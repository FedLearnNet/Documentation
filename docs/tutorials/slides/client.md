---
id: client
title: "Client introduction"
sidebar_label: Client introduction
sidebar_position: 1
hide_table_of_contents: true
---

import SlideDeck, {Slide} from '@site/src/components/SlideDeck';
import {AgendaScene, ClientScene, JourneyScene, WizardScene, RecapScene} from '@site/src/components/SlideDeck/scenes';
import {CohortTabsScene} from '@site/src/components/SlideDeck/mockScenes';
import CohortSchemaAnimation from '@site/src/components/CohortSchemaAnimation';
import SchemaNodesAnimation from '@site/src/components/CohortSchemaAnimation/SchemaNodesAnimation';
import ConnectorAnimation from '@site/src/components/ConnectorAnimation';
import SourceExplainer from '@site/src/components/ConnectorSteps/SourceExplainer';
import HeaderExplainer from '@site/src/components/ConnectorSteps/HeaderExplainer';
import TransformExplainer from '@site/src/components/ConnectorSteps/TransformExplainer';
import MappingExplainer from '@site/src/components/ConnectorSteps/MappingExplainer';
import RunExplainer from '@site/src/components/ConnectorSteps/RunExplainer';

# Client introduction

<SlideDeck title="Client introduction">
  <Slide kicker="Welcome" title="Bringing clinic data into FL-Net" lead="How patient data gets into a Fl-Net Client." center>
    <AgendaScene />
  </Slide>
  <Slide kicker="Intro · Platform and Client" title="Raw data stays in the clinic" lead="The Platform is running global. Each clinic runs its own Fl-Net Client." docs={[{label: 'What is a Client', to: '/docs/client-usage/welcome'}]}>
    <ClientScene />
  </Slide>
  <Slide kicker="Intro · The path" title="Four steps to usable data" lead="Each topic today is one step." docs={[{label: 'Cohorts', to: '/docs/client-usage/cohorts'}, {label: 'Add data', to: '/docs/client-usage/add-data'}]}>
    <JourneyScene />
  </Slide>
  <Slide kicker="1 · Schema" title="A schema is a shared template" docs={[{label: 'Schema and cohort', to: '/docs/client-usage/cohorts#schema-and-cohort'}]}>
    <CohortSchemaAnimation only={['schema']} />
  </Slide>
  <Slide kicker="1 · Schema" title="Every field: meaning, format, place" lead="Ontology: what it means. Datatype: which values are valid. Schema node: where it sits." docs={[{label: 'Schema building blocks', to: '/docs/client-usage/cohorts#schema-building-blocks'}]}>
    <SchemaNodesAnimation />
  </Slide>
  <Slide kicker="2 · Cohort" title="A cohort holds the patients" docs={[{label: 'Create a cohort', to: '/docs/client-usage/cohorts#create-a-cohort'}]}>
    <CohortSchemaAnimation only={['cohort']} />
  </Slide>
  <Slide kicker="2 · Cohort" title="A cohort in the Client" lead="Seven tabs, one per task." docs={[{label: 'Patient data', to: '/docs/client-usage/cohorts/patient-data'}]}>
    <CohortTabsScene />
  </Slide>
  <Slide kicker="2 · Cohort" title="Same schema, comparable clinics" docs={[{label: 'Schema and cohort', to: '/docs/client-usage/cohorts#schema-and-cohort'}]}>
    <CohortSchemaAnimation only={['shared']} />
  </Slide>
  <Slide kicker="3 · Connector" title="A connector is a saved import recipe" lead="Read the file, convert values, link columns to fields. Saving imports nothing. Running does." docs={[{label: 'Connectors', to: '/docs/client-usage/add-data/connectors'}]}>
    <ConnectorAnimation />
  </Slide>
  <Slide kicker="4 · Create a connector" title="Six steps in the wizard" lead="Cohort → Connector → Add Connector → Create manually." docs={[{label: 'Create a connector', to: '/docs/client-usage/add-data/connectors/create-connector'}]}>
    <WizardScene />
  </Slide>
  <Slide kicker="4 · Create a connector" title="Steps 1–2: choose the source" docs={[{label: 'Select the source', to: '/docs/client-usage/add-data/connectors/create-connector#1-select-the-data-source'}]}>
    <SourceExplainer />
  </Slide>
  <Slide kicker="4 · Create a connector" title="Step 3: check the headers" docs={[{label: 'Review headers', to: '/docs/client-usage/add-data/connectors/create-connector#3-review-headers-and-source-data'}]}>
    <HeaderExplainer />
  </Slide>
  <Slide kicker="4 · Create a connector" title="Step 4: convert values" docs={[{label: 'Add transformations', to: '/docs/client-usage/add-data/connectors/create-connector#4-add-transformations'}]}>
    <TransformExplainer />
  </Slide>
  <Slide kicker="4 · Create a connector" title="Step 5: link columns to fields" docs={[{label: 'Map fields', to: '/docs/client-usage/add-data/connectors/create-connector#5-map-source-fields-to-the-schema'}]}>
    <MappingExplainer />
  </Slide>
  <Slide kicker="4 · Create a connector" title="Run it and check the result" docs={[{label: 'Run the import', to: '/docs/client-usage/add-data/import-data'}]}>
    <RunExplainer />
  </Slide>
  <Slide kicker="Recap" title="Recap" docs={[{label: 'Patient data', to: '/docs/client-usage/cohorts/patient-data'}, {label: 'Requests', to: '/docs/client-usage/requests'}, {label: 'Governance', to: '/docs/client-usage/governance'}]}>
    <RecapScene />
  </Slide>
</SlideDeck>
