import React, { Component } from 'react';
import PlaidLink from 'react-plaid-link';
import axios from 'axios';

class Link extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    // These functions are run after a successful Item Creation
    // through Link.
    this.initializeBankAccount = this.props.initializeBankAccount;

    // These functions are Link callbacks.
    this.handleOnExit = this.handleOnExit.bind(this);
    this.handleOnSuccess = this.handleOnSuccess.bind(this);
    this.handleOnEvent = this.handleOnEvent.bind(this);
    this.handleOnLoad = this.handleOnLoad.bind(this);
  }

  async handleOnSuccess(public_token, metadata) {
    await axios({
      url: '/exchange_token',
      method: 'post',
      data: {
        public_token,
        metadata,
      }
    });
    const account_name = metadata.account.name;
    const mask = metadata.account.mask;

    this.initializeBankAccount(account_name, mask);
  }

  async handleOnEvent(eventName, metadata) {
    console.log(eventName, metadata);
  }

  async handleOnExit(error, metadata) {
    console.log('link: user exited');
    console.log(error, metadata);
  }

  async handleOnLoad() {
    console.log('link: loaded');
  }

  render() {
    return(
      <PlaidLink
        clientName="Boilerplate"
        env="sandbox"
        institution={null}
        publicKey="c53a213ab2d73e2c0376babf83bd3b"
        product={['transactions', 'auth']}
        apiVersion='v2'
        webhook="http://1f5643ee.ngrok.io/webhook"
        onEvent={this.handleOnEvent}
        onExit={this.handleOnExit}
        onLoad={this.handleOnLoad}
        onSuccess={this.handleOnSuccess}
      >
        Connect your bank account using Plaid Link!
      </PlaidLink>
    );
  }
}

export default Link;
