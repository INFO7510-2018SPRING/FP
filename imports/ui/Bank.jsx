import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import toastr from 'toastr'
import { withRouter } from 'react-router-dom'

import auth from './auth'

class Bank extends Component {
  constructor (props) {
    super(props)
    this.state = {
      account: null,
      stockMap: {},
      iBank: null,
      requests: null,
      bank: null
    }
  }

  componentDidMount () {
    auth.didMount.call(this)
  }

  getInfo () {
    if (this.state.iBank === null || this.state.bank) {
      return
    }
    Meteor.call('bank.getInfo', { i: this.state.iBank }, (err, info) => {
      // this.setState({ info: 'hello' })
      if (err) {
        console.error(err)
      } else {
        const tmPubKeys = [
          'BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=',
          'QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc=',
          'oNspPPgszVUFw0qmGFfWwh1uxVUXgvBxleXORHj07g8=',
          'R56gy4dn24YOjwyesTczYa8m5xhP6hF2uTMCju/1xkY=',
          'UfNSeSGySeKg11DVNEnqrUtxYRVor4+CvluI8tVv62Y='
        ]
        this.setState({ bank: { info, address: tmPubKeys[parseInt(this.state.iBank)] } })
      }
    })
  }

  getRequests () {
    if (this.state.iBank === null || this.state.requests !== null) {
      return
    }
    Meteor.call('bank.getRequest', ({ iBank: this.state.iBank }), (err, requests) => {
      if (err) {
        console.error(err)
      } else {
        this.setState({ requests })
      }
    })
  }

  getBalance () {
    return this.state.bank && this.state.bank.info.balance
  }

  getFrozenBalance () {
    return this.state.bank && this.state.bank.info.frozenBalance
  }

  getShares () {
    if (!this.state.bank) {
      return ''
    }
    const stockShares = this.state.bank.info.stockShares
    const shares = Object.keys(this.state.stockMap).map(key =>
      <div className='navbar-item' key={key}>
        {this.state.stockMap[key]}: {stockShares ? stockShares[key] || 0 : 0}
      </div>
    )

    const frozenStockShares = this.state.bank.info.frozenStockShares
    const frozenShares = Object.keys(this.state.stockMap).map(key =>
      <div className='navbar-item' key={key + '-frozen'}>
        {this.state.stockMap[key] + '(Frozen)'}: {frozenStockShares ? frozenStockShares[key] || 0 : 0}
      </div>
    )

    return shares.concat(frozenShares)
  }

  reject (request) {
    Meteor.call('bank.rejectRequest', { iBank: this.state.iBank, ...request }, err => {
      if (err) {
        console.error(err)
      } else {
        toastr.success('Request Rejected')
        this.props.history.push('/404') // FIXME: another way to update
        this.props.history.push('/bank')
      }
    })
  }

  approve (request) {
    Meteor.call('bank.approveRequest', { ibank: this.state.iBank, ...request }, err => {
      if (err) {
        console.error(err)
      } else {
        toastr.success('Request Approved')
        this.props.history.push('/404')
        this.props.history.push('/bank')
      }
    })
  }

  renderButton (request) {
    return request.state.startsWith('Accepted') && <span>
      <a className='button is-dark is-small' onClick={() => this.approve(request)} style={{ marginRight: 5 }}>Approve</a>
      <a className='button is-dark is-small' onClick={() => this.reject(request)}>Reject</a>
    </span >
  }

  render () {
    this.getInfo()
    this.getRequests()
    return (
      <div>
        <nav className='navbar is-dark'>
          <div className='navbar-brand'>
            <a className='navbar-item'>
              <h2 className='title is-2 has-text-light'>
                Stock Settlement
              </h2>
            </a>
          </div>
          <div className='navbar-menu'>
            <div className='navbar-start' />
            <div className='navbar-end'>
              <div className='navbar-item'>
                Bank Address: {this.state.bank && this.state.bank.address}
              </div>
              <div className='navbar-item has-dropdown is-hoverable'>
                <div className='navbar-link'>
                  Shares
                </div>
                <div className='navbar-dropdown'>
                  {this.getShares()}
                </div>
              </div>
              <div className='navbar-item has-dropdown is-hoverable'>
                <div className='navbar-link'>
                  Balance
                </div>
                <div className='navbar-dropdown'>
                  <div className='navbar-item'>
                    {this.getBalance()}
                  </div>
                  <div className='navbar-item'>
                    Frozen: {this.getFrozenBalance()}
                  </div>
                </div>
              </div>
              <a className='navbar-item' onClick={() => auth.logout.call(this)}>
                Logout
              </a>
            </div>
          </div>
        </nav>
        <div className='section'>
          <div className='container'>
            <h2 className='title is-2'>Pairing Request From Investor</h2>
            <table className='table is-fullwidth'>
              <thead>
                <tr className='has-background-dark'>
                  <th className='has-text-light'>DateTime</th>
                  <th className='has-text-light' style={{ maxWidth: 120 }}>Investor</th>
                  <th className='has-text-light'>Request</th>
                  <th className='has-text-light'>Offer</th>
                  <th className='has-text-light'>State</th>
                  <th className='has-text-light'>Action</th>
                </tr>
              </thead>
              <tbody>
                {this.state.requests && this.state.requests.map((request, i) => (
                  <tr key={i}>
                    <td>{request.dateTime.toISOString()}</td>
                    <td style={{ maxWidth: 120, overflowX: 'scroll' }} >{request.address}</td>
                    <td>{`Request Pairing ${request.type === 'sell' ? 'Sell' : 'Buy'} Offer`}</td>
                    <td># {request.offer.id}</td>
                    <td>{request.state}</td>
                    <td>{this.renderButton(request)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Bank)
