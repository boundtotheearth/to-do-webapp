import React from "react";
import { Link } from "react-router-dom";
import ToDoCard from "./ToDoCard";
//import moment from 'moment';

class ToDoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_to_dos: [],
      displayed_to_dos: [],
      sort_by: "Date Updated",
      sort_direction: "Ascending",
      filter_by: "All",
      tag_list: [],
      show_subtasks: false,
      show_completed: false
    }

    this.onChangeSortBy = this.onChangeSortBy.bind(this);
    this.onChangeSortDirection = this.onChangeSortDirection.bind(this);
    this.updateToDos = this.updateToDos.bind(this);
    this.onToggleSubtasks = this.onToggleSubtasks.bind(this);
    this.onToggleCompleted = this.onToggleCompleted.bind(this);
    this.fetchToDos = this.fetchToDos.bind(this);
  }

  onChangeSortBy(sort_by) {
    //update component state to new sort option
    this.setState({ sort_by: sort_by }, () => this.updateToDos());
  }

  onChangeFilterBy(filter_by) {
    this.setState({ filter_by: filter_by }, () => this.updateToDos());
  }

  onChangeSortDirection() {
    //update component state to new sort option
    const new_direction = (this.state.sort_direction === "Ascending") ?
      "Descending" :
      "Ascending";
    this.setState({ sort_direction: new_direction }, () => this.updateToDos());
  }

  onToggleSubtasks() {
    this.setState({ show_subtasks: !this.state.show_subtasks }, () => this.updateToDos());
  }

  onToggleCompleted() {
    this.setState({ show_completed: !this.state.show_completed }, () => this.updateToDos());
  }

  updateToDos() {
    //update the list of to_dos based on the sort and filter options in state
    let new_to_dos = this.state.all_to_dos.slice();

    //Filter Subtasks
    if(!this.state.show_subtasks) {
      new_to_dos = new_to_dos.filter(to_do => {
          return !to_do.supertask_id
      })
    }

    //Filter show_completed
    if(!this.state.show_completed) {
      new_to_dos = new_to_dos.filter(to_do => {
          return !to_do.completed
      })
    }

    //Filter Tags
    if(this.state.filter_by !== "All") {
      new_to_dos = new_to_dos.filter(to_do => {
        if(to_do.tags) {
          return to_do.tags.map(tag => tag.tag).includes(this.state.filter_by);
        }

        return false;
      });
    }

    const direction = (this.state.sort_direction === "Ascending") ? 'asc' : 'desc';

    switch(this.state.sort_by) {
      case "Date Created":
        new_to_dos = new_to_dos.sort(
          compareValues('created_at', direction)
        );
        break;
      case "Date Updated":
        new_to_dos = new_to_dos.sort(
          compareValues('updated_at', direction)
        );
        break;
      case "Start Date":
        new_to_dos = new_to_dos.sort(
          compareValues('start_date', direction)
        );
        break;
      case "Due Date":
        new_to_dos = new_to_dos.sort(
          compareValues('due_date', direction)
        );
        break;
      case "Priority":
        new_to_dos = new_to_dos.sort(
          compareValues('priority', direction)
        );
        break;
    }

    this.setState({ displayed_to_dos: new_to_dos});
  }

  fetchToDos() {
    //Fetch to dos from database
    fetch("/api/v1/to_do/")
      .then(response => {
        if(response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.")
      })
      .then(response => this.setState({ all_to_dos: response,
                                        displayed_to_dos: response },
                                        () => this.updateToDos()))
      .catch(() => this.props.history.push("/"));

    //Fetch list of tags from database
    fetch("/api/v1/tag_list")
      .then(response => {
        if(response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.")
      })
      .then(response => this.setState({ tag_list: response }))
      .catch(() => this.props.history.push("/"));
  }

  componentDidMount() {
    this.fetchToDos();
  }

  render() {
    const { displayed_to_dos } = this.state;
    const to_dos = displayed_to_dos.map((to_do, index) => (
      <div key={index} className="col-md-6 col-lg-4">
        <ToDoCard to_do={to_do} fetchToDos={this.fetchToDos}/>
      </div>
    ));

    const no_to_do = (
      <div className="vw-100 vh-50 d-flex align-items-center justify-content-center">
        <h4>
          No to dos yet. Why not <Link to="/new_to_do">create one</Link>
        </h4>
      </div>
    );

    const tags = this.state.tag_list.map((tag, index) => (
      <button key={index} className="dropdown-item" onClick={() => this.onChangeFilterBy(tag)}>{tag}</button>
    ))

    return (
      <>
        <section className="jumbotron jumbotron-fluid text-center">
          <div className="container">
            <h1 className="display-4">To Do List</h1>
            <p className="lead text-muted">
              Lets get things done...
            </p>
          </div>
        </section>

        <div>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-2">
                <div className="py-4 sticky-top">
                  <ul className="nav flex-column">
                    <li className="nav-item my-2">
                      <Link to="/new_to_do" className="btn btn-primary btn-lg">
                        New To Do
                      </Link>
                    </li>

                    <li className="nav-item dropdown my-2">
                      <button className="btn btn-secondary dropdown-toggle"
                              type="button" id="sortByButton"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                      >
                        Sort By: {this.state.sort_by}
                      </button>
                      <div className="dropdown-menu" aria-labelledby="sortByButton">
                        <button className="dropdown-item" onClick={() => this.onChangeSortBy("Date Created")}>Date Created</button>
                        <button className="dropdown-item" onClick={() => this.onChangeSortBy("Date Updated")}>Date Updated</button>
                        <button className="dropdown-item" onClick={() => this.onChangeSortBy("Start Date")}>Start Date</button>
                        <button className="dropdown-item" onClick={() => this.onChangeSortBy("Due Date")}>Due Date</button>
                        <button className="dropdown-item" onClick={() => this.onChangeSortBy("Priority")}>Priority</button>
                      </div>
                    </li>

                    <li className="nav-item dropdown my-2">
                      <button type="button"
                              className="btn btn-secondary"
                              data-toggle="button"
                              aria-pressed="false"
                              onClick={() => this.onChangeSortDirection()}
                      >
                        Sort {this.state.sort_direction}
                      </button>
                    </li>

                    <li className="nav-item dropdown my-2">
                      <button className="btn btn-secondary
                              dropdown-toggle" type="button"
                              id="filterByButton"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                      >
                        Filter By Tag: {this.state.filter_by}
                      </button>
                      <div className="dropdown-menu" aria-labelledby="filterByButton">
                        <button className="dropdown-item"
                                onClick={() => this.onChangeFilterBy('All')}
                        >
                        All
                        </button>
                        {tags}
                      </div>
                    </li>

                    <li className="nav-item my-2">
                      <button type="button"
                              className="btn btn-secondary"
                              data-toggle="button"
                              aria-pressed="false"
                              onClick={this.onToggleSubtasks}
                      >
                        {(this.state.show_subtasks) ? "Hide Subtasks" : 'Show Subtasks'}
                      </button>
                    </li>

                    <li className="nav-item my-2">
                      <button type="button"
                              className="btn btn-secondary"
                              data-toggle="button"
                              aria-pressed="false"
                              onClick={this.onToggleCompleted}
                      >
                        {(this.state.show_completed) ? "Hide Completed" : 'Show Completed'}
                      </button>
                    </li>

                    <li className="nav-item my-2">
                      <Link to="/" className="btn btn-info">
                        Home
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-md-10">
                <div className="row">
                  {to_dos.length > 0 ? to_dos : no_to_do}
                </div>
              </div>

            </div>
          </div>
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
