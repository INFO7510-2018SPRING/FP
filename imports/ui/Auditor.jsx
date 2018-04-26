import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import toastr from 'toastr'
import { withRouter } from 'react-router-dom'

import auth from './auth'
import { SellOfferTable, BuyOfferTable } from './components/PublicOfferTable'

const walletAddresses = [
  '0xed9d02e382b34818e88b88a309c7fe71e65f419d',
  '0xca843569e3427144cead5e4d5999a3d0ccf92b8e',
  '0x0fbdc686b912d7722dc86510934589e0aaf3b55a',
  '0x9186eb3d20cbd1f5f992a950d808c4495153abd5',
  '0x0638e1574728b6d862dd5d3a3e0942c3be47d996'
]

class Auditor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentTab: 'All',
      buyOffers: [],
      sellOffers: [],
      stockMap: {}
    }
  }

  renderTabs () {
    return <ul>
      {['All', 'Pairing'].map((name, i) => (
        <li className={this.state.currentTab === name ? 'is-active' : ''} key={i}>
          <a onClick={() => this.setState({ currentTab: name })}>
            {name}
          </a>
        </li>
      ))}
    </ul>
  }

  componentDidMount () {
    auth.didMount.call(this)

    Meteor.call('publics.getStockList', (err, res) => {
      if (err) {
        console.error(err)
      } else {
        res.map(stock => this.setState({ stockMap: { ...this.state.stockMap, [stock.id]: stock.name } }))
      }
    })

    Meteor.call('publics.getPublicBuyOfferList', (err, buyOffers) => {
      if (err) {
        console.error(err)
      } else {
        this.setState({ buyOffers })
      }
    })

    Meteor.call('publics.getPublicSellOfferList', (err, sellOffers) => {
      if (err) {
        console.error(err)
      } else {
        this.setState({ sellOffers })
      }
    })
  }

  getIBank (address) {
    return walletAddresses.map(addr => addr.toLowerCase()).indexOf(address.toLowerCase())
  }

  rejectOffer (offer, type) {
    const iBank = getIBank(offer.bank)
    Meteor.call(`auditor.cancel${type}Offer`, { iBank, offer }, (err, res) => {
      if (err) {
        console.error(err)
      } else {
        toastr.success('Rejected')
        this.props.history.push('/404')
        this.props.history.push('/auditor')
      }
    })
  }

  getActions (type) {
    return [{
      render: offer => <ViewButton key='view' offer={offer} type={type} />
    }, {
      render: offer => <RejectButton key='reject' offer={offer} rejectOffer={offer => this.rejectOffer(offer, type)} />
    }]
  }

  renderAll () {
    return (
      <div className='container'>
        <h2 className='title is-2'>
          All Offers
        </h2>
        <h3 className='subtitle is-3'>
          Buy Offers
        </h3>
        <BuyOfferTable actions={this.getActions('Buy')} offers={this.state.buyOffers} stockMap={this.state.stockMap} />
        <h3 className='subtitle is-3'>
          Sell Offers
        </h3>
        <SellOfferTable actions={this.getActions('Sell')} offers={this.state.sellOffers} stockMap={this.state.stockMap} />
      </div>
    )
  }

  renderPairing () {
    return (
      <div className='container'>
        <h2 className='title is-2'>All Possible Pairs</h2>
        <PairsTable {...this.state} history={this.props.history} />
      </div>
    )
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
                Auditor Address: BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=
              </div>
              <a className='navbar-item' onClick={() => auth.logout.call(this)}>
                Logout
              </a>
            </div>
          </div>
        </nav>
        <div className='section'>
          <div className='container'>
            <div className='tabs'>
              {this.renderTabs()}
            </div>
          </div>
          <div className='container' style={{ marginTop: 30 }}>
            {this.state.currentTab === 'All' && this.renderAll()}
            {this.state.currentTab === 'Pairing' && this.renderPairing()}
          </div>
        </div>
      </div >
    )
  }
}

class PairsTable extends Component {
  constructor (props) {
    super(props)
    const { buyOffers, sellOffers, stockMap } = props
    const pairs = this.getAllPairs(buyOffers, sellOffers)
    this.state = { pairs, stockMap }
  }

  getAllPairs (buyOffers, sellOffers) {
    buyOffers = buyOffers.filter(offer => offer.state === '0')
    sellOffers = sellOffers.filter(offer => offer.state === '0')
    const pairs = []
    for (let buyOffer of buyOffers) {
      for (let sellOffer of sellOffers) {
        if (this.canPair(buyOffer, sellOffer)) {
          pairs.push({ buyOffer, sellOffer })
        }
      }
    }
    return pairs
  }

  canPair (buyOffer, sellOffer) {
    const b1 = buyOffer.stockId === sellOffer.stockId
    const b2 = buyOffer.unitPrice === sellOffer.unitPrice
    const b3 = buyOffer.shares === sellOffer.shares
    return b1 && b2 && b3
  }

  match (pair) {
    const { buyOffer, sellOffer } = pair
    const iBuyBank = getIBank(buyOffer.bank)
    const iSellBank = getIBank(sellOffer.bank)
    Meteor.call('auditor.matchOffer', { iBuyBank, iSellBank, publicSellOfferId: sellOffer.id, publicBuyOfferId: buyOffer.id }, (err, res) => {
      if (err) {
        console.error(err)
      } else {
        toastr.success('Offer Matched!')
        this.props.history.push('/404')
        this.props.history.push('/auditor')
      }
    })
  }

  render () {
    return (
      <table className='table is-fullwidth'>
        <thead>
          <tr className='has-text-light has-background-dark'>
            <th className='has-text-light'>Buyer</th>
            <th className='has-text-light'>Seller</th>
            <th className='has-text-light'>Stock Name</th>
            <th className='has-text-light'>Unit Price</th>
            <th className='has-text-light'>Shares</th>
            <th className='has-text-light'>Total Price</th>
            <th className='has-text-light'>Action</th>
          </tr>
        </thead>
        <tbody>
          {this.state.pairs.length === 0 && <tr><td>No Data</td></tr>}
          {this.state.pairs.map((pair, i) => <tr key={i}>
            <td><ViewButton offer={pair.buyOffer} type='Buy' /></td>
            <td><ViewButton offer={pair.sellOffer} type='Sell' /></td>
            <td>{Object.keys(this.state.stockMap).length && this.state.stockMap[pair.buyOffer.stockId]}</td>
            <td>{pair.buyOffer.unitPrice}</td>
            <td>{pair.buyOffer.shares}</td>
            <td>{parseInt(pair.buyOffer.unitPrice) * parseInt(pair.buyOffer.shares)}</td>
            <td><a className='button is-small is-dark' onClick={() => this.match(pair)}>Pair</a></td>
          </tr>)}
        </tbody>
      </table>
    )
  }
}

class ViewButton extends Component {
  constructor (props) {
    super(props)
    this.state = {
      investorAddress: null
    }
    const iBank = getIBank(props.offer.bank)
    const hash = props.offer.privateHash
    Meteor.call(`auditor.get${props.type}Offer`, { iBank, hash }, (err, res) => {
      if (err) {
        console.error(err)
      } else {
        this.setState({ investorAddress: res.investor })
      }
    })
  }
  render () {
    return (
      <div className='dropdown is-hoverable' style={{ marginRight: 5 }}>
        <div className='dropdown-trigger'>
          <a className='button is-small is-dark'>Detail</a>
        </div>
        <div className='dropdown-menu'>
          <div className='dropdown-content' style={{ padding: 0, maxWidth: 140, overflowX: 'scroll' }}>
            <div className='dropdown-item'>
              <p><strong>{this.props.type} Offer </strong># {this.props.offer.id}</p>
            </div>
            <div className='dropdown-item'>
              <p><strong>Bank: </strong>{this.props.offer.bank}</p>
            </div>
            <div className='dropdown-item'>
              <p><strong>Investor: </strong>{this.state.investorAddress}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class RejectButton extends Component {
  render () {
    const { offer } = this.props

    if (offer.state !== '0') {
      return <div />
    }

    return (
      <a
        key={`reject-${offer.id}`}
        onClick={() => this.props.rejectOffer(offer)}
        className='button is-dark is-small'>Reject</a>
    )
  }
}

const getIBank = address => walletAddresses.map(addr => addr.toLowerCase()).indexOf(address.toLowerCase())

export default withRouter(Auditor)
