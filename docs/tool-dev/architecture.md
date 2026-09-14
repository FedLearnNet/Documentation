---
id: architecture
title: Engine Architecture
---

**Core components**
- **Worker Manager**: Job queue, lifecycle, cancellation, retries.
- **Data Manager**: File validation, temp dirs, caching, checksum, retention.
- **Config Handler**: Parse & validate `app.yml`, merge overrides.
- **Observer/Logger**: Structured events, levels, correlation IDs.
- **Run DTOs**: Typed messages (e.g., run id, stage, event type).

**Environment Cheatsheet** (examples)
```
APP_STORAGE_DIR=/var/app-storage
ALLOWED_INPUT_EXT=csv,tsv,json
MAX_UPLOAD_MB=512
LOG_LEVEL=INFO
```
Adapt to your deployment. Keep secrets out of logs.
