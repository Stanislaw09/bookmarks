document.addEventListener("DOMContentLoaded", event=>{
    let contextMenu = {
        "id": "bookmarks",
        title: "Save to quotes",
        "contexts": ["selection"]
    }
    chrome.contextMenus.create(contextMenu)

    chrome.storage.sync.get(['pages0'], data => {
        if (data.pages0 == undefined)
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
    })

    chrome.contextMenus.onClicked.addListener(clickData => {
        if (clickData.menuItemId == 'bookmarks' && clickData.selectionText) {
            let date = new Date()

            let icon = chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
                let favIcon = tabs[0].favIconUrl
                let date = new Date()

                chrome.storage.sync.get(['quotes0', 'quotes1'], _data => {
                    let index=0

                    if(_data.quotes0.length>_data.quotes1.length)
                        index=1

                    chrome.storage.sync.set({
                        [`quotes${index}`]: [..._data[`quotes${index}`], {
                            text: clickData.selectionText,
                            url: clickData.pageUrl,
                            favIcon: favIcon,
                            date: date.toLocaleString(),
                            categories: [],
                            favourite: false
                        }]
                    })

                })
            })

        }
    })

    chrome.storage.onChanged.addListener(() => {
        chrome.storage.sync.get(['pages0', 'pages1', 'pages2', 'pages3', 'pages4', 'quotes0', 'quotes1', 'quotes2', 'pageCategories', 'quoteCategories'], syncData => {
            console.log(syncData)
        })
    })
})
