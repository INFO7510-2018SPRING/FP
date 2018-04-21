/**
 * Register api as meteor methods
 */
import { Meteor } from 'meteor/meteor'
import { bank, auditor, publics } from './api'
import { Mongo } from 'meteor/mongo'
import mnid from 'mnid'

const methods = {}

Object.keys(publics).forEach(key => {
  methods[`publics.${key}`] = () => {
    if (!Meteor.isServer) {
      return
    }
    return publics[key]({ i: 4 })
  }
})

Object.keys(bank).forEach(key => {
  methods[`bank.${key}`] = args => {
    if (!Meteor.isServer) {
      return
    }
    return bank[key](args)
  }
})

Object.keys(auditor).forEach(key => {
  methods[`auditor.${key}`] = args => {
    if (!Meteor.isServer) {
      return
    }
    return auditor[key](args)
  }
})

Meteor.methods(methods)

export const Accounts = new Mongo.Collection('accounts')
export const PairingRequests = new Mongo.Collection('pairingRequests')

Meteor.methods({
  'accounts.signIn' ({ credentials, nodeIdx }) {
    if (Meteor.isServer) {
      const { address } = mnid.decode(credentials.address)
      const account = Accounts.findOne({ address })
      if (account && account.nodes.includes(nodeIdx)) {
        return account
      }
    }
  },

  'accounts.getByAddress' ({ address }) {
    if (Meteor.isServer) {
      return Accounts.findOne({ address })
    }
  },

  'investor.myHistory' ({ address, iBank }) {
    if (Meteor.isServer) {
      return PairingRequests.find({ address, iBank }).fetch()
    }
  },

  'investor.pairSellOffer' ({ offer, address, iBank }) {
    if (Meteor.isServer) {
      // TODO: validation
      const totalPrice = parseInt(offer.unitPrice) * parseInt(offer.shares)
      const update = { $inc: { balance: -totalPrice, frozenBalance: totalPrice } }
      Accounts.update({ address }, update)
      PairingRequests.insert({ offer, address, iBank, type: 'sell', state: 'Accepted, under bank review', dateTime: new Date() })
      // TODO: receipt contract
    }
  },

  'investor.pairBuyOffer' ({ offer, address, iBank }) {
    if (Meteor.isServer) {
      // TODO: validation
      const totalPrice = parseInt(offer.unitPrice) * parseInt(offer.shares)
      const account = Accounts.findOne({ address })
      const stockSharesKey = `stockShares.${offer.stockId}`
      const frozenStockSharesKey = `frozenStockShares.${offer.stockId}`
      const update = { $inc: { [stockSharesKey]: -totalPrice } }
      if (account.frozenStockShares[offer.stockId]) {
        update['$set'] = { [frozenStockSharesKey]: totalPrice }
      } else {
        update['$inc'][frozenStockSharesKey] = totalPrice
      }
      Accounts.update({ address }, update)
      PairingRequests.insert({ offer, address, iBank, type: 'buy', state: 'Accepted, under bank review', dateTime: new Date() })
      // TODO: receipt contract
    }
  },

  'bank.getRequest' ({ iBank }) {
    if (Meteor.isServer) {
      return PairingRequests.find({ iBank }).fetch()
    }
  },

  'bank.approveRequest' ({ iBank, type, offer, address, _id }) {
    if (Meteor.isServer) {
      PairingRequests.update({ _id }, { $set: { state: 'Approved by Bank, under auditor review' } })
      const args = {
        stockId: parseInt(offer.stockId),
        unitPrice: parseInt(offer.unitPrice),
        shares: parseInt(offer.shares),
        i: iBank
      }
      if (type === 'sell') {
        args.buyer = address
        return bank.makeBuyOffer(args)
      } else {
        args.seller = address
        return bank.makeSellOffer(args)
      }
    }
  },

  'bank.rejectRequest' ({ iBank, type, offer, address, _id }) {
    if (Meteor.isServer) {
      const update = {}
      if (type === 'sell') {
        const totalPrice = parseInt(offer.unitPrice) * parseInt(offer.shares)
        update['$inc'] = { balance: totalPrice, frozenBalance: -totalPrice }
      } else {
        const stockSharesKey = `stockShares.${offer.stockId}`
        const frozenStockSharesKey = `frozenStockShares.${offer.stockId}`
        update['$inc'] = { [stockSharesKey]: offer.shares, [frozenStockSharesKey]: -offer.shares }
      }
      Accounts.update({ address }, update)
      PairingRequests.update({ _id }, { $set: { state: 'Rejected' } })
    }
  },

  'auditor.approveRequest' ({ iBank, type, offer, address, _id }) {
    // const update = {}
    // if (type === 'sell') {
    //   const totalPrice = parseInt(offer.unitPrice) * parseInt(offer.shares)
    //   update['$inc'] = { frozenBalance: -totalPrice }
    // } else {
    //   const frozenStockSharesKey = `frozenStockShares.${offer.stockId}`
    //   update['$inc'] = { [frozenStockSharesKey]: offer.shares }
    // }
    // Accounts.update({ address }, update)
  }
})
