import React from 'react'
import PropTypes from 'prop-types'
import Blog from './Blog'
/*
 state
 */
export const getDefaultState = () => ({
})

export const stateTypes = {
}

export const propTypes = {
  posts: PropTypes.object,
}

export const defaultListeners = {
}

export function render({ state }) {
  return (
    <Blog posts={state.posts} />
  )
}
