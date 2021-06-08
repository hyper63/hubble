
const { withDataAdapter, withMods } = require('@hyper63/config-utils')
const pouchdb = require('@hyper63/adapter-pouchdb')

const { extend, start } = require('../src')

start(
  extend(
    withMods([
      withDataAdapter(
        pouchdb({ dir: '__foo' })
      )
    ])
  )
)
