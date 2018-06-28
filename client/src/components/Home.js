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
      transactions: null,
    };
    this.initializeBankAccount = this.initializeBankAccount.bind(this);
  }

  initializeBankAccount() {
    this.setState({
      bankConnected: true,
    });

    // Start polling for transactions. We do this because the server is currently
    // waiting for Plaid to respond with the INITIAL_UPDATE transactions webhook.
    // Once that webhook fires, fetchTransactions will recieve data from the /get_transactions
    // endpoint and we can stop polling.
    this.fetchTransactionsInterval = setInterval(this.fetchTransactions.bind(this), 2000);
  }

  async fetchTransactions() {
    console.log("fetchTransactions start poll");
    const res = await axios({
      url: '/get_transactions',
      method: 'post',
      data: {},
    });

    const transactions = res.data.transactions;
    if (transactions.length > 0) {
      console.log("fetchTransactions end poll");
      clearInterval(this.fetchTransactionsInterval);

      this.setState({
        transactions,
      });
    }
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
        transactions,
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
        </p>
        {this.state.bankConnected ? (
          this.state.transactions && this.state.transactions.length > 0 ? (
            <div>
              <p>Bank Connected! See your transactions below.</p>
              <TransactionList transactions={this.state.transactions}/>
            </div>
          ) : (
            <div>
              <p>Bank Connected! Loading transactions...</p>
            </div>
          )
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
