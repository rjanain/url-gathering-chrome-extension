// Use the browser global or fallback to chrome
const api = (typeof browser !== 'undefined') ? browser : chrome;

/**
 * Get the current date and time
 * @returns Current date and time
 */
export function getCurrentDateTime() {
    const currentdate = new Date();
    const datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds()

    return datetime
}

/**
 * Get the current time
 * @returns Current time
 */
export function getCurrentTime() {
    const currentdate = new Date();
    const datetime = currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds()

    return datetime
}




/**
 * Store the data in the local storage
 * @param {String} key
 * @param {String} value
 */
export const saveToChromeStorage = async (key, value) => {
    let options = {}
    options[key] = value
    try {
        await api.storage.sync.set(options);
        console.log("Option has been saved to the local storage.");
    } catch (error) {
        console.error("Failed to save to storage:", error);
    }
}




// Reads all data out of storage.sync and exposes it via a promise.
//
// Note: Once the Storage API gains promise support, this function
// can be greatly simplified.
export async function getAllStorageSyncData() {
    try {
        // Use api which will be either browser (with polyfill) or chrome
        const items = await api.storage.sync.get(null);
        return items;
    } catch (error) {
        throw error;
    }
}
