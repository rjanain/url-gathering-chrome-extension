import { unique } from "webpack-merge"

/**
 * Get id, windowId, name and url of each tab in the current window
 * @return {Array} An array whose each eleent is an object.
 */
export const getTabs = async () => {

    let queryOptions = {
        currentWindow: true
    }

    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let tabs= await chrome.tabs.query(queryOptions)
    tabs = processTabData(tabs)
    let response = []

    tabs.forEach(el => {
        response.push({
            id: el.id ? el.id : -1,
            windowId: el.windowId ? el.windowId : -1,
            title: el.title,
            url: el.url
        })
    })

    console.log("Tabs:", tabs)
    return response
}

/**
 * Process the tabs data by removing duplicates entries and unnecessary pages
 * @param {Array.<Object>} tabs An array that contains each tab information
 * @return {Array.<Object>} An array of object contain processed data
 */
const processTabData = (tabs) => {
    /* Remove duplicates entry based on single duplicate value `url` */
    /* Taken From:  https://stackoverflow.com/a/50082488 */
    const uniqueData = Object.values(
        tabs.reduce(
            (acc, cur) => Object.assign(acc, { [cur.url]: cur }), {}
        ))
    
    /* Remove chrome's pages */
    const filteredData = uniqueData.filter( (el) => {
        return el.url.match('^chrome')  ? false : true 
    })


    // console.log('filtered', filteredData)

    return(filteredData)
}