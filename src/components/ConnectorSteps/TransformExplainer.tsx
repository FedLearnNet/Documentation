import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import StepExplainer, {Swap, at, type ExplainerMode} from './StepExplainer';
import s from './styles.module.css';

function Fn({name, params, delay}: {name: string; params: string; delay: number}) {
  return (
    <div className={clsx(s.fn, s.pop)} style={at(delay)}>
      <span className={s.fnName}>{name}</span>
      <span className={s.fnParams}>{params}</span>
    </div>
  );
}

function CellScene() {
  const rows = [
    ['P-001', 'male', '176', '79.8'],
    ['P-002', 'female', '154', '69.9'],
    ['P-003', 'female', '141', '64.0'],
  ];
  return (
    <>
      <div className={s.row}>
        <Fn name="Scale Numeric" params="multiplier 0.4536 · decimals 1" delay={100} />
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(500)}>
          Columns: <b className={s.mono}>weight_lbs</b>
        </span>
      </div>
      <div className={clsx(s.card, s.in)} style={at(300)}>
        <table className={s.tbl}>
          <thead>
            <tr>
              <th>patient_id</th>
              <th>sex</th>
              <th className={clsx(s.colFocus, s.fade)} style={at(700)}>
                weight_lbs
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r[0]}>
                <td>{r[0]}</td>
                <td>{r[1]}</td>
                <td className={clsx(s.colFocus, s.flash)} style={at(1200 + i * 600)}>
                  <Swap from={r[2]} to={r[3]} delay={1450 + i * 600} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={clsx(s.caption, s.fade)} style={at(3200)}>
        The function runs once per selected cell and writes its result back into the same cell. Other columns are not
        touched.
      </div>
    </>
  );
}

function RowScene() {
  const rows = [
    ['P-001', '2025-03-02', '2025-03-09', '7'],
    ['P-002', '2025-04-10', '2025-04-13', '3'],
    ['P-003', '2025-05-01', '2025-05-13', '12'],
  ];
  return (
    <>
      <div className={s.row}>
        <Fn name="Date Difference" params="unit DAYS" delay={100} />
      </div>
      <div className={s.row}>
        <span className={clsx(s.label, s.fade)} style={at(400)}>
          Input
        </span>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(500)}>
          start ← <b className={s.mono}>admission</b>
        </span>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(650)}>
          end ← <b className={s.mono}>discharge</b>
        </span>
      </div>
      <div className={s.row}>
        <span className={clsx(s.label, s.fade)} style={at(800)}>
          Output
        </span>
        <span className={clsx(s.chip, s.pop)} style={at(900)}>
          value → new column <b className={s.mono}>stay_days</b>
        </span>
      </div>
      <div className={clsx(s.card, s.in)} style={at(300)}>
        <div className={s.tblScroll}>
          <table className={s.tbl}>
            <thead>
              <tr>
                <th>patient_id</th>
                <th className={s.colFocus}>admission</th>
                <th className={s.colFocus}>discharge</th>
                <th className={clsx(s.colNew, s.slideR)} style={at(1300)}>
                  stay_days
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r[0]} className={s.flash} style={at(1600 + i * 650)}>
                  <td>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td>{r[2]}</td>
                  <td className={clsx(s.colNew, s.pop)} style={at(1900 + i * 650)}>
                    {r[3]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={clsx(s.caption, s.fade)} style={at(3800)}>
        The function runs once per row and can combine several columns of that row.
      </div>
    </>
  );
}

function PatientScene() {
  const rem = (n: number) => `${n}rem`;
  // [patient, visit, value, start slot, grouped top, max]
  const rows: [string, string, string, number, number, string][] = [
    ['P-002', 'V1', '6.1', 0, 6.5, '7.0'],
    ['P-001', 'V1', '5.4', 1, 1.1, '6.3'],
    ['P-003', 'V1', '5.9', 2, 11.9, '5.9'],
    ['P-001', 'V2', '6.3', 3, 3.15, '6.3'],
    ['P-002', 'V2', '7.0', 4, 8.55, '7.0'],
  ];
  const colors: Record<string, string> = {'P-001': 'var(--ca-a)', 'P-002': 'var(--ca-b)', 'P-003': 'var(--ca-c)'};
  const groups: [string, number][] = [
    ['P-001', 0],
    ['P-002', 5.4],
    ['P-003', 10.8],
  ];
  return (
    <>
      <div className={s.row}>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(100)}>
          Patient ID ← <b className={s.mono}>patient_id</b>
        </span>
        <span className={clsx(s.caption, s.fade)} style={at(300)}>
          rows are grouped per patient
        </span>
        <Fn name="Patient Value Aggregate" params="aggregate MAX · write ALL" delay={2100} />
      </div>
      <div className={s.stackRow} style={{position: 'relative', top: 0, border: 0, background: 'transparent', fontFamily: 'inherit', fontWeight: 650, fontSize: '0.66rem', color: 'var(--ca-muted)'}}>
        <span>patient</span>
        <span>visit</span>
        <span>HbA1c</span>
        <span className={s.fade} style={{...at(2400), color: 'var(--ca-load)'}}>
          max_hba1c
        </span>
      </div>
      <div className={s.stack} style={{height: '13.8rem'}}>
        {groups.map(([id, y]) => (
          <span key={id} className={clsx(s.groupLabel, s.fade)} style={at(1500, {'--y1': rem(y)})}>
            {id}
          </span>
        ))}
        {rows.map(([id, visit, value, slot, y1, max]) => (
          <div
            key={`${id}-${visit}`}
            className={clsx(s.stackRow, s.move)}
            style={at(700, {'--y0': rem(1.1 + slot * 2.05), '--y1': rem(y1)})}>
            <span>
              <span className={s.dot} style={at(0, {'--c': colors[id]})} />
              {id}
            </span>
            <span>{visit}</span>
            <span>{value}</span>
            <span className={s.pop} style={{...at(2700 + slot * 120), color: 'var(--ca-load)', fontWeight: 650}}>
              {max}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function ColumnsScene() {
  const rows = [
    ['P-001', '120/80', '120', '80'],
    ['P-002', '135/85', '135', '85'],
    ['P-003', '118/76', '118', '76'],
  ];
  return (
    <>
      <div className={s.row}>
        <Fn name="Split Column" params='source bp · delimiter "/" · parts bp_sys, bp_dia' delay={100} />
      </div>
      <div className={clsx(s.card, s.in)} style={at(300)}>
        <div className={s.tblScroll}>
          <table className={s.tbl}>
            <thead>
              <tr>
                <th>patient_id</th>
                <th className={clsx(s.colFocus, s.colRemoved, s.dimmed)} style={at(3300)}>
                  bp
                </th>
                <th className={clsx(s.colNew, s.slideR)} style={at(1000)}>
                  bp_sys
                </th>
                <th className={clsx(s.colNew, s.slideR)} style={at(1150)}>
                  bp_dia
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r[0]}>
                  <td>{r[0]}</td>
                  <td className={clsx(s.colFocus, s.colRemoved, s.dimmed)} style={at(3300)}>
                    {r[1]}
                  </td>
                  <td className={clsx(s.colNew, s.pop)} style={at(1400 + i * 200)}>
                    {r[2]}
                  </td>
                  <td className={clsx(s.colNew, s.pop)} style={at(1500 + i * 200)}>
                    {r[3]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={s.row}>
        <Fn name="Remove Columns" params="columns bp" delay={2700} />
        <span className={clsx(s.caption, s.fade)} style={at(3300)}>
          the packed source column is no longer needed
        </span>
      </div>
    </>
  );
}

function AppScene() {
  const rows = [
    ['P-001', 'Type 2 diabetes', 'E11'],
    ['P-002', 'Hypertension', 'I10'],
    ['P-003', 'Asthma', 'J45'],
  ];
  return (
    <>
      <div className={s.row}>
        <span className={clsx(s.label, s.fade)} style={at(100)}>
          Transformation source
        </span>
        <span className={clsx(s.chip, s.chipMuted, s.fade)} style={at(200)}>
          Built-in
        </span>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(400)}>
          <b>App tools</b>
        </span>
      </div>
      <div className={s.rowNowrap} style={{alignItems: 'stretch'}}>
        <div className={clsx(s.card, s.in)} style={{...at(600), flex: 1}}>
          <div className={s.tblScroll}>
            <table className={s.tbl}>
              <thead>
                <tr>
                  <th className={s.colFocus}>diagnosis_text</th>
                  <th className={clsx(s.colNew, s.slideR)} style={at(2600)}>
                    icd10
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r[0]}>
                    <td style={{fontFamily: 'inherit'}}>{r[1]}</td>
                    <td className={clsx(s.colNew, s.pop)} style={at(2900 + i * 200)}>
                      {r[2]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={clsx(s.box, s.slideR)} style={{...at(900), flex: 'none', width: '8.5rem', justifyContent: 'center'}}>
          <span style={{fontSize: '0.74rem', fontWeight: 650, textAlign: 'center'}}>Diagnosis coder</span>
          <span className={s.caption} style={{textAlign: 'center'}}>example app</span>
          <span className={clsx(s.gear, s.spin)} style={at(1300, {'--n': 2})}>
            ⚙
          </span>
          <span className={clsx(s.ok, s.pop)} style={at(3100)}>
            ✓
          </span>
        </div>
      </div>
      <div className={s.row}>
        <span className={clsx(s.chip, s.pop)} style={at(1200)}>
          input ← <b className={s.mono}>diagnosis_text</b>
        </span>
        <span className={clsx(s.chip, s.pop)} style={at(1350)}>
          output → <b className={s.mono}>icd10</b>
        </span>
        <span className={clsx(s.chip, s.chipMuted, s.pop)} style={at(3600)}>
          skipped in preview · runs on import
        </span>
      </div>
    </>
  );
}

const modes: ExplainerMode[] = [
  {
    key: 'cell',
    label: 'Cell',
    title: 'Cell transformations',
    text: 'Run once for each cell of the selected columns. Best for parsing, normalizing, or replacing individual values.',
    config: [
      {name: 'Columns', text: 'The columns whose cells the function processes.'},
      {name: 'Hyper-Parameters', text: 'Settings of the function, such as multiplier, divisor, and decimals.'},
      {name: 'Result', text: 'Replaces the original value in the same cell.'},
    ],
    examples: ['Replace Value', 'Normalize Missing', 'Trim And Case', 'Regex Replace', 'Generic Value Mapper', 'Scale Numeric', 'datetime_to_date', 'Numeric Range Group Mapper'],
    scene: CellScene,
  },
  {
    key: 'row',
    label: 'Row',
    title: 'Row transformations',
    text: 'Run once per row. Best when a value is combined or derived from several columns of the same row.',
    config: [
      {name: 'Input', text: 'For each function input, pick a column of the row or enter a fixed value.'},
      {name: 'Output', text: 'Write each result to a new column, or select an existing column to overwrite it. Overwriting loses the original data.'},
      {name: 'Hyper-Parameters', text: 'Settings of the function, such as the unit DAYS, HOURS, MINUTES, or SECONDS.'},
    ],
    examples: ['Date Difference', 'Column Set Indicator', 'Merge Columns', 'Split Column', 'GI Symptoms Split'],
    scene: RowScene,
  },
  {
    key: 'patient',
    label: 'Patient',
    title: 'Patient transformations',
    text: 'Run with all rows of one patient at once. Best for filtering, chronological sorting, and values derived across a patient’s rows, such as a maximum lab value or a readmission target.',
    config: [
      {name: 'Patient ID', text: 'Map a source column to the external patient ID first. Rows are grouped by this column.'},
      {name: 'Input', text: 'Columns the function reads, for example the measured value, a code column, or an order column.'},
      {name: 'Hyper-Parameters', text: 'For example the aggregate (MAX, MIN, FIRST, LAST, MEAN, SUM, COUNT) and which rows receive the result (ALL, FIRST, ANCHOR, GROUP).'},
      {name: 'Rows', text: 'A patient function may reorder rows, drop rows, or remove a whole patient from the import.'},
    ],
    examples: ['Patient Value Aggregate', 'Filter Rows By Value', 'Filter Patient By Hit', 'Patient Prior Event Count', 'Readmission Target'],
    scene: PatientScene,
  },
  {
    key: 'columns',
    label: 'Columns',
    title: 'Reshape columns',
    text: 'Column operations change the shape of the table: split one packed column into several, join several into one, or remove columns that are no longer needed. Split and merge run per row. Remove Columns applies to every row.',
    config: [
      {name: 'Source', text: 'The packed column to split, such as bp with 120/80.'},
      {name: 'Delimiter', text: 'The character between the parts.'},
      {name: 'Parts', text: 'Names of the generated columns, in order.'},
      {name: 'Remove Columns', text: 'Columns to drop from every row, such as the source of a split.'},
    ],
    examples: ['Split Column', 'Merge Columns', 'Remove Columns'],
    note: 'To turn values of one column into separate true/false columns, use the pivot table in step 3.',
    scene: ColumnsScene,
  },
  {
    key: 'app',
    label: 'App tool',
    title: 'Transformation apps',
    text: 'Installed transformation apps add processing that is not built in, such as domain-specific coding, enrichment, or cleaning. The app runs in its own container and returns the transformed values.',
    config: [
      {name: 'App', text: 'An installed transformation app. More can be added from the App Store.'},
      {name: 'Input / Output', text: 'Map app inputs to columns, and app outputs to new or existing columns.'},
      {name: 'Hyper-Parameters', text: 'Settings defined by the app.'},
      {name: 'Scope', text: 'The app works per row or per cell, as defined by its developer.'},
    ],
    note: (
      <>
        App steps are skipped in the wizard preview and run during the import. To build one, see the{' '}
        <Link to="/docs/tool-dev/create-tool#transformer-app-rowcell-transform-on-a-dataframe">transformer app guide</Link>.
      </>
    ),
    scene: AppScene,
  },
];

export default function TransformExplainer(): ReactNode {
  return (
    <StepExplainer
      eyebrow="Step 4 · Transformations"
      accent="transform"
      modes={modes}
      footer="Transformations run from top to bottom. Each one receives the output of the previous one, so the order matters."
    />
  );
}
