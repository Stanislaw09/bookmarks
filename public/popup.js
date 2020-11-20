document.addEventListener("DOMContentLoaded", ()=>{

    document.getElementById('saveBtn').addEventListener('click', ()=>{
        chrome.windows.getCurrent(win=>{
            chrome.tabs.query({active: true, windowId: win.id}, tabs=>{
                chrome.storage.sync.get(['pages0', 'pages1', 'pages2', 'pages3', 'pages4'], _data=>{
                    let date=new Date()

                    chrome.tabs.sendMessage(tabs[0].id, {}, response=>{
                        for(let index=0;index<5;index++){
                                if(index==0 && _data.pages0.length<19){
                                    chrome.storage.sync.set({
                                        pages0: [..._data.pages0,{
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
                                if(index==1 && _data.pages1.length<19){
                                    chrome.storage.sync.set({
                                        pages1: [..._data.pages1,{
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
                                if(index==2 && _data.pages2.length<19){
                                    chrome.storage.sync.set({
                                        pages2: [..._data.pages2,{
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
                                if(index==3 && _data.pages3.length<19){
                                    chrome.storage.sync.set({
                                        pages3: [..._data.pages3,{
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
                                if(index==4 && _data.pages4.length<19){
                                    chrome.storage.sync.set({
                                        pages4: [..._data.pages4,{
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
                })

                document.getElementById('saveBtn').innerHTML="Saved!"
            })
        })
    })
})
