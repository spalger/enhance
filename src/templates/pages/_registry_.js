import router from 'lib/router'

router.on('/', require('pages/home.html'))
router.on('/issue/:id', require('pages/issue-details.html'))
router.on('/setup', require('pages/setup.html'))
router.on('/create-issue', require('pages/create-issue.html'))
router.on('/issue-created/:id', require('pages/issue-created.html'))

// dev links
router.on('/payload', require('pages/payload.html'))
router.on('/logging', require('pages/logging.html'))
router.on('/github', require('pages/github.html'))

router.on('/:any*', require('pages/notFound.html'))