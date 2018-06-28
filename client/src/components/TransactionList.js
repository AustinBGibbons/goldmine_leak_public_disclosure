import React, { Component } from 'react';

import Transaction from './Transaction'

class TransactionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: this.props.transactions,
    };
  }
  render() {
    return(
      <div className="transaction-list">
        <h5>Your Transactions:</h5>
        <ol>
          {this.state.transactions.map( (transactions, index) => {
            return (
              <li key={index}>
                <Transaction />
              </li>
            );
          })}
        </ol>
      </div>
    );
  }
}

export default TransactionList;