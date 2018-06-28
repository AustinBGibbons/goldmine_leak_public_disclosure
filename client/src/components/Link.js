import React, { Component } from 'react';
import PlaidLink from 'react-plaid-link';
import axios from 'axios';

class Link extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.toggleBankConnection = this.props.toggleBankConnection;
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
    this.toggleBankConnection();
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
        product={['transactions']}
        apiVersion='v2'
        webhook="https://webhook.site/bcd6817d-05d7-4aab-bcd2-ea86a2b7bf23"
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
