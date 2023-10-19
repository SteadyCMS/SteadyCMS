# SteadyCMS

SteadyCMS — a flexible, block-based, static site CMS frontend for desktop and web.

Status: **Highly work in progress. Not yet ready for use.**


## Roadmap

For now the desktop application is our primary focus, then the web version. 

The immediate goal is to create a simple frontend for creating a site and editing posts in a block-based editor.


## Project structure

- This repository holds the main Vue.js application which can be dropped into either the desktop (or web in the future) projects.
- The Electron-based desktop version can be found [here](https://github.com/SteadyCMS/desktop)

In the future, we plan to have a separate repository that will hold the version that runs on a web server. We're currently focused on the [desktop version](https://github.com/SteadyCMS/desktop).

## Developing the desktop version

### Setting up the first time

1. Clone the source for the desktop version ``git clone https://github.com/SteadyCMS/desktop.git``
2. Move into the render directory with ``cd desktop/src/renderer``
3. Drop in the Vue.js code (this repository) with ``git clone https://github.com/SteadyCMS/SteadyCMS.git .``
4. Run ``npm install`` to get the js dependencies for the Vue.js application
5. Run ``npx tailwindcss -i ./assets/source.css -o ./assets/main.css`` to rebuild the css
6. Move back to to the root folder with ``cd ../..``
7. Run ``npm install`` to get the js dependencies for the desktop version (Electron, etc).
8. Run ``npm run dev`` to build.

### Development

#### Rebuilding tailwindcss

```bash
cd src/renderer
```

```bash
npx tailwindcss -i ./assets/source.css -o ./assets/main.css --watch
```

## License

Copyright 2023 SteadyCMS authors. GPL-3.0 license, see [LICENSE](/LICENSE) for details.
