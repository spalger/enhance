import AppPage from 'AppPage'
import domready from 'domready'

domready(() => {
  AppPage.render(document.getElementById('app-container'))
})