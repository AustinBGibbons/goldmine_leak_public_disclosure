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

    this.initializeBankAccount();
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
        publicKey="2ca704caf9cd7b6d54fd1b1d6dfcd2"
        product={['transactions']}
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
