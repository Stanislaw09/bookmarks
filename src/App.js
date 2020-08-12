import React,{useState, useEffect} from 'react'
import {Tabs, Tab, makeStyles} from '@material-ui/core'
import {Quotes} from './quotes'
import {Pages} from './pages'
const firebase=require('firebase')

const useStyles=makeStyles({
    header:{
        backgroundColor: '#87277e'
    },
    caption:{
        color: '#e9e9e9',
        fontSize: '20px',
        fontWeight: '500',
        margin: '6px 20px'
    }
})

function App(){
    const[quotes, setQuotes]=useState(undefined)
    const[pages, setPages]=useState(undefined)
    const[value, setValue]=useState(0)
    const classes=useStyles()

    useEffect(()=>{
        firebase
            .firestore()
            .collection('quotes')
            .onSnapshot(serverUpdate=>{
                const _quotes=serverUpdate.docs.map(item=>{
                    const data=item.data()
                    data['id']=item.id
                    return data
                })
                setQuotes(_quotes)
            })

        firebase
            .firestore()
            .collection('websites')
            .onSnapshot(serverUpdate=>{
                const _pages=serverUpdate.docs.map(item=>{
                    const data=item.data()
                    data['id']=item.id
                    return data
                })
                setPages(_pages)
            })
    },[])

    const handleChange=(event, newValue)=>setValue(newValue)

    const TabPanel=props=>{
        return(
            <div hidden={props.value!==props.index} role="tabpanel">
                {props.children}
            </div>
        )
    }

     return (
        <div>
            <Tabs centered onChange={handleChange} className={classes.header}>
                <Tab label='Quotes' className={classes.caption}/>
                <Tab label='Pages' className={classes.caption}/>
            </Tabs>

            <TabPanel value={value} index={0} className={classes.tabPanel}>
                <Quotes quotes={quotes}/>
            </TabPanel>

            <TabPanel value={value} index={1} className={classes.tabPanel}>
                <Pages pages={pages}/>
            </TabPanel>
        </div>
     )
}

export default App;
