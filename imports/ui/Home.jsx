import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { Connect, SimpleSigner } from 'uport-connect'
import toastr from 'toastr'
import { withRouter } from 'react-router-dom'

import { BuyOfferTable, SellOfferTable } from './components/PublicOfferTable'
import { clientId, network, signer } from '../uPortConfig.json'
import credentials from '../uPortCredentials.json'

class Home extends Component {
  constructor () {
    super()
    this.state = {
      iBankInvestor: 1,
      iBankBanker: 1
    }

    this.uport = new Connect('INFO7510', {
      clientId,
      network,
      signer: SimpleSigner(signer)
    })
  }

  loginUPort () {
    // return this.uport.requestCredentials({
    //   requested: ['name', 'phone', 'country'],
    //   notifications: true // We want this if we want to recieve credentials
    // })
    return Promise.resolve(credentials)
  }

  getCB ({ next, iBank }) {
    return (err, account) => {
      if (err || !account) {
        toastr.error('Account not found.')
      } else {
        toastr.success('Login success.')
        console.log(account)
        window.sessionStorage.setItem('address', account.address)
        window.sessionStorage.setItem('iBank', iBank)
        this.props.history.push(next)
      }
    }
  }

  investorLogin () {
    return this.loginUPort().then(credentials => {
      const iBank = this.state.iBankInvestor
      Meteor.call('accounts.signIn', { credentials, nodeIdx: iBank }, this.getCB({ next: '/investor', iBank }))
    })
  }

  bankLogin () {
    return this.loginUPort().then(credentials => {
      const iBank = this.state.iBankBanker
      Meteor.call('accounts.signIn', { credentials, nodeIdx: iBank }, this.getCB({ next: '/bank', iBank }))
    })
  }

  auditorLogin () {
    return this.loginUPort().then(credentials => {
      Meteor.call('accounts.signIn', { credentials, nodeIdx: 0 }, this.getCB({ next: '/auditor', iBank: 0 }))
    })
  }

  render () {
    return (
      <section className='section'>
        <div className='container' >
          <h2 className='title is-2'>Welcome to Stock Settlement</h2>
          <h3 className='subtitle is-3'>Buy Offers</h3>
          <BuyOfferTable />
          <h3 className='subtitle is-3'>Sell Offers</h3>
          <SellOfferTable />
          <h3 className='subtitle is-3'>Login</h3>
          <div className='columns'>
            <div className='column'>
              <label className='label'>Investor</label>
              <div className='field has-addons'>
                <div className='control'>
                  <div className='select'>
                    <select value={this.state.iBankInvestor} onChange={e => this.setState({ iBankInvestor: e.target.value })}>
                      <option value='1'>CHASE</option>
                      <option value='2'>BOA</option>
                      <option value='3'>STANDAR</option>
                    </select>
                  </div>
                </div>
                <div className='control'>
                  <a className='button is-dark' onClick={() => this.investorLogin()}>Login</a>
                </div>
              </div>
            </div>
            <div className='column'>
              <label className='label'>Banker</label>
              <div className='field has-addons'>
                <div className='control'>
                  <div className='select'>
                    <select value={this.state.iBankBanker} onChange={e => this.setState({ iBankInvestor: e.target.value })}>
                      <option value='1'>CHASE</option>
                      <option value='2'>BOA</option>
                      <option value='3'>STANDAR</option>
                    </select>
                  </div>
                </div>
                <div className='control'>
                  <a className='button is-dark' onClick={() => this.bankLogin()}>Login</a>
                </div>
              </div>
            </div>
            <div className='column'>
              <label className='label'>Auditor</label>
              <a className='button is-dark' onClick={() => this.auditorLogin()}>Login</a>
            </div>
          </div>
        </div >
      </section >
    )
  }
}

export default withRouter(Home)
