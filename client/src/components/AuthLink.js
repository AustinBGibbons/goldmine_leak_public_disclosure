import React, { Component } from 'react';
import PlaidLink from 'react-plaid-link';
import axios from 'axios';

class AuthLink extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    // These functions are run after a successful Item Creation
    // through Link.
    this.getAuth = this.props.getAuth;

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

    // We're setting user_id to 2 becuase that's the id that corresponds
    // to the Item in our database that's enabled for Auth.
    const user_id = 2;
    this.getAuth(user_id);
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
        publicKey={this.props.public_key}
        product={['auth']}
        apiVersion='v2'
        webhook={this.props.webhook}
        onEvent={this.handleOnEvent}
        onExit={this.handleOnExit}
        onLoad={this.handleOnLoad}
        onSuccess={this.handleOnSuccess}
        className="link-button"
      >
        Launch Auth-initialized Plaid Link!
      </PlaidLink>
    );
  }
}

export default AuthLink;
