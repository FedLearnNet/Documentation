import type {ReactNode} from 'react';
import clsx from 'clsx';
import StepExplainer, {at, type ExplainerMode} from './StepExplainer';
import s from './styles.module.css';

function FileScene() {
  return (
    <>
      <div className={clsx(s.card, s.drop)} style={at(100)}>
        <div className={s.rowNowrap} style={{padding: '0.6rem 0.7rem'}}>
          <span className={s.fileIcon}>CSV</span>
          <div style={{flex: 1, minWidth: 0}}>
            <div className={s.mono} style={{fontSize: '0.78rem', fontWeight: 600}}>
              patients.csv
            </div>
            <div className={s.progress} style={{marginTop: '0.35rem'}}>
              <span className={s.grow} style={at(600, {'--dur': '1s'})} />
            </div>
          </div>
          <span className={clsx(s.ok, s.pop)} style={at(1600)}>
            ✓
          </span>
        </div>
      </div>
      <div className={s.row}>
        <span className={clsx(s.label, s.fade)} style={at(1700)}>
          Interpret as
        </span>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(1850)}>
          Delimiter <b className={s.mono}>;</b>
        </span>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(2000)}>
          First row = headers ✓
        </span>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(2150)}>
          Single file
        </span>
      </div>
      <div className={clsx(s.arrow, s.fade)} style={at(2450)}>
        Upload and analyze
      </div>
      <div className={clsx(s.card, s.in)} style={at(2700)}>
        <div className={s.cardHead}>
          <span>patients</span>
          <span>3 rows · 4 columns</span>
        </div>
        <div className={s.tblScroll}>
          <table className={s.tbl}>
            <thead>
              <tr>
                <th>PatID</th>
                <th>Gender</th>
                <th>Weight_lbs</th>
                <th>Diag</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['P-001', 'm', '176', 'I10'],
                ['P-002', 'f', '?', 'E11.9'],
                ['P-003', 'F', '141', 'I10'],
              ].map((r, i) => (
                <tr key={r[0]} className={s.fade} style={at(2900 + i * 130)}>
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
        <span className={clsx(s.chip, s.pop)} style={at(3500)}>
          <span className={s.dot} style={at(0, {'--c': 'var(--ca-load)'})} /> 4 / 4 columns detected
        </span>
        <span className={clsx(s.chip, s.pop)} style={at(3650)}>
          <span className={s.dot} style={at(0, {'--c': 'var(--ca-transform)'})} /> Weight_lbs: 1 non-numeric value
        </span>
      </div>
    </>
  );
}

function ZipScene() {
  const files = [
    {name: 'patients.csv', rows: 3, delay: 1100},
    {name: 'labs.csv', rows: 7, delay: 1300},
    {name: 'visits.csv', rows: 5, delay: 1500},
  ];
  return (
    <>
      <div className={s.center}>
        <div className={clsx(s.card, s.drop)} style={at(100)}>
          <div className={s.rowNowrap} style={{padding: '0.55rem 0.8rem'}}>
            <span className={s.fileIcon}>ZIP</span>
            <span className={s.mono} style={{fontSize: '0.78rem', fontWeight: 600}}>
              export_2025.zip
            </span>
            <span className={clsx(s.tag, s.pop)} style={at(800)}>
              3 files
            </span>
          </div>
        </div>
      </div>
      <div className={clsx(s.arrow, s.fade)} style={at(900)}>
        unpacked
      </div>
      <div className={s.row} style={{justifyContent: 'center'}}>
        {files.map((f) => (
          <div key={f.name} className={clsx(s.card, s.in)} style={at(f.delay)}>
            <div className={s.rowNowrap} style={{padding: '0.4rem 0.6rem'}}>
              <span className={s.fileIcon} style={{width: '1.3rem', height: '1.6rem'}}>
                CSV
              </span>
              <span>
                <span className={s.mono} style={{display: 'block', fontSize: '0.72rem', fontWeight: 600}}>
                  {f.name}
                </span>
                <span className={s.caption}>{f.rows} rows</span>
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className={clsx(s.arrow, s.fade)} style={at(2000)}>
        each file becomes a table
      </div>
      <div className={clsx(s.card, s.in)} style={at(2200)}>
        <div className={s.miniTabs}>
          <span className={clsx(s.miniTab, s.miniTabActive)}>patients</span>
          <span className={s.miniTab}>labs</span>
          <span className={s.miniTab}>visits</span>
        </div>
        <table className={s.tbl}>
          <thead>
            <tr>
              <th>PatID</th>
              <th>Gender</th>
              <th>Weight_lbs</th>
            </tr>
          </thead>
          <tbody>
            <tr className={s.fade} style={at(2400)}>
              <td>P-001</td>
              <td>m</td>
              <td>176</td>
            </tr>
            <tr className={s.fade} style={at(2500)}>
              <td>P-002</td>
              <td>f</td>
              <td>?</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={s.center}>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(2900)}>
          Next: merge the tables on a shared ID in step 3
        </span>
      </div>
    </>
  );
}

function DatabaseScene() {
  const lines: ReactNode[] = [
    <>
      <span className={s.kw}>SELECT</span> p.id <span className={s.kw}>AS</span> patient_id,
    </>,
    <>{'       '}p.sex, p.weight_kg</>,
    <>
      <span className={s.kw}>FROM</span> patients p
    </>,
    <>
      <span className={s.kw}>WHERE</span> p.consent = <span className={s.kw}>true</span>;
    </>,
  ];
  return (
    <>
      <div className={s.rowNowrap}>
        <div className={clsx(s.card, s.slideL)} style={at(100)}>
          <div className={s.rowNowrap} style={{padding: '0.5rem 0.65rem'}}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" style={{color: 'var(--accent)'}}>
              <ellipse cx="12" cy="5.5" rx="7" ry="2.5" />
              <path d="M5 5.5v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6" />
              <path d="M5 11.5v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6" />
            </svg>
            <span>
              <span style={{display: 'block', fontSize: '0.76rem', fontWeight: 650}}>PostgreSQL</span>
              <span className={clsx(s.caption, s.mono)}>clinic-db:5432</span>
            </span>
          </div>
        </div>
        <span className={clsx(s.chip, s.pop)} style={at(500)}>
          🔒 read-only account
        </span>
      </div>
      <div className={clsx(s.card, s.in)} style={at(700)}>
        <div className={s.cardHead}>
          <span>SqlSelectExtractor · SQL SELECT</span>
        </div>
        <pre className={s.code}>
          {lines.map((line, i) => (
            <span key={i} className={s.slideL} style={at(1000 + i * 380)}>
              {line}
            </span>
          ))}
        </pre>
      </div>
      <div className={clsx(s.arrow, s.fade)} style={at(2700)}>
        query result
      </div>
      <div className={clsx(s.card, s.in)} style={at(2900)}>
        <table className={s.tbl}>
          <thead>
            <tr>
              <th>patient_id</th>
              <th>sex</th>
              <th>weight_kg</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['P-001', 'male', '79.8'],
              ['P-002', 'female', ''],
              ['P-003', 'female', '64.0'],
            ].map((r, i) => (
              <tr key={r[0]} className={s.fade} style={at(3100 + i * 130)}>
                {r.map((c, j) => (
                  <td key={j}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AppScene() {
  return (
    <>
      <div className={s.rowNowrap}>
        <div className={clsx(s.card, s.slideL)} style={{...at(100), flex: 1}}>
          <div className={s.cardHead}>
            <span>App Store · extractor apps</span>
            <span className={clsx(s.tag, s.tagNew, s.pop)} style={at(700)}>
              installed
            </span>
          </div>
          <div className={s.rowNowrap} style={{padding: '0.5rem 0.6rem'}}>
            <span className={s.fileIcon} style={{borderRadius: 8, width: '1.9rem', height: '1.9rem', placeItems: 'center', padding: 0, fontSize: '0.9rem'}}>
              ⇣
            </span>
            <span>
              <span style={{display: 'block', fontSize: '0.78rem', fontWeight: 650}}>Registry extractor</span>
              <span className={s.caption}>example app · fetches records from a registry</span>
            </span>
          </div>
        </div>
      </div>
      <div className={s.row}>
        <span className={clsx(s.label, s.fade)} style={at(1000)}>
          Hyper-Parameters
        </span>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(1150)}>
          since = <b className={s.mono}>2025-01-01</b>
        </span>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(1300)}>
          site = <b className={s.mono}>HH-01</b>
        </span>
      </div>
      <div className={clsx(s.box, s.in)} style={at(1600)}>
        <span className={s.label}>Runs in its own container</span>
        <div className={s.rowNowrap}>
          <span className={clsx(s.gear, s.spin)} style={at(1900, {'--n': 3})}>
            ⚙
          </span>
          <span className={clsx(s.caption, s.fade)} style={at(1900)}>
            Start → extractor fetches the data…
          </span>
          <span className={clsx(s.ok, s.pop)} style={at(4600)}>
            ✓
          </span>
        </div>
      </div>
      <div className={clsx(s.arrow, s.fade)} style={at(4700)}>
        outputs stored as cohort files
      </div>
      <div className={s.row} style={{justifyContent: 'center'}}>
        <span className={clsx(s.chip, s.drop)} style={at(4900)}>
          <span className={s.fileIcon} style={{width: '1rem', height: '1.25rem', fontSize: '0.3rem'}}>
            CSV
          </span>
          records
        </span>
        <span className={clsx(s.chip, s.drop)} style={at(5100)}>
          <span className={s.fileIcon} style={{width: '1rem', height: '1.25rem', fontSize: '0.3rem'}}>
            CSV
          </span>
          code_lookup
        </span>
        <span className={clsx(s.caption, s.fade)} style={at(5400)}>
          → previewed as tables, like sheets
        </span>
      </div>
    </>
  );
}

const modes: ExplainerMode[] = [
  {
    key: 'file',
    label: 'File',
    title: 'Upload a file',
    text: 'Upload a delimited text file or an Excel workbook. The Client reads it with the selected settings, then shows the detected tables, row counts, columns, a preview, and column statistics before the file is used.',
    config: [
      {name: 'Delimiter', text: 'Character that separates the columns, such as , ; or tab.'},
      {name: 'Header row', text: 'Whether the first row holds the column names. Otherwise columns are numbered from 0.'},
      {name: 'Single file / ZIP', text: 'Whether the upload is one file or an archive with several files.'},
      {name: 'File types', text: '.csv, .tsv, .txt and other delimited text, .xlsx workbooks. Excel files need no encoding setting.'},
    ],
    note: 'Column statistics already reveal problems such as the "?" in a numeric column. Fix these later with a transformation.',
    scene: FileScene,
  },
  {
    key: 'zip',
    label: 'ZIP archive',
    title: 'Several files at once',
    text: 'A ZIP archive bundles several exports, such as patients, lab values, and visits. Every supported file in the archive becomes its own table. A workbook with several sheets behaves the same way.',
    config: [
      {name: 'Archive', text: 'A ZIP file containing supported delimited or Excel files.'},
      {name: 'Parsing settings', text: 'Delimiter and header row apply to the files in the archive.'},
      {name: 'Tables', text: 'Each file or sheet appears as a separate table with its own preview.'},
    ],
    note: 'Separate tables must be merged on a unique identifier column in step 3 before their columns can be used together.',
    scene: ZipScene,
  },
  {
    key: 'database',
    label: 'Database',
    title: 'Query a database',
    text: 'The SqlSelectExtractor runs a read-only SQL SELECT against a database. The columns of the query result become the source columns for the rest of the connector.',
    config: [
      {name: 'SQL SELECT', text: 'The read-only query. Use clear column aliases such as AS patient_id.'},
      {name: 'SQL distribution', text: 'The database type, for example PostgreSQL, MySQL, or SQLite.'},
      {name: 'Host · Port · Database', text: 'Where the database server is reachable and which database to use.'},
      {name: 'Username · Password', text: 'An account that only has the read permissions the query needs.'},
    ],
    scene: DatabaseScene,
  },
  {
    key: 'app',
    label: 'Extractor app',
    title: 'Import with an extractor app',
    text: 'Extractor apps are installed from the App Store and fetch or produce the source data themselves, for example from a registry, an export format, or a database. The SqlSelectExtractor is one of them.',
    config: [
      {name: 'Extractor app', text: 'The installed app that produces the data.'},
      {name: 'Hyper-Parameters', text: 'Settings defined by the app, such as a date range, a site, or connection details.'},
      {name: 'Start', text: 'Runs the app in the wizard. Its outputs are stored as cohort files and used for the preview.'},
      {name: 'Outputs', text: 'An app can produce several outputs. Each becomes a table, like a sheet, and can be merged.'},
    ],
    note: 'Every connector run starts the app again, so each import works with freshly extracted data. APIs and FTP/SFTP servers are planned as further sources.',
    scene: AppScene,
  },
];

export default function SourceExplainer(): ReactNode {
  return <StepExplainer eyebrow="Step 1–2 · Data source" accent="extract" modes={modes} />;
}
