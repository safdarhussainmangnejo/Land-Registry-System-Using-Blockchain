import { Grid } from '@material-ui/core'
import React from 'react'
import Requests from './Requests'

export default function InspectorDashboard({web3}) {
  return (
    <Grid container>
        <Grid item xs={12}>
            <Requests  web3={web3}/>
        </Grid>
    </Grid>
  )
}
