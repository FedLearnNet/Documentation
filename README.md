# Purpose
This is the repo containing the public documentation of FL-Net, but also of all
deployed instances of FL-Net, marked via `%%DEPLOYED_PRODUCT_NAME%%`.
It can be built with different %%DEPLOYED_PRODUCT_NAME%% network names, e.g. microb-AI-Net, dAIbetes-Net, Federated Learning Network, etc. The documentation is the same for all of these networks, but the branding can be changed via environment variables.
It is meant to document what these projects are and how to use them.
They are joint projects, the same software is developed and used in both.
However, they are deployed seperately.

The documentation is built using [Docusaurus](https://docusaurus.io/).

# Requirements
- This repository uses githubs large file storage (LFS) for some files. Please make sure to install `git lfs` and pull the files before building the documentation.
- Docusaurus is based on node.js. Please make sure to have a recent version of node.js installed. You can check your version with `node -v` and `npm -v`. If you don't have it installed, please check the [node.js website](https://nodejs.org/en/download/).

# Changing the documentation
The documentation is md file based. Simply change the files in the docs folder, this 
is the navigation structure the deployed. In most cases you won't have to do anything else.
For more info check the [docusaurus documentation](https://docusaurus.io/docs)

For changes apart from these files, docusaurus is React based.
Checkout the `src` folder or `static` for e.g. the logo.

There is a pipeline to build the documentation and a watchtower to pull the updated documentation.

## Testing the documentation
Docusaurus can be deployed via npm.
First install relevant packages
```bash
npm i
```

Then start a development server
```bash
npm start
```

# How to change the styling via env
You can on build time set multiple environment variables concerning the styling.
You can checkout the [docusaurus.config.ts](./docusaurus.config.ts).
The first lines is where the environment variables are read in, you can
see there which variables are available and which are the default values if they
aren't set.
Please make sure if you add any variable there to also add them in `.gitlab-ci.yml`.
There are two relevant parts which contain the values for flnet and posymed:
- `.brand:posymed:`
- `.brand:flnet:`

Example usage locally (dev only):
```bash
DEPLOYED_PRODUCT_NAME="Your Brand" PRODUCT_SLUG="your-brand" npm start
```

# Where and how is the documentation deployed
When deploying, please do NOT strip away the `/documentation/` endpoint or 
this will fail/reload infinitely!

This is deployed twice:
- https://posymed.featurecloud.ai/documentation/
- https://federated-learning.net/documentation/

