import type {CSSProperties, ReactNode} from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import {at} from '../ConnectorSteps/StepExplainer';
import s from '../ConnectorSteps/styles.module.css';
import c from '../CohortSchemaAnimation/styles.module.css';
import d from './styles.module.css';

const color = (value: string) => ({'--c': value}) as CSSProperties;

const topics: [string, string][] = [
  ['Schema', 'var(--ca-map)'],
  ['Cohort', 'var(--ca-load)'],
  ['Connector', 'var(--ca-extract)'],
  ['Create a connector', 'var(--ca-transform)'],
];

const palette = ['var(--ca-map)', 'var(--ca-load)', 'var(--ca-extract)', 'var(--ca-transform)', 'var(--ca-update)'];

/** Numbered agenda chips; `items` overrides the default Client intro topics. */
export function AgendaScene({items}: {items?: string[]}): ReactNode {
  const list: [string, string][] = items ? items.map((x, i) => [x, palette[i % palette.length]]) : topics;
  return (
    <div className={d.agenda}>
      {list.map(([name, col], i) => (
        <span key={name} className={clsx(d.agendaItem, s.pop)} style={{...at(300 + i * 220), ...color(col)}}>
          <span className={d.num}>{i + 1}</span>
          {name}
        </span>
      ))}
    </div>
  );
}

export function ClientScene(): ReactNode {
  const clinics = ['Clinic A', 'Clinic B', 'Clinic C'];
  return (
    <div className={s.stage} style={{minHeight: 0}}>
      <div className={clsx(s.card, s.in)} style={at(100)}>
        <div className={s.cardHead}>
          <span>Platform · shared by everyone</span>
          <span className={s.tag}>online</span>
        </div>
        <div className={s.row} style={{padding: '0.5rem 0.6rem'}}>
          {['Schemas', 'Analysis tools', 'Projects'].map((x, i) => (
            <span key={x} className={clsx(s.chip, s.pop)} style={at(300 + i * 100)}>
              {x}
            </span>
          ))}
        </div>
      </div>
      <div className={s.row} style={{justifyContent: 'center'}}>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(1000)}>
          ↓ question: query, statistics, or training
        </span>
      </div>
      <div className={c.trio}>
        {clinics.map((clinic, i) => (
          <div key={clinic} className={clsx(s.card, s.in)} style={at(600 + i * 150)}>
            <div className={s.cardHead}>
              <span>Client · runs in {clinic}</span>
              <span className={clsx(s.tag, s.tagNew)}>local</span>
            </div>
            <div className={s.row} style={{padding: '0.5rem 0.6rem'}}>
              <span className={s.chip}>🔒 patient data</span>
              <span className={clsx(s.chip, s.pop)} style={at(1500 + i * 200)}>
                access rules
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className={s.row} style={{justifyContent: 'center'}}>
        <span className={clsx(s.chip, s.pop)} style={{...at(2400), borderColor: 'var(--ca-load)'}}>
          <span className={s.ok}>✓</span> ↑ approved results only
        </span>
      </div>
      <div className={clsx(s.caption, s.fade)} style={{...at(2900), textAlign: 'center'}}>
        Patient records never leave the Client.
      </div>
    </div>
  );
}

const journey: [string, string, string, string][] = [
  ['Schema', 'Choose the shared data format', 'Platform', 'var(--ca-map)'],
  ['Cohort', 'Create a local data collection', 'Client', 'var(--ca-load)'],
  ['Connector', 'Describe how to import a file', 'Client', 'var(--ca-extract)'],
  ['Run', 'Import and check the patients', 'Client', 'var(--ca-transform)'],
];

export function JourneyScene(): ReactNode {
  return (
    <>
      <div className={d.journey}>
        {journey.map(([name, text, where, col], i) => (
          <div key={name} className={clsx(d.step, s.in)} style={{...at(200 + i * 450), ...color(col)}}>
            <span className={s.row}>
              <span className={d.num}>{i + 1}</span>
              <span className={clsx(s.tag, s.tagMuted)}>{where}</span>
            </span>
            <span className={d.stepName}>{name}</span>
            <span className={d.stepText}>{text}</span>
          </div>
        ))}
      </div>
      <div className={clsx(s.progress, s.grow)} style={{...at(300, {'--dur': '1.9s'}), marginTop: '0.9rem'}}>
        <span />
      </div>
      <div className={s.row} style={{justifyContent: 'center', marginTop: '0.9rem'}}>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={{...at(2300), fontSize: '0.85rem'}}>
          Cohort ready → queries · statistics · training
        </span>
      </div>
    </>
  );
}

const base = '/docs/client-usage/add-data/connectors/create-connector';

const wizard: [string, string, string][] = [
  ['Select source', 'File import (CSV, Excel, ZIP) or database', '#1-select-the-data-source'],
  ['Configure source', 'Delimiter and headers, or a read-only SQL SELECT', '#2-configure-the-source'],
  ['Review headers', 'Preview columns, rename, merge files on an ID', '#3-review-headers-and-source-data'],
  ['Transform', 'Units, categories, dates (optional)', '#4-add-transformations'],
  ['Map to schema', 'Link columns to fields, check samples', '#5-map-source-fields-to-the-schema'],
  ['Save', 'Save, or Save and Run to import', '#6-save-the-connector'],
];

export function WizardScene(): ReactNode {
  return (
    <div className={d.wizard}>
      {wizard.map(([name, text, anchor], i) => (
        <div key={name} className={clsx(d.wizardRow, s.slideL)} style={at(150 + i * 300)}>
          <span className={d.num}>{i + 1}</span>
          <Link to={base + anchor} target="_blank">
            {name}
          </Link>
          <span className={d.wizardText}>{text}</span>
        </div>
      ))}
    </div>
  );
}

const recap: [string, string, string][] = [
  ['Schema', 'Shared template: fields, meaning, valid values. Lives on the Platform.', 'var(--ca-map)'],
  ['Cohort', 'Holds the patients and access rules. Lives in the Client, based on one schema.', 'var(--ca-load)'],
  ['Connector', 'Saved import recipe: read → convert → link columns to fields.', 'var(--ca-extract)'],
  ['Run', 'Imports and checks. Invalid values are skipped, the rest is kept.', 'var(--ca-transform)'],
];

/** Numbered recap cards; `items` ([title, text] pairs) overrides the Client intro recap. */
export function RecapScene({items}: {items?: [string, string][]}): ReactNode {
  const list: [string, string, string][] = items ? items.map(([a, b], i) => [a, b, palette[i % palette.length]]) : recap;
  return (
    <div className={d.recap}>
      {list.map(([name, text, col], i) => (
        <div key={name} className={clsx(d.step, s.in)} style={{...at(150 + i * 250), ...color(col)}}>
          <span className={d.num}>{i + 1}</span>
          <span>
            <span className={d.stepName}>{name}</span>
            <br />
            <span className={d.stepText}>{text}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
