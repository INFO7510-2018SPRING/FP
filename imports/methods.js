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

Meteor.methods({
  'accounts.signIn' ({ credentials, nodeIdx }) {
    if (Meteor.isServer) {
      const { address } = mnid.decode(credentials.address)
      const account = Accounts.findOne({ address })
      if (account && account.nodes.includes(nodeIdx)) {
        return account
      }
    }
  }
})
