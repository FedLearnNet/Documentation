---
id: operations
title: Operations - Deploy & Run
---

### Docker/Registry
- Build multi-arch images if needed (arm64/amd64).
- Use **immutable** image references (digests) for reproducibility.
- Apply pull secrets and retry policies.

### Quotas & Limits
- CPU/RAM caps per worker.
- Max upload size and concurrent runs.

### Backups
- Artifact store and DB backups with tested restore procedures.
