---
id: statistics
title: "Statistics"
sidebar_label: Statistics
sidebar_position: 3
hide_table_of_contents: true
---

import SlideDeck, {Slide} from '@site/src/components/SlideDeck';
import {AgendaScene, RecapScene} from '@site/src/components/SlideDeck/scenes';
import {KindsScene, StatsFlowScene, ApprovalScene, SanitizeScene} from '@site/src/components/SlideDeck/statisticsScenes';
import {RequestMockScene, CompareScene, LocalStatsScene} from '@site/src/components/SlideDeck/mockScenes';

# Statistics

<SlideDeck title="Statistics">
  <Slide kicker="Welcome" title="What does the data look like?" lead="A query counts patients. Statistics describe their data." center>
    <AgendaScene items={['Two kinds', 'Request', 'Approval', 'Privacy', 'Results']} />
  </Slide>
  <Slide kicker="1 · Two kinds" title="Network and local statistics" lead="Across clinics on the Platform, or inside one cohort in the Client." docs={[{label: 'Statistics requests', to: '/docs/client-usage/requests/statistics-requests'}, {label: 'Cohort statistics', to: '/docs/client-usage/cohorts/patient-data/statistics'}]}>
    <KindsScene />
  </Slide>
  <Slide kicker="2 · Request" title="From query to statistics" lead="A query selects the patients. Statistics describe them." docs={[{label: 'Request statistics', to: '/docs/tutorials/walkthroughs/wt-query#step-4--request-cross-clinic-statistics'}]}>
    <StatsFlowScene />
  </Slide>
  <Slide kicker="3 · Approval" title="Each clinic decides" lead="Unlike a query, a statistics request needs approval." docs={[{label: 'Automatic approval', to: '/docs/client-usage/requests/statistics-requests#automatic-approval'}]}>
    <ApprovalScene />
  </Slide>
  <Slide kicker="3 · Approval" title="What the Data Access Manager sees" lead="Requests → Statistics Requests." docs={[{label: 'Review a request', to: '/docs/client-usage/requests/statistics-requests#review-a-statistics-request'}]}>
    <RequestMockScene />
  </Slide>
  <Slide kicker="4 · Privacy" title="Cleaned before it leaves" lead="Each clinic cleans its statistics before sending them. Defaults shown." docs={[{label: 'Privacy model', to: '/docs/tutorials/walkthroughs/wt-query#statistics-privacy'}]}>
    <SanitizeScene />
  </Slide>
  <Slide kicker="5 · Results" title="Compare clinics on the Platform" lead="Check coverage and differences before training." docs={[{label: 'Statistics details', to: '/docs/tutorials/walkthroughs/wt-query#step-4--request-cross-clinic-statistics'}]}>
    <CompareScene />
  </Slide>
  <Slide kicker="5 · Results" title="Local statistics in the Client" lead="Inside a cohort: a generated Data Profile and your own charts." docs={[{label: 'Data Profile', to: '/docs/client-usage/cohorts/patient-data/statistics'}, {label: 'Custom statistics', to: '/docs/client-usage/cohorts/patient-data/custom-statistics'}]}>
    <LocalStatsScene />
  </Slide>
  <Slide kicker="Recap" title="Recap" docs={[{label: 'Query slides', to: '/docs/tutorials/slides/queries'}, {label: 'Statistics requests', to: '/docs/client-usage/requests/statistics-requests'}]}>
    <RecapScene items={[
      ['Two kinds', 'Network: across clinics, from a query. Local: one cohort, in the Client.'],
      ['Request', 'Run a query, then Request Statistics.'],
      ['Approval', 'Automatic by permission, or by a Data Access Manager.'],
      ['Privacy', 'Rounded, rare values dropped, extremes and IDs removed.'],
    ]} />
  </Slide>
</SlideDeck>
