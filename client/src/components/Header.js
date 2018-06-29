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
          <ul>
            <li>
              <a href="/" className="navbar-brand">
                Boilerplate App 💸⏱
              </a>
            </li>
            <li className="dashboard-link">
              <a href="https://dashboard.plaid.com/account/keys"
                target="_blank">
                Click here to get your API Keys
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Header;
