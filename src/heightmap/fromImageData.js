const create = require('./create')

// Create a heightmap from the given ImageData
// @See https://developer.mozilla.org/en-US/docs/Web/API/ImageData
// @Return heightmap containing Z values from 0-1, representing luminance of each pixel
const fromImageData = (imageData) => {
  let {data, width, height} = imageData
  let zdata = []
  if (data.length === (width * height * 4)) {
    // convert the image data to height map
    for (let i = 0; i < data.length; i = i + 4) {
      let r = data[i + 0] / 255
      let g = data[i + 1] / 255
      let b = data[i + 2] / 255
      let a = data[i + 3]

      // convert color to grayscale luminance
      // see https://en.wikipedia.org/wiki/Grayscale
      let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
      zdata.push(luminance)
    }
  }
  return create(zdata, width, height)
}

module.exports = fromImageData
