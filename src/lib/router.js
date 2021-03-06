import _ from 'lodash'
import Promise from 'bluebird'
import log from 'lib/log'
import pathToRegexp from 'path-to-regexp'
import RouteActions from 'actions/RouteActions'

class Router {
  constructor () {
    _.bindAll(this)
    this.routes = []
    window.addEventListener('hashchange', () => {
      this._dispatch(location.hash)
    })
  }

  start() {
    return this._dispatch(location.hash)
  }

  // on(path, template)
  // - OR -
  // on(path, handler)
  // - OR -
  // on(path, handler, handler, handler, template)
  // - OR -
  // on(route) – with route.template and route.path + route[any]
  on(pattern, ...handlers) {
    handlers.forEach((handler) => {
      var route

      if (_.isString(pattern)) {
        route = {
          pattern,
          handler: _.isFunction(handler) && handler,
          template: _.isString(handler) && handler
        }
      } else {
        route = _.clone(route)
      }

      route.keys = []
      route.regexp = pathToRegexp(route.pattern, route.keys)
      this.routes.push(route)
    })
  }

  goto(hash) {
    window.location.hash = hash;
    return this._dispatch(hash)
  }

  _dispatch(hash) {
    var req = {
      matched: false,
      path: hash.substr(1)
    };

    var q = this.routes.slice(0)

    this.req = req;

    var next = () => {
      if (req !== this.req) {
        req.abandoned = true
        return
      }

      while (q.length) {
        let route = q.shift()
        let match = req.path.match(route.regexp)
        if (!match) continue

        req = this.req = Object.create(req)
        req.matched = true;
        req.route = route;
        req.match = match;
        req.params = _.transform(route.keys, function (params, key, i) {
          var val = match[i + 1];

          if (val && key.repeat) {
            val = val.split(key.delimiter)
          }

          params[key.name] = val;
        }, {})

        if (route.handler) {
          return Promise.try(route.handler, [req]).then(next)
        }

        RouteActions.request(req)
        return;
      }

      log.error('unhandled request', req);
    }

    return Promise.try(next)
  }
}

export default new Router()