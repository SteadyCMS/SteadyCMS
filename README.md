# SteadyCMS

SteadyCMS — a flexible, block-based, static site CMS frontend for desktop and web.

## Project structure

- This repository holds the main Vue.js application which can be dropped into either the desktop (or web in the future) projects.
- The Electron-based desktop version can be found [here](https://github.com/SteadyCMS/desktop)

In the future, we plan to have a separate repository that will hold the version that runs on a web server. We're currently focused on the [desktop version](https://github.com/SteadyCMS/desktop).

## Developing the desktop version

### Setting up the first time

1. Clone the source for the desktop version ``git clone https://github.com/SteadyCMS/desktop.git``
2. Move into the render directory with ``cd desktop/src/source/render``
3. Drop in the Vue.js code (this repository) with ``git clone https://github.com/SteadyCMS/SteadyCMS.git``
4. Run ``npm install`` to get the js dependencies for the Vue.js application
5. Move back to to the root folder with ``cd ../../..``
6. Run ``npm install`` to get the js dependencies for the desktop version (Electron, etc).

### Development

..
