import React, {useEffect} from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {BrowserRouter} from 'react-router-dom'

const firebase=require('firebase')
require('firebase/firestore')

firebase.initializeApp({
    apiKey: "AIzaSyBwv6kBwArkU2E5Ye99J_y24yVHugkgG5s",
    authDomain: "bookmarksextension-ddc64.firebaseapp.com",
    databaseURL: "https://bookmarksextension-ddc64.firebaseio.com",
    projectId: "bookmarksextension-ddc64",
    storageBucket: "bookmarksextension-ddc64.appspot.com",
    messagingSenderId: "148052591321",
    appId: "1:148052591321:web:52bce476c97c903386f4c8"
})

ReactDOM.render(
    <BrowserRouter basename={window.location.pathname || ''}>
        <App/>
    </BrowserRouter>,document.getElementById('root')
)
