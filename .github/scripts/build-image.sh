#!/usr/bin/env bash
# Builds the documentation for one brand and pushes it as a multi-arch nginx image.
# Usage: build-image.sh <image-name>
# The brand (product name, URLs, logo, base URL) comes from the environment, see docusaurus.config.ts.
# VERSION and TAG_IMAGE come from the version action of FedLearnNet/.github.
set -euo pipefail

image="$REGISTRY/$1"
tag=$([ "$GITHUB_REF" = "refs/heads/main" ] && echo latest || echo staging)
tag_args=(-t "$image:$tag")
if [ "${TAG_IMAGE:-false}" = true ]; then tag_args+=(-t "$image:$VERSION"); fi

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
  --label "org.opencontainers.image.version=${VERSION:-}" \
  "${tag_args[@]}" \
  -f Dockerfile \
  --push "$ctx"
