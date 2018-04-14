/**
 * Register api as meteor methods
 */
import { Meteor } from 'meteor/meteor'
import { bank, auditor, public } from './api'

const methods = {}

Object.keys(public).forEach(key => {
    methods[`public.${key}`] = () => {
        if (!Meteor.isServer) {
            return
        }
        return public[key]({ i: 4 })
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
