const fs = require('fs')

const heightmap = require('./heightmap')

const extrudeSurface = require('./extrudeSurface')

// there are many ways to obtain image data, this example uses 'image-decode'
const decode = require('image-decode')

/*
 * This is an example project for creating 3D surfaces from image data (files).
 *
 * Setup:
 * - copy this directory (all contents) to JSCAD CLI directory
 *      cli/cli.js
 *      cli/example/*
 * - copy the contents of the src directory into the example directory
 *      src/* ==> cli/example/*
 * - install the image decoding module
 *     npm install image-decode
 * - create the surface (and convert to STL)
 *     node ./cli.js example
 *
 * NOTE: run 'node ./cli.js' for output options
 */
const main = () => {
  // read the image data from a file
  const imageData = decode(fs.readFileSync('example/MandM.jpg'))
  console.log('imageData:', imageData.width, imageData.height)

  // convert the image data into a heightmap
  const myheightmap = heightmap.fromImageData(imageData)

  // convert the heightmap into a 3D surface
  const mysurface = extrudeSurface({ scale: [1, 1, -20], smooth: 2, base: 25.0 }, myheightmap)

  return mysurface
}

module.exports = { main }
