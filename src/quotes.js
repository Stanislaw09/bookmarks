import React,{useEffect, useState} from 'react'
import {Typography, makeStyles, Card, Avatar, Collapse, Link} from '@material-ui/core'
import ShareIcon from '@material-ui/icons/Share'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

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
        width: '100%'
    },
    avatar:{
        width: '45px',
        height: '45px',
        margin: '4px'
    },
    date:{
        margin: '12px 20px',
        fontSize: '20px'
    },
    link:{
        margin: '12px 20px',
        fontSize: '20px',
        display: 'flex',
        textDecoration: 'none',
        underline: 'none',
        color: '#7187ab'
    },
    collapse:{
        margin: '0  0 10px 24px',
        width: 'calc(100% - 68px)',
        float: 'right'
    },
    text:{
        fontSize: '19px',
        lineHeight: '1.8em',
        padding: '10px 20px 10px 0'
    },
    expandIcon:{
        margin: '10px 4px',
        width: '30px',
        height: '30px'
    }
}))

const CardView=props=>{
    const classes=useStyles()
    const [showText, setShowText]=useState(false)

    return(
        <Card className={classes.card}>
            <div className={classes.header}>
                <Avatar src={props.quote.favIcon} className={classes.avatar}/>

                <Typography><Link href={props.quote.url} target='_blank' className={classes.link}>
                    {props.quote.url.replace('http://','').replace('https://','').split(/[/?#]/)[0]}
                </Link></Typography>

                <Typography className={classes.date}>{props.quote.date}</Typography>
            </div>

            <div>
                {props.quote.text.length>160 && <ExpandMoreIcon onClick={()=>setShowText(prev=>!prev)} className={classes.expandIcon}/>}

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
