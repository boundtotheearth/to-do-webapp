import React from 'react';
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import ToDoForm from "./ToDoForm";

class CreateToDoForm extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(data) {
    const id = this.props.match.params.id;
    const url = "/api/v1/to_do/";
    data.supertask_id = id;

    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch(url, {
      method: "POST",
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
    return (
      <ToDoForm onSubmit={this.onSubmit}/>
    )
  }
}

export default CreateToDoForm;
