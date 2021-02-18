/*global chrome*/
import React, { useState, useEffect } from 'react'
import { Tabs, Tab, makeStyles } from '@material-ui/core'
import { Quotes } from './quotes'
import { Pages } from './pages'

const useStyles = makeStyles({
   container: {
      minWidth: '618px',
      minHeight: '800px'
   },
   header: {
      backgroundColor: '#572a59',
      position: 'sticky',
      display: 'flex',
      top: '0',
      zIndex: '1000'
   },
   tabs: {
      margin: '0 auto'
   },
   captionEnabled: {
      color: '#fff',
      fontSize: '21px',
      fontWeight: '700',
      margin: '0 8px',
      padding: '0 14px'
   },
   captionDisabled: {
      color: '#bbb',
      fontSize: '19px',
      fontWeight: '500',
      margin: '0 8px',
      padding: '0 14px'
   }
})

export const Main = () => {
   const [quotes, setQuotes] = useState(undefined)
   const [pages, setPages] = useState(undefined)
   const [pageCategories, setPageCategories] = useState([])
   const [quoteCategories, setQuoteCategories] = useState([])
   const [value, setValue] = useState(0)
   const classes = useStyles()

   useEffect(() => {
      chrome.storage.sync.get(null, data => {
         let _pages = []
         let _quotes = []

         for (let index = 0; index < 5; index++) {
            data[`pages${index}`].map(page => {
               let _page = {
                  ...page,
                  index: index
               }

               _pages.push(_page)
            })
         }

         for (let index = 0; index < 2; index++) {
            data[`quotes${index}`].map(quote => {
               let _quote = {
                  ...quote,
                  index: index
               }

               _quotes.push(_quote)
            })
         }

         setPages(_pages)
         setQuotes(_quotes)
         setPageCategories(data.pageCategories)
         setQuoteCategories(data.quoteCategories)
      })
   }, [])

   const handleChange = (event, newValue) => setValue(newValue)

   const TabPanel = props => {
      return (
         <div hidden={props.value !== props.index} role="tabpanel">
            {props.children}
         </div>
      )
   }

   return (
      <div className={classes.container}>
         <div className={classes.header}>
            <Tabs centered onChange={handleChange} className={classes.tabs}>
               <Tab
                  label='Pages'
                  className={value === 0 ? classes.captionEnabled : classes.captionDisabled} />
               <Tab
                  label='Quotes'
                  className={value === 1 ? classes.captionEnabled : classes.captionDisabled} />
            </Tabs>
         </div>

         <TabPanel value={value} index={0} className={classes.tabPanel}>
            <Pages pages={pages} categories={pageCategories} />
         </TabPanel>

         <TabPanel value={value} index={1} className={classes.tabPanel}>
            <Quotes quotes={quotes} categories={quoteCategories} />
         </TabPanel>
      </div>
   )
}
