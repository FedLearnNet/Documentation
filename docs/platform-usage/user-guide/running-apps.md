---
id: running-apps
title: Running Apps - Step by Step
---

1. **Select an App** from the Model Board.
2. **Review the Summary** (description, expected inputs/outputs, tags).
3. **Provide Inputs** as requested:
   - CSV/TSV: ensure headers and delimiter match app requirements.
   - JSON: schema must match app contract.
4. **Configure Hyper-parameters**:
   - Types: CATEGORICAL, STRING, INT, FLOAT, BOOL.
   - Defaults come from `model.yml`.
5. **Execute** the run and keep the tab open (you can navigate; progress persists).
6. **Review Results**:
   - Images (base64) are rendered in the UI.
   - Tables/JSON can be downloaded.
   - Logs show warnings/errors and stage timing.
7. **Re-Run** with modified parameters to compare outcomes.

**Tip:** The app contract is visible in **Details → Contract** for transparency.
