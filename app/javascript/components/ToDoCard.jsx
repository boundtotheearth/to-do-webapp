import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";

class ToDoCard extends React.Component {
  constructor(props) {
    super(props);

    this.onToggleComplete = this.onToggleComplete.bind(this);
  }

  onToggleComplete() {
    //Updates database entry, then use callback to update to do list
    const { to_do } = this.props;
    const url = `/api/v1/to_do/${to_do.id}`;
    const body = { completed: !to_do.completed };

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
        this.props.fetchToDos();
      })
      .catch(error => console.log(error.message));
  }

  render() {
    const to_do = this.props.to_do;
    const due_date = moment.utc(to_do.due_date).format("YYYY-MM-DD HH:mm:ss")

    const completeButton = (
      <button className="btn btn-success" onClick={this.onToggleComplete}>
        Complete
      </button>
    );

    const notCompleteButton = (
      <button className="btn btn-danger" onClick={this.onToggleComplete}>
        Undo Complete
      </button>
    );
    //console.log(to_do.title + " " + to_do.completed);
    return (
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{to_do.title}</h5>

          <p className="card-text">{to_do.description}</p>
          <p className="card-text"><small className="text-muted">Due on: {due_date}</small></p>

          <Link to={`/to_do/${to_do.id}`} className="btn btn-secondary">
            View
          </Link>

          {to_do.completed ? notCompleteButton : completeButton}
        </div>
      </div>
    )
  }
}

export default ToDoCard;
