import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export type ImageFormat = 'png' | 'jpeg';

export interface PipelineOptions {
  botDir?: string;
  outputDir?: string;
}

export interface PipelineMetrics {
  durationNs: bigint;
  durationMs: number;
  throughputMbps: number;
}

export interface PipelineResult {
  sourcePath: string;
  outputPath: string;
  format: ImageFormat;
  bytes: number;
  sha256: string;
  metrics: PipelineMetrics;
}

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPEG_MAGIC = Buffer.from([0xff, 0xd8, 0xff]);

/**
 * Validates that a buffer starts with either PNG or JPEG magic bytes.
 */
export function detectImageFormat(buffer: Buffer): ImageFormat {
  if (buffer.length >= PNG_MAGIC.length && buffer.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) {
    return 'png';
  }
  if (buffer.length >= JPEG_MAGIC.length && buffer.subarray(0, JPEG_MAGIC.length).equals(JPEG_MAGIC)) {
    return 'jpeg';
  }
  throw new Error('Invalid image format: expected PNG or JPEG magic bytes');
}

/**
 * Computes the hexadecimal SHA-256 digest of a buffer.
 */
export function computeSha256(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Executes the read-only-safe news image pipeline:
 * reads `entry.png` from `botDir`, validates magic bytes and SHA-256,
 * copies `entry.png` to `outputDir`, and records high-resolution throughput metrics.
 */
export function runPipeline(options: PipelineOptions = {}): PipelineResult {
  const startNs = process.hrtime.bigint();
  const botDir = options.botDir ?? process.env.MAKEFUN_BOT_DIR ?? import.meta.dirname;
  const outputDir = options.outputDir ?? process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

  const sourcePath = path.join(botDir, 'entry.png');
  const outputPath = path.join(outputDir, 'entry.png');

  const payload = fs.readFileSync(sourcePath);
  const format = detectImageFormat(payload);
  const sha256 = computeSha256(payload);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, payload);

  const written = fs.readFileSync(outputPath);
  const verifiedSha256 = computeSha256(written);
  if (verifiedSha256 !== sha256) {
    throw new Error(`SHA-256 verification mismatch: expected ${sha256}, got ${verifiedSha256}`);
  }

  const durationNs = process.hrtime.bigint() - startNs;
  const durationSeconds = Number(durationNs) / 1e9;
  const durationMs = Number(durationNs) / 1e6;
  const throughputMbps =
    durationSeconds > 0 ? (payload.length * 8) / (durationSeconds * 1_000_000) : 0;

  return {
    sourcePath,
    outputPath,
    format,
    bytes: payload.length,
    sha256,
    metrics: {
      durationNs,
      durationMs,
      throughputMbps,
    },
  };
}
