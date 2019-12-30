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
      sort_by: "Date Created"
    }

    this.onChangeSort = this.onChangeSort.bind(this);
    this.updateToDos = this.updateToDos.bind(this);
  }

  onChangeSort(sort_by) {
    //update component state to new sort option
    this.setState({ sort_by: sort_by }, () => this.updateToDos());
  }

  updateToDos() {
    //update the list of to_dos based on the sort and filter options in state
    let new_to_dos = [];

    switch(this.state.sort_by) {
      case "Date Created":
        new_to_dos = this.state.all_to_dos.slice().sort(
          (a, b) => moment(a.created_at) - moment(b.created_at)
        );
        break;
      case "Date Updated":
        new_to_dos = this.state.all_to_dos.slice().sort(
          (a, b) => moment(a.updated_at) - moment(b.updated_at)
        );
        break;
      case "Start Date":
        new_to_dos = this.state.all_to_dos.slice().sort(
          (a, b) => moment(a.start_date) - moment(b.start_date)
        );
        break;
      case "Due Date":
        new_to_dos = this.state.all_to_dos.slice().sort(
          (a, b) => moment(a.due_date) - moment(b.due_date)
        );
        break;
    }
    console.log(this.state.all_to_dos);
    console.log(new_to_dos);

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
                                        displayed_to_dos: response }));
      //.catch(() => this.props.history.push("/"))
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
              <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Sort By: {this.state.sort_by}
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <button className="dropdown-item" onClick={() => this.onChangeSort("Date Created")}>Date Created</button>
                <button className="dropdown-item" onClick={() => this.onChangeSort("Date Updated")}>Date Updated</button>
                <button className="dropdown-item" onClick={() => this.onChangeSort("Start Date")}>Start Date</button>
                <button className="dropdown-item" onClick={() => this.onChangeSort("Due Date")}>Due Date</button>

              </div>
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

export default ToDoList;
