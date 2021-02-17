/* eslint-disable */
document.addEventListener("DOMContentLoaded", () => {

   document.getElementById('saveBtn').addEventListener('click', () => {
      chrome.windows.getCurrent(win => {
         chrome.tabs.query({ active: true, windowId: win.id }, tabs => {
            chrome.storage.sync.get(['pages0', 'pages1', 'pages2', 'pages3', 'pages4'], _data => {
               let _pages = [..._data.pages0, ..._data.pages1, ..._data.pages2, ..._data.pages3, ..._data.pages4]
               let found = false

               _pages.forEach(item => {
                  if (item.url === tabs[0].url)
                     found = true
               })

               if(!found){
                  let date = new Date()

                  chrome.tabs.sendMessage(tabs[0].id, {}, async(response) => {
                     const obj={
                        url: tabs[0].url,
                        favIcon: tabs[0].favIconUrl,
                        title: tabs[0].title,
                        date: date.toLocaleString(),
                        favourite: false,
                        categories: [],
                        image: response.image
                     }

                     let objSize=JSON.stringify(obj).length
                     let saved=false

                     for (let index = 0; index < 5; index++) {
                        let saving=new Promise(resolve=>{
                           chrome.storage.sync.getBytesInUse([`pages${index}`], bytes=>{
                              resolve(bytes)
                           })
                        })

                        saving.then(size=>{
                           if(size+objSize<8000 && !saved){
                              saved=true
                              chrome.storage.sync.set({
                                 [`pages${index}`]: [..._data[`pages${index}`], obj]
                              })
                              document.getElementById('saveBtn').innerHTML = "Saved!"
                           }
                        })
                     }

                     if(!saved){
                        document.getElementById('saveBtn').innerHTML = "Can't save!"
                     }
                  })
               }
               else{
                  document.getElementById('saveBtn').innerHTML = "Saved!"
               }
            })
         })
      })
   })
})
