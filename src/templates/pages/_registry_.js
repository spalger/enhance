import router from 'lib/router'

import requireLogin from 'lib/middleware/requireLogin'

// app routes
router.on('/', require('pages/home.html'))
router.on('/issue/:id', require('pages/issue-details.html'))
router.on('/setup', requireLogin, require('pages/setup.html'))
router.on('/setup/step2', requireLogin, require('pages/setupPayload.html'))
router.on('/create-issue', require('pages/create-issue.html'))
router.on('/issue-created/:id', require('pages/issue-created.html'))


// dev links
router.on('/payload', require('pages/payload.html'))
router.on('/logging', require('pages/logging.html'))
router.on('/github', require('pages/github.html'))


// catchall
router.on('/:any*', require('pages/notFound.html'))