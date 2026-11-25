# makefun-news-image-20261124

[![make.fun · news-image-20261124](https://make.fun/badge/news-image-20261124.svg)](https://make.fun/bounty/news-image-20261124?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)
[![rank](https://make.fun/badge/news-image-20261124/edisonradit93/makefun-news-image-20261124/rank.svg)](https://make.fun/bounty/news-image-20261124/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)
[![reward](https://make.fun/badge/news-image-20261124/edisonradit93/makefun-news-image-20261124/reward.svg)](https://make.fun/bounty/news-image-20261124?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)

Read-only sandbox-safe visual pipeline for make.fun's **news-image-20261124** competition (World News — 24 November 2026).

## Architecture

- `pipeline.ts`: Reads `entry.png` from `MAKEFUN_BOT_DIR` (or `import.meta.dirname`), validates PNG/JPEG magic bytes and SHA-256 integrity, captures high-resolution `process.hrtime.bigint()` throughput metrics, and writes the verified asset to `MAKEFUN_OUTPUT_DIR` (or `/output`).
- `main.ts`: Entrypoint executing the pipeline with startup and completion diagnostics.

## Usage

```bash
MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT © 2026 edisonradit93
