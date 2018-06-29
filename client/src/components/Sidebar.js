import React, { Component } from 'react';
import Prism from 'prismjs';
import { AppState } from '../common';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account_name: this.props.account_name,
      mask: this.props.mask,
    };
  }

  renderAppState(appState) {
    switch(appState) {
      case AppState.INIT:
        return (
          <div>
            <p className="welcome-msg">
              Welcome to the Plaid Boilerplate Tutorial!
            </p>
            <p>
              Step 1: Create a .env file with your API keys:
            </p>
            <pre>
              <code className="language-bash">
{`PORT=8000
PLAID_CLIENT_ID=<your client id>
PLAID_SECRET=<your secret>
PLAID_PUBLIC_KEY=<your public key>
PLAID_ENV=sandbox
`}
              </code>
            </pre>
            <a className="dashboard-link"
               href="https://dashboard.plaid.com/account/keys"
               target="_blank">
              Click here to get your API Keys
            </a>
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
            <p>You are now seeing transactions for</p>
            <p>Account Name: {this.props.account_name}</p>
            <p>Mask: {this.props.mask}</p>
          </div>
        )
    }
  }

  render() {
    return (
      <div>
        <div className="sidebar">
          <div className="logo">
            <a href="/">
              Boilerplate App 💸⏱
            </a>
          </div>
          <div className="app-state">
            {this.renderAppState(this.props.appState)}
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
