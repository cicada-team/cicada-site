import PropTypes from 'prop-types'
import React from 'react'

export const getDefaultState = () => ({
  code: '',
})

export const stateTypes = {
  code: PropTypes.string,
}

export const defaultListeners = {
}


export function render() {
  return (
    <div />
  )
}
