# Contributing
1. Fork and branch: `git checkout -b feat/my-tool`
2. `npm install && npm run dev`
3. **Add a tool** = add one object to `src/tools/registry.js` (`slug`, `name`, `category`, `description`, `example`, `run`). `run` is a pure function (sync or async) that returns a string or throws an `Error` with a helpful message.
4. Add a test in `tests/tools.test.js` (valid input, invalid input, edge case).
5. `npm test && npm run build` must pass, then open a Pull Request.

Rules: no fake/placeholder tools, no new heavy dependencies without discussion, keep everything local-first, be kind (Contributor Covenant v2.1 applies).

## Commands
| Command | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm test` | Unit + simulated-browser tests |
| `npm run build && npm run serve` | Production build served like a real host (real 404s) |
| `cd audit && npm i && npm run audit` / `npm run lighthouse` | Real-browser audit / Lighthouse |
| `npm run docs:tools` | Regenerate `docs/TOOLS.md` |

## Tool design rules
1. **Pure and local:** `run(input)` takes a string and returns a string (sync or async). No network unless unavoidable and disclosed with a `note`.
2. **Honest errors:** throw `new Error('helpful message')` for bad input — never return partial or fake results.
3. **Safe by default:** never `eval`, never inject user input as HTML.
4. **Mark volatile tools:** if the example output changes (random, time, network), add the slug to `VOLATILE` in `src/tools/registry.js`.
5. **Be accessible:** everything must work with a keyboard and at 320 px width.

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
