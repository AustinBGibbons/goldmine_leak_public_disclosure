import React, { Component } from 'react';
import Prism from 'prismjs';
import { AppState } from '../common';

/*
This component helps visualize the current state of your Plaid app.
Your app would not need to replicate any of this code, so you can safely ignore it.
*/
class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account_name: this.props.account_name,
      mask: this.props.mask,
    };
  }

  handleReset() {
    console.log("start over clicked");
    this.props.reset();
  }

  renderAppState(appState) {
    switch(appState) {
      case AppState.LOADING:
        return (
          <h3>Loading...</h3>
        )
      case AppState.ITEM_NOT_LINKED:
        return (
          <div>
            <h3>Step 1</h3>
            <p>Create a .env file with your API keys and environment configs</p>
            <pre>
<code className="language-bash">
{`PLAID_ENV=sandbox
PORT=8000
PLAID_CLIENT_ID=<your client id>
PLAID_SECRET=<your secret>
PLAID_PUBLIC_KEY=<your public key>
TRANSACTION_WEBHOOK_URL=<your webhook url>`
}
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
            <h3>Step 2</h3>
            <p>Item Linked! Calling app server to exchange public_token for access_token...</p>
            <p className="big-emoji">☁️</p>
          </div>
        );
      case AppState.PUBLIC_TOKEN_EXCHANGED:
        return (
          <div>
            <h3>Step 3</h3>
            <p>Server has access_token! App server is waiting for transactions from Plaid...</p>
            <p className="big-emoji">⏳</p>
          </div>
        );
      case AppState.TRANSACTIONS_RECEIVED:
        return (
          <div>
            <h3>Step 4</h3>
            <p>Received transactions!</p>
            <p>You've completed all the steps for a basic Plaid app, congrats!</p>
            <p className="big-emoji">🎉</p>
            <p>You are now seeing transactions for</p>
            <p>Account Name: {this.props.account_name}</p>
            <p>Mask: {this.props.mask}</p>

            <a className="button button-primary" onClick={this.handleReset.bind(this)}>Start Over</a>
          </div>
        )
    }
  }

  render() {
    return (
      <div className="sidebar">
        <div className="app-state">
          {this.renderAppState(this.props.appState)}
        </div>
      </div>
    );
  }
}

export default Sidebar;
