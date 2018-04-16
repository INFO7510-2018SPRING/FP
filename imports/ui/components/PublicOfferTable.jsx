import React, { Component } from 'react'

export default class PublicOfferTable extends Component {
  render() {
    return (
      <div className='table-responsive'>
        <table className='table' >
          <thead>
            <tr>
              <th>Stock Name</th>
              <th>Unit Price</th>
              <th>Shares</th>
              <th>Total Price</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(this.props.stockMap).length > 0 && this.props.offers.map((offer, i) => <tr key={i}>
              <td>{this.props.stockMap[offer.stockId]}</td>
              <td>{offer.unitPrice}</td>
              <td>{offer.shares}</td>
              <td>{parseInt(offer.unitPrice) * parseInt(offer.shares)}</td>
              <td>{{ '0': 'Created', '1': 'Matched', '2': 'Canceled' }[offer.state]}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    )
  }
}
