import React from "react";
import { Link } from "react-router-dom";
import Moment from 'react-moment';

class ToDo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { to_do: {} };

    //this.addHtmlEntities = this.addHtmlEntities.bind(this);
    this.deleteToDo = this.deleteToDo.bind(this);
  }

  componentDidMount() {
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

  render() {
    const { to_do } = this.state;

    return (
      <div className="">
        <div className="hero position-relative d-flex align-items-center justify-content-center">
          <div className="overlay bg-dark position-absolute" />
          <h1 className="display-4 position-relative text-black">
            {to_do.title}
          </h1>
        </div>
        <div className="container py-5">
          <div className="row">
            <div className="col-sm-12 col-lg-7">
              <h5 className="mb-2">Description</h5>
              <p>{to_do.description}</p>
              <h5 className="mb-2">Start Date</h5>
              <Moment format="DD MMM YYYY h:mm a">{to_do.start_date}</Moment>
              <h5 className="mb-2">Due Date</h5>
              <Moment format="DD MMM YYYY h:mm a">{to_do.due_date}</Moment>
            </div>
            <div className="col-sm-12 col-lg-2">
              <button type="button" className="btn btn-danger" onClick={this.deleteToDo}>
                Delete To Do
              </button>
            </div>
          </div>
          <Link to="/list" className="btn btn-secondary">
            Back to To Do List
          </Link>
          <Link to={"/update_to_do/"+to_do.id} className="btn btn-secondary">
            Edit To Do
          </Link>
        </div>
      </div>
    );
  }
}

export default ToDo;
