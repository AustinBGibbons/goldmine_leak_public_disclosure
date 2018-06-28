import React, { Component } from 'react';
import axios from 'axios';

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

  async getBankConnectedState() {
    const res = await axios({
      url: '/get_bank_connected_state',
      method: 'post',
      data: {},
    });
    
    const { bank_connected_state } = res;

    console.log("bank connected state is", bank_connected_state)

    if (bank_connected_state) {
      const transactions_data = await axios({
        url: '/get_transactions',
        method: 'post',
        data: {},
      });

      const transactions = { transactions_data };

      this.setState({
        bankConnected: true,
        transactions: transactions,
      });
    } else {
      this.setState({
        bankConnected: false,
      });
    }
  }

  componentDidMount() {
    this.getBankConnectedState();
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
