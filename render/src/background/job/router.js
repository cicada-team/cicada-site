
export function initialize(utilInstances, stateTree, appearance) {
  const stateIdToRouter = {}
  function register(stateId, { match = '/' }) {
    stateIdToRouter[stateId] = match
  }

  function run(stateId) {
    const location = window.location.href.toString().split(window.location.host)[1]
    console.log(location)
    const match = stateIdToRouter[stateId]
    if (match == location) {
      return true
    }
    return false
  }

  function handle(stateId, result) {
    appearance.setVisibleById(stateId, result)
  }

  return {
    register,
    run,
    handle,
  }
}

export function check({ match }) {
  return match !== undefined && match.length !== 0
}

