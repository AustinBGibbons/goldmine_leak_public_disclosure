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
    this.initializeBankAccount = this.initializeBankAccount.bind(this);
  }

  initializeBankAccount(TRANSACTIONS) {
    this.setState({
      bankConnected: true,
      transactions: TRANSACTIONS,
    });
  }

  async getBankConnectedState() {
    const res = await axios({
      url: '/get_bank_connected_state',
      method: 'post',
      data: {},
    });
    
    const { bank_connected_state } = res.data;

    if (bank_connected_state > 0 ) {
      const transactions_data = await axios({
        url: '/get_transactions',
        method: 'post',
        data: {},
      });

      const { transactions } = transactions_data.data;

      await this.setState({
        bankConnected: true,
        transactions: transactions,
      });
    } else {
      await this.setState({
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
            initializeBankAccount={this.initializeBankAccount} 
          />
        )}
      </div>
    );
  };
};

export default Home;
