import React,{useState, useEffect} from 'react'
import {Switch, Route, useHistory} from 'react-router-dom'
import {makeStyles, Button, Typography} from '@material-ui/core'
import {Main} from './components/main.js'
const firebase=require('firebase')

const useStyles=makeStyles({
    header:{
        fontSize: '20px',
        margin: '12px',
        color: '#ccc'
    },
    linkBtn:{
        margin: '12px'
    }
})

function App(){
    const history=useHistory()
    const classes=useStyles()

     return(
         <div>
             <Switch>
                 <Route exact path="/">
                     <div>
                         <Typography className={classes.header}>Bookmarks management</Typography>

                         <Button
                             variant='outlined'
                             color='secondary'
                             onClick={()=>history.push('/main')}
                             className={classes.linkBtn}>Main View</Button>
                     </div>
                 </Route>
                 <Route path="/main">
                     <Main/>
                 </Route>
             </Switch>
         </div>
     )
}

export default App
