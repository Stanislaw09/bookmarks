document.addEventListener("DOMContentLoaded", ()=>{
    
    document.getElementById('saveBtn').addEventListener('click', ()=>{
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs=>{

            chrome.storage.sync.set({
                url: tabs[0].url,
                favIcon: tabs[0].favIconUrl,
                title: tabs[0].title
            })

            document.getElementById('saveBtn').innerHTML="Saved!"
        })
    })
})
