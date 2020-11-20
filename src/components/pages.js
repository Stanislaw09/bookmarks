/* global chrome*/
import React,{useState, useEffect} from 'react'
import {PageView} from './pageView'
import {Typography,
    makeStyles,
    IconButton,
    InputBase,
    Menu,
    Grid,
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
    grids:{
        display: 'inline-flex',
        alignItems: 'flex-start'
    },
    grid:{
        padding: '8px'
    },
    starter:{
        fontSize: '26px',
        margin: '20px',
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
    const [categories, setCategories]=useState([])
    const [category, setCategory]=useState('')
    const classes=useStyles()

    useEffect(()=>{
        props.pages && setPages(props.pages)
        props.categories && setCategories(props.categories)
    },[props])

    const handleDelete=url=>{
        let newPages=pages.filter(item=>item.url!==url)

        setPages(newPages)

        chrome.storage.sync.set({
            pages: newPages
        })
    }

    const handleFavourite=url=>{
        let newPages=pages.map(item=>{
            if(item.url===url){
                let _item=item
                _item.favourite=!item.favourite
                return _item
            }
            return item
        })

        setPages(newPages)

        chrome.storage.sync.set({
            pages: newPages
        })
    }

    const sortDate=(order)=>{
        const sorted=[...pages].sort((a,b)=>{
            let date1=new Date(a.date)
            let date2=new Date(b.date)

            if(order==='asc')
                return date1-date2
            if(order==='desc')
                return date2-date1
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
        currentSorting==='name' ? sortName(type) : sortDate(type)
    }

    const addCategory=()=>{
        chrome.storage.sync.get(['pageCategories'], data=>{
            let _categories=[...data.pageCategories, category]
            _categories.sort()

            chrome.storage.sync.set({
                pageCategories: _categories
            })

            setCategories(_categories)
        })

        setCategory('')
    }

    const removeCategory=_category=>{
        chrome.storage.sync.get(['pageCategories', 'pages'], data=>{
            let _categories=data.pageCategories.filter(cat=>cat!==_category)

            let _pages=data.pages.map(page=>{
                let _cat=page.categories.filter(cat=>cat!==_category)

                return {
                    date: page.date,
                    favIcon: page.favIcon,
                    favourite: page.favourite,
                    image: page.image,
                    title: page.title,
                    url: page.url,
                    categories: _cat
                }
            })

            chrome.storage.sync.set({
                pageCategories: _categories,
                pages: _pages
            })

            setCategories(_categories)
            setPages(_pages)
            setCategoryFilter('')
        })
    }

    const handleCategoryFilter=category=>{
        setCategoryFilter(category)
        setCategoriesPopover(false)
    }

    const addToCategory=(url, category)=>{
        let _pages=pages.map(page=>{
            if(page.url===url)
                return{
                    url: page.url,
                    favIcon: page.favIcon,
                    title: page.title,
                    date: page.date,
                    favourite: page.favourite,
                    image: page.image,
                    categories: [...page.categories, category]
            }
            else
                return page
        })

        chrome.storage.sync.set({
            pages: _pages
        })

        setPages(_pages)
    }

    const removeFromCategory=(url, category)=>{
        let _pages=pages.map(page=>{
            if(page.url===url){
                let _categories=page.categories.filter(cat=>cat!==category)

                return{
                    url: page.url,
                    favIcon: page.favIcon,
                    title: page.title,
                    date: page.date,
                    favourite: page.favourite,
                    image: page.image,
                    categories: _categories
                }
            }
            else
                return page
        })

        chrome.storage.sync.set({
            pages: _pages
        })

        setPages(_pages)
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
                                    style={categoryFilter===_category ? {color: '#a3496a'} : {color: '#555'}}>{_category}</Typography>
                                <RemoveIcon
                                    onClick={()=>removeCategory(_category)}/>
                            </MenuItem>
                        )}

                        <MenuItem>
                            <InputBase
                                placeholder='Add new'
                                value={category}
                                onChange={e=>setCategory(e.target.value)}
                                onKeyPress={e=>{e.key==='Enter' && addCategory()}}/>
                            <AddIcon onClick={()=>addCategory()}/>
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
                pages.length ?
                    <div className={classes.grids}>
                        <Grid container alignItems='flex-end' direction='column' spacing={2} className={classes.grid}>
                            {
                                pages.map((page,i)=>(i%2==0 &&
                                    (page.title.toLowerCase().includes(filter.toLowerCase()) &&
                                        ((favouriteFilter && page.favourite) || (!favouriteFilter)) &&
                                        ((page.categories.includes(categoryFilter)) || categoryFilter==='')) &&
                                            <PageView
                                                key={i}
                                                page={page}
                                                categories={categories}
                                                handleDelete={handleDelete}
                                                handleFavourite={handleFavourite}
                                                addToCategory={addToCategory}
                                                removeFromCategory={removeFromCategory}/>
                                ))
                            }
                        </Grid>

                        <Grid container alignItems='flex-start' direction='column' spacing={2} className={classes.grid}>
                            {
                                pages.map((page,i)=>(i%2==1 &&
                                    (page.title.toLowerCase().includes(filter.toLowerCase()) &&
                                        ((favouriteFilter && page.favourite) || (!favouriteFilter)) &&
                                        ((page.categories.includes(categoryFilter)) || categoryFilter==='')) &&
                                            <PageView
                                                key={i}
                                                page={page}
                                                categories={categories}
                                                handleDelete={handleDelete}
                                                handleFavourite={handleFavourite}
                                                addToCategory={addToCategory}
                                                removeFromCategory={removeFromCategory}/>
                                ))
                            }
                            </Grid>
                    </div> :
                    <Typography className={classes.starter}>
                        You have nothing to show
                    </Typography>
            }
        </div>
    )
}
