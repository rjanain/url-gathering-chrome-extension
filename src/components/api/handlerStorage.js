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
export const saveToChromeStorage = (key, value) => {
    let options = {}
    options[key] = value
    chrome.storage.sync.set(
        options, () => {
            console.log("Option has been saved to the local storage.")
        })
}





// Reads all data out of storage.sync and exposes it via a promise.
//
// Note: Once the Storage API gains promise support, this function
// can be greatly simplified.
export function getAllStorageSyncData() {
    // Immediately return a promise and start asynchronous work
    return new Promise((resolve, reject) => {
        // Asynchronously fetch all data from storage.sync.
        chrome.storage.sync.get(null, (items) => {
            // Pass any observed errors down the promise chain.
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            // Pass the data retrieved from storage down the promise chain.
            resolve(items);
        });
    });
}