import { getAllStorageSyncData } from "./handlerStorage"



export const getLink = async (id, data) => {
    const seperator = "\r\n\r\n" // Default Separator for Plain Text
    const options = {}

    // Asynchronously retrieve data from storage.sync, then sve it.
    const initOptions = getAllStorageSyncData().then(items => {
        // Copy the data retrieved from storage into options.
        Object.assign(options, items)
    })
    try {
        await initOptions

        // console.log(options)

        const format = options.format ? options.format : "plaintext"
        const includeName = options.includeName ? options.includeName : false

        // console.log(format, includeName)

        return convertedData(data, id, format, includeName, seperator)


    } catch (e) {
        //Handle Error
    }

}


function makeMarkdownText(title, url, includeName) {
    return '[' + (title && title.trim() && includeName ? title : '') + '](' + url + ')'
}

function makeCSVText(title, url, includeName) {
    console.log(includeName)
    return  (includeName ? ( '"' +  (title && title.trim() ? title : url).replace('"', '\\"') + '",' ) : '') 
    + '"'+ url.replace('"', '\\"')  + '"'
}

function makeJSONText(title, url, includeName) {
    return '{' + (title && includeName ? '\n   "title": "' + title + '",' : '') + '\n   "url": "' + url + '" \n}'
}

function makeHTMLText(title, url, includeName) {
    return '<a href="' + url + '">' + (title && title.trim() && includeName ? title : 'Page Link') + '</a>';
}

function makePlainText(title, url, includeName) {
    return  (title && title.trim() && includeName) ? '"' + title + '" : ' + url : url

}

function convertedData(data, id, format, includeName, seperator) {

    if (id != 'copyAll' && id != 'copyHighlighted') {
        // If a single icon press
        switch (format) {
            case 'markdown':
                return makeMarkdownText(data[id].title, data[id].url, includeName)
            case 'csv':
                return makeCSVText(data[id].title, data[id].url, includeName)
            case 'json':
                return makeJSONText(data[id].title, data[id].url, includeName)
            case 'html':
                return makeHTMLText(data[id].title, data[id].url, includeName)
            default:
                return makePlainText(data[id].title, data[id].url, includeName)
        }
    } else {
        // If press copyall button
        switch (format) {
            case 'markdown':
                return data.map(el => {
                    return makeMarkdownText(el.title, el.url, includeName)
                }).join(seperator)
            case 'csv':
                return data.map(el => {
                    return makeCSVText(el.title, el.url, includeName)
                }).join('\n')
            case 'json':
                return "[" +
                    data.map(el => {
                        return makeJSONText(el.title, el.url, includeName)
                    }).join(",") 
                    + "]"
            case 'html':
                return data.map(el => {
                    return makeHTMLText(el.title, el.url, includeName)
                }).join(seperator)
            default:
                return data.map(el => {
                    return makePlainText(el.title, el.url, includeName)
                }).join(seperator)
        }

        //return data.map(el => { return el.url }).join(seperator)
    }

}