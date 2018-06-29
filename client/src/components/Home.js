import React, { Component } from 'react';
import axios from 'axios';

import { AppState } from '../common';
import Sidebar from './Sidebar';
import Link from './Link';
import TransactionList from './TransactionList';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.INIT,
      transactions: null,
    };
    this.initializeBankAccount = this.initializeBankAccount.bind(this);
  }

  async reset() {
    const res = await axios({
      url: '/delete_user',
      method: 'post',
      data: {},
    });

    this.setState({
      appState: AppState.INIT,
    });
  }

  initializeBankAccount() {
    this.setState({
      appState: AppState.ITEM_LINKED,
    });

    // Start polling for transactions. We do this because the server is currently
    // waiting for Plaid to respond with the INITIAL_UPDATE transactions webhook.
    // Once that webhook fires, fetchTransactions will recieve data from the /get_transactions
    // endpoint and we can stop polling.
    this.fetchTransactionsInterval = setInterval(this.fetchTransactions.bind(this), 2000);
  }

  async fetchTransactions() {
    console.log("fetchTransactions poll");
    const res = await axios({
      url: '/get_transactions',
      method: 'post',
      data: {},
    });

    const transactions = res.data.transactions;

    // Check if our app server has received transactions for the linked item.
    // It usually takes 30-240 seconds for the first transaction pull to complete
    // https://plaid.com/docs/quickstart/#pulling-transaction-data
    if (transactions.length > 0) {
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

  renderBody(appState) {
    switch(appState) {
      case AppState.INIT:
        return (
          <div>
            <Link initializeBankAccount={this.initializeBankAccount} />
          </div>
        );
      case AppState.ITEM_LINKED:
        return (
          <div>
          </div>
        );
      case AppState.PUBLIC_TOKEN_EXCHANGED:
        return (
          <div>
          </div>
        );
      case AppState.TRANSACTIONS_RECEIVED:
        return (
          <TransactionList transactions={this.state.transactions}/>
        )
    }
  }

  render() {
    return(
        <div className="row">
          <Sidebar appState={this.state.appState} reset={this.reset.bind(this)}/>
          <div className="app">
            <nav>
              <div className="logo">
                💰 Goldmine 💰
              </div>
            </nav>
            <div className="container body">
              {this.renderBody(this.state.appState)}
            </div>
          </div>
        </div>
    );
  };
};

export default Home;
