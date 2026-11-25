import { runPipeline } from './pipeline.ts';

function main(): void {
  const botDir = process.env.MAKEFUN_BOT_DIR ?? import.meta.dirname;
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  console.log(`[news-image-20261124] starting pipeline (botDir=${botDir}, outputDir=${outputDir})`);

  const result = runPipeline({ botDir, outputDir });
  if (!result.sha256 || result.bytes <= 0) {
    throw new Error('Pipeline produced an empty or unverified entry');
  }

  console.log(
    `[news-image-20261124] completed: format=${result.format} bytes=${result.bytes} ` +
      `sha256=${result.sha256} durationMs=${result.metrics.durationMs.toFixed(3)} ` +
      `throughputMbps=${result.metrics.throughputMbps.toFixed(2)} output=${result.outputPath}`
  );
}

main();
