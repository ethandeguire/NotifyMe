import React from "react";
import { navigate } from 'gatsby';
import "./../styles/login.css";
import "./../styles/buttons.css"

import Webhookdisplay from './webhookdisplay'


export default class dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    this.setState((state) => this.state.email = localStorage.getItem('email'))
  }



  render() {
    return (
      <div>

        <h1>Welcome to the dashboard, {this.state.email}!</h1>
        <h3>Get started with desktop notifications here:</h3>

        <div>
          <h4>Your webhook notification url is:</h4>
          <div className="url"> https://notifyme.netlify.com/.netlify/functions/notif?{this.state.email += ''}
            <button
              className="copybutton"
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://notifyme.netlify.com/.netlify/functions/notif?${this.state.email}`
                )
              }}>
              Copy to clipboard
            </button>
          </div>
        </div>

        <br /><br />

        <Webhookdisplay email={this.state.email}></Webhookdisplay>

        <br /><br />

      </div>
    )
  }
}