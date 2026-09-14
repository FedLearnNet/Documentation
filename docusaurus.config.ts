import {themes as prismThemes} from 'prism-react-renderer';
import replaceVariables from './src/remark/replaceVariables';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const deployedProductName = process.env.DEPLOYED_PRODUCT_NAME ?? 'Federated Learning Net';
const deployedProductUrl = (process.env.DEPLOYED_PRODUCT_URL ?? 'https://federated-learning.net').replace(/\/+$/, '');
const deployedProductWsUrl = (process.env.DEPLOYED_PRODUCT_WS_URL ?? deployedProductUrl.replace(/^http/i, 'ws')).replace(/\/+$/, '');
const deployedProductTCPPort = process.env.DEPLOYED_PRODUCT_TCP_PORT ?? '9152';
const productSlug = process.env.PRODUCT_SLUG ?? 'productSlug';
const productTagline = process.env.PRODUCT_TAGLINE ?? 'productTagline';
// The path here is from the root path static!! Put your logo in e.g.
// static/img/posymed/logo.svg and it will be available at /img/posymed/logo.svg
const productLogoPath = process.env.PRODUCT_LOGO_PATH ?? 'img/logo.svg';
const productLogoAlt = process.env.PRODUCT_LOGO_ALT ?? 'product logo';
// Same as logo, also from the static folder!
const productFaviconPath = process.env.PRODUCT_FAVICON_PATH ?? 'img/favicon.ico';


const config: Config = {
    title: `Documentation of ${deployedProductName}`,
    tagline: productTagline,
    favicon: productFaviconPath,
    staticDirectories: ['public', 'static'],
    customFields: {
        productName: deployedProductName,
        productSlug,
        deployedProductUrl,
        deployedProductWsUrl,
        deployedProductTCPPort,
        productTagline,
        productLogoPath,
        productLogoAlt,
        productFaviconPath,
    },
    future: {
        v4: true, // Improve compatibility with the upcoming Docusaurus v4
    },

    stylesheets: [
        {
            href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
            type: 'text/css',
            integrity: 'sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV',
            crossorigin: 'anonymous',
        },
    ],

    url: deployedProductUrl,
    baseUrl: process.env.PRODUCT_BASE_URL ?? '/documentation/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'University Hamburg',
    projectName: productSlug,

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    onBrokenLinks: 'warn',

    markdown: {
        mermaid: true,
        hooks: {
            onBrokenMarkdownLinks: 'warn',
        }
    },

    themes: ['@docusaurus/theme-mermaid'],
    presets: [
        [
            'classic',
            {
                docs: {
                    routeBasePath: 'docs',
                    path: 'docs',
                    sidebarPath: './sidebars.ts',
                    remarkPlugins: [
                        [
                            replaceVariables,
                            {
                                variables: {
                                    DEPLOYED_PRODUCT_NAME: deployedProductName,
                                    DEPLOYED_PRODUCT_URL: deployedProductUrl,
                                    DEPLOYED_PRODUCT_WS_URL: deployedProductWsUrl,
                                    PRODUCT_SLUG: productSlug,
                                },
                            },
                        ],
                        remarkMath,
                    ],
                    rehypePlugins: [rehypeKatex],
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
                },
                blog: false,
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        // TODO: add the actual logo
        image: 'img/docusaurus-social-card.jpg',
        navbar: {
            title: deployedProductName,
            logo: {
                alt: productLogoAlt,
                src: productLogoPath,
            },
            items: [
                {
                    to: '/docs/intro/welcome',
                    label: 'Introduction',
                    position: 'left',
                    activeBaseRegex: '/docs/intro/',
                    sidebarId: 'introSidebar',
                },
                {
                    to: '/docs/client-usage/welcome',
                    label: 'Client Usage',
                    position: 'left',
                    activeBaseRegex: '/docs/client-usage/',
                    sidebarId: 'clientUsageSidebar',
                },
                {
                    to: '/docs/platform-usage/welcome',
                    label: 'Platform Usage',
                    position: 'left',
                    activeBaseRegex: '/docs/platform-usage/',
                    sidebarId: 'platformUsageSidebar',
                },
                {
                    to: '/docs/tool-dev/create-tool',
                    label: 'Tool Developer',
                    position: 'left',
                    activeBaseRegex: '/docs/tool-dev/',
                    sidebarId: 'toolDeveloperSidebar',
                },
                {
                    to: '/docs/deployment/deployment-overview',
                    label: 'Deployment',
                    position: 'left',
                    activeBaseRegex: '/docs/deployment/',
                    sidebarId: 'deploymentSidebar',
                },
                {
                    to: '/docs/tutorials/tutorial-overview',
                    label: 'Tutorials',
                    position: 'left',
                    activeBaseRegex: '/docs/tutorials/',
                    sidebarId: 'tutorialsSidebar',
                },
                {
                    to: '/docs/contribution-guide/welcome',
                    label: 'FL-Net Codebase Developer',
                    position: 'left',
                    activeBaseRegex: '/docs/contribution-guide/',
                    sidebarId: 'coreDeveloperSidebar',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'General Documentation: Welcome',
                            to: '/docs/intro/welcome',
                        },
                        {
                            label: 'Data Holder Documentation: Deploying your own Client',
                            to: '/docs/deployment/deploy-client',
                        },
                        {
                            label: 'Data Holder Documentation: Using your Client',
                            to: '/docs/client-usage/welcome',
                        },
                        {
                            label: 'Data Scientist Documentation: Using the Platform for federated research',
                            to: '/docs/platform-usage/welcome',
                        },
                        {
                            label: 'Tool Developer Documentation: Building and publishing tools',
                            to: '/docs/tool-dev/create-tool',
                        },
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        {
                            label: 'Contact Us',
                            to: 'mailto:info@mail.federated-learning.net',
                        },
                        // TODO: add Github link once moved to Github
                    ],
                }
            ],
            copyright: `Copyright © ${new Date().getFullYear()} ${deployedProductName} Cosy.bio.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
