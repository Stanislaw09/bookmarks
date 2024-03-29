/* eslint-disable */
document.addEventListener("DOMContentLoaded", event => {
   let contextMenu = {
      "id": "bookmarks",
      title: "Save to quotes",
      "contexts": ["selection"]
   }
   chrome.contextMenus.create(contextMenu)

   chrome.storage.sync.get(['pages', 'pages0'], data => {
      if (data.pages0 === undefined)
         chrome.storage.sync.set({
            pages0: [],
            pages1: [],
            pages2: [],
            pages3: [],
            pages4: [],
            quotes0: [],
            quotes1: [],
            pageCategories: [],
            quoteCategories: []
         })
      if (data.pages !== undefined) {
         chrome.storage.sync.remove('pages')
      }
   })

   chrome.contextMenus.onClicked.addListener(clickData => {
      if (clickData.menuItemId === 'bookmarks' && clickData.selectionText) {

         chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            let favIcon = tabs[0].favIconUrl
            let date = new Date()

            chrome.storage.sync.get(['quotes0', 'quotes1'], _data => {

               let obj={
                  text: clickData.selectionText,
                  url: clickData.pageUrl,
                  favIcon: favIcon,
                  date: date.toLocaleString(),
                  categories: [],
                  favourite: false
               }

               let objSize=JSON.stringify(obj).length
               let saved=false

               for (let index = 0; index < 2; index++) {
                  let saving=new Promise(resolve=>{
                     chrome.storage.sync.getBytesInUse([`quotes${index}`], bytes=>{
                        resolve(bytes)
                     })
                  })

                  saving.then(size=>{
                     if(size+objSize<8000 && !saved){
                        saved=true
                        chrome.storage.sync.set({
                           [`quotes${index}`]: [..._data[`quotes${index}`], obj]
                        })
                     }
                  })
               }
            })
         })

      }
   })

   chrome.storage.onChanged.addListener(() => {
      chrome.storage.sync.get(['pages', 'pages0', 'pages1', 'pages2', 'pages3', 'pages4', 'quotes0', 'quotes1', 'quotes2', 'pageCategories', 'quoteCategories'], syncData => {
         console.log(syncData)
      })
   })
})
