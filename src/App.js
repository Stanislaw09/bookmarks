import React,{useState, useEffect} from 'react';
const firebase=require('firebase')

function App(){
    const[quotes, setQuotes]=useState(undefined)

    useEffect(()=>{
        firebase
            .firestore()
            .collection('quotes')
            .onSnapshot(serverUpdate=>{
                const _quotes=serverUpdate.docs.map(item=>{
                    const data=item.data()
                    data['id']=item.id
                    return data
                })
                setQuotes(_quotes)
            })
    },[])

    console.log(quotes);

     return (
        <div className="App">
        </div>
     )
}

export default App;
