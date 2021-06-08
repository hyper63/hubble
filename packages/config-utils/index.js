
const {
  pipe,
  findIndex,
  propEq,
  set,
  lensIndex,
  lensProp,
  view,
  ifElse,
  always,
  find,
  defaultTo,
  flatten,
  curry
} = require('ramda')

const adapterLens = lensProp('adapters')

/**
 * @param {function[]} mods - an array of mod functions to apply to the hyper config
 * @param {{}} hyperConfig - the base hyper config
 * @returns a hyper config with the mods applied from left to right
 */
const withMods = curry(
  (
    mods,
    hyperConfig
  ) => pipe(...mods)(hyperConfig)
)

const withApp = appConfig => hyperConfig => set(
  lensProp('app'),
  appConfig,
  hyperConfig
)

const withAdapter = port => adapter => hyperConfig => {
  return pipe(
    /**
     * Build adapter config shape
     */
    always({ port, plugins: flatten([adapter]) }),
    /**
    * Replace the adapter in original config,
    * or push onto end of adapter array
    */
    adapterConfig => pipe(
      view(adapterLens),
      defaultTo([]),
      ifElse(
        find(propEq('port', port)),
        // Replace existing adapter config
        adapters => set(
          lensIndex(
            findIndex(propEq('port', port), adapters)
          ),
          adapterConfig,
          adapters
        ),
        // push new config onto adapters array
        adapters => always([...adapters, adapterConfig])
      ),
      adapters => [...adapters]
    )(hyperConfig),
    /**
     * set new adapters config on hyper config
     */
    newAdaptersConfig => set(
      adapterLens,
      newAdaptersConfig,
      hyperConfig
    )
  )()
}

const withDataAdapter = withAdapter('data')
const withCacheAdapter = withAdapter('cache')
const withStorageAdapter = withAdapter('storage')
const withSearchAdapter = withAdapter('search')
const withQueueAdapter = withAdapter('queue')

module.exports = {
  withMods,
  withApp,
  withAdapter,
  withDataAdapter,
  withCacheAdapter,
  withStorageAdapter,
  withSearchAdapter,
  withQueueAdapter
}
