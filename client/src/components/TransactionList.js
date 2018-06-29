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
        <table className="u-full-width">
          <thead>
            <tr>
              <th>Date</th>
              <th>Transaction</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {this.state.transactions.map( (transaction, index) => {
              return (
                <Transaction key={index} transaction={transaction}/>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default TransactionList;
