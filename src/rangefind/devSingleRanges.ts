import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Dev server only: webpack-dev-middleware can't serve multi-range requests and answers them with
// the whole file. Rejecting them up front makes Rangefind fall back to single-range requests.
if (ExecutionEnvironment.canUseDOM) {
    const fetchWithRanges = window.fetch.bind(window);
    window.fetch = (input, init) => {
        const range = new Headers(init?.headers).get('range');
        if (range?.includes(',')) {
            return Promise.resolve(new Response(null, {status: 416}));
        }
        return fetchWithRanges(input, init);
    };
}
