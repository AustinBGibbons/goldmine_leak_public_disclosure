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

  handleGetAuth() {
    this.props.getAuth();
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
            <a className="button button-secondary" onClick={this.handleReset.bind(this)}>Start Over</a>
          </div>
        );
      case AppState.PUBLIC_TOKEN_EXCHANGED:
        return (
          <div>
            <h3>Step 3</h3>
            <p>Server has access_token! App server is waiting for transactions from Plaid...</p>
            <p className="big-emoji">⏳</p>
            <a className="button button-secondary" onClick={this.handleReset.bind(this)}>Start Over</a>
          </div>
        );
      case AppState.TRANSACTIONS_RECEIVED:
        return (
          <div>
            <h3>Step 4</h3>
            <p>Received transactions!</p>
            <p>You've linked an Item for Transactions!</p>
            <p>You can see your transactions on the right.</p>
            <p className="big-emoji">🕵️‍</p>
            <p>Now, let's try authenticating an account using Plaid's Auth product.</p>
            <a className="button button-primary" onClick={this.handleGetAuth.bind(this)}>Authenticate Account</a>
            <br/>
            <a className="button button-secondary" onClick={this.handleReset.bind(this)}>Start Over</a>
          </div>
        );
      case AppState.AUTH_ERROR:
        return (
          <div>
            <h3>Step 5</h3>
            <p>Account Not Supported for Auth!</p>
            <p className="big-emoji">😱</p>
            <p>
              Wait! You're almost done, but there's one final step. You're now able to track a user's purchases of
              Reddit Gold on their AmEx card. However, in order for you to purchase real gold
              on the user's behalf, the user will still need to link a funding source. Plaid's Auth product makes
              it simple to support ACH payments, but these payments can only be made with checking or savings accounts. If a
              user (as in this case) has only linked a credit card account for tracking transactions, you can
              initialize Link with "Auth" instead of "Transactions" and have your user
              re-Link an Item with a different account as that funding source. Notice how only certain
              Financial Institutions show up when you initialize Link with "Auth"
              instead of "Transactions".
            </p>
            <a className="button button-secondary" onClick={this.handleReset.bind(this)}>Start Over</a>
          </div>
        );
      case AppState.AUTH_COMPLETED:
        return (
          <div>
            <h3>Finished</h3>
            <p>Account Authenticated!</p>
            <p>You've completed all the steps for a basic Plaid app, congrats!</p>
            <p className="big-emoji">🎉</p>
            <p>Now, go build something even better!</p>
            <a className="button button-primary" onClick={this.handleReset.bind(this)}>Start Over</a>
          </div>
        );
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
