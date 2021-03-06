const jscad = require('@jscad/modeling')

// scale - scaling of dimensions, X, Y, Z
// smooth - itterations of smoothing to perform (after scaling)
// base - height of base
// heightmap - 1D array of height (Z) values, with a total of width * length values
const createMesh = (options, heightmap) => {
  const defaults = {
    scale: [1, 1, 1],
    smooth: 0,
    base: 0
  }
  const { scale, smooth, base } = Object.assign({}, defaults, options)

  let { data, width, length } = Object.assign({}, heightmap)

  if (data.length !== (width * length)) throw new Error(`wrong dimensions for heightmap (${data.length})`)

  // scale the heightmap if requested
  const zscale = scale[2]
  if (zscale !== 1.0) {
    data = data.map((v) => v * zscale)
  }

  // smooth the heightmap if requested
  if (smooth > 0) {
    for (let s = 0; s < smooth; ++s) {
      for (let y = 0; y < length; ++y) {
        for (let x = 0; x < width; ++x) {
          let z = data[x + y * width]
          let s = 0
          let n = 0
          if (x > 0) { s += (data[(x - 1) + y * width] - z); ++n }
          if (x < (width - 1)) { s += (data[(x + 1) + y * width] - z); ++n }
          if (y > 0) { s += (data[x + (y - 1) * width] - z); ++n }
          if (y < (length - 1)) { s += (data[x + (y + 1) * width] - z); ++n }
          if (n > 0) {
            z = z + (1 / n * s)
            data[x + y * width] = z
          }
        }
      }
    }
  }

  // generate vertices from the heightmap
  const vertices = []
  let min = data[0]
  let max = data[0]
  for (let y0 = 0; y0 < length; ++y0) {
    for (let x0 = 0; x0 < width; ++x0) {
      const x = x0 * scale[0]
      const y = (0 - y0) * scale[1]
      const z = data[x0 + y0 * width] // scaling done above

      min = Math.min(min, z)
      max = Math.max(max, z)

      const vertex = jscad.maths.vec3.fromValues(x, y, z)
      vertices.push(vertex)
    }
  }

  // generate faces from the vertices
  const faces = []
  for (let y1 = 0; y1 < length - 1; ++y1) {
    for (let x1 = 0; x1 < width - 1; ++x1) {
      // calculate the indexes into the vertices, forming four triangles
      const iTL = x1 + y1 * width
      const iTR = (x1 + 1) + y1 * width
      const iBL = x1 + (y1 + 1) * width
      const iBR = (x1 + 1) + (y1 + 1) * width

      const poly1 = jscad.geometries.poly3.fromPoints([vertices[iTL], vertices[iBL], vertices[iTR]])
      const plane1 = jscad.geometries.poly3.plane(poly1)
      const poly2 = jscad.geometries.poly3.fromPoints([vertices[iBL], vertices[iBR], vertices[iTL]])
      const plane2 = jscad.geometries.poly3.plane(poly2)
      const poly3 = jscad.geometries.poly3.fromPoints([vertices[iBR], vertices[iTR], vertices[iBL]])
      const plane3 = jscad.geometries.poly3.plane(poly3)
      const poly4 = jscad.geometries.poly3.fromPoints([vertices[iTR], vertices[iTL], vertices[iBR]])
      const plane4 = jscad.geometries.poly3.plane(poly4)

      // choose the least flat polygons
      const znormal = jscad.maths.vec3.fromValues(0, 0, 1)
      let pi = 1
      let pd = jscad.maths.vec3.squaredDistance(plane1, znormal)
      let d = jscad.maths.vec3.squaredDistance(plane2, znormal)
      if (d > pd) { pi = 2; pd = d }
      d = jscad.maths.vec3.squaredDistance(plane3, znormal)
      if (d > pd) { pi = 3; pd = d }
      d = jscad.maths.vec3.squaredDistance(plane4, znormal)
      if (d > pd) { pi = 4; pd = d }

      // add the polygons to the list of faces
      if (pi === 1) faces.push(poly1, poly3)
      if (pi === 2) faces.push(poly2, poly4)
      if (pi === 3) faces.push(poly3, poly1)
      if (pi === 4) faces.push(poly4, poly2)
    }
  }

  // generate sides and bottom if requested
  if (base > 0) {
    const z = min - base
    for (let y = 0; y < length; ++y) {
      for (let x = 0; x < width; ++x) {
        if (y === 0) {
          if (x > 0) {
            const iv0 = x + y * width
            const iv1 = (x - 1) + y * width
            const v0 = vertices[iv0]
            const v1 = vertices[iv1]
            const v2 = [v1[0], v1[1], z]
            const v3 = [v0[0], v0[1], z]
            faces.push(jscad.geometries.poly3.fromPoints([v3, v2, v1]))
            faces.push(jscad.geometries.poly3.fromPoints([v1, v0, v3]))
          }
        }
        if (y === (length - 1)) {
          if (x > 0) {
            const iv0 = x + y * width
            const iv1 = (x - 1) + y * width
            const v0 = vertices[iv0]
            const v1 = vertices[iv1]
            const v2 = [v1[0], v1[1], z]
            const v3 = [v0[0], v0[1], z]
            faces.push(jscad.geometries.poly3.fromPoints([v0, v1, v2]))
            faces.push(jscad.geometries.poly3.fromPoints([v2, v3, v0]))
          }
        }

        if (x === 0) {
          if (y > 0) {
            const iv0 = x + y * width
            const iv1 = x + (y - 1) * width
            const v0 = vertices[iv0]
            const v1 = vertices[iv1]
            const v2 = [v1[0], v1[1], z]
            const v3 = [v0[0], v0[1], z]
            faces.push(jscad.geometries.poly3.fromPoints([v0, v1, v2]))
            faces.push(jscad.geometries.poly3.fromPoints([v2, v3, v0]))
          }
        }
        if (x === (width - 1)) {
          if (y > 0) {
            const iv0 = x + y * width
            const iv1 = x + (y - 1) * width
            const v0 = vertices[iv0]
            const v1 = vertices[iv1]
            const v2 = [v1[0], v1[1], z]
            const v3 = [v0[0], v0[1], z]
            faces.push(jscad.geometries.poly3.fromPoints([v3, v2, v1]))
            faces.push(jscad.geometries.poly3.fromPoints([v1, v0, v3]))
          }
        }
      }
    }

    // generate bottom
    let v0 = vertices[0 + 0 * width]
    v0 = [v0[0], v0[1], z]
    let v1 = vertices[0 + (length - 1) * width]
    v1 = [v1[0], v1[1], z]
    let v2 = vertices[(width - 1) + 0 * width]
    v2 = [v2[0], v2[1], z]
    let v3 = vertices[(width - 1) + (length - 1) * width]
    v3 = [v3[0], v3[1], z]
    faces.push(jscad.geometries.poly3.fromPoints([v2, v1, v0]))
    faces.push(jscad.geometries.poly3.fromPoints([v1, v2, v3]))
  }
  return faces
}

module.exports = createMesh
