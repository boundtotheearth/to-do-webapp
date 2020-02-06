import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/Home";
import Login from "../components/Login";
import Signup from "../components/Signup";
import ToDoList from "../components/ToDoList";
import ToDo from "../components/ToDo";
import CreateToDoForm from "../components/CreateToDoForm";
import UpdateToDoForm from "../components/UpdateToDoForm";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      user: {}
    };
  }

  handleLogin = (data) => {
    this.setState({
      isLoggedIn: true,
      user: data.user
    })
  }

  handleLogout = () => {
    this.setState({
      isLoggedIn: false,
      user: {}
    })
  }

  loginStatus = () => {
    //fetch?
    const url = '/logged_in'
    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch(url, {
      method: "GET",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      if(response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.")
    })
    .then(response => {
      if (response.logged_in) {
        this.handleLogin(response);
      } else {
        this.handleLogout();
      }
    })
    .catch(error => console.log('api errors:', error))
  }

  componentDidMount() {
    this.loginStatus();
  }

  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route path='/' exact render={props => (
              <Home {...props}
                handleLogin={this.handleLogin}
                handleLogout={this.handleLogout}
                loggedInStatus={this.state.isLoggedIn}
              />)}
            />
            <Route path="/list" exact render={props => (
              <ToDoList {...props}
                handleLogout={this.handleLogout}
              />)}
            />
            <Route path="/to_do/:id" exact component={ToDo}/>
            <Route path="/new_to_do/:id?" exact component={CreateToDoForm}/>
            <Route path="/update_to_do/:id" exact component={UpdateToDoForm}/>
            <Route path='/login' exact render={props => (
              <Login {...props}
                handleLogin={this.handleLogin}
                loggedInStatus={this.state.isLoggedIn}
              />)}
            />
            <Route path='/signup' exact render={props => (
              <Signup {...props}
                handleLogin={this.handleLogin}
                loggedInStatus={this.state.isLoggedIn}
              />)}
            />
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App;
