import format from 'format'
import messenger from 'lib/messenger'

export const msg = logger('msg')
export const info = logger('info')
export const success = logger('success')
export const warning = logger('warning')
export const error = logger('error')

function logger(lvl) {
  var label = lvl.toUpperCase()
  var msgType;

  if (lvl === 'warning') {
    msgType = 'info'
  }

  if (lvl === 'success' || lvl === 'error') {
    msgType = lvl
  }

  return function type(...args) {
    if (msgType) {
      messenger.post({
        type: msgType,
        message: asString(args)
      })
    }

    // log to the console
    args.unshift(label)
    console.log.apply(console, args)
  }
}

function asString(msgs) {
  return msgs.reduce(function (msg, m, i) {
    return msg + (i > 0 ? ' ' : '') + format(m)
  }, '')
}

setTimeout(function () {
  msg('message message', {obj: true})
  info('info message', {obj: true})
  success('success message', {obj: true})
  warning('warning message', {obj: true})
  error('error message', {obj: true})
}, 1000)