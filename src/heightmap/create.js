/**
 * Create a new heightmap from the given parameters if any.
 * @param {Array} [data] - 1D array of Z values, where array.length = width * length
 * @param {Number} [width] - width of heightmap
 * @param {Number} [length] - length of heightmap
 */
const create = (data, width, length) => {
  if (data === undefined || width === undefined || length === undefined) {
    data = []
    width = 0
    length = 0
  }
  return { data, width, length }
}

module.exports = create
