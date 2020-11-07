import React,{useState} from 'react'
import {Typography,
    makeStyles,
    Avatar,
    Collapse,
    Paper,
    Link,
    IconButton,
    Menu,
    Grid,
    MenuItem} from '@material-ui/core'
import {FacebookShareButton,
    FacebookIcon,
    FacebookMessengerShareButton,
    FacebookMessengerIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon,
    RedditShareButton,
    RedditIcon,
    LinkedinShareButton,
    LinkedinIcon} from 'react-share'
import ShareIcon from '@material-ui/icons/Share'
import DeleteIcon from '@material-ui/icons/Delete'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import MenuIcon from '@material-ui/icons/Menu'
import ClassIcon from '@material-ui/icons/Class'

const useStyles=makeStyles(theme=>({
    grid:{
        backgroundColor: '#20252e',
        height: 'fit-content',
        minWidth: '290px'
    },
    container:{
        height: '100%'
    },
    gridHeader:{
        display: 'inline-flex',
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: '-2px'
    },
    gridSubHeader:{
        display: 'flex',
        width: 'calc(100% - 50px)'
    },
    headerContent:{
        width: '83%'
    },
    avatar:{
        width: '30px',
        height: '30px',
        margin: '6px'
    },
    link:{
        margin: '0 4px 0 0',
        fontSize: '14px',
        display: 'flex',
        textDecoration: 'none',
        underline: 'none',
        color: '#7187ab'
    },
    date:{
        margin: 'auto 10px',
        color: '#555',
        fontSize: '13px',
        fontStyle: 'italic'
    },
    headerData:{
        display: 'inline-flex'
    },
    title:{
        margin: '4px 2px',
        fontSize: '12px',
        color: '#494d5b',
        fontWeight: '600',
        wordWrap: 'break-word'
    },
    menuBtn:{
        height: '46px',
        width: '46px',
        margin: '0 2px'
    },
    menuItem:{
        marginRight: '10px',
        color: '#444',
        paddingLeft: '6px'
    },
    menu:{
        width: '190px'
    },
    subMenuIcon:{
        marginRight: '10px',
        color: '#444'
    },
    menuIcon:{
        width: '30px',
        height: '30px'
    },
    shareContainers:{
        padding: '10px'
    },
    share:{
        width: '30px',
        height: '30px',
        margin: '4px',
        borderRadius: '50%'
    },
    imgContainer:{
        overflow: 'hidden',
        width: '100%',
        maxHeight: '270px'
    },
    image:{
        width: '100%',
        borderRadius: '2px'
    }
}))

export const PageView=props=>{
    const classes=useStyles()
    const [menuAnchor, setMenuAnchor]=useState(null)
    const [shareMenu, setShareMenu]=useState(false)
    const [categoriesAddAnchor, setCategoriesAddAnchor]=useState(false)
    const [categoriesRemoveAnchor, setCategoriesRemoveAnchor]=useState(false)

    return(
        <Grid item xs={12} md={12} className={classes.grid}>
            <div className={classes.container}>
                <Paper className={classes.gridHeader} elevation={5}>
                    <div className={classes.gridSubHeader}>
                        <Avatar src={props.page.favIcon} className={classes.avatar}/>

                        <div className={classes.headerContent}>
                            {
                                props.page.title.length>46 ?
                                    <Typography className={classes.title}>
                                        {props.page.title.slice(0, 46)}...
                                    </Typography> :
                                    <Typography className={classes.title}>
                                        {props.page.title}
                                    </Typography>
                            }

                            <div className={classes.headerData}>
                                <Typography>
                                    <Link href={props.page.url} target='_blank' className={classes.link}>
                                        {props.page.url.replace('http://','').replace('https://','').replace('en.', '').replace('www.', '').split(/[/?#]/)[0]}
                                    </Link>
                                </Typography>

                                <Typography className={classes.date}>
                                    {(new Date(props.page.date)).getDate()+'/'+(new Date(props.page.date)).getMonth()+'/'+(new Date(props.page.date)).getFullYear()}
                                </Typography>
                            </div>
                        </div>
                    </div>

                    <IconButton
                        onClick={event=>setMenuAnchor(event.currentTarget)}
                        className={classes.menuBtn}>
                        <MenuIcon className={classes.menuIcon}/>
                    </IconButton>

                    <Menu
                        open={menuAnchor}
                        keepMounted
                        anchorEl={menuAnchor}
                        onClose={()=>setMenuAnchor(false)}
                        className={classes.menu}>

                        <MenuItem
                            onClick={()=>{
                                props.handleFavourite(props.page.url)
                                setMenuAnchor(null)}}
                            className={classes.menuItem}>
                            {
                                props.page.favourite ?
                                    <FavoriteIcon
                                        style={{color: 'rgba(138, 46, 68, 0.95)'}} className={classes.subMenuIcon}/> :
                                        <FavoriteBorderIcon className={classes.subMenuIcon}/>
                            }Favourite
                        </MenuItem>

                        <MenuItem
                            onClick={event=>setCategoriesAddAnchor(event.currentTarget)}
                            className={classes.menuItem}>
                            <ClassIcon className={classes.subMenuIcon}/>
                            Add to...
                        </MenuItem>

                        <Menu
                            open={categoriesAddAnchor}
                            keepMounted
                            anchorEl={categoriesAddAnchor}
                            onClose={()=>setCategoriesAddAnchor(false)}>
                            {
                                props.categories.map(category=>
                                    <MenuItem
                                        onClick={()=>{
                                            props.addToCategory(props.page.url, category)
                                            setCategoriesAddAnchor(null)
                                            setMenuAnchor(null)
                                        }}
                                        style={props.page.categories.includes(category) ? {color: '#999'} : {color: '#000'}}>
                                        {category}
                                    </MenuItem>
                                )
                            }
                        </Menu>

                        <MenuItem
                            onClick={event=>setCategoriesRemoveAnchor(event.currentTarget)}
                            style={props.page.categories.length ? {display: 'flex'} : {display: 'none'}}
                            className={classes.menuItem}>
                            <ClassIcon className={classes.subMenuIcon}/>
                            Remove from...
                        </MenuItem>

                        <Menu
                            open={categoriesRemoveAnchor}
                            keepMounted
                            anchorEl={categoriesRemoveAnchor}
                            onClose={()=>setCategoriesRemoveAnchor(false)}>
                            {
                                props.categories.map(category=>
                                    <MenuItem onClick={()=>{
                                        props.removeFromCategory(props.page.url, category)
                                        setCategoriesRemoveAnchor(null)
                                        setMenuAnchor(null)
                                    }}
                                        style={props.page.categories.includes(category) ? {color: '#000'} : {color: '#999'}}>
                                        {category}
                                    </MenuItem>
                                )
                            }
                        </Menu>

                        <MenuItem
                            onClick={()=>{
                                props.handleDelete(props.page.url)
                                setMenuAnchor(null)}}
                            className={classes.menuItem}>
                            <DeleteIcon className={classes.subMenuIcon}/>Delete
                        </MenuItem>

                        <MenuItem
                            onClick={()=>setShareMenu(prev=>!prev)}
                            className={classes.menuItem}>
                            <ShareIcon className={classes.subMenuIcon}/>Share
                        </MenuItem>

                        <Collapse in={shareMenu}>
                            <div className={classes.shareContainers}>
                                <FacebookShareButton
                                    url={props.page.url}
                                    onClick={()=>{
                                        setShareMenu(null)
                                        setMenuAnchor(null)}}>
                                    <FacebookIcon
                                        logoFillColor="white"
                                        className={classes.share}/>
                                </FacebookShareButton>

                                <FacebookMessengerShareButton
                                    url={props.page.url}
                                    onClick={()=>{
                                        setShareMenu(null)
                                        setMenuAnchor(null)}}>
                                    <FacebookMessengerIcon
                                        logoFillColor="white"
                                        className={classes.share}/>
                                </FacebookMessengerShareButton>

                                <TwitterShareButton
                                    url={props.page.url}
                                    onClick={()=>{
                                        setShareMenu(null)
                                        setMenuAnchor(null)}}>
                                    <TwitterIcon
                                        logoFillColor="white"
                                        className={classes.share}/>
                                </TwitterShareButton>
                            </div>

                            <div className={classes.shareContainers}>
                                <WhatsappShareButton
                                    url={props.page.url}
                                    onClick={()=>{
                                        setShareMenu(null)
                                        setMenuAnchor(null)}}>
                                    <WhatsappIcon
                                        logoFillColor="white"
                                        className={classes.share}/>
                                </WhatsappShareButton>

                                <RedditShareButton
                                    url={props.page.url}
                                    onClick={()=>{
                                        setShareMenu(null)
                                        setMenuAnchor(null)}}>
                                    <RedditIcon
                                        logoFillColor="white"
                                        className={classes.share}/>
                                </RedditShareButton>

                                <LinkedinShareButton
                                    url={props.page.url}
                                    onClick={()=>{
                                        setShareMenu(null)
                                        setMenuAnchor(null)}}>
                                    <LinkedinIcon
                                        logoFillColor="white"
                                        className={classes.share}/>
                                </LinkedinShareButton>
                            </div>
                        </Collapse>
                    </Menu>
                </Paper>

                <div className={classes.imgContainer}>
                    <a href={props.page.url} target='_blank'>
                        <img src={props.page.image} className={classes.image}/>
                    </a>
                </div>
            </div>
        </Grid>
    )
}
