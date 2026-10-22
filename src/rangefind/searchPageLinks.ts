import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import siteConfig from '@generated/docusaurus.config';

// Connects the <rangefind-search> dropdowns to the full results page (src/pages/search.tsx):
// a "See all results" footer in the panel, and Enter without a selected option.

function searchPageUrl(query: string): string {
    return `${siteConfig.baseUrl}search?q=${encodeURIComponent(query)}`;
}

if (ExecutionEnvironment.canUseDOM) {
    document.addEventListener('rangefind:search', (event) => {
        const panel = (event.target as HTMLElement).querySelector('.rf-search__panel');
        if (!panel) return;
        const {query, response} = (event as CustomEvent<{query: string; response: {total: number; approximate?: boolean}}>).detail;
        let link = panel.querySelector<HTMLAnchorElement>(':scope > .rf-search__all');
        if (!link) {
            link = document.createElement('a');
            link.className = 'rf-search__all';
            panel.append(link);
        }
        link.href = searchPageUrl(query);
        link.textContent = `See all ${response.total}${response.approximate ? '+' : ''} results`;
        link.hidden = !response.total;
    });

    // Capture phase, so this runs before the element re-runs the dropdown search on Enter
    document.addEventListener('keydown', (event) => {
        const input = event.target as HTMLInputElement;
        if (event.key !== 'Enter' || !input.matches?.('rangefind-search input')) return;
        if (input.hasAttribute('aria-activedescendant')) return;
        const query = input.value.trim();
        if (!query) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location.assign(searchPageUrl(query));
    }, true);
}
