import React from 'react'
import PropTypes from 'prop-types'
import Homepage from './Homepage'
/*
 state
 */
export const getDefaultState = () => ({
  content: '',
})

export const stateTypes = {
  content: PropTypes.string,
}

export const defaultListeners = {
  onClick: ({ state }) => state,
}

/*
 render
 */
export function render({ state }) {
  return (
    <div>
      <Homepage content={state.content} />
    </div>
  )
}
