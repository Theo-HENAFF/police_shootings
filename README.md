## How to use it

### Prerequisite :
1. Download and install NodeJS https://nodejs.org/en/.

### To run the app :
1. Clone the git
2. Go to the folder to execute the following command to install all packages
```sh
npm install
```
3. Run the following commands to launch the server.
```sh
node app.js
```
4. Go to localhost:3000 and enjoy the visualization

### To modify the app :
All the d3JS code is in `public/javascripts/code.js`

D3JS content must be added in `#viz` div (located in `views/index.js`)

If you are using a local dataset, add it in `public/data/` and refer to it in `code.js` as `/data/MYDATA.CSV`

## Reading list babe

https://observablehq.com/@d3/treemap

https://observablehq.com/@analyzer2004/plot-gallery

https://observablehq.com/@analyzer2004/gridcartogram

https://observablehq.com/@mbostock/u-s-population-by-state-1790-1990
