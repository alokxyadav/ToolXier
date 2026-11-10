// One-command publisher. Usage: node scripts/publish.mjs <git-repo-url> [--base production-foundation] [--branch react-platform] [--site https://your-domain.com] [--dry-run]
// Clones your repo, moves the old files into legacy/, adds this project, tests, builds, commits and pushes a NEW branch (nothing is overwritten on your existing branches).
import { spawnSync } from 'node:child_process'
import { mkdtempSync, cpSync, mkdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
const a = process.argv.slice(2), url = a[0], flag = (n, d) => { const i = a.indexOf('--' + n); return i > 0 && a[i + 1] ? a[i + 1] : d }
const base = flag('base', 'production-foundation'), branch = flag('branch', 'react-platform'), site = flag('site', ''), dry = a.includes('--dry-run'), win = process.platform === 'win32'
if (!url || url.startsWith('--')) { console.log('Usage: npm run ship -- <repo-url> [--base production-foundation] [--branch react-platform] [--site https://your-domain.com] [--dry-run]\nExample: npm run ship -- https://github.com/alokxyadav/ToolXier --site https://toolxier.example'); process.exit(1) }
const run = (cmd, args, cwd, env = {}, soft = false) => { const r = spawnSync(cmd, args, { cwd, stdio: 'inherit', shell: win && cmd === 'npm', env: { ...process.env, ...env } }); if (r.status !== 0 && !soft) { console.error(`\n✘ Failed: ${cmd} ${args.join(' ')}`); process.exit(1) } return r.status === 0 }
const out = (cmd, args, cwd) => spawnSync(cmd, args, { cwd, encoding: 'utf8' })
if (out('git', ['--version']).status !== 0) { console.error('✘ Git is not installed. Get it from https://git-scm.com'); process.exit(1) }
const here = join(dirname(fileURLToPath(import.meta.url)), '..'), work = mkdtempSync(join(tmpdir(), 'toolxier-publish-')), repo = join(work, 'repo')
console.log(`\n[1/6] Cloning ${url}`); run('git', ['clone', url, repo], work)
console.log(`[2/6] Creating branch “${branch}”${out('git', ['rev-parse', '--verify', `origin/${base}`], repo).status === 0 ? ` from “${base}”` : ' from the default branch (base not found)'}`)
if (out('git', ['rev-parse', '--verify', `origin/${base}`], repo).status === 0) run('git', ['checkout', '-B', branch, `origin/${base}`], repo); else run('git', ['checkout', '-b', branch], repo)
console.log('[3/6] Moving the existing site into legacy/ (history is kept)')
const keep = new Set(['.github', 'legacy']), tracked = out('git', ['ls-tree', '--name-only', 'HEAD'], repo).stdout.split('\n').filter(Boolean).filter(n => !keep.has(n))
if (tracked.length) { mkdirSync(join(repo, 'legacy'), { recursive: true }); for (const n of tracked) run('git', ['mv', n, `legacy/${n}`], repo) }
console.log('[4/6] Adding ToolXier'); const skip = ['node_modules', 'dist', '.git', '.lighthouseci', 'test-results', 'playwright-report']
cpSync(here, repo, { recursive: true, force: true, filter: s => !s.split(sep).some(p => skip.includes(p)) })
console.log('[5/6] Installing, testing and building (this proves the push is good)'); run('npm', ['ci'], repo, {}, true) || run('npm', ['install'], repo); run('npm', ['test'], repo); run('npm', ['run', 'build'], repo, site ? { SITE_URL: site, VITE_SITE_URL: site } : {})
rmSync(join(repo, 'dist'), { recursive: true, force: true }); run('git', ['add', '-A'], repo)
if (!run('git', ['commit', '-m', 'feat: ToolXier React platform — 100+ tools, dashboard, PWA, SEO, tests'], repo, {}, true)) { console.error('\n✘ Commit failed. If git asks who you are, run:\n  git config --global user.name "Your Name"\n  git config --global user.email "you@example.com"\nthen run this command again.'); process.exit(1) }
if (dry) { console.log(`\n✔ DRY RUN complete. Nothing was pushed. Review the result in:\n  ${repo}`); process.exit(0) }
console.log(`[6/6] Pushing “${branch}”`); run('git', ['push', '-u', 'origin', branch], repo)
const web = url.replace(/\.git$/, ''); console.log(`\n✔ DONE. Next: open a Pull Request → ${web}/pull/new/${branch}\n  (merge it when you are happy; your old site stays safe in legacy/)`)
