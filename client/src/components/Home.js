import React, { Component } from 'react';

import Header from './Header';
import Link from './Link';
import TransactionList from './TransactionList';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bankConnected: false,
      transactions: [],
    };
    this.toggleBankConnection = this.toggleBankConnection.bind(this);
  }

  toggleBankConnection() {
    this.setState({
      bankConnected: true,
    });
  }

  render() {
    return(
      <div className="home-container">
        <Header/>
        <p className="welcome-msg">
          Welcome to the Plaid Boilerplate Tutorial!
          Please link your bank account.
        </p> 
        {this.state.bankConnected ? (
          <div>
            <p>Bank Connected! See your transactions below.</p>
            <TransactionList transactions={this.state.transactions}/>
          </div>
        ) : (
          <Link
            toggleBankConnection={this.toggleBankConnection} 
          />
        )}
      </div>
    );
  };
};

export default Home;
