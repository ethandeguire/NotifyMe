import React from "react";
import { navigate } from 'gatsby';
import "./../styles/login.css";
import "./../styles/buttons.css";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', errorbox: '' };
  
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
        // check if we recieved an error
        if (res["error"]) throw new Error(res["error"])

        // clear any error messages:
        this.setState((state) => ({ errorbox: '' }))

        localStorage.clear() // clear the current user info

        // store the user data into the dashboard
        localStorage.setItem('session_token', res["data"]["session_token"])
        localStorage.setItem('email', this.state.email)

        // send to the dashboard
        navigate("/dashboard/")
      })
      .catch((error) => {
        // console.log(error.message)
        // console.log(Object.keys(error), Object.values(error), JSON.stringify(error))
        if (error.message == "Password is incorrect for this user" || error.message == "Username does not exist") this.setState((state) => ({ errorbox: error.message }))
        // console.log("An unkown error occured:", typeof error , Object.keys(error))
        this.state.errorbox = error.message
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

        <p className="errorText">{this.state.errorbox}</p>

        <input
          className="purplebutton"
          type='submit'
        />


      </form>
    );
  }
}