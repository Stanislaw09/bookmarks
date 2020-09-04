import React,{useState, useEffect} from 'react'
import {QuoteView} from './quoteView'
import {Typography,
    makeStyles,
    IconButton,
    InputBase,
    Collapse,
    Menu,
    Popover,
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
    // '@global':{
    // '.MuiTypography-root':{
    //     color: 'green'
    //     }
    // },
    container:{
        margin: '0 0 20px'
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
        width: '270px',
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
    category:{
        justifyContent: 'space-between'
    },
    classIcon:{
        width: '36px',
        height: '36px'
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
    }
}))

export const Quotes=props=>{
    const [sortAnchor, setSortAnchor]=useState(null)
    const [quotes, setQuotes]=useState([])
    const [filter, setFilter]=useState('')
    const [favouriteFilter, setFavouriteFilter]=useState(false)
    const [categoryFilter, setCategoryFilter]=useState('')
    const [categoriesPopover, setCategoriesPopover]=useState(null)
    const [currentSorting, setCurrentSorting]=useState('')
    const [category, setCategory]=useState('')
    const classes=useStyles()

    console.log(category);

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

    const addCategory=()=>{
            firebase.firestore().collection('users').doc(props.id).get().then(doc=>{
                let data=doc.data()

                firebase.firestore().collection("users").doc(props.id).set({
                    quotes: data.quotes,
                    pages: data.pages,
                    quoteCategories: [...data.quoteCategories, category],
                    pageCategories: data.pageCategories
                })
            })

        setCategory('')
    }

    const removeCategory=_category=>{
        firebase.firestore().collection('users').doc(props.id).get().then(doc=>{
            let data=doc.data()
            let categories=data.quoteCategories.filter(item=>item!=_category)
            let quotes=data.quotes.map(quote=>{
                let _categories=quote.categories.filter(cat=>cat!=_category)
                return{
                    date: quote.date,
                    favIcon: quote.favIcon,
                    favourite: quote.favourite,
                    text: quote.text,
                    url: quote.url,
                    categories: _categories
                }
            })

            firebase.firestore().collection("users").doc(props.id).set({
                quotes: quotes,
                pages: data.pages,
                quoteCategories: categories,
                pageCategories: data.pageCategories
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
                            placeholder='Search in quote...'
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
                        <ClassIcon/>
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
                                    onClick={()=>removeCategory(_category)}
                                    className={classes.removeIcon}/>
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
                                favouriteFilter ? <FavoriteIcon
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

            {quotes.length && quotes.map((quote,i)=>
                (quote.text.toLowerCase().includes(filter.toLowerCase()) &&
                    ((favouriteFilter && quote.favourite) || (!favouriteFilter)) &&
                    ((quote.categories.includes(categoryFilter)) || categoryFilter=='')) &&
                        <QuoteView
                            key={i}
                            quote={quote}
                            categories={props.categories}
                            id={props.id}/>
            )}
        </div>
    )
}
