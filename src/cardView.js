import React,{useState} from 'react'
import {Typography,
    makeStyles,
    Card,
    Avatar,
    Collapse,
    Link,
    IconButton,
    Menu,
    MenuItem} from '@material-ui/core'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
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
        width: '80%',
        margin: '10px 20px',
        [theme.breakpoints.down('sm')]:{
            width: '94%'
        }
    },
    cardHeader:{
        display: 'inline-flex',
        width: '100%',
        justifyContent: 'space-between',
    },
    cardSubHeader:{
        display: 'flex'
    },
    avatar:{
        width: '40px',
        height: '40px',
        margin: '6px'
    },
    link:{
        margin: '12px 20px',
        fontSize: '20px',
        display: 'flex',
        textDecoration: 'none',
        underline: 'none',
        color: '#7187ab'
    },
    date:{
        margin: '12px 20px',
        fontSize: '20px'
    },
    menuItem:{
        marginRight: '10px'
    },
    collapse:{
        margin: '0  0 10px 16px',
        width: 'calc(100% - 68px)'
    },
    text:{
        fontSize: '19px',
        lineHeight: '1.8em',
        padding: '10px 46px 10px 0'
    },
    expand:{
        padding: '10px',
        margin: '2px',
        height: '50px',
        transform: 'rotate(180deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        })
    },
    expanded:{
        padding: '10px',
        margin: '2px',
        height: '50px',
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
        width: '50px',
        height: '50px',
        margin: '5px',
        borderRadius: '50%'
    }
}))

export const CardView=props=>{
    const classes=useStyles()
    const [showText, setShowText]=useState(false)
    const [menuAnchor, setMenuAnchor]=useState(null)
    const [shareMenu, setShareMenu]=useState(false)
    const date=new Date(1970, 0, 1)
    date.setSeconds(props.quote.date.seconds)

    const handleDelete=event=>{
        firebase.firestore().collection('quotes').doc(props.quote.id).delete().then(()=>{
            console.log("deleted")
        }).catch(error=>{
            console.error("Shit happens:",error)
        })
        setMenuAnchor(null)
    }

    const handleFavourite=()=>{
        firebase.firestore().collection('quotes').doc(props.quote.id).set({
            favourite: !props.quote.favourite,
            url: props.quote.url,
            date: props.quote.date,
            favIcon: props.quote.favIcon,
            text: props.quote.text
        })

        setMenuAnchor(null)
    }

    return(
        <Card className={classes.card}>
            <div className={classes.cardHeader}>
                <div className={classes.cardSubHeader}>
                    <Avatar src={props.quote.favIcon} className={classes.avatar}/>

                    <Typography>
                        <Link href={props.quote.url} target='_blank' className={classes.link}>
                            {props.quote.url.replace('http://','').replace('https://','').replace('en.', '').replace('www.', '').split(/[/?#]/)[0]}
                        </Link>
                    </Typography>

                    <Typography className={classes.date}>{date.toDateString()}</Typography>
                </div>

                <IconButton onClick={event=>setMenuAnchor(event.currentTarget)}>
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
                                <FavoriteIcon className={classes.menuItem}/> :
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
            </div>

            <div className={classes.cardContent}>
                {props.quote.text.length>160 &&
                    <IconButton
                        onClick={()=>setShowText(prev=>!prev)}
                        className={showText ? classes.expand : classes.expanded}>
                        <ExpandMoreIcon className={classes.icons}/>
                    </IconButton>
                }

                <Collapse in={showText} collapsedHeight={110} className={classes.collapse}>
                    <Typography className={classes.text}>{props.quote.text}</Typography>
                </Collapse>
            </div>
        </Card>
    )
}
