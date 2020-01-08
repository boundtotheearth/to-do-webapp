import React from 'react';
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

class CreateToDoForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      title: "",
      description: "",
      start_date: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
      due_date: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
      priority: "0",
      tags: [],
      new_tag: "",
      supertask_id: (this.props.match.params.id ? this.props.match.params.id : null)
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleDueDateChange = this.handleDueDateChange.bind(this);
    this.handlePriorityChange = this.handlePriorityChange.bind(this);
    this.handleTagAdd = this.handleTagAdd.bind(this);
    this.handleTagDelete = this.handleTagDelete.bind(this);
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

  handlePriorityChange(priority) {
    this.setState({ priority: priority });
  }

  handleTagAdd() {
    const tags = this.state.tags.slice();
    tags.push(this.state.new_tag);
    this.setState({ tags: tags, new_tag: "" });
  }

  handleTagDelete(tag) {
    const tags = this.state.tags.slice();
    tags.splice(tags.indexOf(tag), 1);
    this.setState({ tags: tags });
  }

  componentDidMount() {
    //console.log(this.state.supertask_id);
    /*
    const {
      match: {
        params: { id }
      }
    } = this.props;
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
          priority: response.priority,
          tags: response.tags.map(tag => tag.tag),
          method: "PATCH"
        }))
        .catch(() => this.props.history.push('/list'))
    }
    */
  }

  onSubmit(event) {
    event.preventDefault();
    const url = "/api/v1/to_do/" + (this.state.id ? this.state.id : "");
    const { title, description, start_date, due_date, priority, tags, supertask_id } = this.state;
    if(title.length == 0 || description.length == 0 || start_date.length == 0 || due_date.length == 0) {
      return;
    }
    console.log(supertask_id);
    const body = {title, description, start_date, due_date, priority, tags, supertask_id};

    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch(url, {
      method: "POST",
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
    const { tags } = this.state
    const displayed_tags = tags.map((tag, index) => (
      <div key={index} className="mb-2">
        <button className="btn btn-danger" onClick={() => this.handleTagDelete(tag)}>X</button>
        <button className="btn btn-secondary">{tag}</button>
      </div>
    ))

    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-12 col-lg-6 offset-lg-3">
            <h1 className="font-weight-normal mb-4">
              Add a To Do:
            </h1>
            <form onSubmit={this.onSubmit} noValidate>
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

              <div className="form-group">
                <label>Priority</label><br></br>
                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                  <label className="btn btn-success active">
                    <input type="radio" name="priority" value="0" id="lowOption" onClick={this.onChange}/> Low
                  </label>
                  <label className="btn btn-warning">
                    <input type="radio" name="priority" value="1" id="medOption" onClick={this.onChange}/> Medium
                  </label>
                  <label className="btn btn-danger">
                    <input type="radio" name="priority" value="2" id="highOption" onClick={this.onChange}/> High
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="newToDoTag">Tags</label>
                <div>
                  {displayed_tags}
                </div>
                <input
                  type="text"
                  name="new_tag"
                  value={this.state.new_tag}
                  id="newToDoTag"
                  className="form-control"
                  required
                  onChange={this.onChange}
                />
                <button type="button" className="btn btn-success" onClick={this.handleTagAdd}>Add Tag</button>
              </div>

              <button type="submit" className="btn btn-success mt-3 mr-3">
                Done
              </button>
              <Link to="/list" className="btn btn-info mt-3">
                Back to To Do List
              </Link>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateToDoForm;
