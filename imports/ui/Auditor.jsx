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
      modal: {
        show: false,
        data: {}
      }
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
  }

  getIBank (address) {
    return walletAddresses.map(addr => addr.toLowerCase()).indexOf(address.toLowerCase())
  }

  rejectOffer (offer, type) {
    const iBank = getIBank(offer.bank)
    const publicOfferId = parseInt(offer.id)
    Meteor.call(`auditor.cancel${type}Offer`, { iBank, publicOfferId }, (err, res) => {
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
      render: offer => <a
        key={`reject-${type}-${offer.id}`}
        onClick={() => this.rejectOffer(offer, type)}
        className='button is-dark is-small'>Reject</a>
    }]
  }

  renderAll () {
    return (
      <div className='container'>
        <h2 className='title is-2'>
          All Offers
        </h2>
        <h3 className='subtitle is-3'>
          Sell Offers
        </h3>
        <SellOfferTable actions={this.getActions('Sell')} />
        <h3 className='subtitle is-3'>
          Buy Offers
        </h3>
        <BuyOfferTable actions={this.getActions('Buy')} />
      </div>
    )
  }

  renderPairing () {
    return (
      <div className='container'>Pairing</div>
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
          <a className='button is-small is-dark'>View Investor</a>
        </div>
        <div className='dropdown-menu'>
          <div className='dropdown-content' style={{ padding: 0, maxWidth: 120, overflowX: 'scroll' }}>
            <div className='dropdown-item'>
              {this.state.investorAddress}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const getIBank = address => walletAddresses.map(addr => addr.toLowerCase()).indexOf(address.toLowerCase())

export default withRouter(Auditor)
