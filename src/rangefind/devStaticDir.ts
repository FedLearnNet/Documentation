import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';

// docusaurus-plugin-rangefind only emits the search component and index in postBuild,
// so `docusaurus start` serves neither. This mirrors both into a static directory for dev:
// the component from node_modules, the index from the last `npm run build`.
export default function prepareRangefindDevStaticDir(siteDir: string): string {
    const require = createRequire(import.meta.url);
    const devDir = path.join(siteDir, '.rangefind-dev');
    const assetsDir = path.join(devDir, '_rangefind');
    fs.mkdirSync(assetsDir, {recursive: true});
    fs.copyFileSync(require.resolve('rangefind/element'), path.join(assetsDir, 'rangefind-search.js'));
    fs.copyFileSync(require.resolve('rangefind/element.css'), path.join(assetsDir, 'rangefind-search.css'));

    const indexLink = path.join(devDir, 'rangefind');
    fs.rmSync(indexLink, {recursive: true, force: true});
    fs.symlinkSync(path.join('..', 'build', 'rangefind'), indexLink);
    if (!fs.existsSync(path.join(siteDir, 'build', 'rangefind', 'manifest.json'))) {
        console.warn('[rangefind] No search index in build/rangefind; run `npm run build` once to search in dev.');
    }
    return devDir;
}
