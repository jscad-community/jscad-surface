const test = require('ava')

const { createMesh, heightmap } = require('../src/index')

test('createMesh (defaults)', t => {
  const data = [
    0.5, 0.4, 0.3, 0.2, 0.1, 0.0,
    0.6, 0.5, 0.4, 0.3, 0.2, 0.1,
    0.7, 0.6, 0.5, 0.4, 0.3, 0.2,
    0.8, 0.7, 0.6, 0.5, 0.4, 0.3,
    0.9, 0.8, 0.7, 0.6, 0.5, 0.4,
    1.0, 0.9, 0.8, 0.7, 0.6, 0.5
  ]
  const map = heightmap.create(data, 6, 6)
  const mesh = createMesh({}, map)

  t.is(mesh.length, 50) // 5 x 5 x 2 triangles
  t.deepEqual(mesh[0].vertices, [[0, 0, 0.5], [0, -1, 0.6], [1, 0, 0.4]])
})

test('createMesh (scale)', t => {
  const data = [
    0.5, 0.4, 0.3, 0.2, 0.1, 0.0,
    0.6, 0.5, 0.4, 0.3, 0.2, 0.1,
    0.7, 0.6, 0.5, 0.4, 0.3, 0.2,
    0.8, 0.7, 0.6, 0.5, 0.4, 0.3,
    0.9, 0.8, 0.7, 0.6, 0.5, 0.4,
    1.0, 0.9, 0.8, 0.7, 0.6, 0.5
  ]
  const map = heightmap.create(data, 6, 6)
  const mesh = createMesh({ scale: [5, 5, 10] }, map)

  t.is(mesh.length, 50) // 5 x 5 x 2 triangles
  t.deepEqual(mesh[0].vertices, [[0, 0, 5], [0, -5, 6], [5, 0, 4]])
})

test('createMesh (peaks)', t => {
  const data = [
    1.0, 0.5, 0.0, 0.0, 0.5, 1.0,
    0.5, 0.0, 0.5, 0.5, 0.0, 0.5,
    0.0, 1.0, 2.0, 2.0, 1.0, 0.0,
    0.0, 1.0, 2.0, 2.0, 1.0, 0.0,
    0.5, 0.0, 0.5, 0.5, 0.0, 0.5,
    1.0, 0.5, 0.0, 0.0, 0.5, 1.0
  ]
  const map = heightmap.create(data, 6, 6)
  const mesh = createMesh({ scale: [5, 5, 10] }, map)

  t.is(mesh.length, 50) // 5 x 5 x 2 triangles
  t.deepEqual(mesh[0].vertices, [[0, 0, 10], [0, -5, 5], [5, 0, 5]])
  t.deepEqual(mesh[49].vertices, [[25, -25, 10], [25, -20, 5], [20, -25, 5]])
})

test('createMesh (smooth)', t => {
  const data = [
    1.0, 0.5, 0.0, 0.0, 0.5, 1.0,
    0.5, 0.0, 0.5, 0.5, 0.0, 0.5,
    0.0, 1.0, 2.0, 2.0, 1.0, 0.0,
    0.0, 1.0, 2.0, 2.0, 1.0, 0.0,
    0.5, 0.0, 0.5, 0.5, 0.0, 0.5,
    1.0, 0.5, 0.0, 0.0, 0.5, 1.0
  ]
  const map = heightmap.create(data, 6, 6)
  const mesh = createMesh({ scale: [5, 5, 10], smooth: 2 }, map)

  t.is(mesh.length, 50) // 5 x 5 x 2 triangles
  t.deepEqual(mesh[0].vertices, [[5, -5, 5.943287037037037], [5, 0, 2.8240740740740744], [0, -5, 3.3796296296296298]])
  t.deepEqual(mesh[49].vertices, [[20, -25, 5.808046861604081], [25, -25, 5.8475011922367965], [20, -20, 5.773626884805813]])
})

test('createMesh (base)', t => {
  const data = [
    1.0, 2.0, 3.0,
    2.0, 3.0, 1.0,
    3.0, 1.0, 2.0
  ]
  const map = heightmap.create(data, 3, 3)
  const mesh = createMesh({ base: 1 }, map)

  t.is(mesh.length, 26)
})
