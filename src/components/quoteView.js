import React, {useState} from 'react'
import {Typography,
    makeStyles,
    Card,
    Avatar,
    Collapse,
    Paper,
    Link,
    IconButton,
    Menu,
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import DeleteIcon from '@material-ui/icons/Delete'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import MenuIcon from '@material-ui/icons/Menu'
import ClassIcon from '@material-ui/icons/Class'
import Highlighter from "react-highlight-words"


const useStyles=makeStyles(theme=>({
    card:{
        width: '70%',
        maxWidth: '1100px',
        margin: '20px auto',
        [theme.breakpoints.down('sm')]:{
            width: '98%'
        }
    },
    cardHeader:{
        display: 'inline-flex',
        width: '100%',
        justifyContent: 'space-between'
    },
    cardSubHeader:{
        display: 'flex'
    },
    avatar:{
        width: '34px',
        height: '34px',
        margin: '6px'
    },
    link:{
        margin: '8px 20px',
        fontSize: '18px',
        display: 'flex',
        textDecoration: 'none',
        underline: 'none',
        color: '#7187ab'
    },
    date:{
        margin: '10px 20px',
        fontSize: '17px',
        color: '#555'
    },
    menuBtn:{
        padding: '8px'
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
    collapseLong:{
        width: 'calc(100% - 68px)'
    },
    collapseShort:{
        width: 'calc(100% - 68px)',
        marginLeft: '50px'
    },
    text:{
        fontSize: '16px',
        fontStyle: 'italic',
        lineHeight: '1.7em',
        padding: '2px 26px 6px 0',
        wordWrap: 'break-word'
    },
    expandIcon:{
        width: '38px',
        height: '38px',
        transform: 'rotate(180deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        })
    },
    expandedIcon:{
        width: '38px',
        height: '38px',
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        })
    },
    icons:{
        width: '30px',
        height: '30px'
    },
    cardContent:{
        display: 'flex'
    },
    shareContainers:{
        padding: '10px'
    },
    share:{
        width: '30px',
        height: '30px',
        margin: '4px',
        borderRadius: '50%'
    }
}))

export const QuoteView=props=>{
    const classes=useStyles()
    const [showText, setShowText]=useState(false)
    const [menuAnchor, setMenuAnchor]=useState(null)
    const [shareMenu, setShareMenu]=useState(false)
    const [categoriesAddAnchor, setCategoriesAddAnchor]=useState(false)
    const [categoriesRemoveAnchor, setCategoriesRemoveAnchor]=useState(false)

    return(
        <Card className={classes.card}>
            <Paper className={classes.cardHeader} elevation={0}>
                <div className={classes.cardSubHeader}>
                    <Avatar src={props.quote.favIcon} className={classes.avatar}/>

                    <Typography>
                        <Link href={props.quote.url} target='_blank' className={classes.link}>
                            {props.quote.url.replace('http://','').replace('https://','').replace('en.', '').replace('www.', '').split(/[/?#]/)[0]}
                        </Link>
                    </Typography>

                    <Typography className={classes.date}>
                        {(new Date(props.quote.date)).getDate()+'/'+(new Date(props.quote.date)).getMonth()+'/'+(new Date(props.quote.date)).getFullYear()}
                    </Typography>
                </div>

                <IconButton
                    onClick={event=>setMenuAnchor(event.currentTarget)}
                    className={classes.menuBtn}>
                    <MenuIcon className={classes.icons}/>
                </IconButton>

                <Menu
                    open={menuAnchor}
                    keepMounted
                    anchorEl={menuAnchor}
                    onClose={()=>{
                        setMenuAnchor(false)
                        setShareMenu(null)
                    }}
                    className={classes.menu}>

                    <MenuItem
                        onClick={()=>{
                            props.handleFavourite(props.quote.text, props.quote.index)
                            setMenuAnchor(null)}}
                        className={classes.menuItem}>
                        {
                            props.quote.favourite ?
                                <FavoriteIcon
                                    className={classes.subMenuIcon}
                                    style={{color: 'rgba(138, 46, 68, 0.95)'}}/> :
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
                        anchorEl={categoriesAddAnchor}
                        onClose={() => setCategoriesAddAnchor(false)}>
                        {
                            props.categories.length ?
                                props.categories.map(category =>
                                    <MenuItem
                                        onClick={() => {
                                            props.addToCategory(props.quote.text, category, props.quote.index)
                                            setCategoriesAddAnchor(null)
                                            setMenuAnchor(null)
                                        }}
                                        style={props.quote.categories.includes(category) ? { color: '#999' } : { color: '#000' }}>
                                        {category}
                                    </MenuItem>
                                ) :
                                <MenuItem
                                    onClick={() => {
                                        setCategoriesAddAnchor(null)
                                        setMenuAnchor(null)
                                    }} style={{ color: '#000' }}>
                                    You have no categories
                                </MenuItem>
                        }
                    </Menu>

                    <MenuItem
                        onClick={event=>setCategoriesRemoveAnchor(event.currentTarget)}
                        style={props.quote.categories.length ? {display: 'flex'} : {display: 'none'}}
                        className={classes.menuItem}>
                        <ClassIcon className={classes.subMenuIcon}/>
                        Remove from...
                    </MenuItem>

                    <Menu
                        open={categoriesRemoveAnchor}
                        keepMounted
                        anchorEl={categoriesRemoveAnchor}
                        onClose={() => setCategoriesRemoveAnchor(false)}>
                        {
                            props.categories.map(category =>
                                <MenuItem onClick={() => {
                                    props.removeFromCategory(props.quote.text, category, props.quote.index)
                                    setCategoriesRemoveAnchor(null)
                                    setMenuAnchor(null)
                                }}
                                    style={props.quote.categories.includes(category) ? { color: '#000' } : { color: '#999' }}>
                                    {category}
                                </MenuItem>
                            )
                        }
                    </Menu>

                    <MenuItem
                        onClick={()=>{
                            props.handleDelete(props.quote.text, props.quote.index)
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
                                url={props.quote.url}
                                quote={props.quote.text}
                                hashtag="#quote"
                                onClick={()=>{
                                    setShareMenu(null)
                                    setMenuAnchor(null)}}>
                                <FacebookIcon
                                    logoFillColor="white"
                                    className={classes.share}/>
                            </FacebookShareButton>

                            <FacebookMessengerShareButton
                                url={props.quote.url}
                                onClick={()=>{
                                    setShareMenu(null)
                                    setMenuAnchor(null)}}>
                                <FacebookMessengerIcon
                                    logoFillColor="white"
                                    className={classes.share}/>
                            </FacebookMessengerShareButton>

                            <TwitterShareButton
                                url={props.quote.url}
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
                                url={props.quote.url}
                                onClick={()=>{
                                    setShareMenu(null)
                                    setMenuAnchor(null)}}>
                                <WhatsappIcon
                                    logoFillColor="white"
                                    className={classes.share}/>
                            </WhatsappShareButton>

                            <RedditShareButton
                                url={props.quote.url}
                                onClick={()=>{
                                    setShareMenu(null)
                                    setMenuAnchor(null)}}>
                                <RedditIcon
                                    logoFillColor="white"
                                    className={classes.share}/>
                            </RedditShareButton>

                            <LinkedinShareButton
                                url={props.quote.url}
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

            <div className={classes.cardContent}>
                {
                    props.quote.text.length>110 &&
                    <IconButton
                        onClick={()=>setShowText(prev=>!prev)}
                        className={showText ? classes.expandIcon : classes.expandedIcon}>
                        <ExpandMoreIcon className={classes.icons}/>
                    </IconButton>
                }

                <Collapse
                    in={showText}
                    collapsedHeight={88}
                    className={props.quote.text.length>110 ? classes.collapseLong : classes.collapseShort}>
                    <Typography id='text' className={classes.text}>
                    <Highlighter
                        searchWords={[props.filter]}
                        autoEscape={true}
                        highlightStyle={{backgroundColor: 'rgba(138, 46, 68, 0.85)'}}
                        textToHighlight={props.quote.text}/>
                    </Typography>
                </Collapse>
            </div>
        </Card>
    )
}
