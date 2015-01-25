import router from 'lib/router'

router.on('/', require('pages/home.html'))
router.on('/issue/:id', require('pages/issue.html'))
router.on('/setup', require('pages/setup.html'))
router.on('/payload', require('pages/payload.html'))
router.on('/logging', require('pages/logging.html'))
router.on('/github', require('pages/github.html'))
router.on('/:any*', require('pages/notFound.html'))