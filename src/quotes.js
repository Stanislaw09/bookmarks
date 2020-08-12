import React,{useState, useEffect} from 'react'
import {CardView} from './cardView'
import {Typography,
    makeStyles,
    IconButton,
    InputBase,
    Menu,
    MenuItem} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import SortIcon from '@material-ui/icons/Sort'
import CloseIcon from '@material-ui/icons/Close'

const useStyles=makeStyles(theme=>({
    container:{
        marginBottom: '26px'
    },
    nav:{
        backgroundColor: '#ddd',
        padding: '6px 22px'
    },
    search:{
        display: 'inline-flex',
        backgroundColor: '#b3bcbf',
        width: '310px',
        borderRadius: '3px'
    },
    searchInput:{
        width: '240px',
        height: '40px',
        fontSize: '22px',
        padding: '0 10px',
        margin: '4px 4px',
    },
    searchIcon:{
        height: '34px',
        width: '34px',
        color: '#333',
        margin: '4px 6px'
    },
    clear:{
        float: 'right',
        width: '30px',
        height: '30px',
        color: '#444',
        margin: 'auto 8px'
    },
    sortButton:{
        float: 'right',
        width: '44px',
        height: '44px'
    },
    sortIcon:{
        width: '36px',
        height: '36px',
        margin: '4px 10px'
    },
}))

export const Quotes=props=>{
    const [sortAnchor, setSortAnchor]=useState(null)
    const [quotes, setQuotes]=useState([])
    const [filter, setFilter]=useState('')
    const classes=useStyles()

    useEffect(()=>{
        props.quotes && setQuotes(props.quotes)
    },[props])

    const handleSortDate=()=>{
        const sorted=[...quotes].sort((a,b)=>b.date.seconds-a.date.seconds)
        setQuotes(sorted)
        setSortAnchor(null)
    }

    const handleSortName=()=>{
        const sorted=[...quotes].sort((a,b)=>{
            let first=a.url.replace('http://','').replace('https://','').replace('en.', '').replace('www.', '').split(/[/?#]/)[0]
            let second=b.url.replace('http://','').replace('https://','').replace('en.', '').replace('www.', '').split(/[/?#]/)[0]

            if(first<second)
                return -1
            if(first>second)
                return 1
            return 0
        })

        setQuotes(sorted)
        setSortAnchor(null)
    }

    return(
        <div className={classes.container}>
            <div className={classes.nav}>
                <div className={classes.search}>
                    <SearchIcon className={classes.searchIcon}/>
                    <InputBase
                        placeholder='Search...'
                        value={filter}
                        onChange={e=>setFilter(e.target.value)}
                        className={classes.searchInput}/>
                    <CloseIcon onClick={()=>setFilter('')} className={classes.clear}/>
                </div>

                <IconButton
                    onClick={event=>setSortAnchor(event.currentTarget)}
                    className={classes.sortButton}>
                    <SortIcon className={classes.sortIcon}/>
                </IconButton>

                <Menu
                    open={sortAnchor}
                    keepMounted
                    anchorEl={sortAnchor}
                    onClose={()=>setSortAnchor(false)}>
                    <MenuItem onClick={handleSortDate}><Typography>Date</Typography></MenuItem>
                    <MenuItem onClick={handleSortName}><Typography>Name</Typography></MenuItem>
                </Menu>
            </div>

            {quotes.length && quotes.map((quote,i)=>
                quote.url.replace('http://','').replace('https://','').replace('en.', '').replace('www.', '').split(/[/?#]/)[0].includes(filter.toLowerCase()) && <CardView key={i} quote={quote}/>)}

        </div>
    )
}
