import React from "react";
import { Link } from "react-router-dom";

class ToDoCard extends React.Component {
  render() {
    return (
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{this.props.to_do.title}</h5>

          <p className="card-text">{this.props.to_do.description}</p>

          <Link to={`/to_do/${this.props.to_do.id}`} className="btn custom-button">
            View To Do
          </Link>
        </div>
      </div>
    )
  }
}

export default ToDoCard;
