# FL-Net Documentation

[Docusaurus](https://docusaurus.io/) site with the public documentation of FL-Net and its deployments, such as
PoSyMed. The content is shared; product name, URLs and logo are set per brand at build time.

## Documentation

- [FL-Net documentation](https://federated-learning.net/documentation/)

## Quick start

Requirements: Node.js LTS and [Git LFS](https://git-lfs.com/) (videos and sample data in `static/`).

```bash
git lfs install && git lfs pull
npm ci
npm start           # http://localhost:3000/documentation/
```

Pages live in `docs/` (Markdown/MDX), the navigation in `sidebars.ts`, React components in `src/` and assets in
`static/`. No secrets are needed.

## Placeholders

Never hardcode product-specific values in pages. These placeholders are replaced at build time:
`%%DEPLOYED_PRODUCT_NAME%%`, `%%DEPLOYED_PRODUCT_URL%%`, `%%DEPLOYED_PRODUCT_WS_URL%%`,
`%%DEPLOYED_PRODUCT_TCP_PORT%%`.

## Brands

Brand settings are environment variables read in [`docusaurus.config.ts`](docusaurus.config.ts):

| Variable                    | Default                                | FL-Net                      | PoSyMed                           |
|-----------------------------|----------------------------------------|-----------------------------|-----------------------------------|
| `DEPLOYED_PRODUCT_NAME`     | `Federated Learning Net`               | `Federated Learning Net`    | `PoSyMed`                         |
| `DEPLOYED_PRODUCT_URL`      | `https://federated-learning.net`       | same                        | `https://posymed.featurecloud.ai` |
| `DEPLOYED_PRODUCT_WS_URL`   | product URL with `ws`/`wss`            | default                     | default                           |
| `DEPLOYED_PRODUCT_TCP_PORT` | `9152`                                 | default                     | default                           |
| `PRODUCT_SLUG`              | `productSlug`                          | `flnet`                     | `posymed`                         |
| `PRODUCT_BASE_URL`          | `/documentation/`                      | default                     | `/posymed/documentation/`         |
| `PRODUCT_LOGO_PATH`, `PRODUCT_FAVICON_PATH` | `img/logo.svg`, `img/favicon.ico` | `img/flnet/logo.svg` | `img/posymed/logo.svg`       |

`PRODUCT_TAGLINE` and `PRODUCT_LOGO_ALT` complete the branding. Try a brand locally with e.g.
`DEPLOYED_PRODUCT_NAME="PoSyMed" PRODUCT_SLUG=posymed npm start`. A new variable must also be added to both brand
steps in [`.github/workflows/docker.yml`](.github/workflows/docker.yml).

## Deployment

Pushes to `main` publish `latest`, pushes to `develop` publish `staging`:

- `ghcr.io/fedlearnnet/documentation/flnet-user-doc` → https://federated-learning.net/documentation/
- `ghcr.io/fedlearnnet/documentation/posymed-user-doc` → https://posymed.featurecloud.ai/documentation/

Keep the `/documentation/` path when deploying or proxying, otherwise pages reload endlessly. Run both images
locally with `docker compose up` (FL-Net on port 3003, PoSyMed on 3002).

## License

[Apache License 2.0](LICENSE) © Institute for Computational Systems Biomedicine and contributors.
