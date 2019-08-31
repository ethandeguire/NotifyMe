import React from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { Redirect } from 'react-router-dom';
import "./../styles/login.css";

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    //steps:
    // attempt login
    // if valid:
    //  store validation key and other data in FaunaDB
    //  store validation key in session data 
    //  redirect to user dashboard page
    // if not valid:
    // return login failed

    console.log("STARTING FETCH NOW")
    fetch('https://notifyme.netlify.com/.netlify/functions/validate-user', {
      method: 'POST',
      headers: { 'username': 'ethandeguire', 'password': 'ethanpassword' }
    })
      .then(response => response.json())
      .then(res => {
        console.log('session_token:', res["data"]["session_token"])
        localStorage.setItem('session_token', res["data"]["session_token"])

      })
      .catch((error) => {
        console.log("ERROR:", error)
      })
    
  }

  render() {
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bssize="large">
            <FormLabel>Email</FormLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bssize="large">
            <FormLabel>Password</FormLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            bssize="large"
            disabled={!this.validateForm()}
            type="submit"
            className="button"
          >
            Login
          </Button>
        </form>
      </div>
    );
  }
}