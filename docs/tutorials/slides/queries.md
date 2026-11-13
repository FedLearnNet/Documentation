---
id: queries
title: "Queries"
sidebar_label: Queries
sidebar_position: 2
hide_table_of_contents: true
---

import SlideDeck, {Slide} from '@site/src/components/SlideDeck';
import {AgendaScene, RecapScene} from '@site/src/components/SlideDeck/scenes';
import {BroadcastScene, FieldScene, BuilderScene, OperatorScene, ClientCheckScene, RoundingScene, CaseControlScene} from '@site/src/components/SlideDeck/queryScenes';
import {QueryBuilderMockScene} from '@site/src/components/SlideDeck/mockScenes';

# Queries

<SlideDeck title="Queries">
  <Slide kicker="Welcome" title="Finding patients across clinics" lead="Count matching patients without seeing any record." center>
    <AgendaScene items={['Ask', 'Build', 'Answer', 'Privacy']} />
  </Slide>
  <Slide kicker="1 · Ask" title="One question, every clinic" lead="A query is defined once on the Platform. Each clinic counts its own patients and sends back a number." docs={[{label: 'Creating queries', to: '/docs/platform-usage/user-guide/creating-queries'}]}>
    <BroadcastScene />
  </Slide>
  <Slide kicker="1 · Ask" title="Queries use schema fields, not columns" lead="Connectors already linked each clinic's columns to schema fields. A query only sees those fields." docs={[{label: 'Schema and cohort', to: '/docs/client-usage/cohorts#schema-and-cohort'}]}>
    <FieldScene />
  </Slide>
  <Slide kicker="2 · Build" title="Field + operator + value" lead="Groups combine conditions with AND or OR." docs={[{label: 'Building blocks', to: '/docs/platform-usage/user-guide/creating-queries#the-building-blocks'}]}>
    <BuilderScene />
  </Slide>
  <Slide kicker="2 · Build" title="Operators depend on the datatype" lead="The builder only offers operators that fit the field." docs={[{label: 'Create a query', to: '/docs/tutorials/walkthroughs/wt-query#step-2--create-a-new-query'}]}>
    <OperatorScene />
  </Slide>
  <Slide kicker="2 · Build" title="In the Platform" lead="Find data → New query → Save and Run Query." docs={[{label: 'Query walkthrough', to: '/docs/tutorials/walkthroughs/wt-query'}]}>
    <QueryBuilderMockScene />
  </Slide>
  <Slide kicker="3 · Answer" title="How a clinic answers" lead="No manual approval. Each clinic checks its own rules first." docs={[{label: 'Discovery queries', to: '/docs/client-usage/requests#discovery-queries'}, {label: 'Permission settings', to: '/docs/client-usage/governance/access-management#permission-settings'}]}>
    <ClientCheckScene />
  </Slide>
  <Slide kicker="4 · Privacy" title="Counts are never exact" lead="Small groups become 0. All other counts are rounded up." docs={[{label: 'Privacy model', to: '/docs/tutorials/walkthroughs/wt-query#privacy-model-for-queries-and-statistics'}]}>
    <RoundingScene />
  </Slide>
  <Slide kicker="Recap" title="Recap" docs={[{label: 'Statistics slides', to: '/docs/tutorials/slides/statistics'}, {label: 'Creating queries', to: '/docs/platform-usage/user-guide/creating-queries'}]}>
    <RecapScene items={[
      ['Ask', 'Defined once on the Platform, answered by every clinic.'],
      ['Build', 'Schema fields, operators by datatype, AND / OR groups.'],
      ['Answer', 'Automatic, under each clinic’s rules.'],
      ['Privacy', 'Below the minimum: 0. Everything else rounded up.'],
    ]} />
  </Slide>
</SlideDeck>
