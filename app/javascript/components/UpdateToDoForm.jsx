import React from 'react';
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import ToDoForm from "./ToDoForm";

class UpdateToDoForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { to_do: { tags: [] } }

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const id = this.props.match.params.id;

    const url = `/api/v1/to_do/${id}`;

    fetch(url)
      .then(response => {
        if(response.ok) {
          return response.json();
        }

        throw new Error("Network response was not ok")
      })
      .then(response => this.setState({ to_do: {
        id: response.id,
        title: response.title,
        description: response.description,
        start_date: response.start_date,
        due_date: response.due_date,
        priority: response.priority,
        tags: response.tags.map(tag => tag.tag),
      }}))
      .catch(() => this.props.history.push('/list'))
  }

  onSubmit(data) {
    const id = this.props.match.params.id;
    const url = "/api/v1/to_do/" + (id ? id : "");

    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch(url, {
      method: "PATCH",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
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
    //console.log(this.state.to_do);
    return (
      <ToDoForm onSubmit={this.onSubmit} to_do={this.state.to_do}/>
    )
  }
}

export default UpdateToDoForm;
