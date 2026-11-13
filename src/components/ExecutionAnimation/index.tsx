import type {ReactNode} from 'react';
import clsx from 'clsx';
import StepExplainer, {at, type ExplainerMode} from '../ConnectorSteps/StepExplainer';
import s from '../ConnectorSteps/styles.module.css';

type Hop = [actor: string, message: string];

function Flow({hops}: {hops: Hop[]}): ReactNode {
  return <>{hops.map(([actor, message], i) => (
    <div key={actor} className={clsx(s.card, s.slideL)} style={at(i * 850)}>
      <div className={s.cardHead}>
        <span>{i + 1} · {actor}</span>
        {i < hops.length - 1 && <span>↓</span>}
      </div>
      <div className={s.row} style={{padding: '0.45rem 0.65rem'}}>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(i * 850 + 300, {whiteSpace: 'normal', overflowWrap: 'anywhere'})}>{message}</span>
      </div>
    </div>
  ))}</>;
}

const modes: ExplainerMode[] = [
  {
    key: 'execution', label: 'Execution', title: 'The database holds execution state',
    text: 'A run contains steps; each step launches attempts. Committed events hand work to the next coordinator.',
    config: [
      {name: 'Run', text: 'The workflow coordinator advances steps in execution order.'},
      {name: 'Step', text: 'The step coordinator creates a trial attempt.'},
      {name: 'Attempt', text: 'The launcher starts its container; Tool messages update its lifecycle.'},
    ],
    note: 'Finishing an attempt stops its container and wakes its step. Finishing a step wakes its run.',
    scene: () => <Flow hops={[
      ['Run → workflow coordinator', 'RunStartedEvent'],
      ['Step → step coordinator', 'StepChangedEvent'],
      ['Attempt → launcher → Orch API', 'AttemptLaunchEvent'],
      ['Tool → attempt lifecycle', 'UPDATE_RUN · FINISH_RUN'],
      ['Lifecycle → step → run', 'AttemptFinished → StepFinished'],
    ]} />,
  },
  {
    key: 'search', label: 'Parameter search', title: 'Several attempts, one selected result',
    text: 'Each parameter set gets a separate attempt. Trials run one at a time; downstream steps read the winner’s outputs.',
    config: [
      {name: 'Score', text: 'Latest value of the configured search metric.'},
      {name: 'Failure', text: 'Skip the failed trial; continue the search without retry.'},
      {name: 'Selection', text: 'Rank successful trials; ties prefer the lower trial index.'},
    ],
    note: 'Example: maximize accuracy. Without a search, the step runs one fixed parameter set.',
    scene: () => <Flow hops={[
      ['Step · maximize accuracy', 'Plan parameter sets'],
      ['Attempt · trial 0', 'accuracy 0.81 · FINISHED'],
      ['Attempt · trial 1', 'ERROR · skip'],
      ['Attempt · trial 2', 'accuracy 0.89 · FINISHED'],
      ['Step → next step', 'Select trial 2 → copy outputs'],
    ]} />,
  },
  {
    key: 'federation', label: 'Federated', title: 'One step across all participants',
    text: 'Federated coordination waits for clinics together. Each participant has an attempt, and participants run concurrently.',
    config: [
      {name: 'Control', text: 'Global ↔ Local FLNet WebSocket synchronizes readiness and status.'},
      {name: 'Tool', text: 'Attempt WebSocket reports lifecycle, logs, and metrics to its owning API.'},
      {name: 'Updates', text: 'Tool ↔ Controller HTTP; Controllers ↔ Relay over mTLS TCP.'},
    ],
    note: 'The next node waits for every clinic and any Platform aggregator to finish.',
    scene: () => <Flow hops={[
      ['Global → Local APIs', 'START_LEARNING'],
      ['Local APIs → Global', 'UPDATE_LEARNING · all READY'],
      ['Global → Local → Controller', 'Relay config · RELAY_CERT'],
      ['Tools ↔ Controllers ↔ Relay', 'Federated model updates'],
      ['Local APIs → Global', 'All FINISHED → next node'],
    ]} />,
  },
];

export default function ExecutionAnimation(): ReactNode {
  return <StepExplainer eyebrow="Execution · message flow" accent="extract" modes={modes} />;
}
