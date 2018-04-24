import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'

class MyHistoryTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      history: []
    }
  }

  componentDidMount() {
    const { account, iBank } = this.props

    Meteor.call('investor.myHistory', ({ address: account.address, iBank }), (err, history) => {
      if (err) {
        console.error(err)
      } else {
        this.setState({ history })
      }
    })
  }

  render() {
    return (
      <table className='table is-fullwidth'>
        <thead>
          <tr className='has-background-dark'>
            <th className='has-text-light'>DateTime</th>
            <th className='has-text-light'>My Request</th>
            <th className='has-text-light'>Offer</th>
            <th className='has-text-light'>State</th>
            <th className='has-text-light'>Receipt</th>
          </tr>
        </thead>
        <tbody>
          {this.state.history.length === 0 && <tr><td>No Data</td></tr>}
          {this.state.history.map((one, i) => (
            <tr key={i}>
              <td>{one.dateTime.toISOString()}</td>
              <td>{`Request Pairing ${one.type.charAt(0).toUpperCase() + one.type.slice(1)} Offer`}</td>
              <td># {one.offer.id}</td>
              <td>{one.state}</td>
              <td>r</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}

export default MyHistoryTable
