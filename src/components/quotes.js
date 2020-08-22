import React,{useState, useEffect} from 'react'
import {QuoteView} from './quoteView'
import {Typography,
    makeStyles,
    IconButton,
    InputBase,
    Menu,
    MenuItem} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import SortIcon from '@material-ui/icons/Sort'
import CloseIcon from '@material-ui/icons/Close'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'

const useStyles=makeStyles(theme=>({
    container:{
        marginBottom: '26px'
    },
    nav:{
        backgroundColor: '#ddd',
        padding: '6px 22px'
    },
    subNav:{
        width: '73%',
        margin: '0 auto',
        [theme.breakpoints.down('sm')]:{
            width: '96%'
        }
    },
    search:{
        display: 'inline-flex',
        backgroundColor: '#b3bcbf',
        width: '320px',
        borderRadius: '3px'
    },
    searchInput:{
        width: '250px',
        height: '40px',
        fontSize: '22px',
        padding: '0 10px',
        margin: '4px 4px',
    },
    searchIcon:{
        height: '32px',
        width: '32px',
        color: '#444',
        margin: 'auto 6px'
    },
    sortContainer:{
        display: 'inline-flex',
        float: 'right'
    },
    clearBtn:{
        width: '44px',
        height: '44px',
        margin: 'auto 2px',
        float: 'right'
    },
    clear:{
        width: '28epx',
        height: '28epx',
        color: '#444',
    },
    favouriteBtn:{
        height: '52px',
        width: '52px',
        margin: 'auto 8px'
    },
    favourite:{
        width: '30px',
        height: '30px'
    },
    sortButton:{
        float: 'right',
        width: '52px',
        height: '52px',
        margin: 'auto 0'
    },
    arrowIcon:{
        width: '28px',
        height: '28px',
    },
    sortIcon:{
        width: '36px',
        height: '36px',
        margin: '4px 10px'
    },
    sortItem:{
        padding: '2px 6px',
        fontSize: '18px',
        color: '#555'
    }
}))

export const Quotes=props=>{
    const [sortAnchor, setSortAnchor]=useState(null)
    const [quotes, setQuotes]=useState([])
    const [filter, setFilter]=useState('')
    const [favouriteFilter, setFavouriteFilter]=useState(false)
    const [currentSorting, setCurrentSorting]=useState('')
    const classes=useStyles()

    useEffect(()=>{
        props.quotes && setQuotes(props.quotes)
    },[props])

    const sortDate=(order)=>{
        const sorted=[...quotes].sort((a,b)=>{
            if(order==='asc')
                return a.date.seconds-b.date.seconds
            if(order==='desc')
                return b.date.seconds-a.date.seconds
        })

        setCurrentSorting('date')
        setQuotes(sorted)
        setSortAnchor(null)
    }

    const sortName=(order)=>{
        const sorted=[...quotes].sort((a,b)=>{
            let first=a.url.replace('http://','').replace('https://','').replace('en.', '').replace('www.', '').split(/[/?#]/)[0]
            let second=b.url.replace('http://','').replace('https://','').replace('en.', '').replace('www.', '').split(/[/?#]/)[0]

            if(first<second && order==='asc')
                return -1
            if(first<second && order==='desc')
                return 1
            if(first>second && order==='asc')
                return 1
            if(first>second && order==='desc')
                return -1
            return 0
        })

        setCurrentSorting('name')
        setQuotes(sorted)
        setSortAnchor(null)
    }

    const reorder=type=>{
        currentSorting==='date' ? sortDate(type) : sortName(type)
    }

    return(
        <div className={classes.container}>
            <div className={classes.nav}>
                <div className={classes.subNav}>
                    <div className={classes.search}>
                        <SearchIcon className={classes.searchIcon}/>
                        <InputBase
                            placeholder='Search in domain...'
                            value={filter}
                            onChange={e=>setFilter(e.target.value)}
                            className={classes.searchInput}/>
                        <IconButton onClick={()=>setFilter('')} className={classes.clearBtn}>
                            <CloseIcon className={classes.clear}/>
                        </IconButton>
                    </div>

                    <div className={classes.sortContainer}>
                        <IconButton onClick={()=>setFavouriteFilter(prev=>!prev)} className={classes.favouriteBtn}>
                            {favouriteFilter ? <FavoriteIcon
                                style={{color: 'rgba(138, 46, 68, 0.95)'}}
                                className={classes.favourite}/> : <FavoriteBorderIcon className={classes.favourite}/>}
                        </IconButton>
                        <IconButton onClick={()=>reorder('desc')}>
                            <KeyboardArrowDownIcon className={classes.arrowIcon}/>
                        </IconButton>
                        <IconButton onClick={()=>reorder('asc')}>
                            <KeyboardArrowUpIcon className={classes.arrowIcon}/>
                        </IconButton>

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
                            <MenuItem onClick={()=>sortDate('asc')}>
                                <Typography className={classes.sortItem}>Date</Typography>
                            </MenuItem>
                            <MenuItem onClick={()=>sortName('asc')}>
                                <Typography className={classes.sortItem}>Name</Typography>
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            </div>

            {quotes.length && quotes.map((quote,i)=>
                quote.url.replace('http://','').replace('https://','').replace('en.', '').replace('www.', '').split(/[/?#]/)[0].includes(filter.toLowerCase()) &&
                ((favouriteFilter && quote.favourite) || (!favouriteFilter)) &&
                    <QuoteView
                        key={i}
                        quote={quote}/>
            )}

        </div>
    )
}
