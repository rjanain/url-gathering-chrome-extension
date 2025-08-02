
import { Browser } from './browser.js';

// Use the browser API abstraction
const api = Browser.api.getAPI();

/**
 * Get id, windowId, name and url of each tab in the current window
 * @return {Array} An array whose each eleent is an object.
 */
export const getTabs = async () => {

    let queryOptions = {
        currentWindow: true
    }

    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let tabs = await api.tabs.query(queryOptions)
    tabs = processTabData(tabs)
    let response = []

    tabs.forEach(el => {
        response.push({
            id: el.id ? el.id : -1,
            windowId: el?.windowId,
            favIconUrl: el?.favIconUrl,
            title: el.title,
            url: el.url,
            highlighted : el.highlighted,
            active: el.active
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

    /* Remove browser-specific internal pages using the browser abstraction */
    const filteredData = Browser.quirks.filterInternalUrls(uniqueData);


    // console.log('filtered', filteredData)

    return (filteredData)
}
