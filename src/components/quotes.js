/* global chrome*/
import React,{useState, useEffect} from 'react'
import {QuoteView} from './quoteView'
import {Typography,
    makeStyles,
    IconButton,
    InputBase,
    Popover,
    Menu,
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

const useStyles=makeStyles(theme=>({
    container:{
        margin: '0 0 140px'
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
        height: '34px',
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
        margin: '6px 16px'
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
    starter:{
        fontSize: '26px',
        margin: '20px',
        color: '#d5d5d5'
    }
}))

export const Quotes=props=>{
    const [sortAnchor, setSortAnchor]=useState(null)
    const [quotes, setQuotes]=useState([])
    const [filter, setFilter]=useState('')
    const [favouriteFilter, setFavouriteFilter]=useState(false)
    const [categoryFilter, setCategoryFilter]=useState('')
    const [categoriesPopover, setCategoriesPopover]=useState(null)
    const [categories, setCategories]=useState([])
    const [currentSorting, setCurrentSorting]=useState('')
    const [category, setCategory]=useState('')
    const classes=useStyles()

    useEffect(()=>{
        props.quotes && setQuotes(props.quotes)
        props.categories && setCategories(props.categories)
    },[props])

    const handleDelete=(text, index)=>{
        let newQuotes=quotes.filter(quote=>quote.text!==text)

        setQuotes(newQuotes)

        chrome.storage.sync.get([`quotes${index}`], data=>{
            let _quotes=data[`quotes${index}`].filter(quote=>quote.text!==text)

            chrome.storage.sync.set({
                [`quotes${index}`]: _quotes
            })
        })
    }

    const handleFavourite=(text, index)=>{
        let newQuotes=quotes.map(quote=>{
            if(quote.text===text){
                let _quote=quote
                _quote.favourite=!quote.favourite
                return _quote
            }
            return quote
        })

        setQuotes(newQuotes)

        chrome.storage.sync.get([`quotes${index}`], data=>{
            let _quotes=data[`quotes${index}`].map(quote=>{
                if(quote.text===text){
                    let _quote=quote
                    _quote.favourite=!quote.favourite
                    return _quote
                }

                return quote
            })

            chrome.storage.sync.set({
                [`quotes${index}`]: _quotes
            })
        })
    }

    const sortDate=(order)=>{
        const sorted=[...quotes].sort((a,b)=>{
            let date1=new Date(a.date)
            let date2=new Date(b.date)

            if(order==='asc')
                return date1-date2
            if(order==='desc')
                return date2-date1
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
        currentSorting==='name' ? sortName(type) : sortDate(type)
    }

    const addCategory=()=>{
        chrome.storage.sync.get(['quoteCategories'], data=>{
            let _categories=[...data.quoteCategories, category]
            _categories.sort()

            chrome.storage.sync.set({
                quoteCategories: _categories
            })

            setCategories(_categories)
        })

        setCategory('')
    }

    const removeCategory=_category=>{
        chrome.storage.sync.get(['quoteCategories', 'quotes0', 'quotes1'], data=>{
            let _categories=data.quoteCategories.filter(cat=>cat!==_category)

            chrome.storage.sync.set({
                quoteCategories: _categories,
            })

            for(let index=0;index<2;index++){
                let _quotes=data[`quotes${index}`].map(quote=>{
                    let _cat=quote.categories.filter(cat=>cat!==_category)

                    return {
                        text: quote.text,
                        url: quote.url,
                        favIcon: quote.favIcon,
                        date: quote.date,
                        favourite: quote.favourite,
                        categories: _cat
                    }
                })

                chrome.storage.sync.set({
                    [`quotes${index}`]: _quotes
                })
            }

            let newQuotes=quotes.map(quote=>{
                let _cat=quote.categories.filter(cat=>cat!==_category)

                return {
                    text: quote.text,
                    url: quote.url,
                    favIcon: quote.favIcon,
                    date: quote.date,
                    favourite: quote.favourite,
                    index: quote.index,
                    categories: _cat
                }
            })

            setCategories(_categories)
            setQuotes(newQuotes)
            setCategoryFilter('')
        })
    }

    const handleCategoryFilter=category=>{
        setCategoryFilter(category)
        setCategoriesPopover(false)
    }

    const addToCategory=(text, category, index)=>{
        chrome.storage.sync.get([`quotes${index}`], data=>{
            let _quotes=data[`quotes${index}`].map(quote=>{
                if(quote.text===text)
                    return{
                        url: quote.url,
                        favIcon: quote.favIcon,
                        date: quote.date,
                        favourite: quote.favourite,
                        text: quote.text,
                        categories: [...quote.categories, category]
                }
                else
                    return quote
            })

            chrome.storage.sync.set({
                [`quotes${index}`]: _quotes
            })
        })

        let newQuotes=quotes.map(quote=>{
            if(quote.text===text)
                return{
                    url: quote.url,
                    favIcon: quote.favIcon,
                    date: quote.date,
                    favourite: quote.favourite,
                    text: quote.text,
                    index: quote.index,
                    categories: [...quote.categories, category]
                }
            else
                return quote
        })

        setQuotes(newQuotes)
    }

    const removeFromCategory=(text, category, index)=>{
        chrome.storage.sync.get([`quotes${index}`], data=>{
            let _quotes=data[`quotes${index}`].map(quote=>{
                if(quote.text===text){
                    let _categories=quote.categories.filter(cat=>cat!==category)

                    return{
                        url: quote.url,
                        favIcon: quote.favIcon,
                        date: quote.date,
                        favourite: quote.favourite,
                        text: quote.text,
                        categories: _categories
                    }
                }
                else
                    return quote
            })

            chrome.storage.sync.set({
                [`quotes${index}`]: _quotes
            })
        })

        let newQuotes=quotes.map(quote=>{
            if(quote.text===text){
                let _categories=quote.categories.filter(cat=>cat!==category)

                return{
                    url: quote.url,
                    favIcon: quote.favIcon,
                    date: quote.date,
                    favourite: quote.favourite,
                    text: quote.text,
                    index: quote.index,
                    categories: _categories
                }
            }
            else
                return quote
        })

        setQuotes(newQuotes)
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
                        <ClassIcon style={categoryFilter!=='' ? {color: '#813759'} : {color: '#777'}}/>
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

                        {categories.map(_category=>
                            <MenuItem
                                onClick={()=>handleCategoryFilter(_category)}
                                className={classes.category}>

                                <Typography
                                    style={categoryFilter===_category ? {color: '#a3496a'} : {color: '#555'}}>
                                    {_category}
                                </Typography>

                                <RemoveIcon onClick={()=>removeCategory(_category)}/>
                            </MenuItem>
                        )}

                        <MenuItem>
                            <InputBase
                                placeholder='Add new'
                                value={category}
                                onChange={e=>setCategory(e.target.value)}
                                onKeyPress={e=>{e.key==='Enter' && addCategory()}}/>
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

                            <Typography className={classes.categoriesHeader}>Sort By</Typography>

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

            {
                quotes.length ? quotes.map((quote,i)=>
                    (quote.text.toLowerCase().includes(filter.toLowerCase()) &&
                        ((favouriteFilter && quote.favourite) || (!favouriteFilter)) &&
                        ((quote.categories.includes(categoryFilter)) || categoryFilter==='')) &&
                            <QuoteView
                                key={i}
                                quote={quote}
                                categories={categories}
                                filter={filter}
                                handleDelete={handleDelete}
                                handleFavourite={handleFavourite}
                                addToCategory={addToCategory}
                                removeFromCategory={removeFromCategory}/>
                ) :
                <Typography className={classes.starter}>
                    You have nothing to show
                </Typography>
            }
        </div>
    )
}
