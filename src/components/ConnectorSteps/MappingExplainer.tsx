import type {ReactNode} from 'react';
import clsx from 'clsx';
import StepExplainer, {at, type ExplainerMode} from './StepExplainer';
import s from './styles.module.css';

function FieldsScene() {
  const maps: [string, string, string, string, boolean][] = [
    ['patient_id', 'Patient ID', 'STRING', 'P-001', true],
    ['sex', 'Sex', 'CATEGORICAL', 'm', false],
    ['weight_kg', 'Body weight', 'FLOAT', '79.8', true],
    ['birth_date', 'Date of birth', 'DATE', '1980-04-12', true],
  ];
  return (
    <>
      <div className={s.row}>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(100)}>
          ✨ Suggest mapping
        </span>
        <span className={clsx(s.caption, s.fade)} style={at(300)}>
          proposals are reviewed before saving
        </span>
      </div>
      <div className={s.mapRow} style={{marginTop: '0.2rem'}}>
        <span className={s.label}>Source column</span>
        <span />
        <span className={s.label}>Schema field</span>
        <span className={s.label}>Sample</span>
      </div>
      {maps.map(([col, field, type, sample, ok], i) => (
        <div key={col} className={s.mapRow}>
          <span className={clsx(s.chip, s.mono, s.slideL)} style={{...at(400 + i * 150), overflow: 'hidden', textOverflow: 'ellipsis'}}>
            {col}
          </span>
          <span className={clsx(s.mapLine, s.grow)} style={at(1100 + i * 300, {'--dur': '0.45s'})} />
          <span className={clsx(s.field, s.pop)} style={at(1400 + i * 300)}>
            <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{field}</span>
            <span className={s.type}>{type}</span>
          </span>
          <span className={clsx(s.sample, s.fade)} style={at(2700 + i * 200)}>
            {sample}
            <span className={clsx(ok ? s.ok : s.err, s.pop)} style={at(2900 + i * 200)}>
              {ok ? '✓' : '✕'}
            </span>
          </span>
        </div>
      ))}
      <div className={clsx(s.card, s.in)} style={{...at(3800), borderColor: 'color-mix(in srgb, var(--ca-error) 40%, transparent)'}}>
        <div style={{padding: '0.45rem 0.6rem'}} className={s.caption}>
          <b style={{color: 'var(--ca-error)'}}>Sex:</b> “m” is not an allowed category (male, female, …). Add a value
          mapping transformation, then check the mapping again.
        </div>
      </div>
    </>
  );
}

function MultiScene() {
  const rows = [
    ['P-001', 'I10'],
    ['P-001', 'E11.9'],
    ['P-001', 'J45'],
  ];
  return (
    <>
      <div className={clsx(s.card, s.in)} style={at(100)}>
        <div className={s.cardHead}>source rows</div>
        <table className={s.tbl}>
          <thead>
            <tr>
              <th>patient_id</th>
              <th className={s.colFocus}>diagnosis</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r[0]}</td>
                <td className={clsx(s.colFocus, s.flash)} style={at(1000 + i * 450)}>
                  {r[1]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={clsx(s.arrow, s.fade)} style={at(800)}>
        Map to Field
      </div>
      <div className={s.split}>
        <div className={clsx(s.card, s.in)} style={at(600)}>
          <div className={s.cardHead}>
            <span>P-001 · Diagnoses</span>
            <span className={s.tag}>multi-value</span>
          </div>
          <div className={s.row} style={{padding: '0.55rem 0.6rem', minHeight: '2.6rem'}}>
            {rows.map((r, i) => (
              <span key={r[1]} className={clsx(s.chip, s.chipAccent, s.mono, s.drop)} style={at(1200 + i * 450)}>
                {r[1]}
              </span>
            ))}
          </div>
        </div>
        <div className={clsx(s.card, s.in)} style={at(700)}>
          <div className={s.cardHead}>
            <span>P-001 · Sex</span>
            <span className={clsx(s.tag, s.tagMuted)}>single</span>
          </div>
          <div className={s.row} style={{padding: '0.55rem 0.6rem', minHeight: '2.6rem'}}>
            <span className={clsx(s.chip, s.mono, s.pop)} style={at(1000)}>
              male
            </span>
          </div>
        </div>
      </div>
      <div className={clsx(s.caption, s.fade)} style={at(2800)}>
        A multi-value field collects the values from all rows of the same patient. A single-value field holds exactly
        one value.
      </div>
    </>
  );
}

function TimeScene() {
  const rows = [
    ['P-001', 'V1', '2025-01-15', '68', '15%'],
    ['P-001', 'V2', '2025-06-20', '66', '50%'],
    ['P-001', 'V3', '2025-11-02', '65', '85%'],
  ];
  return (
    <>
      <div className={clsx(s.card, s.in)} style={at(100)}>
        <div className={s.tblScroll}>
          <table className={s.tbl}>
            <thead>
              <tr>
                <th>patient_id</th>
                <th className={clsx(s.colFocus, s.fade)} style={at(700)}>
                  visit <span className={clsx(s.tag, s.pop)} style={at(900)}>context</span>
                </th>
                <th className={clsx(s.colFocus, s.fade)} style={at(700)}>
                  date <span className={clsx(s.tag, s.pop)} style={at(1000)}>context</span>
                </th>
                <th>weight_kg</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r[1]}>
                  <td>{r[0]}</td>
                  <td className={s.colFocus}>{r[1]}</td>
                  <td className={s.colFocus}>{r[2]}</td>
                  <td>{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={s.row}>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(1300)}>
          Map to Visit/Time
        </span>
        <span className={clsx(s.chip, s.pop)} style={at(1450)}>
          visit ← <b className={s.mono}>visit</b>
        </span>
        <span className={clsx(s.chip, s.pop)} style={at(1600)}>
          time ← <b className={s.mono}>date</b>
        </span>
      </div>
      <div className={clsx(s.card, s.in)} style={at(1900)}>
        <div className={s.cardHead}>
          <span>P-001 · Body weight over time</span>
        </div>
        <div className={s.timeline}>
          {rows.map((r, i) => (
            <div key={r[1]} className={clsx(s.tick, s.pop)} style={at(2300 + i * 400, {'--x': r[4]})}>
              <span className={s.tickValue}>{r[3]} kg</span>
              <span className={s.tickDot} />
              <span className={s.tickDate}>{r[2]}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const modes: ExplainerMode[] = [
  {
    key: 'fields',
    label: 'Map to field',
    title: 'Give every column its meaning',
    text: 'Each source column is linked to one field of the cohort schema. The mapper validates sample values against the field’s data type and rules, so problems show up before the import.',
    config: [
      {name: 'Map to Field', text: 'Links a source column to one schema field.'},
      {name: 'Suggest mapping', text: 'Proposes mappings automatically. Review every proposal before saving.'},
      {name: 'Validation', text: 'Sample values are checked against the type (STRING, CATEGORICAL, INT, FLOAT, BOOLEAN, DATE) and rules such as REQUIRED, MIN, MAX, or PATTERN.'},
    ],
    note: 'Invalid values are rejected one by one during the import. The patient’s other valid values are still stored.',
    scene: FieldsScene,
  },
  {
    key: 'multi',
    label: 'Multiple values',
    title: 'Single-value and multi-value fields',
    text: 'Schema fields accept either one value or several values. A multi-value field collects values found in separate rows for the same patient, such as several diagnoses or medications.',
    config: [
      {name: 'Single value', text: 'One value per patient, such as sex or date of birth.'},
      {name: 'Multiple values', text: 'Values from all rows of the patient are collected into one list.'},
    ],
    scene: MultiScene,
  },
  {
    key: 'time',
    label: 'Visit / time',
    title: 'Longitudinal data',
    text: 'Observations that repeat over visits or points in time are mapped with Map to Visit/Time. The visit and date columns provide context, so every value lands at the right patient and time.',
    config: [
      {name: 'Visit column', text: 'Identifies the visit or series entry of each row.'},
      {name: 'Date / timestamp', text: 'When the observation was made. ISO 8601 values are recommended.'},
      {name: 'Context only', text: 'Visit and time columns are not mapped as patient values themselves.'},
    ],
    scene: TimeScene,
  },
];

/** `only` limits the explainer to the given mode keys, e.g. for a single slide. */
export default function MappingExplainer({only}: {only?: string[]}): ReactNode {
  const shown = only ? modes.filter((m) => only.includes(m.key)) : modes;
  return <StepExplainer eyebrow="Step 5 · Map to the schema" accent="map" modes={shown} />;
}
