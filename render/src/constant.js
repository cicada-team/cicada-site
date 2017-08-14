
export const PROD = 'production'
export const DEBUG = 'debug'
export const DISPLAY_BLOCK = 'block'
export const DISPLAY_INLINE = 'inline'

export const primitiveComponent = {
  a: DISPLAY_INLINE,
  br: DISPLAY_BLOCK,
  dd: DISPLAY_INLINE,
  del: DISPLAY_INLINE,
  div: DISPLAY_BLOCK,
  dl: DISPLAY_INLINE,
  dt: DISPLAY_INLINE,
  em: DISPLAY_INLINE,
  h1: DISPLAY_BLOCK,
  h2: DISPLAY_BLOCK,
  h3: DISPLAY_BLOCK,
  h4: DISPLAY_BLOCK,
  h5: DISPLAY_BLOCK,
  h6: DISPLAY_BLOCK,
  hr: DISPLAY_BLOCK,
  i: DISPLAY_INLINE,
  iframe: DISPLAY_BLOCK,
  label: DISPLAY_INLINE,
  li: DISPLAY_INLINE,
  ol: DISPLAY_INLINE,
  p: DISPLAY_BLOCK,
  pre: DISPLAY_BLOCK,
  span: DISPLAY_INLINE,
  ul: DISPLAY_INLINE,
}

export const primitiveFnNames = [
  'componentDidMount',
  'componentWillReceiveProps',
  'componentWillUnmount',
  'getChildContext',
  'shouldComponentUpdate',
  'componentWillUpdate',
]

export const CONTEXT_NAME = 'cicada'
export const ACTION_COMPONENT_CHANGE = 'component.change'
export const ACTION_FORM_CONTROL_CHANGE = 'form.change'
export const ACTION_VALIDATION_STATE_CHANGE = 'validation.change'
export const ACTION_VALIDATION_PROMISE_START = 'validation.validating'
export const ACTION_VALIDATION_FORCE_VALIDATE = 'validation.forceValidate'
export const ACTION_FUTURE_CHANGE = 'future.change'
export const ACTION_STORE_SEAL = 'store.seal'
export const ACTION_LISTENER_SET = 'listener.set'
export const ACTION_LINK_STATE = 'compose.linkState'
export const ACTION_CONTEXT_COMPUTE = 'context.compute'
export const ACTION_STORE_SET_STATE = 'store.setState'

export const VALIDATION_TYPE_ERROR = 'error'
export const VALIDATION_TYPE_WARNING = 'warning'
export const VALIDATION_TYPE_SUCCESS = 'success'
export const VALIDATION_TYPE_NORMAL = 'normal'
export const VALIDATION_TYPE_VALIDATING = 'validating'

export const LINK_STATE_FROM = 'from'
export const LINK_STATE_TO = 'to'

export const COMPOSE_RELATIVE_CHILD_PATH = '__inner__'

export const REASON_DEFAULT_LISTENER = 'reason.listener.default'
export const REASON_VALIDATION_RESET = 'reason.validation.reset'
export const REASON_VALIDATION_CHANGE = 'reason.validation.change'
export const REASON_JOB_MAP_BACK_GROUND_TO_STATE = 'reason.job.mapBackgroundToState'

export const CHANGE_STATETREE = 'change.stateTree'
export const CHANGE_APPEARANCE = 'change.appearance'

export const COMPONENT_TYPE_PRIMITIVE = 'component.primitive'
export const COMPONENT_TYPE_CUSTOM = 'component.custom'
export const COMPONENT_TYPE_IDENTIFIER = 'component.identifier'
