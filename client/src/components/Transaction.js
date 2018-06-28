import React, { Component } from 'react';

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.transaction.name,
      amount: this.props.transaction.amount,
    }
  }
  render() {
    return(
      <tr>
         <td className="transaction-name">
          {this.state.name}
        </td>
        <td className="transaction-amount">
          {'$' + this.state.amount.toFixed(2)}
        </td>
      </tr>
    );
  }
}

export default Transaction;
