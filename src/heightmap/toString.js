
const toString = (heightmap) => {
  let string = `heightmap: ${heightmap.width} ${heightmap.height}\n[`
  for (let i = 0; i < heightmap.height; i++) {
    const offset = i * heightmap.width
    const row = heightmap.data.slice(offset, offset + heightmap.width)
    string += `\n  ${row},`
  }
  string += '\n]'
  return string
}

module.exports = toString
