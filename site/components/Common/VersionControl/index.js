import React from 'react'
import PropTypes from 'prop-types'
import VersionControl from './VersionControl'

export const getDefaultState = () => ({
  version: '',
})

export const stateTypes = {
  version: PropTypes.string,
}

export const defaultListeners = {
  onSelect: ({ state }) => state,
}

export function render() {
  return (
    <VersionControl />
  )
}
