import React,{useState, useEffect} from 'react'
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
    EmailShareButton,
    EmailIcon} from 'react-share'
import ShareIcon from '@material-ui/icons/Share'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import DeleteIcon from '@material-ui/icons/Delete'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import MenuIcon from '@material-ui/icons/Menu'
const firebase=require('firebase')

const useStyles=makeStyles(theme=>({
    card:{
        width: '70%',
        maxWidth: '1100px',
        margin: '16px auto',
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
        margin: '4px 8px'
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
        width: '46px',
        height: '46px'
    },
    menuItem:{
        marginRight: '10px',
        color: '#444'
    },
    menu:{
        width: '166px'
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
        padding: '6px 26px 6px 0',
        wordWrap: 'break-word'
    },
    expandIcon:{
        width: '42px',
        height: '42px',
        padding: '0',
        transform: 'rotate(180deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        })
    },
    expandedIcon:{
        width: '42px',
        height: '42px',
        padding: '0',
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
    const date=new Date(1970, 0, 1)
    date.setSeconds(props.quote.date.seconds)

    const handleDelete=()=>{
        firebase.firestore().collection('users').doc(props.id).get().then(doc=>{
            let data=doc.data()
            let quotes=data.quotes.filter(item=>item.text!=props.quote.text || item.url!=props.quote.url)

            firebase.firestore().collection("users").doc(props.id).set({
                quotes: quotes,
                pages: data.pages
            })
        })

        setMenuAnchor(null)
    }

    const handleFavourite=()=>{         firebase.firestore().collection('users').doc(props.id).get().then(doc=>{
            let data=doc.data()
            let quotes=data.quotes.map(item=>{
                if(item.text==props.quote.text && item.date.seconds==props.quote.date.seconds)
                    return {
                        date: props.quote.date,
                        favIcon: props.quote.favIcon,
                        favourite: !props.quote.favourite,
                        text: props.quote.text,
                        url: props.quote.url
                    }
                else
                    return item
                })

            firebase.firestore().collection("users").doc(props.id).set({
                quotes: quotes,
                pages: data.pages
            })
        })
        setMenuAnchor(null)
    }

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

                    <Typography className={classes.date}>{date.toLocaleDateString()}</Typography>
                </div>

                <IconButton onClick={event=>setMenuAnchor(event.currentTarget)} className={classes.menuBtn}>
                    <MenuIcon className={classes.icons}/>
                </IconButton>

                <Menu
                    open={menuAnchor}
                    keepMounted
                    anchorEl={menuAnchor}
                    onClose={()=>setMenuAnchor(false)}
                    className={classes.menu}>

                    <MenuItem onClick={handleFavourite}>
                        {
                            props.quote.favourite ?
                                <FavoriteIcon
                                    style={{color: 'rgba(138, 46, 68, 0.95)'}} className={classes.menuItem}/> :
                                    <FavoriteBorderIcon className={classes.menuItem}/>
                        }Favourite
                    </MenuItem>

                    <MenuItem onClick={handleDelete}>
                        <DeleteIcon className={classes.menuItem}/>Delete
                    </MenuItem>

                    <MenuItem onClick={()=>setShareMenu(prev=>!prev)}>
                        <ShareIcon className={classes.menuItem}/>Share
                    </MenuItem>

                    <Collapse in={shareMenu}>
                        <div className={classes.shareContainers}>
                            <FacebookShareButton
                                url={props.quote.url}
                                quote={props.quote.text}
                                hashtag="#quote"
                                onClick={()=>setMenuAnchor(null)}>
                                <FacebookIcon
                                    logoFillColor="white"
                                    className={classes.share}/>
                            </FacebookShareButton>

                            <FacebookMessengerShareButton
                                url={props.quote.url}
                                onClick={()=>setMenuAnchor(null)}>
                                <FacebookMessengerIcon
                                    logoFillColor="white"
                                    className={classes.share}/>
                            </FacebookMessengerShareButton>

                            <TwitterShareButton
                                url={props.quote.url}
                                onClick={()=>setMenuAnchor(null)}>
                                <TwitterIcon
                                    logoFillColor="white"
                                    className={classes.share}/>
                            </TwitterShareButton>
                        </div>

                        <div className={classes.shareContainers}>
                            <WhatsappShareButton
                                url={props.quote.url}
                                onClick={()=>setMenuAnchor(null)}>
                                <WhatsappIcon
                                    logoFillColor="white"
                                    className={classes.share}/>
                            </WhatsappShareButton>

                            <RedditShareButton
                                url={props.quote.url}
                                onClick={()=>setMenuAnchor(null)}>
                                <RedditIcon
                                    logoFillColor="white"
                                    className={classes.share}/>
                            </RedditShareButton>

                            <EmailShareButton
                                url={props.quote.url}
                                onClick={()=>setMenuAnchor(null)}>
                                <EmailIcon
                                    logoFillColor="white"
                                    className={classes.share}/>
                            </EmailShareButton>
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
                    collapsedHeight={92}
                    className={props.quote.text.length>110 ? classes.collapseLong : classes.collapseShort}>
                    <Typography id='text' className={classes.text}>{props.quote.text}</Typography>
                </Collapse>
            </div>
        </Card>
    )
}
