import React from 'react'
import { DateInput } from 'semantic-ui-calendar-react'
import { Form } from 'semantic-ui-react'

class DatePicker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      date: ''
    }
  }

  handleChange = (event, {name, value}) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value })
    }
  }

  render() {
    return (
      <Form.Field>
        <DateInput inline
          name="date"
          placeholder="Date"
          value={this.state.date}
          iconPosition="left"
          onChange={this.handleChange} />
      </Form.Field>
    );
  }
}

export default DatePicker
