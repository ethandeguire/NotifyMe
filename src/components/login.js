import React from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { Redirect } from 'react-router-dom';
import "./../styles/login.css";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };
  }

  mySubmitHandler = (event) => {
    event.preventDefault();

    // send request
    fetch('https://notifyme.netlify.com/.netlify/functions/validate-user', {
      method: 'POST',
      headers: { 'username': this.state.email, 'password': this.state.password }
    })
      .then(response => response.json())
      .then(res => {
        if (res["error"]) throw new Error(res["error"])
        console.log('session_token:', res["data"]["session_token"])
        localStorage.setItem('session_token', res["data"]["session_token"])
      })
      .catch((error) => {
        console.log("an error occured:", error)
      })

  }

  myChangeHandler = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  render() {
    return (
      <form onSubmit={this.mySubmitHandler} className="container">
        <div className="input">
          Email
          <input
            className="input"
            type='text'
            id='email'
            onChange={this.myChangeHandler}
          />
        </div>


        <div className="input">
          Password
          <input
            className="input"
            type='text' // type='password'
            id='password'
            onChange={this.myChangeHandler}
          />
        </div>

        <input
          className="button"
          type='submit'
        />
      </form>
    );
  }
}