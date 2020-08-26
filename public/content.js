chrome.extension.onMessage.addListener((msg, sender, sendResponse)=>{

    let images=document.getElementsByTagName("img")

        for(let i=0;i<images.length;i++)
            if(images[i].width>=185 && images[i].height>=185)
                if(!images[i].src.includes('?q='))
                    sendResponse({image: images[i].src})

    sendResponse({image: 'https://firebasestorage.googleapis.com/v0/b/quote-7cbcd.appspot.com/o/article2.jpg?alt=media&token=0327b747-3495-4e62-80ea-a090d3e3a693'})
})
