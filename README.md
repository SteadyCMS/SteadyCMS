# SteadyCMS

[![SteadyCMS](/.readme/steadycms-banner.png)](https://steadycms.github.io)

SteadyCMS — a flexible, block-based, static site CMS frontend for desktop.

Currently, only [Hugo](https://gohugo.io) is supported but the long-term goal is to be flexible for use with any static site generator out there.

Not yet ready for production use, but we're nearing alpha state. **We're looking for early testers, adopters, and contributors to help make SteadyCMS the best it can be.**


## Roadmap

For now the Vue.js app wrapped in Electron.js for a desktop application is our primary focus, then in the future, a web version. 

- [x] Initial dashboard
- [x] Create, edit, and preview post
- [ ] **WIP** Basic block editor for editing posts (Paragraph, Heading, List, Image, Quote blocks)
- [x] Post featured image
- [ ] **WIP** Onboarding flow for creating a new website
- [ ] **WIP** Media library for managing static files
- [ ] **WIP** Publish post
- [ ] **WIP** Website settings


## Contributing

We welcome pull requests and feedback!


## Project structure

- This repository holds the main Vue.js application which can be dropped into either the desktop (or web in the future) projects.
- The Electron-based desktop version can be found [here](https://github.com/SteadyCMS/desktop)


## Developing the desktop version

### Setting up the first time

1. Clone the source for the desktop version ``git clone https://github.com/SteadyCMS/desktop.git``
2. Move into the render directory with ``cd desktop/src/renderer``
3. Drop in the Vue.js code (this repository) with ``git clone https://github.com/SteadyCMS/SteadyCMS.git .``
4. Run ``npm install`` to get the js dependencies for the SteadyCMS Vue.js application.
5. Run ``npm run cssdev`` to rebuild the css during development.
6. Move back to to the root folder with ``cd ../..``
7. Run ``npm install`` to get the js dependencies for the desktop version (Electron, etc).
8. Run ``npm run dev`` for development.

### Development

```bash
npm run dev
```

#### Rebuilding tailwindcss

```bash
cd src/renderer
```

```bash
npm run dev
```

## The SteadyCMS core team

The current team members and their primary responsibilities:

[Noah R (@Correct-Syntax)](https://github.com/Correct-Syntax) Visual design, Frontend development, and styling.

[@sundrycode](https://github.com/sundrycode) Vue.js, Electron, and Javascript logic/functionality.


## License

Copyright 2023-2025, the SteadyCMS team. Licensed under the GPL-3.0 license. See [LICENSE](/LICENSE) for details.
