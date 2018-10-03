import React from 'react'
import {Form, Grid, Card, Button, Label} from 'semantic-ui-react'
import {connect} from 'react-redux'

class EditBudget extends React.Component {
	handleSubmit = (event) => {
		const formInfo = {
			totalAmount: Number(event.target.totalAmount.value),
			monthlyExpenses: Number(event.target.monthlyExpenses.value),
			shops: Number(event.target.shops.value),
			travel: Number(event.target.travel.value),
			recreation: Number(event.target.recreation.value),
			savings: Number(event.target.savings.value),
			foodAndDrink: Number(event.target.foodAndDrink.value)
		}
		formInfo.other = formInfo.totalAmount - formInfo.monthlyExpenses - formInfo.shops - formInfo.travel - formInfo.recreation - formInfo.savings - formInfo.foodAndDrink
		
	}
	render () {
		return (
		      <div>
      <h1 />
      <Grid centered>
      <Grid.Column centered width={5}>
      <Card fluid centered color="white">
      <Label size="massive" color="blue">Edit Budget</Label>
      <h1 />
      <Form onSubmit={this.handleSubmit}>
      <Form.Field className="padding-large">
        <label>Total Budget Amount:</label>
        <input placeholder='Total Amount' name='totalAmount'/>
      </Form.Field>
      <br />
      <Form.Field className="padding-large">
        <label>Monthly Expenses:</label>
        <input placeholder='Monthly Expenses' name='monthlyExpenses'/>
      </Form.Field>     
      <br />
            <br />
      <Form.Field className="padding-large">
        <label>Shopping:</label>
        <input placeholder='Shopping' name='shops'/>
      </Form.Field>     
      <br />
            <br />
      <Form.Field className="padding-large">
        <label>Travel:</label>
        <input placeholder='Travel' name='travel'/>
      </Form.Field>     
      <br />
            <br />
      <Form.Field className="padding-large">
        <label>Recreation:</label>
        <input placeholder='Recreation' name='recreation'/>
      </Form.Field>     
      <br />
            <br />
      <Form.Field className="padding-large">
        <label>Savings:</label>
        <input placeholder='Savings' name='savings'/>
      </Form.Field>     
      <br />
            <br />
      <Form.Field className="padding-large">
        <label>Food:</label>
        <input placeholder='Food' name='foodAndDrink'/>
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

export default EditBudget