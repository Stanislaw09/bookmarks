import React,{useState, useEffect} from 'react'
import {Tabs, Tab, makeStyles} from '@material-ui/core'
import {Quotes} from './components/quotes'
import {Pages} from './components/pages'
const firebase=require('firebase')

const useStyles=makeStyles({
    container:{
        minWidth: '560px'
    },
    header:{
        backgroundColor: '#87277e'
    },
    captionEnabled:{
        color: '#eee',
        fontSize: '20px',
        fontWeight: '500',
        margin: '6px 20px'
    },
    captionDisabled:{
        color: '#999',
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
        <div className={classes.container}>
            <Tabs centered onChange={handleChange} className={classes.header}>
                <Tab
                    label='Quotes'
                    className={value===0 ? classes.captionEnabled : classes.captionDisabled}/>
                <Tab label='Pages' className={value===1 ? classes.captionEnabled : classes.captionDisabled}/>
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
