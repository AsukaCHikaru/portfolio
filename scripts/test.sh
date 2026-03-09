#!/bin/bash
set -euo pipefail

IMAGE="portfolio-test"
DOCKER_FLAGS="--init --ipc=host --rm -v ./:/app -w /app"

docker build -t "$IMAGE" -f Dockerfile.test .

if [ "${1:-}" = "--update-snapshots" ]; then
  docker run $DOCKER_FLAGS "$IMAGE" \
    bash -c 'git config --global --add safe.directory /app && bun install --frozen-lockfile && bun run build:dev && bunx playwright test --update-snapshots'
else
  docker run $DOCKER_FLAGS "$IMAGE" \
    bash -c 'git config --global --add safe.directory /app && bun install --frozen-lockfile && bun run build:dev && bun run test'
fi
