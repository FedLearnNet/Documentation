import type {CSSProperties, ReactNode} from 'react';
import clsx from 'clsx';
import {at, Swap} from '../ConnectorSteps/StepExplainer';
import s from '../ConnectorSteps/styles.module.css';
import c from '../CohortSchemaAnimation/styles.module.css';
import d from './styles.module.css';

const color = (value: string) => ({'--c': value}) as CSSProperties;

const QUERY = 'Age > 35 AND Diagnosis = Diabetes type 1';

type Clinic = [name: string, local: number, sent: number];

const clinics: Clinic[] = [
  ['Clinic A', 187, 190],
  ['Clinic B', 431, 440],
  ['Clinic C', 31, 0],
];

/** Platform sends one query; each Client counts locally and returns a privacy-filtered count. */
export function BroadcastScene(): ReactNode {
  return (
    <div className={s.stage} style={{minHeight: 0}}>
      <div className={clsx(s.card, s.in)} style={at(100)}>
        <div className={s.cardHead}>
          <span>Platform · Find data</span>
          <span className={s.tag}>query</span>
        </div>
        <div className={s.row} style={{padding: '0.5rem 0.6rem'}}>
          <span className={clsx(s.chip, s.chipAccent, s.mono, s.pop)} style={at(400)}>
            {QUERY}
          </span>
        </div>
      </div>
      <div className={c.fanout} aria-hidden>
        {['16.5%', '50%', '83.5%'].map((x, i) => (
          <span key={x} className={s.fade} style={at(900 + i * 120, {'--x': x})} />
        ))}
      </div>
      <div className={c.trio}>
        {clinics.map(([name, local, sent], i) => (
          <div key={name} className={clsx(s.card, s.in)} style={at(1000 + i * 150)}>
            <div className={s.cardHead}>
              <span>Client · {name}</span>
              <span className={clsx(s.tag, s.tagNew)}>local</span>
            </div>
            <div className={c.site}>
              <span className={s.caption}>matching patients</span>
              <span className={c.siteName} style={{fontSize: '1.1rem'}}>
                <Swap from={<>{local}</>} to={<>{sent === 0 ? '0 · too few' : `≈ ${sent}`}</>} delay={2600 + i * 300} />
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className={s.row} style={{justifyContent: 'center'}}>
        <span className={clsx(s.chip, s.pop)} style={{...at(3800), fontSize: '0.85rem', borderColor: 'var(--ca-load)'}}>
          <span className={s.ok}>✓</span> Result on the Platform: <b>≈ 630</b> patients
        </span>
      </div>
      <div className={clsx(s.caption, s.fade)} style={{...at(4200), textAlign: 'center'}}>
        Exact counts stay in the clinic. Only rounded totals leave it.
      </div>
    </div>
  );
}

const columns: [clinic: string, column: string][] = [
  ['Clinic A', 'pat_age'],
  ['Clinic B', 'Alter'],
  ['Clinic C', 'age_years'],
];

/** Different local column names map to one schema field; the query uses the field. */
export function FieldScene(): ReactNode {
  return (
    <>
      <div className={s.mapRow} style={{gridTemplateColumns: 'minmax(0,1fr) 3rem minmax(0,1fr)'}}>
        <span className={s.label}>Local column (connector)</span>
        <span />
        <span className={s.label}>Schema field</span>
      </div>
      {columns.map(([clinic, column], i) => (
        <div key={clinic} className={s.mapRow} style={{gridTemplateColumns: 'minmax(0,1fr) 3rem minmax(0,1fr)'}}>
          <span className={clsx(s.chip, s.slideL)} style={at(200 + i * 200)}>
            {clinic} · <b className={s.mono}>{column}</b>
          </span>
          <span className={clsx(s.mapLine, s.grow)} style={at(900 + i * 250, {'--dur': '0.45s'})} />
          <span className={clsx(s.field, s.pop)} style={at(1200 + i * 250)}>
            Age <span className={s.type}>INT</span>
          </span>
        </div>
      ))}
      <div className={clsx(s.arrow, s.fade)} style={at(2100)}>
        query uses the field
      </div>
      <div className={s.center}>
        <span className={clsx(s.chip, s.chipAccent, s.mono, s.pop)} style={{...at(2400), fontSize: '0.9rem'}}>
          Age &gt; 35
        </span>
      </div>
      <div className={clsx(s.caption, s.fade)} style={{...at(2900), textAlign: 'center'}}>
        One condition works in every clinic, whatever the local column is called.
      </div>
    </>
  );
}

/** A condition is field + operator + value; conditions combine in AND / OR groups. */
export function BuilderScene(): ReactNode {
  const parts: [string, string][] = [
    ['Field', 'Age'],
    ['Operator', '>'],
    ['Value', '35'],
  ];
  return (
    <>
      <div className={s.row}>
        {parts.map(([label, value], i) => (
          <span key={label} className={clsx(d.step, s.pop)} style={{...at(200 + i * 350), ...color('var(--ca-map)'), padding: '0.5rem 0.8rem'}}>
            <span className={s.label}>{label}</span>
            <span className={clsx(d.stepName, s.mono)}>{value}</span>
          </span>
        ))}
        <span className={clsx(s.arrowRight, s.fade)} style={at(1300)}>
          =
        </span>
        <span className={clsx(s.chip, s.chipAccent, s.mono, s.pop)} style={at(1500)}>
          condition: Age &gt; 35
        </span>
      </div>
      <div className={clsx(s.box, s.in)} style={{...at(2100), alignItems: 'stretch'}}>
        <span className={s.row}>
          <span className={clsx(s.tag, s.pop)} style={at(2300)}>
            AND
          </span>
          <span className={s.caption}>all conditions must match</span>
        </span>
        <span className={s.row}>
          <span className={clsx(s.chip, s.mono, s.slideL)} style={at(2500)}>
            Age &gt; 35
          </span>
          <span className={clsx(s.chip, s.mono, s.slideL)} style={at(2700)}>
            Diagnosis = Diabetes type 1
          </span>
        </span>
      </div>
      <div className={s.row}>
        <span className={s.label}>Optional</span>
        {['OR group: any one matches', 'Time filter: May 2025', 'At least 3 times', 'A happens before B'].map((x, i) => (
          <span key={x} className={clsx(s.chip, s.chipMuted, s.pop)} style={at(3300 + i * 200)}>
            {x}
          </span>
        ))}
      </div>
    </>
  );
}

const operatorSets: [type: string, ops: string[]][] = [
  ['Numbers (INT, FLOAT)', ['=', '≠', '>', '≥', '<', '≤', 'in']],
  ['Dates', ['before', 'after', 'on or before', 'on or after']],
  ['Text', ['=', 'contains', 'starts with', 'ends with', 'regex']],
  ['Categories', ['=', '≠', 'in', 'not in']],
  ['Yes / no', ['=', '≠']],
];

/** Operators offered depend on the field's datatype. */
export function OperatorScene(): ReactNode {
  return (
    <>
      {operatorSets.map(([type, ops], i) => (
        <div key={type} className={clsx(d.wizardRow, s.slideL)} style={{...at(150 + i * 250), gridTemplateColumns: 'minmax(9rem, 0.6fr) minmax(0, 2fr)'}}>
          <b>{type}</b>
          <span className={s.row}>
            {ops.map((op) => (
              <span key={op} className={clsx(s.chip, s.mono)}>
                {op}
              </span>
            ))}
          </span>
        </div>
      ))}
      <div className={s.row} style={{marginTop: '0.4rem'}}>
        <span className={s.label}>Every type</span>
        <span className={clsx(s.chip, s.chipAccent, s.mono, s.pop)} style={at(1600)}>
          exists
        </span>
        <span className={clsx(s.chip, s.chipAccent, s.mono, s.pop)} style={at(1700)}>
          does not exist
        </span>
        <span className={clsx(s.chip, s.chipAccent, s.mono, s.pop)} style={at(1800)}>
          has changed
        </span>
      </div>
    </>
  );
}

type Check = [title: string, text: string, ok: boolean];

const checks: Check[] = [
  ['Allowed to query?', 'Access management permits this user on the cohort.', true],
  ['Not too frequent?', 'Minimum time between queries (default 3 s).', true],
  ['Field queryable?', 'Queriability: Value, Existence only, or None.', true],
  ['Enough patients?', 'Fewer than the minimum (default 100) → 0.', true],
  ['Round the count', 'Rounded up to two significant digits.', true],
];

/** The checks a Client runs before it answers. */
export function ClientCheckScene(): ReactNode {
  return (
    <div className={d.wizard}>
      {checks.map(([title, text], i) => (
        <div key={title} className={clsx(d.wizardRow, s.slideL)} style={at(200 + i * 450)}>
          <span className={d.num}>{i + 1}</span>
          <b>{title}</b>
          <span className={d.wizardText}>{text}</span>
        </div>
      ))}
      <div className={s.row} style={{justifyContent: 'center', marginTop: '0.3rem'}}>
        <span className={clsx(s.chip, s.pop)} style={{...at(2700), borderColor: 'var(--ca-load)'}}>
          <span className={s.ok}>✓</span> answered automatically, no manual approval
        </span>
      </div>
    </div>
  );
}

const roundings: [exact: string, sent: string, why: string][] = [
  ['31', '0', 'below minimum of 100'],
  ['187', '190', 'rounded up'],
  ['431', '440', 'rounded up'],
  ['1,234', '1,300', 'rounded up'],
];

/** Count rounding with real examples. */
export function RoundingScene(): ReactNode {
  return (
    <>
      <div className={s.mapRow} style={{gridTemplateColumns: 'minmax(0,1fr) 3rem minmax(0,1fr) minmax(0,1.4fr)'}}>
        <span className={s.label}>Exact in the clinic</span>
        <span />
        <span className={s.label}>Sent to the Platform</span>
        <span />
      </div>
      {roundings.map(([exact, sent, why], i) => (
        <div key={exact} className={s.mapRow} style={{gridTemplateColumns: 'minmax(0,1fr) 3rem minmax(0,1fr) minmax(0,1.4fr)'}}>
          <span className={clsx(s.chip, s.mono, s.slideL)} style={{...at(200 + i * 400), fontSize: '0.9rem'}}>
            {exact}
          </span>
          <span className={clsx(s.mapLine, s.grow)} style={at(500 + i * 400, {'--dur': '0.4s'})} />
          <span className={clsx(s.field, s.mono, s.pop)} style={{...at(800 + i * 400), fontSize: '0.9rem'}}>
            {sent}
          </span>
          <span className={clsx(s.caption, s.fade)} style={at(900 + i * 400)}>
            {why}
          </span>
        </div>
      ))}
      <div className={clsx(s.caption, s.fade)} style={{...at(2600), marginTop: '0.4rem'}}>
        Exact numbers never leave the clinic. Each clinic sets its own minimum.
      </div>
    </>
  );
}

/** Case and control cohorts give two counts side by side. */
export function CaseControlScene(): ReactNode {
  return (
    <div className={s.split}>
      {[
        ['Case', 'Diagnosis = Diabetes type 1', '≈ 630', 'var(--ca-map)'],
        ['Control', 'Diagnosis = Healthy', '≈ 2,400', 'var(--ca-extract)'],
      ].map(([name, cond, result, col], i) => (
        <div key={name} className={clsx(d.step, s.in)} style={{...at(200 + i * 400), ...color(col)}}>
          <span className={d.stepName}>{name}</span>
          <span className={clsx(s.chip, s.mono)}>{cond}</span>
          <span className={s.caption}>Result</span>
          <span className={clsx(d.stepName, s.pop)} style={{...at(1200 + i * 300), fontSize: '1.4rem'}}>
            {result}
          </span>
        </div>
      ))}
    </div>
  );
}
