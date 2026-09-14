import type {ReactNode} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

function Feature({title, description}: FeatureItem) {
  return (
    // 12 grid columns total, adujust accordingly
    <div className={clsx('col col--6')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const productName =
    typeof siteConfig.customFields?.productName === 'string'
      ? siteConfig.customFields.productName
      : 'PoSyMed';

  const featureList: FeatureItem[] = [
    {
      title: 'Make federated collaboration easy',
      description: (
        <>
          {productName} allows any consortium to easily set up and manage their own
          federated database network, enabling federated learning for everybody.
        </>
      ),
    },
    {
      title: 'Allows complex workflows to be used by non-experts',
      description: (
        <>
          Allows anybody to use complex data analysis workflows without expert knowledge,
          either on our platform or on your own infrastructure (self deployment).
        </>
      ),
    },
  ];

  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {featureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
