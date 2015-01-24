// capture initial values
var _jQuery = window.jQuery

// export $ for messenger
import $ from 'jquery'
window.jQuery = $

// import messenger and it's necessary styles
import 'messenger/build/js/messenger.js'
import 'messenger/build/css/messenger.css'
import 'messenger/build/css/messenger-theme-air.css'

export default window.Messenger({
  extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
  theme: 'air'
})

// reset initial values
window.jQuery = _jQuery