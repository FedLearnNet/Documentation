import type {ReactNode} from 'react';
import clsx from 'clsx';
import StepExplainer, {at, type ExplainerMode} from '../ConnectorSteps/StepExplainer';
import s from '../ConnectorSteps/styles.module.css';

type Hop = [actor: string, messages: string | string[]];

function Flow({hops, animated = true}: {hops: Hop[]; animated?: boolean}): ReactNode {
  return <>{hops.map(([actor, messages], i) => (
    <div key={i} className={clsx(s.card, animated && s.slideL)} style={at(i * 850)}>
      <div className={s.cardHead}><span>{actor}</span>{i < hops.length - 1 && <span>↓</span>}</div>
      <div className={s.row} style={{padding: '0.45rem 0.65rem'}}>
        {(Array.isArray(messages) ? messages : [messages]).map(message => (
          <span key={message} className={clsx(s.chip, s.chipAccent, animated && s.pop)}
            style={at(i * 850 + 300, {whiteSpace: 'normal', overflowWrap: 'anywhere'})}>{message}</span>
        ))}
      </div>
    </div>
  ))}</>;
}

type RunType = 'central' | 'federation' | 'analysis' | 'processing' | 'test' | 'hosting';

const modes: Record<RunType, ExplainerMode> = {
  central: {
    key: 'central', label: 'Central training', title: 'One Platform run, ordered steps',
    text: 'Example: patients.csv → scale → train → model. Project files are staged on the Platform.',
    scene: () => <Flow hops={[
      ['PlatformTrainingSetupBO', 'patients.csv → attempt volume'],
      ['Step 1 · scale', 'Attempt finishes → selected scaled.csv'],
      ['Step 2 · train', 'Read selected output → train model'],
      ['PlatformTrainingBO', 'Uploaded model → model store'],
    ]} />,
  },
  federation: {
    key: 'federation', label: 'Federated training', title: 'Clinics execute together',
    text: 'Example: three clinics train on local patients; one clinic or the Platform aggregates.',
    scene: () => <Flow hops={[
      ['Global → Local APIs', 'START_LEARNING → all READY'],
      ['Concurrent clinic attempts · patient data stays local', ['Clinic A · train', 'Clinic B · train', 'Clinic C · train']],
      ['Controllers ↔ Relay ↔ aggregator', 'Model updates → aggregated model'],
      ['FederatedTrainingBO', 'All clinics + aggregator FINISHED → next node'],
    ]} />,
  },
  analysis: {
    key: 'analysis', label: 'Analysis', title: 'Run a Tool, model, or workflow', animated: false,
    text: 'Example: saved model + patients.csv → predictions.csv on the Platform. Uses the shared single-participant lifecycle.',
    scene: () => <Flow animated={false} hops={[
      ['Input', 'patients.csv + saved model'],
      ['Model attempt', 'START_PREDICTION'],
      ['Upload → analysis results', 'predictions.csv'],
    ]} />,
  },
  processing: {
    key: 'processing', label: 'Processing', title: 'Reuse one transformer across batches',
    text: 'Example: normalize two CSV batches before loading a Client cohort.',
    scene: () => <Flow hops={[
      ['Client · one transformer attempt', 'Container connects → session ready'],
      ['Batch 1 → same attempt', 'raw rows → normalized rows'],
      ['Batch 2 → same attempt', 'raw rows → normalized rows'],
      ['ConnectorAppRunBO.endSession', 'End attempt → stop container'],
    ]} />,
  },
  test: {
    key: 'test', label: 'Tool tests', title: 'Tests use a connected app engine',
    text: 'Example: simulate three federated participants in one developer engine; single tests use the same connection.',
    scene: () => <Flow hops={[
      ['TestRunSetupBO', 'TEST / FEDERATED · one step'],
      ['TestRunLauncher → connected engine', 'One START_FEDERATED_RUN'],
      ['Inside that engine', ['Participant A', 'Participant B', 'Participant C']],
      ['Engine → TestRunProgressBO', 'Participant reports → attempt statuses'],
    ]} />,
  },
  hosting: {
    key: 'hosting', label: 'Hosted engine', title: 'Hosting and test runs are separate',
    text: 'Example: one Platform container serves two TEST runs in ENGINE mode.',
    scene: () => <Flow hops={[
      ['TEST_HOSTING · one container', 'Connect /testembed → RUNNING'],
      ['TEST run 1 → same engine', 'Attempt finishes; engine stays RUNNING'],
      ['TEST run 2 → same engine', 'Attempt finishes; engine stays RUNNING'],
      ['Stop hosting run', 'Stop container + revoke engine key'],
    ]} />,
  },
};

export default function RunTypeAnimation({type}: {type: RunType}): ReactNode {
  return <StepExplainer eyebrow={modes[type].label} accent="extract" modes={[modes[type]]} />;
}
