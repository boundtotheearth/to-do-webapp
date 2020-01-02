import React from "react";
import { Link } from "react-router-dom";
import ToDoCard from "./ToDoCard";
import moment from 'moment';

class ToDoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_to_dos: [],
      displayed_to_dos: [],
      sort_by: "Date Updated",
      sort_direction: "Ascending"
    }

    this.onChangeSortBy = this.onChangeSortBy.bind(this);
    this.onChangeSortDirection = this.onChangeSortDirection.bind(this);
    this.updateToDos = this.updateToDos.bind(this);
  }

  onChangeSortBy(sort_by) {
    //update component state to new sort option
    this.setState({ sort_by: sort_by }, () => this.updateToDos());
  }

  onChangeSortDirection() {
    //update component state to new sort option
    const new_direction = (this.state.sort_direction === "Ascending") ?
      "Descending" :
      "Ascending";
    this.setState({ sort_direction: new_direction }, () => this.updateToDos());
  }

  updateToDos() {
    //update the list of to_dos based on the sort and filter options in state
    let new_to_dos = [];
    const direction = (this.state.sort_direction === "Ascending") ? 'asc' : 'desc';

    switch(this.state.sort_by) {
      case "Date Created":
        new_to_dos = this.state.all_to_dos.slice().sort(
          compareValues('created_at', direction)
        );
        break;
      case "Date Updated":
        new_to_dos = this.state.all_to_dos.slice().sort(
          compareValues('updated_at', direction)
        );
        break;
      case "Start Date":
        new_to_dos = this.state.all_to_dos.slice().sort(
          compareValues('start_date', direction)
        );
        break;
      case "Due Date":
        new_to_dos = this.state.all_to_dos.slice().sort(
          compareValues('due_date', direction)
        );
        break;
      case "Priority":
        new_to_dos = this.state.all_to_dos.slice().sort(
          compareValues('priority', direction)
        );
        break;
    }

    this.setState({ displayed_to_dos: new_to_dos});
  }

  componentDidMount() {
    const url = "/api/v1/to_do/";
    fetch(url)
      .then(response => {
        if(response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.")
      })
      .then(response => this.setState({ all_to_dos: response,
                                        displayed_to_dos: response }))
      .catch(() => this.props.history.push("/"));
  }

  render() {
    const { displayed_to_dos } = this.state;
    const to_dos = displayed_to_dos.map((to_do, index) => (
      <div key={index} className="col-md-6 col-lg-4">
        <ToDoCard to_do={to_do} />
      </div>
    ));

    const no_to_do = (
      <div className="vw-100 vh-50 d-flex align-items-center justify-content-center">
        <h4>
          No to dos yet. Why not <Link to="/new_to_do">create one</Link>
        </h4>
      </div>
    );

    return (
      <>
        <section className="jumbotron jumbotron-fluid text-center">
          <div className="container py-5">
            <h1 className="display-4">To Do List</h1>
            <p className="lead text-muted">
              Lets get things done...
            </p>
          </div>
        </section>
        <div className="py-5">
          <main className="container">
            <div className="text-left mb-3">
              <Link to="/new_to_do" className="btn btn-primary">
                Create New To Do
              </Link>
            </div>
            <div className="dropdown">
              <button className="btn btn-secondary dropdown-toggle" type="button" id="sortByButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Sort By: {this.state.sort_by}
              </button>
              <div className="dropdown-menu" aria-labelledby="sortByButton">
                <button className="dropdown-item" onClick={() => this.onChangeSortBy("Date Created")}>Date Created</button>
                <button className="dropdown-item" onClick={() => this.onChangeSortBy("Date Updated")}>Date Updated</button>
                <button className="dropdown-item" onClick={() => this.onChangeSortBy("Start Date")}>Start Date</button>
                <button className="dropdown-item" onClick={() => this.onChangeSortBy("Due Date")}>Due Date</button>
                <button className="dropdown-item" onClick={() => this.onChangeSortBy("Priority")}>Priority</button>
              </div>
            </div>
            <div>
              <button type="button" className="btn btn-secondary" data-toggle="button" aria-pressed="false" onClick={() => this.onChangeSortDirection()}>
                {this.state.sort_direction}
              </button>
            </div>
            <div className="row">
              {to_dos.length > 0 ? to_dos : no_to_do}
            </div>
            <Link to="/" className="btn btn-secondary">
              Home
            </Link>
          </main>
        </div>
      </>
    );
  }
}

function compareValues(key, order = 'asc') {
  return function innerSort(a, b) {
    if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if(varA > varB) {
      comparison = 1;
    } else if(varA < varB) {
      comparison = -1;
    }

    return (
      (order === 'desc') ? comparison * -1 : comparison
    );
  };
}

export default ToDoList;
