document.addEventListener("DOMContentLoaded", event=>{
  let contextMenu={
      "id": "bookmarks",
      title: "Save",
      "contexts": ["selection"]
  }

  chrome.contextMenus.create(contextMenu)

  chrome.storage.sync.set({
      url: '',
      favIcon: '',
      title: '',
      date: {}
  })

  const app=firebase.initializeApp({
      apiKey: "AIzaSyBN4OxyFPnGpYmUbrpZgbBsop79KccRgXI",
      authDomain: "quote-7cbcd.firebaseapp.com",
      databaseURL: "https://quote-7cbcd.firebaseio.com",
      projectId: "quote-7cbcd",
      storageBucket: "quote-7cbcd.appspot.com",
      messagingSenderId: "819773771295",
      appId: "1:819773771295:web:54c4b62f06e1473ec00f2a"
  })
  let database=app.database().ref()

  chrome.contextMenus.onClicked.addListener(clickData=>{
      if(clickData.menuItemId=='bookmarks' && clickData.selectionText){
          let date=new Date()

          let icon=chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs=>{
              let favIcon=tabs[0].favIconUrl

              firebase.firestore().collection('quotes').add({
                  text: clickData.selectionText,
                  url: clickData.pageUrl,
                  favIcon: favIcon,
                  date: date,
                  favourite: false
              })
          })
      }
  })

  chrome.storage.onChanged.addListener(()=>
      chrome.storage.sync.get(['url', 'favIcon', 'title', 'date'], data=>{

          chrome.tabs.query({active: true, currentWindow: true}, tabs=>{
                chrome.tabs.sendMessage(tabs[0].id, {}, response=>{
                    let date=new Date()

                    firebase.firestore().collection('pages').add({
                        url: data.url,
                        favIcon: data.favIcon,
                        title: data.title,
                        date: date,
                        image: response.image,
                        favourite: false
                    })
                })
            })
      })
  )
})
