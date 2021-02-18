import React from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import { makeStyles, Button, Typography } from '@material-ui/core'
import { Main } from './components/main'

const useStyles = makeStyles({
   header: {
      fontSize: '20px',
      margin: '12px',
      color: '#ccc'
   },
   linkBtn: {
      margin: '12px'
   },
   saveBtn: {
      margin: '0 4px'
   }
})

function App() {
   const history = useHistory()
   const classes = useStyles()

   return (
      <div>
         <Switch>
            <Route exact="exact" path="/">
               <div>
                  <Typography className={classes.header}>Bookmarks management</Typography>

                  <Button color='secondary' id='saveBtn' className={classes.saveBtn}>Save Page</Button>

                  <Button color='secondary' onClick={() => history.push('/main')} className={classes.linkBtn}>Main View</Button>
               </div>
            </Route>

            <Route exact="exact" path="/main">
               <Main />
            </Route>
         </Switch>
      </div>
   )
}

export default App
