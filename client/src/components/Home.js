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
      appState: AppState.LOADING,
      account_name: null,
      mask: null,
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
      appState: AppState.ITEM_NOT_LINKED,
    });
  }

  async getItemLinkedState() {
    const res = await axios({
      url: '/get_item_linked_state',
      method: 'post',
      data: {},
    });

    const { item } = res.data;

    if (item.length > 0) {
      const {
        mask,
        account_name,
      } = item[0];

      // Logged in user has already linked an Item
      this.setState({
        appState: AppState.ITEM_LINKED,
        mask,
        account_name,
      });

      // Since the user has already linked an Item, we can now fetch
      // transactions for that Item from our database.
      this.fetchTransactions();
    } else {
      this.setState({
        appState: AppState.ITEM_NOT_LINKED,
      })
    }
  }

  initializeBankAccount(account_name, mask) {
    this.setState({
      appState: AppState.ITEM_LINKED,
      account_name,
      mask,
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

  componentDidMount() {
    this.getItemLinkedState();
  }

  renderBody(appState) {
    switch(appState) {
      case AppState.LOADING:
        return (
          <div>Loading...</div>
        );
      case AppState.ITEM_NOT_LINKED:
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
          <Sidebar
                appState={this.state.appState}
                account_name={this.state.account_name}
                mask={this.state.mask}
                reset={this.reset.bind(this)}
          />
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
