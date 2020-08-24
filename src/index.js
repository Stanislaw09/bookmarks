import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {BrowserRouter} from 'react-router-dom'

const firebase=require('firebase')
require('firebase/firestore')

firebase.initializeApp({
    apiKey: "AIzaSyBN4OxyFPnGpYmUbrpZgbBsop79KccRgXI",
    authDomain: "quote-7cbcd.firebaseapp.com",
    databaseURL: "https://quote-7cbcd.firebaseio.com",
    projectId: "quote-7cbcd",
    storageBucket: "quote-7cbcd.appspot.com",
    messagingSenderId: "819773771295",
    appId: "1:819773771295:web:54c4b62f06e1473ec00f2a"
})

ReactDOM.render(
    <BrowserRouter basename={window.location.pathname || ''}>
        <App />
    </BrowserRouter>,document.getElementById('root')
)
