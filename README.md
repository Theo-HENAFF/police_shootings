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

## To do list
- [X]  Mise en place du data object pour la Treemap
- [ ]  Toggle switch NB Hab/densité de population
- [ ]  Stacked Area Chart
- [X]  Clean la treemap
- [ ]  Tableau (Description, état, population, ...)
- [ ]  Adaptabilité du tableau au survol
- [ ]  Homogénéisation des couleurs
- [ ]  Homogénéisation des tailles graphiques (Responsive ?)
- [ ]  **BONUS :**  Micro graphique au survol.

## Source list

https://observablehq.com/@d3/treemap

https://www.d3-graph-gallery.com/graph/treemap_custom.html

https://observablehq.com/@analyzer2004/plot-gallery

https://observablehq.com/@analyzer2004/gridcartogram

https://observablehq.com/@mbostock/u-s-population-by-state-1790-1990

https://bl.ocks.org/mbostock/3885211
