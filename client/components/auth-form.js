import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {auth} from '../store'
import {Grid, Form, Label, Card, Button} from 'semantic-ui-react'

/**
 * COMPONENT
 */
const AuthForm = props => {
  const {name, displayName, handleSubmit, error} = props
      return(
      <div>
      <h1 />
      <Grid centered>
      <Grid.Column centered width={5}>
      <Card fluid centered color="white">
      <Label size="massive" color="blue">Login</Label>
      <h1 />
      <Form onSubmit={handleSubmit} name={name}>
      <Form.Field className="padding-large">
        <label>Email:</label>
        <input placeholder='Email' name='email'/>
      </Form.Field>
      <br />
      <Form.Field className="padding-large">
        <label>Password:</label>
        <input placeholder='password' name='password' type='password'/>
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

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(auth(email, password, formName))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
