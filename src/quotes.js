import React,{useEffect, useState} from 'react'
import {Typography, makeStyles, Button, Card, Avatar, Collapse, Link, IconButton, Menu, MenuItem} from '@material-ui/core'
import ShareIcon from '@material-ui/icons/Share'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import DeleteIcon from '@material-ui/icons/Delete'
import FavoriteIcon from '@material-ui/icons/Favorite'
import MenuIcon from '@material-ui/icons/Menu'
const firebase=require('firebase')

const useStyles=makeStyles(theme=>({
    container:{
        marginBottom: '26px'
    },
    card:{
        width: '80%',
        margin: '10px 20px',
        [theme.breakpoints.down('sm')]:{
            width: '94%'
        }
    },
    header:{
        display: 'inline-flex',
        width: '100%',
        justifyContent: 'space-between',
    },
    subHeader:{
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
        padding: '10px 20px 10px 0'
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
    }
}))

const CardView=props=>{
    const classes=useStyles()
    const [showText, setShowText]=useState(false)
    const [menuAnchor, setMenuAnchor]=useState(null)

    const handleDelete=event=>{
        firebase.firestore().collection('quotes').doc(props.quote.id).delete().then(()=>{
            console.log("deleted")
        }).catch(error=>{
            console.error("Shit happens: ",error)
        })
        setMenuAnchor(null)
    }

    return(
        <Card className={classes.card}>
            <div className={classes.header}>
                <div className={classes.subHeader}>
                    <Avatar src={props.quote.favIcon} className={classes.avatar}/>

                    <Typography><Link href={props.quote.url} target='_blank' className={classes.link}>
                        {props.quote.url.replace('http://','').replace('https://','').split(/[/?#]/)[0]}
                    </Link></Typography>

                    <Typography className={classes.date}>{props.quote.date}</Typography>
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
                    <MenuItem onClick={()=>setMenuAnchor(null)}><FavoriteIcon className={classes.menuItem}/>Favourite</MenuItem>
                    <MenuItem onClick={()=>setMenuAnchor(null)}><ShareIcon className={classes.menuItem}/>Share</MenuItem>
                    <MenuItem onClick={handleDelete}><DeleteIcon className={classes.menuItem}/>Delete</MenuItem>
                </Menu>
            </div>

            <div className={classes.cardContent}>
                {props.quote.text.length>200 &&
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


export const Quotes=props=>{
    const classes=useStyles()

    return(
        <div className={classes.container}>
            {props.quotes && props.quotes.map(quote=><CardView quote={quote}/>)}
        </div>
    )
}
