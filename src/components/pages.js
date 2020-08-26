import React,{useState, useEffect} from 'react'
import {PageView} from './pageView'
import {Typography,
    makeStyles,
    IconButton,
    InputBase,
    Menu,
    Grid,
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
        marginBottom: '26px',
        width: '100%'
    },
    nav:{
        backgroundColor: '#ddd'
    },
    subNav:{
        margin: '0 auto',
    },
    search:{
        display: 'inline-flex',
        backgroundColor: '#b3bcbf',
        width: '280px',
        borderRadius: '3px'
    },
    searchInput:{
        width: '250px',
        height: '36px',
        fontSize: '18px',
        padding: '0 10px',
        margin: '4px 4px',
    },
    searchIcon:{
        height: '30px',
        width: '30px',
        color: '#444',
        margin: 'auto 4px'
    },
    sortContainer:{
        display: 'inline-flex',
        float: 'right'
    },
    clearBtn:{
        width: '42px',
        height: '42px',
        margin: 'auto 2px',
        float: 'right'
    },
    clear:{
        width: '28px',
        height: '28px',
        color: '#444',
    },
    favouriteBtn:{
        height: '44px',
        width: '44px',
        margin: 'auto 8px'
    },
    iconBtn:{
        width: '44px',
        height: '44px'
    },
    favourite:{
        width: '28px',
        height: '28px'
    },
    sortButton:{
        float: 'right',
        width: '48px',
        height: '48px'
    },
    arrowIcon:{
        width: '28px',
        height: '28px',
    },
    sortIcon:{
        width: '32px',
        height: '32px',
        margin: '4px 10px'
    },
    sortItem:{
        padding: '2px 6px',
        fontSize: '18px',
        color: '#555'
    },
    grid:{
        padding: '8px'
    }
}))

export const Pages=props=>{
    const [sortAnchor, setSortAnchor]=useState(null)
    const [pages, setPages]=useState([])
    const [filter, setFilter]=useState('')
    const [favouriteFilter, setFavouriteFilter]=useState(false)
    const [currentSorting, setCurrentSorting]=useState('')
    const classes=useStyles()

    useEffect(()=>{
        props.pages && setPages(props.pages)
    },[props])

    const sortDate=(order)=>{
        const sorted=[...pages].sort((a,b)=>{
            if(order==='asc')
                return a.date.seconds-b.date.seconds
            if(order==='desc')
                return b.date.seconds-a.date.seconds
        })

        setCurrentSorting('date')
        setPages(sorted)
        setSortAnchor(null)
    }

    const sortName=(order)=>{
        const sorted=[...pages].sort((a,b)=>{

            if(a.title<b.title && order==='asc')
                return -1
            if(a.title<b.title && order==='desc')
                return 1
            if(a.title>b.title && order==='asc')
                return 1
            if(a.title>b.title && order==='desc')
                return -1
            return 0
        })

        setCurrentSorting('name')
        setPages(sorted)
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
                            placeholder='Search in title...'
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
                        <IconButton onClick={()=>reorder('desc')} className={classes.iconBtn}>
                            <KeyboardArrowDownIcon className={classes.arrowIcon}/>
                        </IconButton>
                        <IconButton onClick={()=>reorder('asc')} className={classes.iconBtn}>
                            <KeyboardArrowUpIcon className={classes.arrowIcon}/>
                        </IconButton>

                        <IconButton
                            onClick={event=>setSortAnchor(event.currentTarget)}
                            className={classes.iconBtn}>
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

            <Grid container spacing={1} className={classes.grid}>
                {pages.length && pages.map((page,i)=>
                    page.title.toLowerCase().includes(filter.toLowerCase()) &&
                    ((favouriteFilter && page.favourite) || (!favouriteFilter)) &&
                        <PageView
                            key={i}
                            page={page}/>
                )}
            </Grid>

        </div>
    )
}
