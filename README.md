## jscad-surface

## Create Surfaces using JSCAD

> This project contains a set of functions that produce 3D surfaces from height maps.

## Overview

The JSCAD project does not provide the ability to create sufaces / contours.
Therefore, a special set of functionality has been created to suppliment JSCAD, and produce 3D geometries from height map data.

This little project contains the definition of a height map, which is basically a 1D array of height (Z) values.
The Z values are used to form the surface of the 3D geometry. See src/heightmap/

Any viable heightmap data can be provided to the extrudeSurface() function, which creates a surface.
Additional options provide smoothing of Z values (in-place), etc. See src/extrudeSurface.js


```
  // convert the heightmap into a 3D surface
  let mysurface = extrudeSurface({scale: [1,1,-20], smooth: 2, base: 25.0}, myheightmap)
```

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Special Note](#special-note)
- [License](#license)

## Installation

For Node.js based projects, this package can be installed using NPM.
```
npm install jscad-surface
```

For standalone projects, this package can be downloaded and included as a component.
- Download the package from GitHub
- Unzip the contents, which will produce a directory called 'jscad-surface'
- Copy the 'jscad-surface' directory into the larger project

## Usage

There's an example project provided, which must be used with JSCAD CLI V2.
This example reads a small image file, which is converted into a heightmap, then extruded into a surface.
See the contents of the example directory, and read main.js for instructions.

![Screenshot](./example/example01.png)

## Special Note

**THIS PROJECT ONLY WORKS WITH JSCAD V2.**

As of today, the JSCAD V2 libraries / applications are only available via [GITHUB](https://github.com/jscad/OpenJSCAD.org)

See the user guide on [Early Adoption of V2](https://openjscad.org/dokuwiki/doku.php?id=early_v2) for some tips.

## License

[The MIT License (MIT)](./LICENSE)

