/*global chrome*/
import React,{useState, useEffect} from 'react'
import {Tabs, Tab, makeStyles} from '@material-ui/core'
import {Quotes} from './quotes'
import {Pages} from './pages'

const useStyles=makeStyles({
    container:{
        minWidth: '618px',
        minHeight: '800px'
    },
    header:{
        backgroundColor: '#7e3477',
        position: 'sticky',
        display: 'flex',
        top: '0',
        zIndex: '1000'
    },
    arrowBack:{
        marginLeft: '12px',
        color: '#ddd',
        padding: '4px'
    },
    arrowBackIcon:{
        width: '30px',
        height: '30px'
    },
    tabs:{
        margin: '0 auto'
    },
    captionEnabled:{
        color: '#fff',
        fontSize: '19px',
        fontWeight: '700',
        margin: '0 8px',
        padding: '2px 14px'
    },
    captionDisabled:{
        color: '#bbb',
        fontSize: '19px',
        fontWeight: '500',
        margin: '0 8px',
        padding: '2px 14px'
    }
})

export const Main=()=>{
    const[quotes, setQuotes]=useState(undefined)
    const[pages, setPages]=useState(undefined)
    const[pageCategories, setPageCategories]=useState([])
    const[quoteCategories, setQuoteCategories]=useState([])
    const[value, setValue]=useState(0)
    const classes=useStyles()

    useEffect(()=>{
        chrome.storage.sync.get(null, data=>{
            setPages(data.pages)
            setQuotes(data.quotes)
            setPageCategories(data.pageCategories)
            setQuoteCategories(data.quoteCategories)
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

     return(
        <div className={classes.container}>
            <div className={classes.header}>
                <Tabs centered onChange={handleChange} className={classes.tabs}>
                    <Tab
                        label='Pages'
                        className={value===0 ? classes.captionEnabled : classes.captionDisabled}/>
                    <Tab
                        label='Quotes'
                        className={value===1 ? classes.captionEnabled : classes.captionDisabled}/>
                </Tabs>
            </div>

            <TabPanel value={value} index={0} className={classes.tabPanel}>
                <Pages pages={pages} categories={pageCategories}/>
            </TabPanel>

            <TabPanel value={value} index={1} className={classes.tabPanel}>
                <Quotes quotes={quotes} categories={quoteCategories}/>
            </TabPanel>
        </div>
     )
}
