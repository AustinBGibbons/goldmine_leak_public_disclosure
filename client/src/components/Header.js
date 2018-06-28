import React, { Component } from 'react';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div>
            <p className="navbar-brand" href="#">
              Boilerplate App 💸⏱
            </p>
            <a className="dashboard-link"
               href="https://dashboard.plaid.com/account/keys"
               target="_blank">
              Click here to get your API Keys
            </a>
          </div>
        </nav>
      </div>
    );
  }
}

export default Header;
