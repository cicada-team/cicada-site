import React from 'react'
import PropTypes from 'prop-types'

import Doc from './Doc'

export const getDefaultState = () => ({
  sideBar: {},
  main: {},
})

export const stateTypes = {
  sideBar: PropTypes.object,
  main: PropTypes.object,
}

export const defaultListeners = {
  onTitleClick({ state }, payload) {
    return {
      ...state,
      value: payload.url,
    }
  },
}
export function render({ state, listeners }) {
  return (
    <Doc
      sideBar={state.sideBar}
      main={state.main}
      onTitleClick={listeners.onTitleClick}
    />
  )
}
