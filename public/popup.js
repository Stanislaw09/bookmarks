document.addEventListener("DOMContentLoaded", ()=>{

    document.getElementById('saveBtn').addEventListener('click', ()=>{
        chrome.windows.getCurrent(win=>{
            chrome.tabs.query({active: true, windowId: win.id}, tabs=>{

                chrome.storage.sync.get(['pages'], _data=>{
                    let date=new Date()

                    chrome.tabs.sendMessage(tabs[0].id, {}, response=>{
                        chrome.storage.sync.set({
                            pages: [..._data.pages,{
                                url: tabs[0].url,
                                favIcon: tabs[0].favIconUrl,
                                title: tabs[0].title,
                                date: date.toLocaleString(),
                                favourite: false,
                                categories: [],
                                image: response.image
                            }]
                        })
                    })
                })

                document.getElementById('saveBtn').innerHTML="Saved!"
            })
        })
    })
})
