---
id: training
title: "Training"
sidebar_label: Training
sidebar_position: 4
hide_table_of_contents: true
---

import SlideDeck, {Slide} from '@site/src/components/SlideDeck';
import {AgendaScene, RecapScene} from '@site/src/components/SlideDeck/scenes';
import {TrainPathScene, ConcernsScene, ProjectMockScene, FeatureScene, ExportScene, WorkflowScene, RequestScene, ClinicReviewScene, FederatedRunScene, StatusScene} from '@site/src/components/SlideDeck/trainingScenes';

# Training

<SlideDeck title="Training">
  <Slide kicker="Welcome" title="Training a model without moving data" lead="From project to a finished federated run." center>
    <AgendaScene items={['Project', 'Dataset', 'Workflow', 'Request', 'Run']} />
  </Slide>
  <Slide kicker="Overview" title="The path to a trained model" lead="Four steps on the Platform, two in the clinics." docs={[{label: 'Project walkthrough', to: '/docs/tutorials/walkthroughs/wt-project'}]}>
    <TrainPathScene />
  </Slide>
  <Slide kicker="Overview" title="Three choices, kept apart" lead="Patients, fields, and computation are set separately, so each can be reviewed on its own." docs={[{label: 'How datasets work', to: '/docs/tutorials/walkthroughs/wt-dataset#how-datasets-work-at-runtime'}]}>
    <ConcernsScene />
  </Slide>
  <Slide kicker="1 · Project" title="Create a project" lead="Training → Create Project. Link the query that selects the patients." docs={[{label: 'Create a project', to: '/docs/tutorials/walkthroughs/wt-project#step-2--create-a-new-project'}, {label: 'Query slides', to: '/docs/tutorials/slides/queries'}]}>
    <ProjectMockScene />
  </Slide>
  <Slide kicker="2 · Dataset" title="Choose the fields" lead="Each schema field can become a column. Coverage shows how many clinics have it." docs={[{label: 'Add features', to: '/docs/tutorials/walkthroughs/wt-dataset#step-3--add-features-to-the-dataset'}]}>
    <FeatureScene />
  </Slide>
  <Slide kicker="2 · Dataset" title="One row per patient" lead="The export turns stored values into the table the tool expects." docs={[{label: 'Export mode', to: '/docs/tutorials/walkthroughs/wt-dataset#step-4--configure-the-export-mode'}, {label: 'Preview', to: '/docs/tutorials/walkthroughs/wt-dataset#step-5--preview-and-download-the-dataset'}]}>
    <ExportScene />
  </Slide>
  <Slide kicker="3 · Workflow" title="Pick the tool" lead="The workflow connects the dataset to a trainable tool and its settings." docs={[{label: 'Create the workflow', to: '/docs/tutorials/walkthroughs/wt-project#step-4--create-the-workflow'}]}>
    <WorkflowScene />
  </Slide>
  <Slide kicker="4 · Request" title="Clinics decide who takes part" lead="Request Training sends a frozen copy of the project. Each clinic accepts, excludes patients, or rejects." docs={[{label: 'Request training', to: '/docs/tutorials/walkthroughs/wt-run#step-2--create-a-federated-training-request'}]}>
    <RequestScene />
  </Slide>
  <Slide kicker="4 · Request" title="What a clinic reviews" lead="Requests → Training Requests in the Client." docs={[{label: 'Training requests', to: '/docs/client-usage/requests/training-requests'}]}>
    <ClinicReviewScene />
  </Slide>
  <Slide kicker="5 · Run" title="Training stays in the clinics" lead="Each clinic trains on its accepted patients. Only model updates travel." docs={[{label: 'Start the run', to: '/docs/tutorials/walkthroughs/wt-run#step-4--start-the-federated-training'}]}>
    <FederatedRunScene />
  </Slide>
  <Slide kicker="5 · Run" title="Follow the run" lead="The Platform shows the status. Each Client keeps a record of what it contributed." docs={[{label: 'After start', to: '/docs/tutorials/walkthroughs/wt-run#what-happens-after-start'}, {label: 'Trainings in the Client', to: '/docs/client-usage/governance/trainings'}]}>
    <StatusScene />
  </Slide>
  <Slide kicker="Recap" title="Recap" docs={[{label: 'Metrics walkthrough', to: '/docs/tutorials/walkthroughs/wt-metrics'}, {label: 'Run walkthrough', to: '/docs/tutorials/walkthroughs/wt-run'}]}>
    <RecapScene items={[
      ['Project', 'Workspace on the Platform, linked to a query.'],
      ['Dataset', 'Fields as columns, one row per patient.'],
      ['Workflow', 'The trainable tool and its settings.'],
      ['Request', 'Frozen copy. Each clinic accepts, excludes, or rejects.'],
      ['Run', 'Local training, only model updates move.'],
    ]} />
  </Slide>
</SlideDeck>
