import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/Home";
import ToDoList from "../components/ToDoList";
import ToDo from "../components/ToDo";
import CreateToDoForm from "../components/CreateToDoForm";
import UpdateToDoForm from "../components/UpdateToDoForm";


export default (
  <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/list" exact component={ToDoList}/>
      <Route path="/to_do/:id" exact component={ToDo}/>
      <Route path="/new_to_do/:id?" exact component={CreateToDoForm}/>
      <Route path="/update_to_do/:id" exact component={UpdateToDoForm}/>
      <Route exact path='/login' component={}/>
      <Route exact path='/signup' component={}/>
    </Switch>
  </Router>
)
