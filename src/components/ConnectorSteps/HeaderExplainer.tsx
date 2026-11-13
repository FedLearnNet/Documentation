import type {ReactNode} from 'react';
import clsx from 'clsx';
import StepExplainer, {Swap, at, type ExplainerMode} from './StepExplainer';
import s from './styles.module.css';

const idColor: Record<string, string> = {
  'P-001': 'var(--ca-a)',
  'P-002': 'var(--ca-b)',
  'P-003': 'var(--ca-c)',
};

function RenameScene() {
  const headers = [
    ['PatID', 'patient_id'],
    ['Gndr', 'sex'],
    ['wt', 'weight_lbs'],
    ['dx', 'diagnosis'],
  ];
  return (
    <>
      <div className={clsx(s.card, s.in)} style={at(100)}>
        <div className={s.cardHead}>
          <span>patients · preview</span>
          <span>all columns · first rows</span>
        </div>
        <div className={s.tblScroll}>
          <table className={s.tbl}>
            <thead>
              <tr>
                {headers.map(([from, to], i) => (
                  <th key={from} className={clsx(s.flash)} style={at(900 + i * 350)}>
                    <Swap from={from} to={<span style={{color: 'var(--accent)'}}>{to}</span>} delay={900 + i * 350} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['P-001', 'm', '176', 'I10'],
                ['P-002', 'f', '?', 'E11.9'],
                ['P-003', 'F', '141', 'I10'],
              ].map((r, i) => (
                <tr key={r[0]} className={s.fade} style={at(300 + i * 120)}>
                  {r.map((c, j) => (
                    <td key={j}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={s.row}>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(2500)}>
          Names are used in transformations
        </span>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(2650)}>
          …and in the schema mapping
        </span>
      </div>
    </>
  );
}

function IdCell({id}: {id: string}) {
  return (
    <span className={s.rowNowrap} style={{gap: '0.35rem'}}>
      <span className={s.dot} style={at(0, {'--c': idColor[id]})} />
      {id}
    </span>
  );
}

function MergeScene() {
  return (
    <>
      <div className={s.split}>
        <div className={clsx(s.card, s.slideL)} style={at(100)}>
          <div className={s.cardHead}>patients.csv</div>
          <table className={s.tbl}>
            <thead>
              <tr>
                <th className={s.flash} style={at(800)}>
                  PatID{' '}
                  <span className={clsx(s.tag, s.pop)} style={at(800)}>
                    UID
                  </span>
                </th>
                <th>Gender</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['P-001', 'm'],
                ['P-002', 'f'],
                ['P-003', 'F'],
              ].map((r) => (
                <tr key={r[0]}>
                  <td>
                    <IdCell id={r[0]} />
                  </td>
                  <td>{r[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={clsx(s.card, s.slideR)} style={at(250)}>
          <div className={s.cardHead}>labs.csv</div>
          <table className={s.tbl}>
            <thead>
              <tr>
                <th className={s.flash} style={at(1100)}>
                  patient_no{' '}
                  <span className={clsx(s.tag, s.pop)} style={at(1100)}>
                    UID
                  </span>
                </th>
                <th>HbA1c</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['P-002', '6.1'],
                ['P-003', '7.2'],
                ['P-001', '5.4'],
              ].map((r) => (
                <tr key={r[0]}>
                  <td>
                    <IdCell id={r[0]} />
                  </td>
                  <td>{r[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={clsx(s.arrow, s.fade)} style={at(1700)}>
        rows matched on equal identifier values
      </div>
      <div className={clsx(s.card, s.in)} style={at(2000)}>
        <div className={s.cardHead}>
          <span>merged input</span>
          <span>one shared ID column</span>
        </div>
        <table className={s.tbl}>
          <thead>
            <tr>
              <th>patient_id</th>
              <th>Gender</th>
              <th>HbA1c</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['P-001', 'm', '5.4'],
              ['P-002', 'f', '6.1'],
              ['P-003', 'F', '7.2'],
            ].map((r, i) => (
              <tr key={r[0]}>
                <td className={s.fade} style={at(2300 + i * 250)}>
                  <IdCell id={r[0]} />
                </td>
                <td className={s.slideL} style={at(2350 + i * 250)}>
                  {r[1]}
                </td>
                <td className={s.slideR} style={at(2450 + i * 250)}>
                  {r[2]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function PivotScene() {
  const wide = [
    ['P-001', 'diabetes', 'true', 'false'],
    ['P-001', 'asthma', 'false', 'true'],
    ['P-002', 'asthma', 'false', 'true'],
  ];
  return (
    <>
      <div className={clsx(s.card, s.in)} style={at(100)}>
        <div className={s.cardHead}>
          <span>conditions.csv · long format</span>
        </div>
        <table className={s.tbl}>
          <thead>
            <tr>
              <th>patient_id</th>
              <th className={s.flash} style={at(700)}>
                condition{' '}
                <span className={clsx(s.tag, s.pop)} style={at(700)}>
                  field names
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {wide.map((r, i) => (
              <tr key={i}>
                <td>{r[0]}</td>
                <td>{r[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={s.row}>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(1200)}>
          Long to wide (true/false)
        </span>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(1350)}>
          prefix <b className={s.mono}>cond_</b>
        </span>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(1500)}>
          values <b>true / false</b>
        </span>
      </div>
      <div className={clsx(s.card, s.in)} style={at(1900)}>
        <div className={s.cardHead}>
          <span>after pivot · wide format</span>
          <span>rows kept</span>
        </div>
        <div className={s.tblScroll}>
          <table className={s.tbl}>
            <thead>
              <tr>
                <th>patient_id</th>
                <th className={clsx(s.colNew, s.slideR)} style={at(2200)}>
                  cond_diabetes
                </th>
                <th className={clsx(s.colNew, s.slideR)} style={at(2350)}>
                  cond_asthma
                </th>
              </tr>
            </thead>
            <tbody>
              {wide.map((r, i) => (
                <tr key={i}>
                  <td>{r[0]}</td>
                  <td className={clsx(s.colNew, s.pop)} style={at(2600 + i * 180)}>
                    {r[2]}
                  </td>
                  <td className={clsx(s.colNew, s.pop)} style={at(2700 + i * 180)}>
                    {r[3]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

const modes: ExplainerMode[] = [
  {
    key: 'rename',
    label: 'Rename headers',
    title: 'Review and rename columns',
    text: 'The preview shows every detected column and a limited number of rows. Rename unclear source names so that later steps are easy to read.',
    config: [
      {name: 'Column name', text: 'The name used for this column in transformations and in the schema mapping.'},
      {name: 'Preview', text: 'All columns, limited rows. Intended for checking the structure, not the full dataset.'},
    ],
    scene: RenameScene,
  },
  {
    key: 'merge',
    label: 'Merge tables',
    title: 'Merge files or sheets',
    text: 'Several files from a ZIP archive, or several sheets of a workbook, are combined into one connector input. Rows are joined where the identifier columns hold the same value, even when the columns are named differently.',
    config: [
      {name: 'UID column', text: 'One identifier column per file or sheet. It must represent the same entity in all of them.'},
      {name: 'Result', text: 'One table with a single shared ID column and the columns of every table.'},
    ],
    note: 'Merging is required before columns from separate files or sheets can be transformed and mapped together.',
    scene: MergeScene,
  },
  {
    key: 'pivot',
    label: 'Pivot table',
    title: 'Pivot a table',
    text: 'Pivoting reshapes a table before it is merged. Long to wide turns each value of a column into its own true/false column. Every source row is kept.',
    config: [
      {name: 'Column containing field names', text: 'Its values become the new column names.'},
      {name: 'Pivot mode', text: 'Long to wide (true/false), or Transpose rows and columns for key/value tables.'},
      {name: 'Generated column prefix', text: 'Prefix for the new columns, such as cond_.'},
      {name: 'Generated values', text: 'true / false, yes / no, or 1 / 0.'},
    ],
    scene: PivotScene,
  },
];

export default function HeaderExplainer(): ReactNode {
  return <StepExplainer eyebrow="Step 3 · Specify headers" accent="extract" modes={modes} />;
}
