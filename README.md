# Les Cahiers du Studio

A time-based documentation tool to collaboratively keep notes and capture media from live experiences.

![dmk4q_fxkae_i70](https://user-images.githubusercontent.com/1948417/32667094-f8f3b43e-c639-11e7-98e2-22de0502fa96.png)

The documentation for this app can be found [here (in french)](https://latelier-des-chercheurs.fr/docs/manuel-les-cahiers-du-studio).

# License

This app is under a [Creative Commons BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/) license. It can be used, modified and shared freely as long as no commercial use is made and the attribution and link to [L’Atelier des Chercheurs](https://latelier-des-chercheurs.fr/) are kept.

The typeface embedded in this tool, *STVitry*, was created specifically for the Studio-Théâtre of Vitry. Its use is expressly restricted to this tool, and it cannot be used anywhere else without prior authorisation by the Studio-Théâtre or Maxime Fittes, the creator of this font.

# Credits and origin

This tool was made for and in collaboration with the [Studio-Théâtre of Vitry](http://www.studiotheatre.fr/), a place for theatrical creation and research that welcomes and hosts theatre companies. It is installed on a computer inside the Studio-Théâtre and allows companies to keep track of their time and process inside the walls of the Studio-Théâtre. Studio-Théâtre of Vitry is supported by la ville de Vitry-sur-Seine, le Département du Val-de-Marne, la Région île-de-France et la DRAC île-de-France.

The creation, design and code for this app was done by [L’Atelier des Chercheurs](https://latelier-des-chercheurs.fr/) following a series of workshops and field studies at the Studio-Théâtre, and meetings with persons in charge there (specifically Bérangère Vantusso, Florence Kremper and Ella Gouet).

Furthermore, it was developed with the precious help from the following persons:

- Vincent Desclaux (who participated in the creation of the user interface)

- Maxime Fittes (who created the typeface *STVitry*)

- Nolwenn Maudet, Benoît Verjat, Émilie Coquard, Nicolas Taffin, Julien Taquet, Thibéry Maillard, Anthony Masure, Mike Sabbagh, and others who gave feedbacks and helped refine the concept and use cases of this app.

Finally, we should mention that this app wouldn’t be the same if it weren’t for two other, older free and open-source apps: [Rekall](http://www.rekall.fr/) and [Ligne de Temps](http://www.iri.centrepompidou.fr/outils/lignes-de-temps/). Both had very interesting ideas and use cases that we drew inspiration from to make Les Cahiers du Studio.

# Install Les Cahiers du Studio

### Method 1 — the easy way

Download the latest release from the [release page](https://github.com/l-atelier-des-chercheurs/Les-Cahiers-du-Studio/releases).

### Method 2 — the long way

_You need [node.js](https://nodejs.org/) and [python 2.7](https://www.python.org/) to install this app with this method. On Windows, you also need to install Microsoft’s Windows Build Tools by following the instructions [here](https://github.com/Microsoft/nodejs-guidelines/blob/master/windows-environment.md#prerequisites)._

#### 1. Download this repository

Click on *Clone or Download* in the top right corner of this page, then *Download ZIP*. Unpack this folder.

#### 2. Open a terminal window

Open a terminal window:

- Windows: (XP) use [this tutorial](http://wikistrea.fr/Comment_ouvrir_la_console_de_commande_Windows_en_mode_administrateur_%3F) to open a terminal on Windows or open Command Prompt in the start menu 
- macOS: go to Applications -> Utilities -> Terminal
- Linux: use a terminal app such as Terminal or Konsole

In your terminal, navigate to the Les-Cahiers-du-Studio-master folder with your terminal using the `cd` command:
```
cd path/to/Les-Cahiers-du-Studio-master
```

#### 3. Install dependencies

If you haven’t already, install the tool that will enable native modules to be used. To do this, follow the instructions here: https://github.com/nodejs/node-gyp

Then, install DoDoc’s dependencies (may take up to 5 minutes):
```
npm install
```  

Make sure to build native dependencies by running:

```
npm run rebuild
```
 
#### 4. Run Les Cahiers du Studio

Start from the folder in a terminal window with the following command:

```
npm start
```

#### Troubleshooting

**Module version mismatch**

If you get the *Module version mismatch. Expected 50, got XX.* error, they are most probably due to native packages (looking at you sharp). 

Here are a few things you can try:

1. Follow the instructions [here](https://github.com/electron/electron/blob/master/docs/tutorial/using-native-node-modules.md), and specifically:

```
# Electron's version.
export npm_config_target=1.7.9
# The architecture of Electron, can be ia32 or x64.
export npm_config_arch=x64
export npm_config_target_arch=x64
# Download headers for Electron.
export npm_config_disturl=https://atom.io/download/electron
# Tell node-pre-gyp that we are building for Electron.
export npm_config_runtime=electron
# Tell node-pre-gyp to build module from source code.
export npm_config_build_from_source=true
# Install all dependencies, and store cache to ~/.electron-gyp.
HOME=~/.electron-gyp npm install
```

2. Sometimes, Electron is not installed when running `npm install` on the repo. It may help to run `npm install electron@1.7.9` just to be sure it is actually installed locally.

3. Also, *it is necessary to run the same node version locally as the one used in electron* so that installed native packages are compiled with the same version. Since electron 1.7.9 uses Node 7.9.0, this is the version you should use. Obviously, changing Node version all the time is annoying, but great tools such as [nvm](https://github.com/creationix/nvm) make it much simpler.

4. electron-builder (which builds electron to an app) embeds a script that rebuilds dependencies according to electron. To use it, write: 

```
./node_modules/.bin/electron-builder install-app-deps
``` 

**sharp on ubuntu**

It seems the dependency sharp cannot be built easily on Ubuntu. Install an older version to fix this:

```
npm install sharp@0.17.3
```

# Tweak, fork and debug

### server-side

* Run `npm run debug` to start the server with a better debug in terminal

### client-side

To tweak and write some new SASS or client-side JS, you need to run the gulp task:

* `gulp watch`