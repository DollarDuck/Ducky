import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Form, Button, Grid, Card, Label} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {updateUserInfo} from '../store/user'
import {auth} from '../store'
import {convertPhoneNumber} from '../../utils'

const mapDispatchToProps = (dispatch) => ({
  updateUserInfo: (userInfo) => dispatch(updateUserInfo(userInfo))
})

class EditUser extends Component {
  constructor(props) {
    super(props)
    this.state = ({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      id: ''
    })
  }
  componentDidMount() {
      const id = this.props.match.params.userId
      this.setState({ id: id})
  }
  handleMessage = event => {
    let stateChange = {};
    stateChange[event.target.name] = event.target.value;
    this.setState(stateChange)
  }
  handleSubmit = async (event) => {
      event.preventDefault();
      const updateInfo = {}
      for(let key in this.state) {
        if(this.state[key]) updateInfo[key] = this.state[key]
      }
      await this.props.updateUserInfo(updateInfo)
      this.props.history.push('/userProfile')
  }
  render() {
    const handleSubmit = this.props.handleSubmit
    return(
      <div>
      <h1 />
      <Grid centered>
      <Grid.Column width={5}>
      <Card fluid centered>
      <Label size="massive" color="blue">Edit User Information</Label>
      <h1 />
      <Form onSubmit={this.handleSubmit}>
      <Form.Field className="padding-large">
        <label>Edit First Name:</label>
        <input placeholder='First Name' name='firstName' onChange={this.handleMessage} />
      </Form.Field>
      <br />
      <Form.Field className="padding-large">
        <label>Edit Last Name:</label>
        <input placeholder='Last Name' name='lastName' onChange={this.handleMessage} />
      </Form.Field>
      <br />
      <Form.Field className="padding-large">
        <label>Edit Email:</label>
        <input placeholder='Email' name='email' onChange={this.handleMessage} />
      </Form.Field>
      <br />
      <Form.Field className="padding-large">
        <label>Edit Mobile Number:</label>
        <input placeholder='xxx-xxx-xxxx' name='phoneNumber' onChange={this.handleMessage}/>
      </Form.Field>
      <br />
      <br />
      <Button fluid color="blue" type='submit'>Submit</Button>
      </Form>
      </Card>
      </Grid.Column>
      </Grid>
      </div>
    )
  }
}



export default connect(null, mapDispatchToProps)(EditUser)
