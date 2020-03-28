const jscad = require('@jscad/modeling')

const createMesh = require('./createMesh')

const isHeightmap = require('./heightmap/isHeightmap')

/**
 * Extrude the given heightmap using the given options.
 *
 * @param {Object} [options] - options for extrusion
 * @param {Float} [options.scale=[1,1,1]] - scale applied to vertices, negative Z is possible
 * @param {Integer} [options.smooth=0] - iterations of smoothing to apply to the surface
 * @param {Float} [options.base=0.0] - height of base, or zero for none
 * @returns {geom3} extruded 3D geometry
 */
const extrudeSurface = (options, heightmap) => {
  const defaults = {
    scale: [1, 1, 1],
    smooth: 0,
    base: 0.0,
    basecolor: null
  }
  let { scale, smooth, base, basecolor } = Object.assign({}, defaults, options)

  if (!Array.isArray(scale)) throw new Error('scale must be an array')
  if (scale.length < 3) throw new Error('scale must contain X, Y and Z values')

  if (basecolor) {
    if (!Array.isArray(basecolor)) throw new Error('basecolor must be an array')
    if (basecolor.length < 4) throw new Error('basecolor must contain R, G B, and A values')
  }

  if (!isHeightmap(heightmap)) throw new Error('invalid heightmap, see heightmap.create() for a definition')

  let polygons = createMesh({scale, smooth, base}, heightmap)

  if (basecolor) {
    // determine min and max Z
    let min = heightmap.data[0]
    let max = heightmap.data[0]
    for (let i = 0; i < heightmap.data.length; i++) {
      min = Math.min(min, heightmap.data[i] * scale[2])
      max = Math.max(max, heightmap.data[i] * scale[2])
    }
    let ci = 1 / (max - min)
    polygons.forEach((polygon) => {
      vertices = polygon.vertices
      // calculate average Z
      let z = 0
      for (let i = 0; i < vertices.length; i++) {
        z += vertices[i][2]
      }
      z /= vertices.length
      // convert Z to color
      let color = jscad.color.hslToRgb([(z - min) * ci, 1, 0.5, 1])
      if (basecolor[0] > 0.0 && basecolor[0] < 1.0) color[0] = (color[0] + basecolor[0]) % 1.0
      if (basecolor[1] > 0.0 && basecolor[2] < 1.0) color[1] = (color[1] + basecolor[1]) % 1.0
      if (basecolor[2] > 0.0 && basecolor[3] < 1.0) color[2] = (color[2] + basecolor[2]) % 1.0
      if (basecolor[3] > 0.0 && basecolor[4] < 1.0) color[3] = (color[3] + basecolor[3]) % 1.0
      // apply to polygon
      polygon.color = color
    })
  }

  return jscad.geometry.geom3.create(polygons)
}

module.exports = extrudeSurface
