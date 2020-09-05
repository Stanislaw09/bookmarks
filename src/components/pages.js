import React,{useState, useEffect} from 'react'
import {PageView} from './pageView'
import {Typography,
    makeStyles,
    IconButton,
    InputBase,
    Popover,
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
import ClassIcon from '@material-ui/icons/Class'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
const firebase=require('firebase')

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
    classBtn:{
        height: '42px',
        width: '42px',
        position: 'absolute',
        margin: 'auto 12px'
    },
    categoriesHeader:{
        fontWeight: '700',
        margin: '6px 10px 0'
    },
    category:{
        justifyContent: 'space-between'
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
    },
    starter:{
        fontSize: '26px',
        margin: '12px 16px',
        color: '#d5d5d5'
    }
}))

export const Pages=props=>{
    const [sortAnchor, setSortAnchor]=useState(null)
    const [pages, setPages]=useState([])
    const [filter, setFilter]=useState('')
    const [favouriteFilter, setFavouriteFilter]=useState(false)
    const [categoryFilter, setCategoryFilter]=useState('')
    const [currentSorting, setCurrentSorting]=useState('')
    const [categoriesPopover, setCategoriesPopover]=useState(null)
    const [category, setCategory]=useState('')
    const classes=useStyles()

    useEffect(()=>{
        props.pages && setPages(props.pages)
    },[props])

    const sortDate=order=>{
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

    const sortName=order=>{
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

    const addCategory=()=>{
            firebase.firestore().collection('users').doc(props.id).get().then(doc=>{
                let data=doc.data()
                let categories=[...data.pageCategories, category]
                categories.sort()

                firebase.firestore().collection("users").doc(props.id).set({
                    quotes: data.quotes,
                    pages: data.pages,
                    quoteCategories: data.quoteCategories,
                    pageCategories: categories
                })
            })

        setCategory('')
    }

    const removeCategory=_category=>{
        firebase.firestore().collection('users').doc(props.id).get().then(doc=>{
            let data=doc.data()
            let categories=data.pageCategories.filter(item=>item!=_category)

            let pages=data.pages.map(page=>{
                let _categories=page.categories.filter(cat=>cat!=_category)
                return {
                    date: page.date,
                    favIcon: page.favIcon,
                    favourite: page.favourite,
                    image: page.image,
                    title: page.title,
                    url: page.url,
                    categories: _categories
                }
            })

            firebase.firestore().collection("users").doc(props.id).set({
                quotes: data.quotes,
                pages: pages,
                quoteCategories: data.quoteCategories,
                pageCategories: categories
            })
        })
    }

    const handleCategoryFilter=category=>{
        setCategoryFilter(category)
        setCategoriesPopover(false)
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

                    <IconButton
                        className={classes.classBtn}
                        onClick={event=>setCategoriesPopover(event.currentTarget)}>
                        <ClassIcon style={categoryFilter!='' ? {color: '#a3496a'} : {color: '#555'}}/>
                    </IconButton>

                    <Popover
                        open={Boolean(categoriesPopover)}
                        anchorEl={categoriesPopover}
                        onClose={()=>{setCategoriesPopover(null)}}
                        anchorOrigin={{
                            vertical: 'bottom',
                        horizontal: 'center'}}
                        transformOrigin={{
                            vertical: 'top',
                        horizontal: 'center'}}>

                        <Typography className={classes.categoriesHeader}>Categories</Typography>

                        <MenuItem onClick={()=>handleCategoryFilter('')}>
                            <Typography>All</Typography>
                        </MenuItem>

                        {props.categories.map(_category=>
                            <MenuItem
                                onClick={()=>handleCategoryFilter(_category)}
                                className={classes.category}>
                                <Typography
                                    style={categoryFilter==_category ? {color: '#a3496a'} : {color: '#555'}}>{_category}</Typography>
                                <RemoveIcon
                                    onClick={()=>removeCategory(_category)}/>
                            </MenuItem>
                        )}

                        <MenuItem>
                            <InputBase
                                placeholder='Add new'
                                value={category}
                                onChange={e=>setCategory(e.target.value)}/>
                            <AddIcon onClick={addCategory}/>
                        </MenuItem>
                    </Popover>

                    <div className={classes.sortContainer}>
                        <IconButton onClick={()=>setFavouriteFilter(prev=>!prev)} className={classes.favouriteBtn}>
                            {
                                favouriteFilter ?
                                    <FavoriteIcon
                                        style={{color: 'rgba(138, 46, 68, 0.95)'}}
                                        className={classes.favourite}/> :
                                        <FavoriteBorderIcon className={classes.favourite}/>
                            }
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
                            <MenuItem onClick={()=>sortDate('desc')}>
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
                {
                    pages.length ? pages.map((page,i)=>
                        (page.title.toLowerCase().includes(filter.toLowerCase()) &&
                            ((favouriteFilter && page.favourite) || (!favouriteFilter)) &&
                            ((page.categories.includes(categoryFilter)) || categoryFilter=='')) &&
                                <PageView
                                    key={i}
                                    page={page}
                                    categories={props.categories}
                                    id={props.id}/>
                    ) :
                    <Typography className={classes.starter}>It's a little empty in here, save something</Typography>
                }
            </Grid>
        </div>
    )
}
