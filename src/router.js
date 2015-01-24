import AmpRouter from 'ampersand-router'

var Router = AmpRouter.extend({
  initialize: function () {
    var render = (template) => {
      return function () {
        document.getElementById('app-container').innerHTML = template
      }
    }

    var route = (path, template) => {
      this.route(path, 'route', render(template))
    }

    route('', require('pages/home.html'));
    route('issue/:id', require('pages/issue.html'));
  }
})

export default new Router()