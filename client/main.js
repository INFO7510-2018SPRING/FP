import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '../imports/ui/investor/investorLogin.js';
import '../imports/ui/investor/investorHome.js';
import '../imports/startup/accounts-config.js';


import './main.html';
Template.main.onCreated(function () {
  this.stocks = new ReactiveVar([])
  this.publicBuyOffers = new ReactiveVar([])
  this.publicSellOffers = new ReactiveVar([])
})

Template.main.onRendered(function () {
  Meteor.call('public.getStockList', (err, res) => {
    if (err) {
      console.error(err)
    } else {
      this.stocks.set(res)
    }
  })
  Meteor.call('public.getPublicSellOfferList', (err, res) => {
    if (err) {
      console.error(err)
    } else {
      this.publicSellOffers.set(res)
    }
  })
  Meteor.call('public.getPublicBuyOfferList', (err, res) => {
    if (err) {
      console.error(err)
    } else {
      this.publicBuyOffers.set(res)
    }
  })
})

Template.main.helpers({
  publicBuyOffers() {
    const instance = Template.instance()
    const stockMap = {}
    instance.stocks.get().forEach(({name, id}) => {
      stockMap[id] = name
    })
    if (Object.keys(stockMap) === 0) {
      return []
    }

    return instance.publicSellOffers.get()
      // .filter(stock => stock.state === '0') // state === 'Created'
      .map(({id, shares, state, stockId, unitPrice }) => ({
        name: stockMap[stockId],
        shares,
        unitPrice,
        totalPrice: parseInt(unitPrice) * parseInt(shares),
        state: {'0': 'Created', '1': 'Matched', '2': 'Canceled'}[state]
      }))
  },

  publicSellOffers() {
    const instance = Template.instance()
    const stockMap = {}
    instance.stocks.get().forEach(({name, id}) => {
      stockMap[id] = name
    })
    if (Object.keys(stockMap) === 0) {
      return []
    }

    return instance.publicBuyOffers.get()
      // .filter(stock => stock.state === '0') // state === 'Created'
      .map(({id, shares, state, stockId, unitPrice }) => ({
        name: stockMap[stockId],
        shares,
        unitPrice,
        totalPrice: parseInt(unitPrice) * parseInt(shares),
        state: {'0': 'Created', '1': 'Matched', '2': 'Canceled'}[state]
      }))
  },

  stocks: [
    { stockName: 'Amazon' , buyNumber: "100"},
    { stockName: 'Google' , buyNumber: "100"},
    { stockName: 'FaceBook' , buyNumber: "100"},
    { stockName: 'Apple' , buyNumber: "100"},
    { stockName: 'Linked' , buyNumber: "100"},
    { stockName: 'Dell' , buyNumber: "100"},
    { stockName: 'Leveno' , buyNumber: "100"},
    { stockName: 'Apple' , buyNumber: "100"},
    { stockName: 'Linked' , buyNumber: "100"},
    { stockName: 'Dell' , buyNumber: "100"},
    { stockName: 'Leveno' , buyNumber: "100"},
    { stockName: 'Apple' , buyNumber: "100"},
    { stockName: 'Linked' , buyNumber: "100"},
    { stockName: 'Dell' , buyNumber: "100"},
    { stockName: 'Leveno' , buyNumber: "100"},

  ]
});

