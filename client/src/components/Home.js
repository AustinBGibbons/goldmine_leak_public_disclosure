import React, { Component } from 'react';
import axios from 'axios';

import Header from './Header';
import Link from './Link';
import TransactionList from './TransactionList';

const AppState = Object.freeze({
  INIT: Symbol("INIT"),
  ITEM_LINKED: Symbol("ITEM_LINKED"),
  PUBLIC_TOKEN_EXCHANGED: Symbol("PUBLIC_TOKEN_EXCHANGED"),
  TRANSACTIONS_RECEIVED: Symbol("PUBLIC_TOKEN_EXCHANGED")
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.INIT,
      transactions: null,
    };
    this.initializeBankAccount = this.initializeBankAccount.bind(this);
  }

  initializeBankAccount() {
    this.setState({
<<<<<<< HEAD
      bankConnected: true,
=======
      appState: AppState.ITEM_LINKED,
>>>>>>> f609d8b1a184c8c348526ae70b40c2297f197fd5
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
<<<<<<< HEAD
    if (transactions.length > 0) {
=======

    // Check if our app server has received transactions for the linked item.
    // It usually takes 30-240 seconds for the first transaction pull to complete
    // https://plaid.com/docs/quickstart/#pulling-transaction-data
    if (transactions) {
>>>>>>> f609d8b1a184c8c348526ae70b40c2297f197fd5
      console.log("fetchTransactions end poll");
      clearInterval(this.fetchTransactionsInterval);

      this.setState({
        appState: AppState.TRANSACTIONS_RECEIVED,
        transactions,
      });
    }
  }

  async getItemLinkedState() {
    const res = await axios({
      url: '/get_item_linked_state',
      method: 'post',
      data: {},
    });

    const { item_linked_state } = res.data;

    if (item_linked_state > 0) {
      console.log("getItemLinkedState", item_linked_state)
      // Logged in user has already linked an item
      this.setState({
        appState: AppState.ITEM_LINKED
      });

      // Since the user has already linked an item, we can now fetch
      // transactions for that item
      this.fetchTransactions();
    }
  }

  componentDidMount() {
    this.getItemLinkedState();
  }

  renderAppState(appState) {
    switch(appState) {
      case AppState.INIT:
        return (
          <div>
            <p className="welcome-msg">
              Welcome to the Plaid Boilerplate Tutorial!
            </p>
            <Link initializeBankAccount={this.initializeBankAccount} />
          </div>
        );
      case AppState.ITEM_LINKED:
        return (
          <div>
            <p>Item Linked! Calling app server to exchange public_token for access_token...</p>
          </div>
        );
      case AppState.PUBLIC_TOKEN_EXCHANGED:
        return (
          <div>
            <p>Server has access_token! App server is waiting for transactions from Plaid...</p>
          </div>
        );
      case AppState.TRANSACTIONS_RECEIVED:
        return (
          <div>
            <p>Received transactions! See below</p>
            <TransactionList transactions={this.state.transactions}/>
          </div>
        )
    }
  }
  render() {
    return(
      <div>
        <Header/>
<<<<<<< HEAD
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
=======
        <div className="container">
          {this.renderAppState(this.state.appState)}
        </div>
>>>>>>> f609d8b1a184c8c348526ae70b40c2297f197fd5
      </div>
    );
  };
};

export default Home;
