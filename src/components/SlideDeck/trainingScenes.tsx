import type {CSSProperties, ReactNode} from 'react';
import clsx from 'clsx';
import {at, Swap} from '../ConnectorSteps/StepExplainer';
import s from '../ConnectorSteps/styles.module.css';
import c from '../CohortSchemaAnimation/styles.module.css';
import d from './styles.module.css';

const color = (value: string) => ({'--c': value}) as CSSProperties;

function Input({label, value, delay}: {label: string; value: ReactNode; delay: number}) {
  return (
    <span className={clsx(d.input, s.pop)} style={at(delay)}>
      <span className={d.inputLabel}>{label}</span>
      {value}
    </span>
  );
}

const path: [name: string, text: string, where: string, col: string][] = [
  ['Query', 'Which patients', 'Platform', 'var(--ca-map)'],
  ['Project', 'The workspace', 'Platform', 'var(--ca-map)'],
  ['Dataset', 'Which fields', 'Platform', 'var(--ca-map)'],
  ['Workflow', 'Which tool', 'Platform', 'var(--ca-map)'],
  ['Request', 'Clinics approve', 'Client', 'var(--ca-load)'],
  ['Run', 'Train locally', 'Client', 'var(--ca-load)'],
];

/** The whole training path, Platform steps then Client steps. */
export function TrainPathScene(): ReactNode {
  return (
    <>
      <div className={d.journey} style={{gridTemplateColumns: 'repeat(6, minmax(0, 1fr))'}}>
        {path.map(([name, text, where, col], i) => (
          <div key={name} className={clsx(d.step, s.in)} style={{...at(200 + i * 350), ...color(col)}}>
            <span className={s.row}>
              <span className={d.num}>{i + 1}</span>
              <span className={clsx(s.tag, s.tagMuted)}>{where}</span>
            </span>
            <span className={d.stepName}>{name}</span>
            <span className={d.stepText}>{text}</span>
          </div>
        ))}
      </div>
      <div className={clsx(s.progress, s.grow)} style={{...at(300, {'--dur': '2.2s'}), marginTop: '0.9rem'}}>
        <span />
      </div>
      <div className={s.row} style={{justifyContent: 'center', marginTop: '0.9rem'}}>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={{...at(2600), fontSize: '0.85rem'}}>
          Result: one trained model, no patient data moved
        </span>
      </div>
    </>
  );
}

const concerns: [q: string, a: string, example: string, col: string][] = [
  ['Which patients?', 'Query', 'Age exists · ≈ 1,600 patients', 'var(--ca-map)'],
  ['Which fields?', 'Dataset', 'Age, Gender, A1C Result, Readmitted', 'var(--ca-extract)'],
  ['Which computation?', 'Workflow', 'US-130 readmission model', 'var(--ca-transform)'],
];

/** The three separate choices a project combines. */
export function ConcernsScene(): ReactNode {
  return (
    <>
      <div className={c.trio}>
        {concerns.map(([q, a, example, col], i) => (
          <div key={a} className={clsx(d.step, s.in)} style={{...at(200 + i * 400), ...color(col)}}>
            <span className={s.caption}>{q}</span>
            <span className={d.stepName}>{a}</span>
            <span className={clsx(s.chip, s.mono)} style={{whiteSpace: 'normal'}}>
              {example}
            </span>
          </div>
        ))}
      </div>
      <div className={c.fanout} aria-hidden>
        {['16.5%', '50%', '83.5%'].map((x, i) => (
          <span key={x} className={s.fade} style={at(1500 + i * 120, {'--x': x})} />
        ))}
      </div>
      <div className={s.center}>
        <div className={clsx(s.fn, s.pop)} style={at(1900)}>
          <span style={{fontSize: '0.95rem', fontWeight: 650}}>Project</span>
          <span className={s.fnParams}>reviewable, reusable, each part on its own</span>
        </div>
      </div>
    </>
  );
}

const steps = ['1 Overview', '2 Data', '3 Workflow', '4 Run'];

/** Creating a project and linking a query. */
export function ProjectMockScene(): ReactNode {
  return (
    <div className={clsx(s.card, s.in)} style={at(100)}>
      <div className={s.cardHead}>
        <span>Platform · Training · Create Project</span>
      </div>
      <div className={d.mockBody}>
        <Input label="Project Name" value="Readmission US-130" delay={300} />
        <Input label="Description" value="Predict 30-day readmission across clinics" delay={600} />
        <div className={s.row}>
          <Input label="Link Query" value="Age exists" delay={1000} />
          <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(1400)}>
            ≈ 1,600 patients
          </span>
        </div>
        <span className={clsx(s.row, s.fade)} style={at(1800)}>
          <span className={s.ok}>✓</span>
          <span className={d.stepText}>I accept the process (name and description are shared with clinics)</span>
        </span>
      </div>
      <div className={s.miniTabs}>
        {steps.map((step, i) => (
          <span key={step} className={clsx(s.miniTab, i === 0 && s.miniTabActive, s.fade)} style={at(2300 + i * 200)}>
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}

const selections: [name: string, coverage: string][] = [
  ['Age', '3 / 3'],
  ['Gender', '3 / 3'],
  ['A1C Result', '3 / 3'],
  ['Num Medications', '2 / 3'],
  ['Readmitted', '3 / 3'],
];

/** Dataset builder: available selections become features. */
export function FeatureScene(): ReactNode {
  return (
    <div className={s.split}>
      <div className={clsx(s.card, s.in)} style={at(100)}>
        <div className={s.cardHead}>
          <span>Available data selections</span>
          <span className={s.caption}>clinics</span>
        </div>
        <table className={s.tbl}>
          <tbody>
            {selections.map(([name, cov], i) => (
              <tr key={name} className={s.fade} style={at(200 + i * 120)}>
                <th>{name}</th>
                <td style={{textAlign: 'right'}}>
                  <span className={clsx(s.tag, cov === '3 / 3' ? s.tagNew : s.tagUpd)}>{cov}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={s.row} style={{padding: '0.5rem 0.6rem'}}>
          <span className={clsx(d.primaryBtn, s.flash)} style={at(1100)}>
            Add all as features
          </span>
        </div>
      </div>
      <div className={clsx(s.card, s.in)} style={at(300)}>
        <div className={s.cardHead}>
          <span>Feature layout</span>
          <span className={s.caption}>column order</span>
        </div>
        <div className={d.mockBody}>
          {selections.map(([name], i) => (
            <span key={name} className={clsx(s.field, s.slideR)} style={at(1400 + i * 180)}>
              <span>
                {i + 1} · {name.toLowerCase().replace(/ /g, '_')}
              </span>
              <span className={s.type}>from {name}</span>
            </span>
          ))}
          <span className={clsx(s.caption, s.fade)} style={at(2500)}>
            Rename, reorder, or remove features. Num Medications is missing at one clinic.
          </span>
        </div>
      </div>
    </div>
  );
}

const longRows = [
  ['P-001', 'Age', '[60-70)'],
  ['P-001', 'A1C Result', '>8'],
  ['P-001', 'Readmitted', 'NO'],
  ['P-002', 'Age', '[40-50)'],
  ['P-002', 'A1C Result', 'None'],
  ['P-002', 'Readmitted', '<30'],
];

const wideRows = [
  ['P-001', '[60-70)', '>8', 'NO'],
  ['P-002', '[40-50)', 'None', '<30'],
];

/** Export: schema values per patient pivot into one row per patient. */
export function ExportScene(): ReactNode {
  return (
    <>
      <div className={s.split} style={{gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)'}}>
        <div className={clsx(s.card, s.in)} style={at(100)}>
          <div className={s.cardHead}>
            <span>Stored in the Client</span>
            <span className={clsx(s.tag, s.tagMuted)}>one value per row</span>
          </div>
          <table className={s.tbl}>
            <tbody>
              {longRows.map((r, i) => (
                <tr key={i} className={s.fade} style={at(200 + i * 100)}>
                  {r.map((x, j) => (
                    <td key={j}>{x}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={clsx(s.card, s.in)} style={at(1300)}>
          <div className={s.cardHead}>
            <span>Training table</span>
            <span className={s.tag}>one row per patient</span>
          </div>
          <table className={s.tbl}>
            <thead>
              <tr>
                {['patient', 'age', 'a1c_result', 'readmitted'].map((h, i) => (
                  <th key={h} className={clsx(i > 0 && s.colFocus, s.fade)} style={at(1500 + i * 150)}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {wideRows.map((r, i) => (
                <tr key={i} className={s.slideL} style={at(2200 + i * 300)}>
                  {r.map((x, j) => (
                    <td key={j}>{x}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={s.row} style={{justifyContent: 'center', marginTop: '0.6rem'}}>
        {['Native export', 'Wide format (pivot)', 'Join on Patient ID', 'Duplicate policy'].map((x, i) => (
          <span key={x} className={clsx(s.chip, i < 3 && s.chipAccent, s.pop)} style={at(900 + i * 150)}>
            {x}
          </span>
        ))}
      </div>
      <div className={clsx(s.caption, s.fade)} style={{...at(3000), textAlign: 'center'}}>
        Check the preview before any run. It shows exactly what the tool will receive.
      </div>
    </>
  );
}

const params: [string, string][] = [
  ['target_column', 'readmitted'],
  ['test_size', '0.2'],
  ['max_iter', '1000'],
  ['class_weight', 'balanced'],
];

/** Workflow: input data feeds a trainable tool with hyperparameters. */
export function WorkflowScene(): ReactNode {
  return (
    <>
      <div className={s.row} style={{justifyContent: 'center', alignItems: 'stretch', gap: '0.8rem'}}>
        <div className={clsx(s.box, s.in)} style={{...at(100), justifyContent: 'center'}}>
          <span className={s.fileIcon}>CSV</span>
          <b>input-data</b>
          <span className={s.caption}>the dataset</span>
        </div>
        <span className={clsx(s.mapLine, s.grow)} style={{...at(700, {'--dur': '0.5s'}), width: '4rem', alignSelf: 'center'}} />
        <div className={clsx(s.card, s.pop)} style={{...at(1100), minWidth: '17rem'}}>
          <div className={s.cardHead}>
            <span>US-130 Readmission Prediction</span>
            <span className={s.tag}>Trainable</span>
          </div>
          <table className={s.tbl}>
            <tbody>
              {params.map(([k, v], i) => (
                <tr key={k} className={s.fade} style={at(1600 + i * 180)}>
                  <th>{k}</th>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={s.row} style={{justifyContent: 'center', marginTop: '0.8rem'}}>
        {['Pick from the Tool Store', 'Input must match the dataset', 'Defaults are fine for a first run'].map((x, i) => (
          <span key={x} className={clsx(s.chip, s.chipMuted, s.pop)} style={at(2500 + i * 200)}>
            {x}
          </span>
        ))}
      </div>
    </>
  );
}

type Clinic = [name: string, requested: number, accepted: number | null, how: string];

const clinics: Clinic[] = [
  ['Clinic A', 620, 600, 'Reviewed, 20 excluded'],
  ['Clinic B', 980, 980, 'Accepted automatically'],
  ['Clinic C', 140, null, 'Rejected'],
];

/** The request freezes the project and each clinic decides. */
export function RequestScene(): ReactNode {
  return (
    <>
      <div className={s.row} style={{justifyContent: 'center'}}>
        <span className={clsx(s.chip, s.in)} style={at(100)}>
          Project <span className={clsx(s.tag, s.tagMuted)}>editable</span>
        </span>
        <span className={clsx(s.arrowRight, s.fade)} style={at(500)}>
          →
        </span>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(700)}>
          Training request <span className={s.tag}>frozen copy</span>
        </span>
      </div>
      <div className={c.fanout} aria-hidden>
        {['16.5%', '50%', '83.5%'].map((x, i) => (
          <span key={x} className={s.fade} style={at(1100 + i * 120, {'--x': x})} />
        ))}
      </div>
      <div className={c.trio}>
        {clinics.map(([name, requested, accepted, how], i) => (
          <div key={name} className={clsx(s.card, s.in)} style={at(1200 + i * 150)}>
            <div className={s.cardHead}>
              <span>Client · {name}</span>
              <span className={clsx(s.tag, accepted === null ? s.tagErr : s.tagNew, s.pop)} style={at(2400 + i * 300)}>
                {accepted === null ? 'rejected' : 'accepted'}
              </span>
            </div>
            <div className={c.site}>
              <span className={c.siteName} style={{fontSize: '1.05rem'}}>
                <Swap from={<>{requested} requested</>} to={<>{accepted ?? 0} accepted</>} delay={2400 + i * 300} />
              </span>
              <span className={clsx(s.caption, s.fade)} style={at(2400 + i * 300)}>
                {how}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className={s.row} style={{justifyContent: 'center'}}>
        <span className={clsx(s.chip, s.pop)} style={{...at(3600), fontSize: '0.85rem', borderColor: 'var(--ca-load)'}}>
          Acceptance count: <b>1,580</b> patients from 2 clinics
        </span>
      </div>
    </>
  );
}

const patients: [string, boolean][] = [
  ['P-001', true],
  ['P-002', true],
  ['P-003', false],
  ['P-004', true],
];

/** What a clinic reviews before accepting a training request. */
export function ClinicReviewScene(): ReactNode {
  return (
    <div className={s.split}>
      <div className={clsx(s.card, s.in)} style={at(100)}>
        <div className={s.cardHead}>
          <span>Client · Training Request Details</span>
        </div>
        <div className={s.miniTabs}>
          <span className={clsx(s.miniTab, s.miniTabActive)}>Overview</span>
          <span className={s.miniTab}>Selected Data</span>
          <span className={s.miniTab}>Workflow</span>
        </div>
        <table className={s.tbl}>
          <tbody>
            {patients.map(([id, keep], i) => (
              <tr key={id} className={s.fade} style={at(400 + i * 150)}>
                <td style={{width: '2rem'}}>
                  {keep ? (
                    <span className={s.ok}>✓</span>
                  ) : (
                    <Swap from={<span className={s.ok}>✓</span>} to={<span className={clsx(s.tag, s.tagMuted)}>–</span>} delay={1500} />
                  )}
                </td>
                <td>Heart failure 2024</td>
                <td className={clsx(!keep && s.dimmed)} style={at(1500)}>
                  {id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={s.row} style={{padding: '0.55rem 0.6rem', justifyContent: 'flex-end'}}>
          <span className={s.chip}>Reject</span>
          <span className={clsx(d.primaryBtn, s.flash)} style={at(2300)}>
            Accept
          </span>
        </div>
      </div>
      <div className={d.wizard}>
        {[
          ['Overview', 'Who asks, how many patients, where the aggregator runs. Untick patients to exclude them.'],
          ['Selected Data', 'The fields the training will see.'],
          ['Workflow', 'The tools it runs. Watch for uncertified tools.'],
        ].map(([tab, text], i) => (
          <div key={tab} className={clsx(d.wizardRow, s.slideR)} style={{...at(600 + i * 400), gridTemplateColumns: 'minmax(6.5rem, auto) minmax(0, 1fr)'}}>
            <b>{tab}</b>
            <span className={d.wizardText}>{text}</span>
          </div>
        ))}
        <span className={clsx(s.caption, s.fade)} style={at(2000)}>
          Automatic approval is possible by permission. Tools that need network access always need a person.
        </span>
      </div>
    </div>
  );
}

/** Federated run: local training, model updates to an aggregator, repeated rounds. */
export function FederatedRunScene(): ReactNode {
  const sites = ['Clinic A', 'Clinic B'];
  return (
    <>
      <div className={s.row} style={{justifyContent: 'center'}}>
        <span className={clsx(d.primaryBtn, s.pop)} style={at(100)}>
          Start
        </span>
        <span className={clsx(s.caption, s.fade)} style={at(300)}>
          on the Platform, after enough patients are accepted
        </span>
      </div>
      <div className={s.split}>
        {sites.map((site, i) => (
          <div key={site} className={clsx(s.card, s.in)} style={at(500 + i * 150)}>
            <div className={s.cardHead}>
              <span>Client · {site}</span>
              <span className={clsx(s.tag, s.tagNew)}>trains locally</span>
            </div>
            <div className={d.mockBody}>
              <span className={s.row}>
                <span className={s.chip}>🔒 accepted patients</span>
                <span className={s.arrowRight}>→</span>
                <span className={clsx(s.chip, s.chipAccent)}>model</span>
              </span>
              <span className={s.progress}>
                <span className={s.grow} style={at(900 + i * 200, {'--dur': '1.6s'})} />
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className={s.row} style={{justifyContent: 'center'}}>
        <span className={clsx(s.chip, s.pop)} style={at(2600)}>
          ↓ model updates only
        </span>
      </div>
      <div className={s.center}>
        <div className={clsx(s.fn, s.pop)} style={at(3000)}>
          <span style={{fontSize: '0.95rem', fontWeight: 650}}>Aggregator</span>
          <span className={s.fnParams}>on one participating Client or the Platform</span>
        </div>
      </div>
      <div className={s.row} style={{justifyContent: 'center'}}>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(3600)}>
          ↺ combined model goes back · next round
        </span>
      </div>
    </>
  );
}

const statuses: [string, string][] = [
  ['Ready', 'Accepted, waiting for Start'],
  ['Running', 'Clinics train, the aggregator combines'],
  ['Finished', 'Model and metadata stored'],
];

/** Run status on the Platform and what each Client sees. */
export function StatusScene(): ReactNode {
  return (
    <div className={s.split}>
      <div className={clsx(s.card, s.in)} style={at(100)}>
        <div className={s.cardHead}>
          <span>Platform · Run status</span>
        </div>
        <div className={d.mockBody}>
          {statuses.map(([name, text], i) => (
            <span key={name} className={clsx(s.row, s.slideL)} style={at(400 + i * 700)}>
              <span className={clsx(s.tag, i === 2 ? s.tagNew : i === 1 ? s.tagUpd : s.tagMuted)}>{name}</span>
              <span className={d.stepText}>{text}</span>
            </span>
          ))}
          <span className={clsx(s.row, s.fade)} style={at(2600)}>
            <span className={clsx(s.tag, s.tagErr)}>Failed</span>
            <span className={d.stepText}>Check logs: offline clinic, missing target column, tool error</span>
          </span>
        </div>
      </div>
      <div className={clsx(s.card, s.in)} style={at(500)}>
        <div className={s.cardHead}>
          <span>Client · Governance → Trainings</span>
        </div>
        <table className={s.tbl}>
          <tbody>
            {[
              ['Role', 'Coordinator or Participant'],
              ['Status', 'Same run, seen locally'],
              ['Selected Data', 'Fields the training used'],
              ['Export used Data', 'Exact local records, for audits'],
            ].map(([k, v], i) => (
              <tr key={k} className={s.fade} style={at(900 + i * 200)}>
                <th>{k}</th>
                <td style={{fontFamily: 'inherit', whiteSpace: 'normal'}}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
