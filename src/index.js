import router from 'router'
import domready from 'domready'
import config from 'config'

domready(() => {
  router.history.start({
    root: config.rootPath
  })
})