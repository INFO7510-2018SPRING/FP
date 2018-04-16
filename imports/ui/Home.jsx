import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { Connect, SimpleSigner } from 'uport-connect'
import toastr from 'toastr'
import { withRouter } from 'react-router-dom'

import PublicOfferTable from './components/PublicOfferTable'
import { clientId, network, signer } from '../uPortConfig.json'
import credentials from '../uPortCredentials.json'

class Home extends Component {
  constructor () {
    super()
    this.state = {
      buyOffers: [],
      sellOffers: [],
      iBankInvestor: 1,
      iBankBanker: 1,
      stockMap: {}
    }

    this.uport = new Connect('INFO7510', {
      clientId,
      network,
      signer: SimpleSigner(signer)
    })

    Meteor.call('publics.getStockList', (err, res) => {
      if (err) {
        console.error(err)
      } else {
        res.map(stock => this.setState({ stockMap: { ...this.state.stockMap, [stock.id]: stock.name } }))
      }
    })

    Meteor.call('publics.getPublicBuyOfferList', (err, res) => {
      if (err) {
        console.error(err)
      } else {
        this.setState({ buyOffers: res })
      }
    })

    Meteor.call('publics.getPublicSellOfferList', (err, res) => {
      if (err) {
        console.error(err)
      } else {
        this.setState({ sellOffers: res })
      }
    })
  }

  loginUPort () {
    // return this.uport.requestCredentials({
    //   requested: ['name', 'phone', 'country'],
    //   notifications: true // We want this if we want to recieve credentials
    // })
    return Promise.resolve(credentials)
  }

  getCB (next) {
    return (err, account) => {
      if (err) {
        toastr.error('Account not found.')
      } else {
        toastr.success('Login success.')
        this.props.history.push(next)
      }
    }
  }

  investorLogin () {
    return this.loginUPort().then(credentials => {
      Meteor.call('accounts.signIn', { credentials, nodeIdx: this.state.iBankInvestor }, this.getCB('/investor'))
    })
  }

  bankLogin () {
    return this.loginUPort().then(credentials => {
      Meteor.call('accounts.signIn', { credentials, nodeIdx: this.state.iBankBanker }, this.getCB('/bank'))
    })
  }

  auditorLogin () {
    return this.loginUPort().then(credentials => {
      Meteor.call('accounts.signIn', { credentials, nodeIdx: 0 }, this.getCB('/auditor'))
    })
  }

  render () {
    return (
      <div className='container' >
        <h2>Welcome to Stock Settlement</h2>
        <h3>Buy Offers</h3>
        <div className='row'>
          <div className='col-md'>
            <PublicOfferTable offers={this.state.buyOffers} stockMap={this.state.stockMap} />
          </div>
        </div>
        <h3>Sell Offers</h3>
        <div className='row'>
          <div className='col-md'>
            <PublicOfferTable offers={this.state.sellOffers} stockMap={this.state.stockMap} />
          </div>
        </div>
        <h3>Login</h3>
        <div className='row'>
          <div className='col-6 col-md-4'>
            <h4>Investor</h4>
            <div className='input-group'>
              <select className='custom-select' value={this.state.iBankInvestor} onChange={e => this.setState({ iBankInvestor: e.target.value })}>
                <option value='1'>CHASE</option>
                <option value='2'>BOA</option>
                <option value='3'>STANDAR</option>
              </select>
              <div className='input-group-append'>
                <button className='btn btn-dark' onClick={() => this.investorLogin()}>Login</button>
              </div>
            </div>
          </div>
          <div className='col-6 col-md-4'>
            <h4>Banker</h4>
            <div className='input-group'>
              <select className='custom-select' value={this.state.iBankBanker} onChange={e => this.setState({ iBankInvestor: e.target.value })}>
                <option value='1'>CHASE</option>
                <option value='2'>BOA</option>
                <option value='3'>STANDAR</option>
              </select>
              <div className='input-group-append'>
                <button className='btn btn-dark' onClick={() => this.bankLogin()}>Login</button>
              </div>
            </div>
          </div>
          <div className='col-6 col-md-4'>
            <h4>Auditor</h4>
            <button className='btn btn-dark' onClick={() => this.auditorLogin()}>Login</button>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Home)
