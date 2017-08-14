const fs = require('fs')

const OUTPUT_PATH = `${__dirname}/output`

exports.gatherDocs = () => {
  const docList = []
  fs.readdir(OUTPUT_PATH, (_error, fileNames) => {
    if (_error) {
      throw _error
    }

    /* eslint-disable */
    fileNames.forEach((fileName) => {
      fs.readFile(`${OUTPUT_PATH}/${fileName}`, 'utf-8', (_error, data) => {
        if (_error) {
          throw _error
        }
        /* eslint-disable */
        console.log(data)
        docList.push(JSON.parse(data))
      })
    })
  })
}

exports.formatTitle = (origin) => {
  return origin.replace(/\s+/g, '-').toLowerCase()
}

