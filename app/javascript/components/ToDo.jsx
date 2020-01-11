import React from "react";
import { Link } from "react-router-dom";
import Moment from 'react-moment';
import ToDoCard from './ToDoCard';

class ToDo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { to_do: { tags: [] } };

    //this.addHtmlEntities = this.addHtmlEntities.bind(this);
    this.deleteToDo = this.deleteToDo.bind(this);
    this.forceUpdate = this.forceUpdate.bind(this);
    this.fetchToDo = this.fetchToDo.bind(this);
    this.onToggleComplete = this.onToggleComplete.bind(this);
  }

  componentDidMount() {
    this.fetchToDo();
  }

  onToggleComplete() {
    //Updates database entry, then use callback to update to do list
    const url = `/api/v1/to_do/${this.state.to_do.id}`;
    const body = { completed: !this.state.to_do.completed };

    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch(url, {
      method: "PATCH",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        if(response.ok) {
          return response.json();
        }

        throw new Error("Network response was not ok");
      })
      .then(response => {
        this.fetchToDo();
      })
      .catch(error => console.log(error.message));
  }

  fetchToDo() {
    const {
      match: {
        params: { id }
      }
    } = this.props;

    const url = `/api/v1/to_do/${id}`;

    fetch(url)
      .then(response => {
        if(response.ok) {
          return response.json();
        }

        throw new Error("Network response was not ok")
      })
      .then(response => this.setState({ to_do: response }))
      .catch(() => this.props.history.push('/list'))
  }

  deleteToDo() {
    const {
      match: {
        params: { id }
      }
    } = this.props;
    const url = `/api/v1/to_do/${id}`;
    const token = document.querySelector('meta[name="csrf-token"]').content;

    fetch(url, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(() => this.props.history.push("/list"))
      .catch(error => console.log(error.message));
  }

  componentDidUpdate(prevProps) {
    const oldId = prevProps.match.params.id;
    const newId = this.props.match.params.id;
    if(newId !== oldId) {
      this.fetchToDo();
    }
  }

  render() {
    const { to_do } = this.state;

    let tags = [];
    if (to_do.tags) {
      tags = to_do.tags.map((tag, index) => (
        <button key={index} className="btn btn-secondary mx-1 my-3">{tag.tag}</button>
      ));
    }

    let subtasks = [];
    if(to_do.subtasks) {
      subtasks = to_do.subtasks.map((subtask, index) => (
        <div key={index} className="col-md-6 col-lg-4">
          <ToDoCard to_do={subtask} fetchToDos={this.fetchToDo}/>
        </div>
      ))
    }

    const completedHeader = (
      <div className="row">
        <div className="col bg-success">
          <h4>Completed</h4>
        </div>
      </div>
    );

    const completeButton = (
      <button className="btn btn-success" onClick={this.onToggleComplete}>
        Complete
      </button>
    );

    const notCompleteButton = (
      <button className="btn btn-danger" onClick={this.onToggleComplete}>
        Undo Complete
      </button>
    )

    return (
      <div className="">
        <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="deleteModalTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deleteModalTitle">Are you sure you want to delete this to do?</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                All subtasks will also be deleted
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this.deleteToDo}>Delete</button>
              </div>
            </div>
          </div>
        </div>

        <div className="hero position-relative d-flex align-items-center justify-content-center">
          <div className="overlay bg-dark position-absolute" />
          <h1 className="display-4 position-relative text-black">
            {to_do.title}
          </h1>
        </div>
        <div className="container-fluid">
          <div className="text-center my-3">
            {to_do.completed ? completedHeader : <></>}
          </div>
          <div className="row">
            <div className="col-md-2 offset-md-1">
              <div className="py-4 sticky-top">
                <ul className="nav flex-column">
                  <li className="nav-item my-2">
                    <Link to="/list" className="btn btn-info">
                      Back to To Do List
                    </Link>
                  </li>

                  <li className="nav-item my-2">
                    {to_do.completed ? notCompleteButton : completeButton}
                  </li>

                  <li className="nav-item my-2">
                    <Link to={"/update_to_do/"+to_do.id} className="btn btn-secondary">
                      Edit To Do
                    </Link>
                  </li>

                  <li className="nav-item my-2">
                    <Link to={`/new_to_do/${this.state.to_do.id}`} className="btn btn-secondary">
                      Add Subtask
                    </Link>
                  </li>

                  <li className="nav-item my-2">
                    <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#deleteModal">
                      Delete To Do
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-8">
              <h5 className="mb-2">Description</h5>
              <p className="mb-4 ml-3">{to_do.description}</p>
              <h5 className="mb-2">Start Date/Time</h5>
              <div className="mb-4 ml-3">
                <Moment format="DD MMM YYYY h:mm a">{to_do.start_date}</Moment>
              </div>
              <h5 className="mb-2">Due Date/Time</h5>
              <div className="mb-4 ml-3">
                <Moment format="DD MMM YYYY h:mm a">{to_do.due_date}</Moment>
              </div>
              <h5 className="mb-2">Priority</h5>
              <p className="mb-4 ml-3">{to_do.priority}</p>
              <h5 className="mb-2">Tags</h5>
              <div className="mb-4 ml-3">
                {tags.length > 0 ? tags : "No Tags"}
              </div>
              <h5 className="mb-2">Subtasks</h5>
              <div className="row mb-4 ml-2">
                {subtasks.length > 0 ? subtasks : "No Subtasks"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ToDo;
