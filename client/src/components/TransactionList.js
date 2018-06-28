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
<<<<<<< HEAD
=======
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Amount</th>
            </tr>
          </thead>
>>>>>>> f609d8b1a184c8c348526ae70b40c2297f197fd5
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
