# Chrome Extension To Gather URL From Browser

By using this chrome extension we can gather all url that are open on the current browser window and directly copy those information into your clipboard in different format likes, Markdown, CSV, html, and plain text. 


# Chrome Web Store Description


By using this chrome extension we can gather all url that are open on the current browser window and directly copy those information into your clipboard in different format likes, Markdown, CSV, html, and plain text. 

- This is an initial working version with the following features.

    - Display all icons corresponding to each page that is currently open on the active browser window. It will not takes `chrome` pages likes `chrome://` or `chrome-extension://` into the consideration. The icons appeared on the app as per the corresponding pages open on the browser. 

    - Upon clicking an icon, the url corresponds to the page will be copied to your clipboard automatically.

    - Also you will find a `Copy To All` button to copy all urls that are currently open on your active browser window  into your clipboard. Currently we are using a empty line space in between two consecutive url while coping. In the next version we will add an feature so that user can change it as per their requirement.




## Dev Deployment

In order to deploy this extension into clone the project from this reposotory and run `npm install`. Note that in the [package.json](./package.json) following `scripts` are defined.

```json
"scripts": {
    "dev": "webpack --watch --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js",
    "stat": "webpack --profile --json > webpack-stats.json"
  }
```
The `webpack` module will take care of building and put it into `dist` folder. There are mainly two command we can use here, while developing the extension we use `npm run dev` and for production we generate files using `npm run build`. 

## Boilerplate As Other Chrome Extension
If you want to use this code to create another chrome extension then you can also use this repo as a boilerplate. For that delete all files inside [./src](./src/) folder leaving  only three blank files [contentScript.js](./src/contentScript.js), [serviceWorker.js](./src/serviceWorker.js), and [popup.js](./src/popup.js). Also deletes all files and subfolders inside [./public](./public/) leaving only two blank files [manifest.json](./public/manifest.json) and [popup.html](./public/popup.html). 







