import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './Home'
import Investor from './Investor'
import Bank from './Bank'
import Auditor from './Auditor'

const App = () => (
  <Router>
    <div>
      <Route exact path='/' component={Home} />
      <Route path='/investor' component={Investor} />
      <Route path='/bank' component={Bank} />
      <Route path='/auditor' component={Auditor} />
    </div>
  </Router>
)

export default App
