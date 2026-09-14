import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

type QuickLink = {
  title: string;
  description: string;
  to: string;
};

type Card = {
  title: string;
  description: string;
};

type Step = {
  label: string;
  title: string;
  description: string;
};

function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const productName =
    typeof siteConfig.customFields?.productName === 'string'
      ? siteConfig.customFields.productName
      : 'FL-Net';

  const conceptCards: Card[] = [
    {
      title: 'FL-Net',
      description: `The federated network software behind ${productName}: lets multiple data holders keep control over local data while participating in shared discovery, analysis, and governed workflows.`,
    },
    {
      title: productName,
      description:
        'The deployed instance of FL-Net: a ready-to-use platform for finding data, running tools, and collaborating without building infrastructure from scratch.',
    },
    {
      title: 'Client Deployments',
      description: `Self-hosted nodes operated by data holders which make up the ${productName}. They enforce access rules, run no-code data onboarding, and participate in federated analysis.`,
    },
  ];

  // Every entry point into the docs: top-level orientation pages first,
  // then the role-specific paths defined in Solutions and Get Started.
  const entryPoints: QuickLink[] = [
    {
      title: 'Welcome',
      description: `Understand what FL-Net and ${productName} are and how the pieces fit together.`,
      to: '/docs/intro/welcome',
    },
    {
      title: 'Solutions',
      description: 'See why teams choose FL-Net over other federated learning frameworks.',
      to: '/docs/intro/solutions',
    },
    {
      title: 'Get Started',
      description: 'Choose the right path based on your role and deployment model.',
      to: '/docs/intro/get-started',
    },
    {
      title: 'Architecture',
      description: 'Understand how the platform, clients, and runtime boundaries fit together.',
      to: '/docs/intro/architecture/welcome',
    },
    {
      title: 'Deploy your own client',
      description:
        'Set up a self-hosted client, either on your own infrastructure or in a cloud environment.',
      to: '/docs/deployment/deploy-client',
    },
    {
      title: 'Use your client',
      description:
        'Describe your schema, ingest data through connectors, and decide what the network is allowed to do with it.',
      to: '/docs/client-usage/welcome',
    },
    {
      title: 'Use the platform',
      description:
        'Search the network, create analysis projects, run tools, and interpret results in a governed environment.',
      to: '/docs/platform-usage/welcome',
    },
    {
      title: 'Build and publish tools',
      description:
        'Develop reproducible ETL, federated learning, and inference Tools for others to run.',
      to: '/docs/tool-dev/create-tool',
    },
    {
      title: 'Self-host a deployment',
      description:
        'Run your own platform and coordinate the clients that connect to it.',
      to: '/docs/deployment/deploy-global',
    },
    {
      title: 'Contribute to FL-Net',
      description:
        'Help build the underlying software: the Client, Platform, and Schema system itself.',
      to: '/docs/contribution-guide/welcome',
    },
  ];

  const workflowSteps: Step[] = [
    {
      label: '01',
      title: 'Describe and publish metadata',
      description:
        'Data holders model their local schema and expose only the information needed for discovery and governance.',
    },
    {
      label: '02',
      title: 'Discover relevant data and tools',
      description:
        'Data Scientists search the network, evaluate available tools, and assemble a project that matches their question.',
    },
    {
      label: '03',
      title: 'Run governed analysis',
      description:
        'Execution happens through reproducible tools and explicit permissions rather than ad hoc data movement.',
    },
    {
      label: '04',
      title: 'Review outputs and iterate',
      description:
        'Results, logs, and artifacts stay traceable, so teams can refine parameters and compare outcomes.',
    },
  ];

  return (
    <Layout
      title={`${productName} documentation`}
      description={`${productName} and FL-Net documentation for users, data holders, and tool developers.`}>
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.heroGlow} />
          <div className={clsx('container', styles.heroInner)}>
            <div className={styles.heroCopy}>
              <div className={styles.eyebrow}>Collaboration for real-world scientific work</div>
              <Heading as="h1" className={styles.heroTitle}>
                {productName}
              </Heading>
              <div className={styles.heroActions}>
                <Link className="button button--primary button--lg" to="/docs/intro/welcome">
                  Start with the docs
                </Link>
                <Link className="button button--secondary button--lg" to="/docs/intro/solutions">
                  Explore solutions
                </Link>
              </div>
              <div className={styles.heroBadges}>
                <span>Harmonized data</span>
                <span>Audited workflows</span>
                <span>Persistent network</span>
                <span>Isolated, secure execution</span>
                <span>Privacy-preserving federation</span>
              </div>
            </div>
            <div className={styles.heroPanel}>
              <div className={styles.panelLabel}>At a glance</div>
              <Heading as="h2" className={styles.panelTitle}>
                One stack, every role
              </Heading>
              <div className={styles.panelRows}>
                <div className={styles.panelRow}>
                  <strong>Data holders</strong>
                  <span>Deploy your own client, no-code onboard data, and control access, participating in federated studies with ease.</span>
                </div>
                <div className={styles.panelRow}>
                  <strong>Data Scientists</strong>
                  <span>Find cohorts, run (federated) analyses, and review and publish governed results.</span>
                </div>
                <div className={styles.panelRow}>
                  <strong>Tool developers</strong>
                  <span>Package scientific solutions as reusable Tools.</span>
                </div>
                <div className={styles.panelRow}>
                  <strong>Collaboration coordinators</strong>
                  <span>Self-host a FL-Net deployment</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionIntro}>
              <Heading as="h2">Know the pieces</Heading>
              <p>
                The documentation is easier to navigate when the terminology is explicit. These are
                the building blocks used throughout the site.
              </p>
            </div>
            <div className={styles.cardGrid}>
              {conceptCards.map((card) => (
                <article key={card.title} className={styles.infoCard}>
                  <Heading as="h3">{card.title}</Heading>
                  <p>{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={clsx(styles.section, styles.sectionAlt)}>
          <div className="container">
            <div className={styles.sectionIntro}>
              <Heading as="h2">Jump into the documentation</Heading>
              <p>
                Orient yourself with the pages above, or go straight to the path that matches your
                role.
              </p>
            </div>
            <div className={styles.pathGrid}>
              {entryPoints.map((link) => (
                <Link key={link.title} className={styles.pathCard} to={link.to}>
                  <Heading as="h3">{link.title}</Heading>
                  <p>{link.description}</p>
                  <span>Open section</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionIntro}>
              <Heading as="h2">Typical workflow</Heading>
              <p>
                FL-Net is designed so discovery, governance, execution, and interpretation follow a
                consistent sequence instead of turning into manual coordination.
              </p>
            </div>
            <div className={styles.stepGrid}>
              {workflowSteps.map((step) => (
                <article key={step.label} className={styles.stepCard}>
                  <div className={styles.stepLabel}>{step.label}</div>
                  <Heading as="h3">{step.title}</Heading>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Home;