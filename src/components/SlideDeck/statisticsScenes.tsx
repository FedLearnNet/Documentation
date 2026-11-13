import type {CSSProperties, ReactNode} from 'react';
import clsx from 'clsx';
import {at, Swap} from '../ConnectorSteps/StepExplainer';
import s from '../ConnectorSteps/styles.module.css';
import d from './styles.module.css';

const color = (value: string) => ({'--c': value}) as CSSProperties;

const kinds: [name: string, where: string, col: string, rows: [string, string][]][] = [
  [
    'Network statistics',
    'Platform',
    'var(--ca-map)',
    [
      ['Who asks', 'A Platform user'],
      ['Which patients', 'Those matching a query'],
      ['Computed', 'In each Client'],
      ['Returned', 'Privacy-filtered summaries'],
      ['Approval', 'Automatic or by a Data Access Manager'],
    ],
  ],
  [
    'Local statistics',
    'Client',
    'var(--ca-load)',
    [
      ['Who looks', 'Cohort members in the Client'],
      ['Which patients', 'The whole cohort'],
      ['Views', 'Data Profile and custom dashboards'],
      ['Returned', 'Nothing, it stays in the Client'],
      ['Approval', 'Not needed'],
    ],
  ],
];

/** Network statistics vs. local cohort statistics. */
export function KindsScene(): ReactNode {
  return (
    <div className={s.split}>
      {kinds.map(([name, where, col, rows], i) => (
        <div key={name} className={clsx(d.step, s.in)} style={{...at(200 + i * 400), ...color(col)}}>
          <span className={s.row}>
            <span className={d.stepName}>{name}</span>
            <span className={clsx(s.tag, s.tagMuted)}>{where}</span>
          </span>
          <dl style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.3rem 0.8rem', margin: 0}}>
            {rows.map(([k, v], j) => (
              <div key={k} style={{display: 'contents'}}>
                <dt className={clsx(s.label, s.fade)} style={at(600 + i * 400 + j * 120)}>
                  {k}
                </dt>
                <dd className={clsx(d.stepText, s.fade)} style={{...at(600 + i * 400 + j * 120), margin: 0}}>
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

const flow: [title: string, text: string, where: string, col: string][] = [
  ['Run a query', 'Selects the patients, e.g. Age > 35', 'Platform', 'var(--ca-map)'],
  ['Request Statistics', 'One click on the query page', 'Platform', 'var(--ca-map)'],
  ['Approve', 'Automatic, or a Data Access Manager accepts', 'Client', 'var(--ca-load)'],
  ['Compute', 'A profile per field for the matching patients', 'Client', 'var(--ca-load)'],
  ['Sanitize', 'Round, drop rare values, remove IDs', 'Client', 'var(--ca-load)'],
  ['Compare', 'Clinics side by side', 'Platform', 'var(--ca-map)'],
];

/** End-to-end flow of a statistics request. */
export function StatsFlowScene(): ReactNode {
  return (
    <div className={d.wizard}>
      {flow.map(([title, text, where, col], i) => (
        <div key={title} className={clsx(d.wizardRow, s.slideL)} style={{...at(200 + i * 400), ...color(col)}}>
          <span className={d.num}>{i + 1}</span>
          <span className={s.row}>
            <b>{title}</b>
            <span className={clsx(s.tag, s.tagMuted)}>{where}</span>
          </span>
          <span className={d.wizardText}>{text}</span>
        </div>
      ))}
    </div>
  );
}

/** A request arrives and is approved automatically or manually. */
export function ApprovalScene(): ReactNode {
  return (
    <>
      <div className={clsx(s.card, s.in)} style={at(100)}>
        <div className={s.cardHead}>
          <span>Client · Requests → Statistics Requests</span>
          <span className={clsx(s.tag, s.tagMuted)}>
            <Swap from={<>Pending</>} to={<>Accepted</>} delay={2600} />
          </span>
        </div>
        <div className={s.row} style={{padding: '0.5rem 0.6rem'}}>
          <span className={s.chip}>
            Query <b className={s.mono}>Age &gt; 35</b>
          </span>
          <span className={s.chip}>1 cohort</span>
          <span className={s.chip}>412 patients</span>
        </div>
      </div>
      <div className={s.split}>
        <div className={clsx(d.step, s.in)} style={{...at(900), ...color('var(--ca-load)')}}>
          <b>Automatic</b>
          <span className={d.stepText}>
            A permission sets <b>Automatic statistics access for</b> to <b>All</b>. Default for new cohorts.
          </span>
        </div>
        <div className={clsx(d.step, s.in)} style={{...at(1300), ...color('var(--ca-transform)')}}>
          <b>Manual</b>
          <span className={d.stepText}>
            Otherwise a Data Access Manager reviews it and selects <b>Accept</b> or <b>Reject</b>.
          </span>
        </div>
      </div>
    </>
  );
}

type Value = [label: string, raw: string, safe: string, note: string];

const values: Value[] = [
  ['Count', '783', '785', 'rounded up to 5'],
  ['Missing', '12', '15', 'rounded up to 5'],
  ['Unique', '9', '10', 'rounded up to 5'],
  ['Mean', '5.6347', '5.6', '1 decimal'],
  ['Min', '1', '—', 'removed'],
  ['Max', '25', '—', 'removed'],
];

const categories: [name: string, raw: number, safe: number | null][] = [
  ['None', 643, 645],
  ['>8', 58, 60],
  ['Norm', 41, 45],
  ['>7', 2, null],
];

/** One field profile before and after sanitizing, with the default rules. */
export function SanitizeScene(): ReactNode {
  return (
    <div className={s.split}>
      <div className={clsx(s.card, s.in)} style={at(100)}>
        <div className={s.cardHead}>
          <span>Field profile · A1C Result</span>
          <span className={s.tag}>leaves the Client</span>
        </div>
        <table className={s.tbl}>
          <tbody>
            {values.map(([label, raw, safe, note], i) => (
              <tr key={label}>
                <th>{label}</th>
                <td>
                  <Swap from={<>{raw}</>} to={<>{safe}</>} delay={1200 + i * 250} />
                </td>
                <td className={clsx(s.caption, s.fade)} style={at(1200 + i * 250)}>
                  {note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={clsx(s.card, s.in)} style={at(300)}>
        <div className={s.cardHead}>
          <span>Top values</span>
          <span className={clsx(s.tag, s.tagMuted)}>categories</span>
        </div>
        <table className={s.tbl}>
          <tbody>
            {categories.map(([name, raw, safe], i) => (
              <tr key={name} className={clsx(safe === null && s.dimmed)} style={at(3000 + i * 200)}>
                <th>{name}</th>
                <td>
                  <Swap from={<>{raw}</>} to={<>{safe ?? 'dropped'}</>} delay={3000 + i * 200} />
                </td>
                <td className={clsx(s.caption, s.fade)} style={at(3000 + i * 200)}>
                  {safe === null ? 'fewer than 3' : 'rounded up to 5'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={clsx(s.caption, s.fade)} style={{...at(4000), padding: '0.5rem 0.6rem'}}>
          Fewer than 10 matching patients: no statistics at all. Patient and cohort IDs are never sent.
        </div>
      </div>
    </div>
  );
}
