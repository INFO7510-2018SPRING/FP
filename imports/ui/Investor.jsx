import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import toastr from 'toastr'
import { withRouter } from 'react-router-dom'

import { OpeningBuyOfferTable, OpeningSellOfferTable } from './components/PublicOfferTable'
import MyHistoryTable from './components/MyHistoryTable'

class Investor extends Component {
  constructor () {
    super()
    this.state = {
      account: null,
      stockMap: {}
    }
  }

  componentDidMount () {
    const address = window.sessionStorage.getItem('address')
    const iBank = window.sessionStorage.getItem('iBank')

    if (!address || !iBank) {
      this.invalidLogin()
    }

    Meteor.call('accounts.getByAddress', { address }, (err, account) => {
      if (err || !account) {
        console.error(err)
        this.invalidLogin()
      } else {
        this.setState({ account, iBank: parseInt(iBank) })
      }
    })

    Meteor.call('publics.getStockList', (err, res) => {
      if (err) {
        console.error(err)
      } else {
        res.map(stock => this.setState({ stockMap: { ...this.state.stockMap, [stock.id]: stock.name } }))
      }
    })
  }

  invalidLogin () {
    toastr.error('Invalid login.')
    this.props.history.push('/')
  }

  renderSellOfferButton (offer) {
    if (!this.state.account) {
      return <a className='button is-dark is-loading is-small' >Loading</a>
    }
    const balance = this.state.account.balance || 0
    const totalPrice = parseInt(offer.unitPrice) * parseInt(offer.shares)
    const sufficient = balance >= totalPrice
    const text = sufficient ? 'Request Pairing' : 'Insufficient Balance'
    return <a key='key' className='button is-dark is-small' onClick={() => sufficient && this.pairSellOffer(offer)} disabled={!sufficient}>{text}</a>
  }

  renderBuyOfferButton (offer) {
    if (!this.state.account) {
      return <a className='button is-dark is-loading is-small' >Loading</a>
    }
    const stockShares = this.state.account.stockShares
    const shares = stockShares ? stockShares[offer.stockId] || 0 : 0
    const sufficient = shares > parseInt(offer.shares)
    const text = sufficient ? 'Request Pairing' : 'Insufficient Shares'
    return <a key='key' className='button is-dark is-small' onClick={() => sufficient && this.pairBuyOffer(offer)} disabled={!sufficient}>{text}</a>
  }

  pairBuyOffer (offer) {
    const args = { address: this.state.account.address, iBank: this.state.iBank, offer }
    Meteor.call('investor.pairBuyOffer', args, err => {
      if (err) {
        console.error(err)
      } else {
        toastr.success('Request Submitted')
        this.props.history.push('/404')  // FIXME: another way to update
        this.props.history.push('/investor')
      }
    })
  }

  pairSellOffer (offer) {
    const args = { address: this.state.account.address, iBank: this.state.iBank, offer }
    Meteor.call('investor.pairSellOffer', args, err => {
      if (err) {
        console.error(err)
      } else {
        toastr.success('Request Submitted')
        this.props.history.push('/404')  // FIXME: another way to update
        this.props.history.push('/investor')
      }
    })
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
    const stockShares = this.state.account.stockShares
    const shares = Object.keys(this.state.stockMap).map(key =>
      <div className='navbar-item' key={key}>
        {this.state.stockMap[key]}: {stockShares ? stockShares[key] || 0 : 0}
      </div>
    )

    const frozenStockShares = this.state.account.stockShares
    const frozenShares = Object.keys(this.state.stockMap).map(key =>
      <div className='navbar-item' key={key + '-frozen'}>
        {this.state.stockMap[key] + '(Frozen)'}: {frozenStockShares ? frozenStockShares[key] || 0 : 0}
      </div>
    )

    return shares.concat(frozenShares)
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
              <div className='navbar-item'>
                Investor Address: {this.state.account && this.state.account.address}
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
                    Frozen: {this.getBalance()}
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
            <h2 className='title is-2'>My History</h2>
            {this.state.account && <MyHistoryTable {...this.state} />}
          </div>
        </section>
      </div>
    )
  }
}

export default withRouter(Investor)
