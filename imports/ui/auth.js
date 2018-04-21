import { Meteor } from 'meteor/meteor'
import toastr from 'toastr'

export function didMount () {
  const invalidLogin = () => {
    toastr.error('Invalid login.')
    this.props.history.push('/')
  }

  const address = window.sessionStorage.getItem('address')
  const iBank = window.sessionStorage.getItem('iBank')

  if (!address || !iBank) {
    invalidLogin()
  }

  Meteor.call('accounts.getByAddress', { address }, (err, account) => {
    if (err || !account) {
      console.error(err)
      invalidLogin()
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

export function logout () {
  window.sessionStorage.removeItem('address')
  window.sessionStorage.removeItem('iBank')
  toastr.success('Logout Success')
  this.props.history.push('/')
}
