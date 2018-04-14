import { Meteor } from 'meteor/meteor'
import { bank, auditor, public } from './api'

Meteor.methods({
  'public.getStockList' () {
      if (!Meteor.isServer) {
          return
      }
      return public.getStockList({ i: 4 })
  },

  'public.getPublicBuyOfferList' () {
      if (!Meteor.isServer) {
          return
      }
      return public.getPublicBuyOfferList({ i: 4 })
  },

  'public.getPublicSellOfferList' () {
      if (!Meteor.isServer) {
          return
      }
      return public.getPublicSellOfferList({ i: 4 })
  }
})
