/*
 * preventDefaultEvent
 * */
export const preventDefault = (e) => {
  e.preventDefault()
}

export const stopPropagation = (e) => {
  e.stopPropagation()
  if (e.nativeEvent.stopImmediatePropagation) {
    e.nativeEvent.stopImmediatePropagation()
  }
}

/*
 * pass the props to next state
 * */
export const keep = ({ state }) => {
  return state
}

/*
 * null function
 * */
export const noop = () => {
  return null
}


/*
 *  constants
 */

export const SIZES = ['default', 'small', 'large']
export const VALIDATION_STATUS = ['normal', 'validating', 'success', 'warning', 'error']

export const FOCUS_EVENT = ['onFocus', 'onBlur']
export const FORM_EVENT = ['onChange', 'onInput', 'onSubmit']
export const MOUSE_EVENT = ['onClick', 'onContextMenu', 'onDoubleClick', 'onDrag', 'onDragEnd', 'onDragEnter', 'onDragExit', 'onDragLeave', 'onDragOver', 'onDragStart', 'onDrop', 'onMouseDown', 'onMouseEnter', 'onMouseLeave', 'onMouseMove', 'onMouseOut', 'onMouseOver', 'onMouseUp']
export const SELECTION_EVENT = ['onSelect']
export const KEYBOARD_EVENT = ['onKeyDown', 'onKeyPress', 'onKeyUp']

export const COMMON_INPUT_STATE = ['value', 'disabled', 'placeholder']
export const COMMON_INPUT_EVENT = FORM_EVENT.concat(KEYBOARD_EVENT).concat(FOCUS_EVENT)
