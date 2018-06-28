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
        <table className="u-full-width">
          {this.state.transactions.map( (transaction, index) => {
            return (
              <Transaction transaction={transaction}/>
            );
          })}
        </table>
      </div>
    );
  }
}

export default TransactionList;
