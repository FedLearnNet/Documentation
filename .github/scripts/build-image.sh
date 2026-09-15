#!/usr/bin/env bash
# Builds the documentation for one brand and pushes it as a multi-arch nginx image.
# Usage: build-image.sh <image-name>
# The brand (product name, URLs, logo, base URL) comes from the environment, see docusaurus.config.ts.
set -euo pipefail

image="$REGISTRY/$1"
tag=$([ "$GITHUB_REF" = "refs/heads/main" ] && echo latest || echo staging)

npm run build

# Minimal build context: the Dockerfile only needs the static site and the nginx config
ctx="$RUNNER_TEMP/docker-context-$1"
rm -rf "$ctx"
mkdir -p "$ctx"
cp -r build "$ctx/build"
cp nginx.conf "$ctx/"

# The nginx image only copies files, so both architectures are assembled without emulation
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --provenance=false \
  --label "org.opencontainers.image.source=$GITHUB_SERVER_URL/$GITHUB_REPOSITORY" \
  --label "org.opencontainers.image.revision=$GITHUB_SHA" \
  -t "$image:$tag" \
  -t "$image:$tag-${GITHUB_SHA::7}" \
  -f Dockerfile \
  --push "$ctx"
