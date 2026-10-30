import {useEffect, useRef, useState, type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useHistory, useLocation} from '@docusaurus/router';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import type {SearchEngine, SearchResponse, SearchResult} from 'rangefind/browser';

import styles from './search.module.css';

const PAGE_SIZE = 20;
const SNIPPET_FIELDS = ['excerpt', 'body', 'headings', 'description'];
const SNIPPET_LENGTH = 280;

type Highlight = {
  text: string;
  ranges?: [number, number][];
};

function getHighlight(result: SearchResult, field: string): Highlight | null {
  const highlights = result.highlights as Record<string, Highlight> | undefined;
  const hit = highlights?.[field];
  return hit && typeof hit.text === 'string' && hit.text ? hit : null;
}

function Highlighted({highlight}: {highlight: Highlight}): ReactNode {
  const {text, ranges = []} = highlight;
  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const [rangeStart, end] of [...ranges].sort((a, b) => a[0] - b[0])) {
    const start = Math.max(rangeStart, cursor);
    if (end <= start) continue;
    if (start > cursor) parts.push(text.slice(cursor, start));
    parts.push(<mark key={start}>{text.slice(start, end)}</mark>);
    cursor = end;
  }
  parts.push(text.slice(cursor));
  return <>{parts}</>;
}

function Snippet({result}: {result: SearchResult}): ReactNode {
  for (const field of SNIPPET_FIELDS) {
    const highlight = getHighlight(result, field);
    if (highlight) return <Highlighted highlight={highlight} />;
  }
  const excerpt = typeof result.excerpt === 'string' ? result.excerpt : '';
  return excerpt.length > SNIPPET_LENGTH ? `${excerpt.slice(0, SNIPPET_LENGTH)}…` : excerpt || null;
}

// "/documentation/docs/deployment/deploy-client" -> "docs › deployment › deploy client"
function breadcrumb(url: string, baseUrl: string): string {
  const path = url.startsWith(baseUrl) ? url.slice(baseUrl.length) : url;
  return path
    .split(/[/#]/)
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment).replace(/[-_]/g, ' '))
    .join(' › ');
}

function searchUrl(query: string, page = 1): string {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (page > 1) params.set('page', String(page));
  const search = params.toString();
  return search ? `?${search}` : '';
}

function useSearchEngine(): {engine: SearchEngine | null; failed: boolean} {
  const indexUrl = useBaseUrl('/rangefind/');
  const [engine, setEngine] = useState<SearchEngine | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Loaded on demand so the engine only ships with this page
    import('rangefind/browser')
      .then(({createSearch}) => createSearch({baseUrl: new URL(indexUrl, window.location.href).href}))
      .then((loaded) => !cancelled && setEngine(loaded))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [indexUrl]);

  return {engine, failed};
}

export default function SearchPage(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const location = useLocation();
  const history = useHistory();
  const params = new URLSearchParams(location.search);
  const query = params.get('q')?.trim() ?? '';
  const page = Math.max(1, Number(params.get('page')) || 1);

  const {engine, failed} = useSearchEngine();
  const [input, setInput] = useState(query);
  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [searchFailed, setSearchFailed] = useState(false);
  const writtenQuery = useRef(query);

  // Follow external navigation (back/forward, navbar search) without clobbering typing
  useEffect(() => {
    if (query !== writtenQuery.current) {
      writtenQuery.current = query;
      setInput(query);
    }
  }, [query]);

  useEffect(() => {
    const next = input.trim();
    if (next === writtenQuery.current) return undefined;
    const timer = setTimeout(() => {
      writtenQuery.current = next;
      history.replace({search: searchUrl(next)});
    }, 200);
    return () => clearTimeout(timer);
  }, [input, history]);

  useEffect(() => {
    if (!engine || !query) {
      setResponse(null);
      return undefined;
    }
    let cancelled = false;
    engine
      .search({q: query, page, size: PAGE_SIZE, highlight: true})
      .then((result) => {
        if (cancelled) return;
        setResponse(result);
        setSearchFailed(false);
      })
      .catch(() => !cancelled && setSearchFailed(true));
    return () => {
      cancelled = true;
    };
  }, [engine, query, page]);

  const goToPage = (target: number) => {
    history.push({search: searchUrl(query, target)});
    window.scrollTo({top: 0});
  };

  const results = response?.results ?? [];
  const total = response?.total ?? 0;
  const pageCount = Math.ceil(total / PAGE_SIZE);

  let status: string;
  if (failed || searchFailed) {
    status = 'Search is unavailable.';
  } else if (!engine) {
    status = 'Loading search…';
  } else if (!query) {
    status = `Search all ${engine.manifest.total ?? ''} pages of the documentation.`;
  } else if (!response) {
    status = 'Searching…';
  } else if (!total) {
    status = `No results for “${query}”.`;
  } else {
    status = `${total}${response.approximate ? '+' : ''} result${total === 1 ? '' : 's'} for “${query}”`;
  }

  return (
    <Layout title={query ? `Search: ${query}` : 'Search'} description="Search the documentation">
      <Head>
        {/* Keep this page out of its own index */}
        <html data-rangefind-ignore="" />
      </Head>
      <main className={`container margin-vert--lg ${styles.searchPage}`}>
        <Heading as="h1">Search the documentation</Heading>
        <input
          type="search"
          className={styles.searchInput}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Search…"
          aria-label="Search the documentation"
          autoFocus
        />
        <p className={styles.status} role="status">
          {status}
          {response?.correctedQuery && response.correctedQuery !== query && (
            <> Showing results for “{response.correctedQuery}”.</>
          )}
        </p>

        {query && results.length > 0 && (
          <ol className={styles.results}>
            {results.map((result) => {
              const titleHighlight = getHighlight(result, 'title');
              return (
                <li key={result.id}>
                  <Link to={result.url} className={styles.result}>
                    <span className={styles.breadcrumb}>{breadcrumb(result.url ?? '', siteConfig.baseUrl)}</span>
                    <span className={styles.title}>
                      {titleHighlight ? <Highlighted highlight={titleHighlight} /> : result.title || result.url}
                    </span>
                    <span className={styles.snippet}>
                      <Snippet result={result} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}

        {pageCount > 1 && (
          <nav className={styles.pagination} aria-label="Search result pages">
            <button
              type="button"
              className="button button--secondary"
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}>
              Previous
            </button>
            <span>
              Page {page} of {pageCount}
            </span>
            <button
              type="button"
              className="button button--secondary"
              disabled={page >= pageCount}
              onClick={() => goToPage(page + 1)}>
              Next
            </button>
          </nav>
        )}
      </main>
    </Layout>
  );
}
