# Chrome Extension To Gather URL From Browser

In this project we create a chrome extension to gather all url that are open on the current wbrowser window. It will also give you an option to directly copy those information directly to your clipboard in different format likes, Markdown, CSV, html, and plain text. 

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







