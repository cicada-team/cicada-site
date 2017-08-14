export const keys = Object.keys

export function reduce(obj, handler, initial = {}) {
  return keys(obj).reduce((last, key) => handler(last, obj[key], key), initial)
}

export function filter(obj, handler) {
  return reduce(obj, (last, item, key) => (handler(item, key) ? { ...last, [key]: item } : last))
}

export function omit(obj, names) {
  return filter(obj, (value, name) => names.indexOf(name) === -1)
}

export function id(fn) {
  return (...argv) => fn.call(this, ...argv)
}

export function pick(obj, names) {
  return filter(obj, (value, name) => names.indexOf(name) !== -1)
}

export function mapValues(obj, handler) {
  return reduce(obj, (last, value, key) => ({ ...last, [key]: handler(value, key) }))
}

export function each(obj, fn) {
  return keys(obj).forEach((k) => {
    fn(obj[k], k)
  })
}

export function zip(zipKeys, zipValues) {
  return zipKeys.reduce((last, key, index) => {
    last[key] = zipValues[index]
    return last
  }, {})
}

export function unique(arr) {
  arr.sort()
  if (arr.length < 1) {
    return arr
  }
  const re = [arr[0]]
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== re[re.length - 1]) {
      re.push(arr[i])
    }
  }
  return re
}

export function repeat(time, handler) {
  const result = []
  for (let i = 0; i < time; i++) {
    result.push(handler(i))
  }
  return result
}

/* eslint-disable eqeqeq */
export function isNegative(obj) {
  if (obj == undefined) {
    return true
  } else if (Array.isArray(obj)) {
    return obj.length === 0
  } else if (typeof obj === 'object') {
    return Object.keys(obj).length === 0
  } else if (typeof obj === 'string') {
    return obj === ''
  }
  return false
}

export const compose = (first, ...rest) => (...init) => rest.reduce((composed, func) => func(composed), first(...init))

export function walk(obj, childrenName, handler, path = []) {
  handler(obj, path)
  if (obj[childrenName] !== undefined && Array.isArray(obj[childrenName])) {
    obj[childrenName].forEach((child, index) => walk(child, childrenName, handler, path.concat([childrenName, index])))
  }
}
