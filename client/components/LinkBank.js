import React from 'react'
import Plaid from './plaidLink'
import {Segment, Grid} from 'semantic-ui-react'

const LinkBank = () => {
  return (
    <Grid centered>
      <Grid.Row className="link-row">
        <Segment padded="very">
          <Plaid />
        </Segment>
      </Grid.Row>
    </Grid>
  )
}

export default LinkBank
