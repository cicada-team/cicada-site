import React from 'react'
import PropTypes from 'prop-types'
import Contribution from './Contribution'
/*
 state
 */
export const getDefaultState = () => ({
})

export const stateTypes = {
}

export const defaultListeners = {
}

/*
 render
 */
export function render({ state }) {
  return (
    <div>
      <Contribution data={state.data} />
    </div>
  )
}
