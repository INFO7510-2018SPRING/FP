import React, { Component } from 'react'

import { Meteor } from 'meteor/meteor'

class PublicOfferTable extends Component {
  constructor (props) {
    super(props)
    props = props || {}
    this.state = { offers: props.offers || [], stockMap: props.stockMap || {} }
  }

  componentDidMount () {
    if (Object.keys(this.state.stockMap).length === 0) {
      Meteor.call('publics.getStockList', (err, res) => {
        if (err) {
          console.error(err)
        } else {
          res.map(stock => this.setState({ stockMap: { ...this.state.stockMap, [stock.id]: stock.name } }))
        }
      })
    }

    if (this.state.offers.length === 0) {
      Meteor.call(this.methodName, (err, offers) => {
        if (err) {
          console.error(err)
        } else {
          offers = this.filter ? offers.filter(o => this.filter(o)) : offers
          this.setState({ offers })
        }
      })
    }
  }

  render () {
    return (
      <table className='table is-fullwidth'>
        <thead>
          <tr className='has-text-light has-background-dark'>
            <th />
            <th className='has-text-light'>Stock Name</th>
            <th className='has-text-light'>Unit Price</th>
            <th className='has-text-light'>Shares</th>
            <th className='has-text-light'>Total Price</th>
            <th className='has-text-light'>State</th>
            {this.props.actions && <th className='has-text-light'>Action</th>}
          </tr>
        </thead>
        <tbody>
          {this.state.offers.length === 0 && <tr><td>No Data</td></tr>}
          {Object.keys(this.state.stockMap).length > 0 && this.state.offers.map((offer, i) => <tr key={i}>
            <td># {offer.id}</td>
            <td>{this.state.stockMap[offer.stockId]}</td>
            <td>{offer.unitPrice}</td>
            <td>{offer.shares}</td>
            <td>{parseInt(offer.unitPrice) * parseInt(offer.shares)}</td>
            <td>{{ '0': 'Created, under auditor review', '1': 'Matched', '2': 'Canceled' }[offer.state]}</td>
            {this.props.actions && <td>
              {this.props.actions.map(action => action.render(offer))}
            </td>}
          </tr>)}
        </tbody>
      </table>
    )
  }
}

export class BuyOfferTable extends PublicOfferTable {
  constructor () {
    super()
    this.methodName = 'publics.getPublicBuyOfferList'
  }
}

export class SellOfferTable extends PublicOfferTable {
  constructor () {
    super()
    this.methodName = 'publics.getPublicSellOfferList'
  }
}

export class OpeningBuyOfferTable extends BuyOfferTable {
  constructor () {
    super()
    this.filter = o => o.state === '0'
  }
}

export class OpeningSellOfferTable extends SellOfferTable {
  constructor () {
    super()
    this.filter = o => o.state === '0'
  }
}
