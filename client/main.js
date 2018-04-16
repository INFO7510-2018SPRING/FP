
import React from 'react'
import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'
import 'toastr/build/toastr.css'

import App from '../imports/ui/App'

Meteor.startup(() => {
  render(<App />, document.getElementById('root'))
})
