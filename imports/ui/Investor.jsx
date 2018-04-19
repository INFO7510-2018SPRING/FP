import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'

import { OpeningBuyOfferTable, OpeningSellOfferTable } from './components/PublicOfferTable'

export default class Investor extends Component {
  constructor () {
    super()
    this.state = {
      account: null,
      stockMap: {}
    }
  }

  componentDidMount () {
    const account = JSON.parse(window.sessionStorage.getItem('account'))
    this.setState({ account })

    Meteor.call('publics.getStockList', (err, res) => {
      if (err) {
        console.error(err)
      } else {
        res.map(stock => this.setState({ stockMap: { ...this.state.stockMap, [stock.id]: stock.name } }))
      }
    })
  }

  renderBuyOfferButton (offer) {
    const balance = this.state.account.balance || 0
    const totalPrice = parseInt(offer.unitPrice) * parseInt(offer.shares)
    const sufficient = balance >= totalPrice
    const text = sufficient ? 'Request Pairing' : 'Insufficient Balance'
    return <a key='key' className='button is-dark' disabled={!sufficient}>{text}</a>
  }

  renderSellOfferButton (offer) {
    const stockShares = this.state.account.stockShares
    const shares = stockShares ? stockShares[offer.stockId] || 0 : 0
    const sufficient = shares > parseInt(offer.shares)
    const text = sufficient ? 'Request Pairing' : 'Insufficient Shares'
    return <a key='key' className='button is-dark' disabled={!sufficient}>{text}</a>
  }

  getBalance () {
    if (!this.state.account) {
      return 0
    }
    return this.state.account.balance || 0
  }

  getShares () {
    if (!this.state.account || Object.keys(this.state.stockMap).length === 0) {
      return ''
    }
    return Object.keys(this.state.stockMap).map(key => {
      const stockShares = this.state.account.stockShares
      return <div className='navbar-item'>
        {this.state.stockMap[key]}: {stockShares ? stockShares[key] || 0 : 0}
      </div>
    })
  }

  render () {
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
              <div className='navbar-item has-dropdown is-hoverable'>
                <div className='navbar-link'>
                  Balance
                </div>
                <div className='navbar-dropdown'>
                  <div className='navbar-item'>
                    {this.getBalance()}
                  </div>
                </div>
              </div>
              <div className='navbar-item has-dropdown is-hoverable'>
                <div className='navbar-link'>
                  Shares
                </div>
                <div className='navbar-dropdown'>
                  {this.getShares()}
                </div>
              </div>
            </div>
          </div>
        </nav>
        <section className='section'>
          <div className='container'>
            <h2 className='title is-2'>Opening Offers</h2>
            <h4 className='subtitle is-3'>Buy Offers</h4>
            <OpeningBuyOfferTable actions={[{ render: offer => this.renderBuyOfferButton(offer) }]} />
            <h4 className='subtitle is-3'>Sell Offers</h4>
            <OpeningSellOfferTable actions={[{ render: offer => this.renderSellOfferButton(offer) }]} />
          </div>
        </section>
      </div>
    )
  }
}
