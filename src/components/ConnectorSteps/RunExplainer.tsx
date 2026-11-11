import type {ReactNode} from 'react';
import clsx from 'clsx';
import StepExplainer, {at, type ExplainerMode} from './StepExplainer';
import s from './styles.module.css';

function Incoming({delay}: {delay: number}) {
  return (
    <div className={clsx(s.card, s.slideL)} style={at(delay)}>
      <div className={s.cardHead}>
        <span>Source · this run</span>
        <span className={s.mono}>patients.csv</span>
      </div>
      <div className={s.row} style={{padding: '0.5rem 0.6rem'}}>
        <span className={s.patient}>P-001 · 79.8 kg</span>
        <span className={s.patient}>P-004 · 71.2 kg</span>
      </div>
    </div>
  );
}

function Counters({values, delay}: {values: [number, number, number, number, number]; delay: number}) {
  const items: [string, string][] = [
    ['new', 'var(--ca-load)'],
    ['updated', 'var(--ca-update)'],
    ['deleted', 'var(--ca-muted)'],
    ['failed', 'var(--ca-error)'],
    ['unchanged', 'var(--ca-muted)'],
  ];
  return (
    <div className={s.counters}>
      {items.map(([label, color], i) => (
        <div key={label} className={clsx(s.counter, s.pop)} style={at(delay + i * 90, {'--c': color})}>
          <strong>{values[i]}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function RunScene() {
  return (
    <>
      <Incoming delay={100} />
      <div className={clsx(s.arrow, s.fade)} style={at(700)}>
        Run
      </div>
      <div className={clsx(s.cohort, s.in)} style={at(300)}>
        <span className={clsx(s.patient, s.flash)} style={at(1300)}>
          P-001 · 79.8 kg{' '}
          <span className={clsx(s.tag, s.tagUpd, s.pop)} style={at(1400)}>
            updated
          </span>
        </span>
        <span className={s.patient}>
          P-002{' '}
          <span className={clsx(s.tag, s.tagMuted, s.pop)} style={at(2200)}>
            unchanged
          </span>
        </span>
        <span className={s.patient}>
          P-003{' '}
          <span className={clsx(s.tag, s.tagMuted, s.pop)} style={at(2300)}>
            unchanged
          </span>
        </span>
        <span className={clsx(s.patient, s.drop)} style={at(1800)}>
          P-004 · 71.2 kg{' '}
          <span className={clsx(s.tag, s.tagNew, s.pop)} style={at(1950)}>
            new
          </span>
        </span>
      </div>
      <Counters values={[1, 1, 0, 0, 2]} delay={2700} />
    </>
  );
}

function DryRunScene() {
  return (
    <>
      <Incoming delay={100} />
      <div className={clsx(s.arrow, s.fade)} style={at(700)}>
        Dry run
      </div>
      <div className={s.split}>
        <div className={clsx(s.card, s.in)} style={at(300)}>
          <div className={s.cardHead}>
            <span>Cohort</span>
            <span className={clsx(s.tag, s.tagMuted, s.pop)} style={at(2600)}>
              unchanged
            </span>
          </div>
          <div className={s.row} style={{padding: '0.5rem 0.6rem'}}>
            <span className={s.patient}>P-001 · 80.3 kg</span>
            <span className={s.patient}>P-002</span>
            <span className={s.patient}>P-003</span>
          </div>
        </div>
        <div className={clsx(s.cohort, s.cohortDry, s.in)} style={at(1000)}>
          <span className={clsx(s.label, s.fade)} style={{...at(1100), width: '100%'}}>
            Result preview
          </span>
          <span className={clsx(s.patient, s.patientGhost, s.pop)} style={at(1400)}>
            P-001 · 79.8 kg{' '}
            <span className={clsx(s.tag, s.tagUpd)}>would update</span>
          </span>
          <span className={clsx(s.patient, s.patientGhost, s.pop)} style={at(1700)}>
            P-004 <span className={clsx(s.tag, s.tagNew)}>would add</span>
          </span>
        </div>
      </div>
      <div className={s.row}>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(2900)}>
          Review the result
        </span>
        <span className={clsx(s.arrowRight, s.fade)} style={at(3000)}>
          →
        </span>
        <span className={clsx(s.chip, s.pop)} style={at(3100)}>
          apply it
        </span>
        <span className={clsx(s.caption, s.fade)} style={at(3150)}>
          or
        </span>
        <span className={clsx(s.chip, s.pop)} style={at(3200)}>
          abandon it
        </span>
      </div>
    </>
  );
}

function ReplaceScene() {
  return (
    <>
      <div className={s.row}>
        <span className={clsx(s.chip, s.pop)} style={{...at(100), borderColor: 'var(--ca-error)', color: 'var(--ca-error)'}}>
          ☑ Delete all patients before import
        </span>
      </div>
      <Incoming delay={300} />
      <div className={clsx(s.cohort, s.in)} style={at(500)}>
        {['P-001', 'P-002', 'P-003'].map((id, i) => (
          <span key={id} className={clsx(s.patient, s.colRemoved, s.dimmed)} style={at(1200 + i * 150)}>
            {id}
          </span>
        ))}
        <span className={clsx(s.patient, s.drop)} style={at(2200)}>
          P-001 · 79.8 kg <span className={clsx(s.tag, s.tagNew)}>imported</span>
        </span>
        <span className={clsx(s.patient, s.drop)} style={at(2400)}>
          P-004 · 71.2 kg <span className={clsx(s.tag, s.tagNew)}>imported</span>
        </span>
      </div>
      <div className={clsx(s.caption, s.fade)} style={at(2900)}>
        All existing patients are deleted first, so the cohort afterwards contains exactly the imported source. P-002
        and P-003 are gone.
      </div>
    </>
  );
}

function ReviewScene() {
  return (
    <>
      <div className={clsx(s.card, s.in)} style={at(100)}>
        <div className={s.rowNowrap} style={{padding: '0.45rem 0.6rem', justifyContent: 'space-between'}}>
          <span style={{fontSize: '0.76rem', fontWeight: 650}}>Activity log · latest run</span>
          <span className={clsx(s.tag, s.tagNew)}>Completed</span>
        </div>
      </div>
      <Counters values={[1, 1, 0, 0, 2]} delay={500} />
      <div className={clsx(s.card, s.in)} style={at(1200)}>
        <div className={s.miniTabs}>
          <span className={s.miniTab}>Patient Results</span>
          <span className={clsx(s.miniTab, s.miniTabActive)}>
            Patient Errors <span className={clsx(s.tag, s.tagErr, s.pop)} style={at(1600)}>1</span>
          </span>
          <span className={s.miniTab}>Run Errors</span>
          <span className={s.miniTab}>Run Logs</span>
        </div>
        <table className={s.tbl}>
          <thead>
            <tr>
              <th>patient</th>
              <th>field</th>
              <th>message</th>
            </tr>
          </thead>
          <tbody>
            <tr className={s.flash} style={at(1900)}>
              <td>P-004</td>
              <td style={{fontFamily: 'inherit'}}>Weight</td>
              <td style={{fontFamily: 'inherit', color: 'var(--ca-error)'}}>“?” is not allowed</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={clsx(s.caption, s.fade)} style={at(2500)}>
        The run completed, yet one value was rejected and is missing from the cohort until the source or a
        transformation is fixed.
      </div>
    </>
  );
}

const modes: ExplainerMode[] = [
  {
    key: 'run',
    label: 'Run',
    title: 'A regular run',
    text: 'Without options, the connector reads its configured source, adds new patients, and updates existing ones. Patients that are not in the source stay in the cohort.',
    config: [
      {name: 'New', text: 'Patients from the source that are not in the cohort yet.'},
      {name: 'Updated', text: 'Existing patients whose values changed.'},
      {name: 'Unchanged', text: 'Patients that are kept as they are.'},
    ],
    scene: RunScene,
  },
  {
    key: 'dry',
    label: 'Dry run',
    title: 'Make this a Dry Run',
    text: 'The connector runs completely, but no change is applied to the cohort. Use it for every new connector or new source file to find extraction, transformation, mapping, and validation problems safely.',
    config: [
      {name: 'Make this a Dry Run', text: 'Executes without changing cohort data. The results can be reviewed and then applied or abandoned.'},
      {name: 'Import a new File', text: 'Selects another compatible source file for this run of a file-based connector.'},
    ],
    scene: DryRunScene,
  },
  {
    key: 'replace',
    label: 'Replace all',
    title: 'Delete all patients before import',
    text: 'Permanently deletes every existing patient before the import, so the imported dataset replaces the cohort’s data completely.',
    config: [{name: 'Delete all patients before import', text: 'Only enable it when the source is meant to replace the whole cohort.'}],
    note: 'This cannot be undone through a new import. Run a dry run first.',
    scene: ReplaceScene,
  },
  {
    key: 'review',
    label: 'Review results',
    title: 'Check every run',
    text: 'The activity log lists each run with its new, deleted, updated, failed, and unchanged patients. View Details opens four tabs that together show what was imported and what was not.',
    config: [
      {name: 'Patient Results', text: 'The processed patients, whether they were committed, and whether the run was a dry run.'},
      {name: 'Patient Errors', text: 'Rejected values by patient, field, and message.'},
      {name: 'Run Errors', text: 'Problems that affected the run as a whole.'},
      {name: 'Run Logs', text: 'The detailed execution log, searchable and filterable by severity.'},
    ],
    note: 'A completed status only means the run finished. Always check Patient Errors.',
    scene: ReviewScene,
  },
];

export default function RunExplainer(): ReactNode {
  return <StepExplainer eyebrow="Run the connector" accent="load" modes={modes} />;
}
