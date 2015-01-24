import router from 'router'
import domready from 'domready'
import config from 'config'
import 'components/_registry_'

domready(() => {
  router.history.start({
    root: config.rootPath
  })
})