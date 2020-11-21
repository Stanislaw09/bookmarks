document.addEventListener("DOMContentLoaded", ()=>{

    document.getElementById('saveBtn').addEventListener('click', ()=>{
        chrome.windows.getCurrent(win=>{
            chrome.tabs.query({active: true, windowId: win.id}, tabs=>{
                chrome.storage.sync.get(['pages0', 'pages1', 'pages2', 'pages3', 'pages4'], _data=>{
                    let _pages=[..._data.pages0, ..._data.pages1, ..._data.pages2, ..._data.pages3, ..._data.pages4]
                    let found=false

                    _pages.forEach(item=>{
                        if(item.url===tabs[0].url)
                            found=true
                    })

                    if(!found){

                        let date=new Date()

                        chrome.tabs.sendMessage(tabs[0].id, {}, response=>{
                            for(let index=0;index<5;index++){
                                    if(_data[`pages${index}`].length<19){
                                        chrome.storage.sync.set({
                                            [`pages${index}`]: [..._data[`pages${index}`],{
                                                url: tabs[0].url,
                                                favIcon: tabs[0].favIconUrl,
                                                title: tabs[0].title,
                                                date: date.toLocaleString(),
                                                favourite: false,
                                                categories: [],
                                                image: response.image
                                            }]
                                        })

                                        break
                                    }
                            }
                        })
                    }
                })

                document.getElementById('saveBtn').innerHTML="Saved!"
            })
        })
    })
})
