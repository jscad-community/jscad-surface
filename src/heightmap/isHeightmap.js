
const isHeightmap = (object) => {
  if (object && typeof object === 'object') {
    if ('data' in object && Array.isArray(object.data)) {
      if ('width' in object && Number.isInteger(object.width)) {
        if ('length' in object && Number.isInteger(object.length)) {
          return true
        }
      }
    }
  }
  return false
}

module.exports = isHeightmap
