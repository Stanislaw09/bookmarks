document.addEventListener("DOMContentLoaded", event=>{
    let id=''
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
      apiKey: "AIzaSyBwv6kBwArkU2E5Ye99J_y24yVHugkgG5s",
      authDomain: "bookmarksextension-ddc64.firebaseapp.com",
      databaseURL: "https://bookmarksextension-ddc64.firebaseio.com",
      projectId: "bookmarksextension-ddc64",
      storageBucket: "bookmarksextension-ddc64.appspot.com",
      messagingSenderId: "148052591321",
      appId: "1:148052591321:web:52bce476c97c903386f4c8"
  })
  let database=app.database().ref()

  chrome.identity.getProfileUserInfo(user=>{
      chrome.storage.sync.set({
          userId: user.id,
          userMail: user.email
      })

      id=user.id

      let docRef=firebase.firestore().collection("users").doc(id)

      docRef.get().then(doc=>{
          if(!doc.exists){
              firebase.firestore().collection('users').doc(id).set({
                  pages: [],
                  quotes:[],
                  pageCategories: [],
                  quoteCategories: []
                }).then(()=>{
                  console.log("Document successfully written")
                })
                .catch(error=>{
                    console.error("shit happens:", error)
                })
            }
        })
  })

  chrome.contextMenus.onClicked.addListener(clickData=>{
      if(clickData.menuItemId=='bookmarks' && clickData.selectionText){
          let date=new Date()

          let icon=chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs=>{
              let favIcon=tabs[0].favIconUrl

              firebase.firestore().collection("users").doc(id).get().then(doc=>{
                  let data=doc.data()

                  firebase.firestore().collection("users").doc(id).set({
                      pages: data.pages,
                      quotes: [...data.quotes,{
                          text: clickData.selectionText,
                          url: clickData.pageUrl,
                          favIcon: favIcon,
                          date: date,
                          categories: [],
                          favourite: false
                      }],
                      pageCategories: data.pageCategories,
                      quoteCategories: data.quoteCategories
                  })
              })
          })
      }
  })

  chrome.storage.onChanged.addListener(()=>{
      chrome.storage.sync.get(['url', 'favIcon', 'title'], syncData=>{

          chrome.tabs.query({active: true, currentWindow: true}, tabs=>{
                chrome.tabs.sendMessage(tabs[0].id, {}, response=>{
                    let date=new Date()

                    firebase.firestore().collection("users").doc(id).get().then(doc=>{
                        let data=doc.data()

                        firebase.firestore().collection("users").doc(id).set({
                            quotes: data.quotes,
                            pages: [...data.pages,{
                                url: syncData.url,
                                favIcon: syncData.favIcon,
                                title: syncData.title,
                                date: date,
                                image: response.image,
                                categories: [],
                                favourite: false
                            }],
                            pageCategories: data.pageCategories,
                            quoteCategories: data.quoteCategories
                        })
                    })
                })
            })
      })
  })
})
