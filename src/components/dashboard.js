import React from "react";
import { navigate } from 'gatsby';
import "./../styles/login.css";
import "./../styles/buttons.css";

export default class dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '' };
  }

  componentDidMount() {
    this.setState((state)=> this.state.email = localStorage.getItem('email'))
    console.log('email:', this.state.email)
  }

  render() {
    return (
      <div>
        <h4>Your webhook notification url is:</h4>
        <div className="url"> https://notifyme.netlify.com/.netlify/functions/notif?{this.state.email+=''}
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
    )
  }
}