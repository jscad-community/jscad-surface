const test = require('ava')

const fs = require('fs')

const decode = require('image-decode')

const { fromImageData } = require('./index')

const logImageData = (imagedata) => {
  console.log(`ImageData: ${imagedata.width} ${imagedata.height}`)
  const r = imagedata.data.length / imagedata.height
  for (let i = 0; i < imagedata.height; i++) {
    const offset = i * r
    const row = imagedata.data.slice(offset, offset + r)
    console.log(`\n  ${row},`)
  }
}

test('fromImageData (small png)', t => {
  // small image; {width: 89, height: 38, data: [13528]}
  const imageData = decode(fs.readFileSync('example/small.png'))
  // logImageData(imageData)
  const map1 = fromImageData(imageData)

  t.is(map1.width, 89)
  t.is(map1.length, 38)
  t.is(map1.data.length, 3382)
})
