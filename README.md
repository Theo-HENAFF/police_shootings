## The project is visible at
https://viz-ms-bigdata.herokuapp.com/

But if you still want to play with our code, follow the guide :
## How to modify it

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

D3JS content must be added in `views/index.js` or in specific javascript file

If you are using a local dataset, add it in `public/data/` and refer to it in `code.js` as `/data/MYDATA.CSV`

