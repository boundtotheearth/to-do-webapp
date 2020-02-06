import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      errors: ''
     };
  }
  handleChange = (event) => {
    const {name, value} = event.target;
    this.setState({
      [name]: value
    });
  };
  handleSubmit = (event) => {
    event.preventDefault()
    const {username, email, password, password_confirmation} = this.state;

    let user = {
      username: username,
      email: email,
      password: password,
      password_confirmation: password_confirmation
    }
    const url = '/users';
    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch(url, {
      method: "POST",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
    .then(response => {
      if(response.ok) {
        console.log("ok");
        return response.json();
      }
      throw new Error("Network response was not ok.")
    })
    .then(response => {
      console.log(response.status);
      if(response.status === 'created') {
        this.props.handleLogin(response);
        this.redirect();
      } else {
        this.setState({
          errors: response.errors
        })
      }
    })
    .catch(error => console.log('api errors:', error))
  };

  redirect = () => {
    console.log("here");
    this.props.history.push('/list');
  }

  handleErrors = () => {
    return (
      <div>
        <ul>{this.state.errors.map((error) => {
          return <li key={error}>{error}</li>
        })}
        </ul>
      </div>
    )
  }

  render() {
    const {username, email, password, password_confirmation} = this.state;

    return (
      <div className="vw-100 vh-300 primary-color d-flex align-items-center justify-content-center">
        <div className="jumbotron jumbotron-fluid bg-transparent">
          <div className="container secondary-color">
            <div className="row">
              <h1 className="display-4">Sign Up</h1>
            </div>
            <div className="row">
              <div className="col">
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      name="username"
                      className="form-control"
                      value={username}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="text"
                      name="email"
                      className="form-control"
                      value={email}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={password}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password_confirmation">Re-enter Password</label>
                    <input
                      type="password"
                      name="password_confirmation"
                      className="form-control"
                      value={password_confirmation}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="row">
                    <button className="btn btn-primary" placeholder="submit" type="submit">
                      Sign Up
                    </button>
                    <h5 className="mx-3">or</h5>
                    <Link to='/' className="btn btn-secondary" role="button">Back to Login</Link>
                  </div>
                 </form>
               </div>
               <div>
                {
                  this.state.errors ? this.handleErrors() : null
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Signup;
