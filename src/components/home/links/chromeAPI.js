/**
 * Get name and url of each tab in the current window
 * @return {Array} An array whose each eleent is an object.
 */
export const getTabs = async () => {
    let queryOptions = {
        currentWindow: true
    }
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let tabs = await chrome.tabs.query(queryOptions)

    let response = []

    tabs.forEach(el => {
        response.push({
            title: el.title,
            url: el.url
        })
    })

    console.log("Tabs:", tabs)
    return response
}