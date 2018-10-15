import gutil from 'gulp-util'
import _ from 'lodash'
import path from 'path'
import through from 'through2'
import Vinyl from 'vinyl'

const pluginName = 'gulp-example-source'

export default () => {
  const exampleSources = {}

  return through.obj(
    (file, enc, cb) => {
      if (file.isNull()) {
        cb(null, file)
        return
      }

      if (file.isStream()) {
        cb(new gutil.PluginError(pluginName, 'Streaming is not supported'))
        return
      }

      const sourceName = _.split(file.path, path.sep)
        .slice(-4)
        .join('/')
        .slice(0, -3)

      exampleSources[sourceName] = file.contents.toString()
      cb()
    },
    (cb) => {
      const indexFile = new Vinyl({
        path: './exampleSources.json',
        contents: Buffer.from(JSON.stringify(exampleSources, null, 2)),
      })

      cb(null, indexFile)
    },
  )
}
