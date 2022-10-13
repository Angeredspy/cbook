# cbook
This App when run locally displays a text box within the browser which is coupled with ESBuild transpiling &amp; bundling capabilities. When a user submits valid JSX code within the textarea in the browser, the transpiled es2015 Javascript counterpart will be displayed beneath. For bundling of various Modules, ESBuilds base behavior of parsing through the local machines filesystem (which wont work in the browser) is overridden by a custom plugin which reaches out to the NPM registry and provides the appropriate data to the in-browser bundler. 
 
Esbuild Documentation: 

[Github Reference](https://esbuild.github.io/api/)
