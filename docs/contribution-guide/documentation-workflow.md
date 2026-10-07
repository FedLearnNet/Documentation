---
title: Documentation Workflow
sidebar_position: 5
---

# Documentation workflow
This documentation is a [Docusaurus](https://docusaurus.io/) site in the [`Documentation`](https://github.com/FedLearnNet/Documentation) repository. The content is shared between PoSyMed and FL-Net; product name, URLs, and logo are set per project at build time.

## When do I have to change the documentation?
Please make sure if you contribute to also update the documentation if your change affects:
- user-facing behavior, e.g. a new feature, a changed UI flow, or a changed API changing how the frontend behaves
- If your change is internal please check the documentation of the service you changed. If your changes affect whats documented there, update the documentation accordingly. For example, if you change the learning flow in the `local-learning-api`, update the [federated learning flow](backend/federated-learning-flow.md) page.

### Running the documentation locally
Requirements: Node.js 22.12 or newer and [Git LFS](https://git-lfs.com/) (videos and sample data in `static/` are stored in LFS).

```bash
git lfs install && git lfs pull
npm ci
npm start           # http://localhost:3000/documentation/
```

No secrets are needed.

## Where things live

| Path | Content |
|---|---|
| `docs/` | Pages (Markdown/MDX), one folder per section, e.g. `docs/intro`, `docs/contribution-guide` |
| `sidebars.ts` | Navigation: one sidebar per section |
| `docusaurus.config.ts` | Navbar, footer, and brand configuration |
| `src/` | React components and the homepage |
| `static/` | Images, videos, and downloadable resources |
| `archive/` | Outdated pages kept for reference. This folder is not part of the built site |

Most sidebars are generated from the folder structure. The order of pages is controlled by `sidebar_position` in the front matter of each page, and the label and order of a folder by its `_category_.json`.

## Writing conventions
- **Never hardcode product-specific values.** Use the placeholders that are replaced at build time: `%%DEPLOYED_PRODUCT_NAME%%`, `%%DEPLOYED_PRODUCT_URL%%`, `%%DEPLOYED_PRODUCT_WS_URL%%`, `%%DEPLOYED_PRODUCT_TCP_PORT%%`.
- Link to other pages with relative links to the Markdown file, e.g. `[Quickstart](quickstart.md)`, so the build can check them.
- Start a section with a `welcome.md` page that explains who the section is for and in which order to read it, following the [Introduction](../intro/welcome.md) style.
- Do not delete outdated pages directly. Move them to `archive/` so they stay available for reference.

## Trying a project branding locally
Brand settings are environment variables read in `docusaurus.config.ts`, for example:

```bash
DEPLOYED_PRODUCT_NAME="PoSyMed" PRODUCT_SLUG=posymed npm start
```

The full list of variables and their values per brand is in the README of the repository. A new variable must also be added to the build step in `.github/workflows/docker.yml`.

## Checking a change
Run the same checks as the CI:

```bash
npm run typecheck
npm run build       # also reports broken links and invalid Markdown/MDX
```

## Publishing
This is handled automatically by the CI/CD on the develop/main branch, nothing required from your site.

## Where to go next
Go back to the [Welcome page](welcome.md), or see the [Development workflow](development-workflow.md) for issues and pull requests.
