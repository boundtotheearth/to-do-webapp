import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);
    if(this.props.loggedInStatus) {
      this.props.history.push("/list");
    }
    this.state = {
      username: '',
      email: '',
      password: '',
      errors: ''
    };
  }

  handleChange = (event) => {
    const {name, value} = event.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const {username, email, password} = this.state;

    let user = {
      username: username,
      email: email,
      password: password
    }
    const url = '/login';
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
        return response.json();
      }
      throw new Error("Network response was not ok.")
    })
    .then(response => {
      if(response.logged_in) {
        this.props.handleLogin(response);
        this.redirect();
      } else {
        this.setState({
          errors: response.errors
        })
      }
    })
    .catch(error => console.log('api errors:', error))
  }

  redirect = () => {
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
    const {username, email, password} = this.state;

    return (
      <div>
        <h1>Log In</h1>
        <form onSubmit={this.handleSubmit}>
          <input
            placeholder="username"
            type="text"
            name="username"
            value={username}
            onChange={this.handleChange}
          />
          <input
            placeholder="email"
            type="text"
            name="email"
            value={email}
            onChange={this.handleChange}
          />
          <input
            placeholder="password"
            type="password"
            name="password"
            value={password}
            onChange={this.handleChange}
          />
         <button placeholder="submit" type="submit">
            Log In
          </button>
          <div>
            or <Link to='/signup'>sign up</Link>
          </div>

         </form>
         <div>
          {
            this.state.errors ? this.handleErrors() : null
          }
        </div>
      </div>
    );
  }
}

export default Login;
