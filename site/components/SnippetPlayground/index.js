import PropTypes from 'prop-types'
import React from 'react'
import SnippetPlayground from './SnippetPlayground'

export const getDefaultState = () => ({
  code: '',
  location: '',
})

export const stateTypes = {
  code: PropTypes.string,
  location: PropTypes.string,
}

export function render({ state }) {
  return (
    <SnippetPlayground code={state.code} location={state.location} />
  )
}
