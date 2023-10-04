# shortcuts

Register keyboard shortcuts for using the ClickCritters Click Exchange.
We support two sets of shortcuts:

- `left`/`right` arrow keys for the answers, `up` arrow for back
- `j`/`k` for the answers, `i` for back

We also bind the key `f` to clicking the "Feed" link on the manual leveling page.

## Development

This project uses TypeScript and [Bun](https://bun.sh/).

TypeScript is fantastic. It's everything that I wish the Python ecosystem included. Despite being more comfortable with Python (or perhaps _because_ I am?), I find myself missing the robustness and consistency of TypeScript when I switch over. As I matured this repo, I wanted to add TypeScript because it makes development so much easier—especially when I take a three-year break in between code updates, like I did from 2020 to 2023!

Adding Webpack for a simple browser extension felt like overkill. I also don't really like the config-sprawl created by having separate bundlers, transpilers, and/or minifiers; this feels like far too much tool-induced complexity for a browser extension.

_Bun_ natively supports TypeScript, and its batteries-included approach (and ridiculous speed) appealed to me. Bun felt like the kind of tool that I'd actually enjoy using—one that would make my development faster _and_ simpler, instead of a tool that I am forced to introduce to fill a hole in my project.

### Getting started

Clone the repo and install [Bun](https://bun.sh/).

- Install dependencies: `bun install`
- Run type-checking with `tsc`: `bun run check` (or `bunx tsc`)
- Build for the browser: `bun run build`

You can add the extension to Firefox in debug mode. Chrome probably works, but I didn't test it.

## Changelog

- v1.0 (March 2020): initial release
- v1.1 (April 2020): unclear
- v1.2 (September 2023): support new shortcuts & rearchitect
- v2.0 (upcoming): rebuild with _bun_

_Copyright (c) 2018 Tushar Chandra_
