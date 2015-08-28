
import { identity } from 'lodash'

export class Actions {
  constructor(specs) {
    for (let spec of specs) {
      if (typeof spec === 'string') {
        spec = [spec, null]
      }

      if (!Array.isArray(spec)) {
        throw new TypeError('Actions should either be a string (name) or array ([name, mapFn])')
      }

      let [name, mapFn = identity] = spec
      let creator = (...args) => mapFn({ creator }, ...args)
      this[spec[0]] = creator
    }
  }
}
