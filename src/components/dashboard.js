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
    this.setState(

      // set state to include email and session_token from localStorage
      { email: localStorage.getItem('email'), session_token: localStorage.getItem('session_token') },

      // callback function after setting state
      () => {
        if (this.state.email != null && this.state.session_token != null) {
          // verify session token
          return fetch('https://notifyme.netlify.com/.netlify/functions/validate-session-token', {
            method: 'POST',
            body: JSON.stringify({ data: { username: this.state.email, session_token: this.state.session_token } })
          })
            .then(res => res.json())
            .then(json => {
              // if the session token is not valid, go back to the authentication page
              // console.log(json, json['data'])
              if (json['data']['is_valid']) {
                console.log('session_token valid, session has', json['data']['mins_left'], 'minutes left')
              }
              else {
                console.log(json['data']['message']);
                navigate("/authenticate/")
              }
              // console.log(json['data']); 
              // 

            })
            .catch(err => console.log(err))
        } else {
          navigate("/authenticate/")
        }
      }
    )
  }

  getEmail() {
    if (typeof window !== 'undefined') return localStorage.getItem('email')
    else return 'how are we here please explain gatsby'
  }

  render() {
    return (
      <div>

        <h1>Welcome to the dashboard, {this.state.email}!</h1>
        <h3>Get started with desktop notifications here:</h3>

        <div>
          <h4>Your webhook notification url is:</h4>
          <div className="url"> https://notifyme.netlify.com/.netlify/functions/notif?username={this.state.email}
            <button
              className="copybutton"
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://notifyme.netlify.com/.netlify/functions/notif?username=${this.state.email}`
                )
              }}>
              Copy to clipboard
            </button>
          </div>
        </div>

        <br /><br />

        <Webhookdisplay email={this.getEmail()}></Webhookdisplay>

        <br />

      </div>
    )
  }
}