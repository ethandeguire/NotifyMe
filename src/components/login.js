import React from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./../styles/login.css";
import axios from "axios";

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
    axios({
      method: 'post',
      url: 'https://notifyme.netlify.com/.netlify/functions/add-url-to-db',
      headers: { 'Content-Type': 'application/json' },
      data: {
        data: {
          'username': this.state.email.split('@')[0],
          'password': this.state.password,
          'email': this.state.email
        }
      }
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