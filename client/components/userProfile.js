import React from 'react'
import {connect} from 'react-redux'
import {Card, Image, Grid, Button, Label} from 'semantic-ui-react'
import {Link} from 'react-router-dom'

const mapStateToProps = state => ({
	user: state.user
})
class UserProfile extends React.Component {
render() {
	const {user} = this.props
	return (
		<div>
		<h1 />
		<h1 />
		<Grid centered width={7}>
		<div className="max-width">
		<Card centered fluid>
			<Label fluid size="massive"><h1 className="font-header">User profile</h1></Label>
			<h1 />
			<Grid.Row>
			<Grid.Column width={1}>
			<Image className="img-sizing" src="profile.png" />
			</Grid.Column>
			<Grid.Column>
			<Grid.Column width={2}>
				<h3/>
					<h4 className="padding font-body">Name: {`${user.firstName} ${user.lastName}`}</h4>
			</Grid.Column>
			<Grid.Column width={2}>
					<h4 className="padding font-body">Email: {user.email}</h4>
			</Grid.Column>
			<Grid.Column width={2}>
					<h4 className="padding font-body">Phone number: {user.phoneNumber}</h4>
			</Grid.Column>
			</Grid.Column>
			</Grid.Row>
			<h1 />
			<Link className="white" to={`/editUser/${user.id}`}><Button fluid size="small">Edit User Info</Button></Link>
			<Link className="white" to="/plaid"><Button fluid color="purple">Link a new bank or credit card</Button></Link>
		</Card>
		</div>
		</Grid>
		</div>
	)
}
}

export default connect(mapStateToProps)(UserProfile)