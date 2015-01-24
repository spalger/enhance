import domready from 'domready'

import 'components/_registry_'
import 'pages/_registry_'
import 'lib/initDb'

import router from 'lib/router'
domready(router.start)