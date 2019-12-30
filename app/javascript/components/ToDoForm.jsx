import React from 'react';
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

class ToDoForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      title: "",
      description: "",
      start_date: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
      due_date: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
      method: "POST"
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleDueDateChange = this.handleDueDateChange.bind(this);

  }

  onChange(event) {
    console.log('on change');
    this.setState({ [event.target.name]: event.target.value});
  }

  handleStartDateChange(date) {
    this.setState({ start_date: moment.utc(date).format("YYYY-MM-DD HH:mm:ss") });
  }

  handleDueDateChange(date) {
    this.setState({ due_date: moment.utc(date).format("YYYY-MM-DD HH:mm:ss") });
  }

  componentDidMount() {
    const {
      match: {
        params: { id }
      }
    } = this.props;
    console.log(id);
    if(id) {
      const url = `/api/v1/to_do/${id}`;

      fetch(url)
        .then(response => {
          if(response.ok) {
            return response.json();
          }

          throw new Error("Network response was not ok")
        })
        .then(response => this.setState({
          id: response.id,
          title: response.title,
          description: response.description,
          start_date: response.start_date,
          due_date: response.due_date,
          method: "PATCH"
        }))
        .catch(() => this.props.history.push('/list'))
    }
  }

  onSubmit(event) {
    console.log("submit");
    event.preventDefault();
    const url = "/api/v1/to_do/" + (this.state.id ? this.state.id : "");
    const { title, description, start_date, due_date } = this.state;

    if(title.length == 0 || description.length == 0 || start_date.length == 0 || due_date.length == 0) {
      return;
    }

    const body = {title, description, start_date, due_date};
    console.log(start_date);
    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch(url, {
      method: this.state.method,
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
        this.props.history.push(`/to_do/${response.id}`);
      })
      .catch(error => console.log(error.message));
  }

  render() {
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-12 col-lg-6 offset-lg-3">
            <h1 className="font-weight-normal mb-5">
              Add a To Do:
            </h1>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="toDoTitle">Title</label>
                <input
                  type="text"
                  value={this.state.title}
                  name="title"
                  id="toDoTitle"
                  className="form-control"
                  required
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="toDoDescription">Description</label>
                <input
                  type="text"
                  value={this.state.description}
                  name="description"
                  id="toDoDescription"
                  className="form-control"
                  required
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label>Start Date</label><br></br>
                <DatePicker
                  selected={moment.utc(this.state.start_date).toDate()}
                  onChange={this.handleStartDateChange}
                  showTimeSelect
                  timeFormat="hh:mm aa"
                  timeIntervals={30}
                  dateFormat="dd MMM yyyy hh:mm aa"
                />
              </div>
              <div className="form-group">
                <label>Due Date</label><br></br>
                <DatePicker
                  selected={moment.utc(this.state.due_date).toDate()}
                  onChange={this.handleDueDateChange}
                  showTimeSelect
                  timeFormat="hh:mm"
                  timeIntervals={30}
                  dateFormat="dd MMM yyyy hh:mm aa"
                />
              </div>

              <button type="submit" className="btn custom-button mt-3">
                Done
              </button>
              <Link to="/list" className="btn btn-link mt-3">
                Back to To Do List
              </Link>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ToDoForm;
