import React from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
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
    // attempt login
    // if valid:
    // store validation key and other data in FaunaDB
    // store validation key in session data 
    // redirect to user dashboard page
    // if not valid:
    // return login failed

    // attempt login
    fetch('https://notifyme.netlify.com/.netlify/functions/validate_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          data: {
            'username': this.state.email,
            'password': this.state.password
          }
        }
      ),
    })
      .then((result) => { // VALID
        console.log(result)
        console.log('session_token:', result.data.data.session_token)
        localStorage.setItem('session_token', result.data.data.session_token);
      })
      .catch((error) => { // INVALID LOGIN
        console.log(error)
        localStorage.setItem('error', JSON.stringify(error));
        // display a pretty 'invalid login' thing, offer to signup
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