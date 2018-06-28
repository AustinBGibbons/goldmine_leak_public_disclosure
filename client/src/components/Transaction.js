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
      <div>
         <p className="transaction-name">
          {this.state.name}
        </p>
        <p className="transaction-amount">
          {'$' + this.state.amount}
        </p>
      </div>
    );
  }
}

export default Transaction;
