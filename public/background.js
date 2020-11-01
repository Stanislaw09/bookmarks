document.addEventListener("DOMContentLoaded", event=>{
    let contextMenu = {
        "id": "bookmarks",
        title: "Save to quotes",
        "contexts": ["selection"]
    }
    chrome.contextMenus.create(contextMenu)

    chrome.storage.sync.get(['pages'], data => {
        if (data.pages == undefined)
            chrome.storage.sync.set({
                pages: [],
                quotes: [],
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

                chrome.storage.sync.get(['quotes'], _data => {
                    chrome.storage.sync.set({
                        quotes: [..._data.quotes, {
                                text: clickData.selectionText,
                                url: clickData.pageUrl,
                                favIcon: favIcon,
                                date: date,
                                categories: [],
                                favourite: false
                        }]
                    })
                })

            })
        }
    })

    chrome.storage.onChanged.addListener(() => {
        chrome.storage.sync.get(['pages', 'quotes', 'pageCategories', 'quoteCategories'], syncData => {
            console.log(syncData)
        })
    })
})
