import type {CSSProperties, ReactNode} from 'react';
import clsx from 'clsx';
import {at, Swap} from '../ConnectorSteps/StepExplainer';
import s from '../ConnectorSteps/styles.module.css';
import d from './styles.module.css';

const palette = ['var(--ca-map)', 'var(--ca-load)', 'var(--ca-transform)', 'var(--ca-extract)'];

/** Labelled input box in a UI mock. */
function Input({label, value, delay}: {label: string; value: ReactNode; delay: number}) {
  return (
    <span className={clsx(d.input, s.pop)} style={at(delay)}>
      <span className={d.inputLabel}>{label}</span>
      {value}
    </span>
  );
}

const tabs: [string, string][] = [
  ['Details', 'Name, purpose, citation'],
  ['Schema', 'Fields and their types'],
  ['Queriability', 'What may be queried'],
  ['Access', 'Who may use the data'],
  ['Statistics', 'Profile and own charts'],
  ['Patients', 'View and edit records'],
  ['Members', 'Who maintains it'],
];

/** The tabs of a cohort page, each with what it is for. */
export function CohortTabsScene(): ReactNode {
  return (
    <div className={clsx(s.card, s.in)} style={at(100)}>
      <div className={s.cardHead}>
        <span>Client · Cohorts · Heart failure 2024</span>
        <span className={s.row} style={{gap: '0.3rem'}}>
          <span className={clsx(s.chip, s.chipAccent)}>Connector</span>
          <span className={s.chip}>Export</span>
        </span>
      </div>
      <div className={s.miniTabs}>
        {tabs.map(([name], i) => (
          <span key={name} className={clsx(s.miniTab, s.flash)} style={at(600 + i * 450)}>
            {name}
          </span>
        ))}
      </div>
      <div className={d.tabGrid}>
        {tabs.map(([name, text], i) => (
          <div key={name} className={clsx(d.tabCard, s.pop)} style={at(600 + i * 450)}>
            <b>{name}</b>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The Platform query builder with two conditions and a result. */
export function QueryBuilderMockScene(): ReactNode {
  const rows: [string, string, string][] = [
    ['Age', 'Greater than', '35'],
    ['Diagnosis', 'Equals', 'Diabetes type 1'],
  ];
  return (
    <div className={clsx(s.card, s.in)} style={at(100)}>
      <div className={s.cardHead}>
        <span>Platform · Find data · New query</span>
      </div>
      <div className={d.mockBody}>
        <Input label="Name" value="Adults with type 1 diabetes" delay={300} />
        {rows.map(([field, op, value], i) => (
          <div key={field} className={s.row}>
            {i > 0 && (
              <span className={clsx(s.tag, s.pop)} style={at(1500)}>
                AND
              </span>
            )}
            <Input label="Field" value={field} delay={700 + i * 900} />
            <Input label="Operator" value={op} delay={950 + i * 900} />
            <Input label="Value" value={value} delay={1200 + i * 900} />
          </div>
        ))}
        <div className={s.row} style={{justifyContent: 'flex-end'}}>
          <span className={clsx(s.chip, s.fade)} style={at(2700)}>
            Create query
          </span>
          <span className={clsx(d.primaryBtn, s.pop)} style={at(2900)}>
            Save and Run Query
          </span>
        </div>
      </div>
      <div className={clsx(d.resultBar, s.in)} style={at(3600)}>
        <span>Result</span>
        <b>≈ 630</b>
        <span className={s.caption}>3 clinics answered</span>
      </div>
    </div>
  );
}

const checks = ['Known user, clear purpose', 'Enough patients for your minimum', 'Fields fine to share as summaries'];

/** A statistics request as the Data Access Manager reviews it. */
export function RequestMockScene(): ReactNode {
  const overview: [string, ReactNode][] = [
    ['Status', <Swap key="st" from={<span className={clsx(s.tag, s.tagMuted)}>Pending</span>} to={<span className={clsx(s.tag, s.tagNew)}>Accepted</span>} delay={3600} />],
    ['Query', <span key="q" className={clsx(s.chip, s.mono)}>Age &gt; 35</span>],
    ['Requested cohorts', '1'],
    ['Requested patients', '412'],
  ];
  return (
    <div className={s.split}>
      <div className={clsx(s.card, s.in)} style={at(100)}>
        <div className={s.cardHead}>
          <span>Client · Statistics Request Details</span>
        </div>
        <table className={s.tbl}>
          <tbody>
            {overview.map(([k, v], i) => (
              <tr key={k} className={s.fade} style={at(300 + i * 200)}>
                <th>{k}</th>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={s.row} style={{padding: '0.55rem 0.6rem', justifyContent: 'flex-end'}}>
          <span className={s.chip}>Close</span>
          <span className={s.chip}>Reject</span>
          <span className={clsx(d.primaryBtn, s.flash)} style={at(3300)}>
            Accept
          </span>
        </div>
      </div>
      <div className={clsx(s.card, s.in)} style={at(500)}>
        <div className={s.cardHead}>
          <span>Before you accept</span>
        </div>
        <div className={d.mockBody}>
          {checks.map((x, i) => (
            <span key={x} className={s.row}>
              <span className={clsx(s.ok, s.pop)} style={at(1300 + i * 600)}>
                ✓
              </span>
              <span className={clsx(s.fade, d.stepText)} style={at(1300 + i * 600)}>
                {x}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const ageGroups = ['< 40', '40–60', '60–80', '80+'];

const shares: [clinic: string, values: number[]][] = [
  ['Clinic A', [10, 35, 45, 10]],
  ['Clinic B', [15, 40, 35, 10]],
  ['Clinic C', [5, 25, 50, 20]],
];

type Cover = 'full' | 'part' | 'none';

const coverage: [field: string, values: Cover[]][] = [
  ['Age group', ['full', 'full', 'full']],
  ['Body weight', ['full', 'part', 'none']],
  ['HbA1c', ['full', 'full', 'part']],
];

const coverLabel: Record<Cover, string> = {full: 'complete', part: 'gaps', none: 'missing'};

/** Cross-clinic comparison: one distribution per clinic and field coverage. */
export function CompareScene(): ReactNode {
  return (
    <div className={s.split}>
      <div className={clsx(s.card, s.in)} style={at(100)}>
        <div className={s.cardHead}>
          <span>Age group per clinic</span>
          <span className={s.row} style={{gap: '0.3rem'}}>
            {ageGroups.map((g, i) => (
              <span key={g} className={s.row} style={{gap: '0.2rem'}}>
                <span className={s.dot} style={{'--c': palette[i]} as CSSProperties} />
                <span className={s.caption}>{g}</span>
              </span>
            ))}
          </span>
        </div>
        <div className={d.mockBody}>
          {shares.map(([clinic, values], i) => (
            <div key={clinic} className={d.barRow}>
              <span className={s.caption}>{clinic}</span>
              <span className={clsx(d.meter, s.grow)} style={at(500 + i * 300, {'--dur': '0.8s'})}>
                {values.map((v, j) => (
                  <span key={j} style={{width: `${v}%`, background: palette[j]}} />
                ))}
              </span>
            </div>
          ))}
          <span className={clsx(s.caption, s.fade)} style={at(1800)}>
            Clinic C has older patients.
          </span>
        </div>
      </div>
      <div className={clsx(s.card, s.in)} style={at(400)}>
        <div className={s.cardHead}>
          <span>Coverage</span>
          <span className={s.caption}>A · B · C</span>
        </div>
        <table className={s.tbl}>
          <tbody>
            {coverage.map(([field, values], i) => (
              <tr key={field} className={s.fade} style={at(2200 + i * 300)}>
                <th>{field}</th>
                {values.map((v, j) => (
                  <td key={j}>
                    <span className={clsx(s.tag, v === 'full' ? s.tagNew : v === 'part' ? s.tagUpd : s.tagErr)}>
                      {coverLabel[v]}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className={clsx(s.caption, s.fade)} style={{...at(3300), padding: '0.5rem 0.6rem'}}>
          Clinic C has no body weight. A model using it cannot train there.
        </div>
      </div>
    </div>
  );
}

const profileFields: [name: string, values: number[]][] = [
  ['A1C Result', [82, 8, 6, 4]],
  ['Change', [54, 46]],
];

const columns: number[][] = [
  [1, 1, 0],
  [2, 1, 0],
  [5, 6, 2],
  [14, 20, 4],
  [20, 33, 7],
  [44, 85, 8],
  [66, 90, 16],
  [78, 86, 22],
  [33, 87, 17],
  [8, 10, 4],
];

/** Data Profile and a custom dashboard, side by side. */
export function LocalStatsScene(): ReactNode {
  const max = Math.max(...columns.map((c) => c.reduce((a, b) => a + b, 0)));
  return (
    <div className={s.split}>
      <div className={clsx(s.card, s.in)} style={at(100)}>
        <div className={s.cardHead}>
          <span>Statistics · Data Profile</span>
          <span className={clsx(s.tag, s.tagMuted)}>generated</span>
        </div>
        <div className={d.mockBody}>
          <div className={d.kpis}>
            {[
              ['Properties', '49'],
              ['Patients', '778'],
              ['Missing', '0'],
            ].map(([k, v], i) => (
              <span key={k} className={clsx(d.kpi, s.pop)} style={at(400 + i * 150)}>
                <span className={s.label}>{k}</span>
                <b>{v}</b>
              </span>
            ))}
          </div>
          {profileFields.map(([name, values], i) => (
            <div key={name} className={d.barRow}>
              <span className={s.caption}>{name}</span>
              <span className={clsx(d.meter, s.grow)} style={at(1100 + i * 300, {'--dur': '0.8s'})}>
                {values.map((v, j) => (
                  <span key={j} style={{width: `${v}%`, background: palette[j]}} />
                ))}
              </span>
            </div>
          ))}
          <span className={clsx(s.caption, s.fade)} style={at(1900)}>
            One card per field, no setup.
          </span>
        </div>
      </div>
      <div className={clsx(s.card, s.in)} style={at(400)}>
        <div className={s.cardHead}>
          <span>Dashboard · Age by readmission</span>
          <span className={clsx(s.tag, s.tagMuted)}>your chart</span>
        </div>
        <div className={d.mockBody}>
          <div className={d.cols}>
            {columns.map((segs, i) => (
              <span key={i} className={clsx(d.col, d.growY)} style={at(1300 + i * 120)}>
                {segs.map((v, j) => (
                  <span key={j} style={{height: `${(v / max) * 100}%`, background: palette[j]}} />
                ))}
              </span>
            ))}
          </div>
          <span className={clsx(s.caption, s.fade)} style={at(2800)}>
            Bar, pie, line, scatter, histogram, box plot, heatmap.
          </span>
        </div>
      </div>
    </div>
  );
}
