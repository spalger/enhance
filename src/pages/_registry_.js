import router from 'lib/router'

router.on('/', require('pages/home.html'))
router.on('/issue/:id', require('pages/issue.html'))
router.on('/payload', require('pages/payload.html'))
router.on('/logging', require('pages/logging.html'))
router.on('/github', require('pages/github.html'))

router.on('/route/debug', require('pages/routeDebug.html'))
router.on('/zero-or-one/:v?', require('pages/routeDebug.html'))
router.on('/zero-or-more/:v*', require('pages/routeDebug.html'))
router.on('/zero-or-more-plus-bar/:v*/bar', require('pages/routeDebug.html'))
router.on('/one-or-more/:v+/baz', require('pages/routeDebug.html'))
router.on('/one-or-more-plus-baz/:v+/baz', require('pages/routeDebug.html'))

router.on('/:any*', require('pages/notFound.html'))