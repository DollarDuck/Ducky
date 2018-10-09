import React from 'react'
import {Grid, Card, Table} from 'semantic-ui-react'

export default class SplashPage extends React.Component {
	render() {
		return (
			<div className="background-home">
				<h1 />
				<h1 />
				<h1 />
				<h1 />
				<h1 />
				<Grid fluid verticalAlign="middle" centered>
				<Grid.Column verticalAlign="middle" width={12}>
                  	<h1 className="font">Planning your financial life is hard. We make it easier.</h1>
              		<h3 className="font">Track your monthly budget, connect your bank account to see your transaction history, plan for big purchases, and even check in to see if grad school is a smart financial decision.</h3>
              		<h3 className="font">Click the login or sign up link to get started!</h3>
				</Grid.Column>
				</Grid>
			</div>
		)
	}	
}