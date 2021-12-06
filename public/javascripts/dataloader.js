const numCitiesPerState = 3


// get the data
var data = {children: []}
d3.csv("/data/state_fips@2.csv").then(function (d) {
    data.children = d.map(d => ({
        code: d.stusps,
        name: d.stname,
        sum_value: 0,
        children: [{name: "Other", value: 0}],
        shooting: []
    }))
});

d3.csv("/data/us-cities-top-1k.csv").then(function (d) {

    d.sort((a, b) => (a.state > b.state) ? 1 : ((b.state > a.state) ? -1 : 0)).forEach(function (d) {
        var i = data.children.findIndex(x => x.name === d.state);
        if (data.children[i].children.findIndex(x => x.name === d.city) === -1) {
            data.children[i].children.push({name: d.city, value: 0});
        }
    });
})

d3.csv("/data/shootings.csv").then(function (dsh) {
    dsh.sort((a, b) => (a.state > b.state) ? 1 : ((b.state > a.state) ? -1 : 0)).forEach(function (d) {
        var i = data.children.findIndex(x => x.code === d.state);
        data.children[i].sum_value = data.children[i].sum_value + 1;
        if (data.children[i].children.findIndex(x => x.name === d.city) === -1) {
            data.children[i].children[data.children[i].children.findIndex(x => x.name === "Other")].value++;
        } else {
            data.children[i].children[data.children[i].children.findIndex(x => x.name === d.city)].value++;
        }

        if (data.children[i].shooting.findIndex(x => (x.date === d.date.split('-')[0]) && (x.race === d.race)) === -1) {
            data.children[i].shooting.push({date: d.date.split('-')[0], race: d.race, value: 1});
        } else {
            var o = data.children[i].shooting.findIndex(x => (x.date === d.date.split('-')[0]) &&(x.race === d.race))
            data.children[i].shooting[o].value++;
        }

    });

}).then(function () {
    var map = [[0, 0, ""], [1, 0, ""], [2, 0, ""], [3, 0, ""], [4, 0, ""], [5, 0, ""], [6, 0, ""], [7, 0, ""], [8, 0, ""],
        [9, 0, ""], [10, 0, ""], [11, 0, "ME"], [0, 1, "AK"], [1, 1, ""], [2, 1, ""], [3, 1, ""], [4, 1, ""], [5, 1, ""],
        [6, 1, "WI"], [7, 1, ""], [8, 1, ""], [9, 1, ""], [10, 1, "VT"], [11, 1, "NH"], [0, 2, ""], [1, 2, "WA"],
        [2, 2, "ID"], [3, 2, "MT"], [4, 2, "ND"], [5, 2, "MN"], [6, 2, "IL"], [7, 2, "MI"], [8, 2, ""], [9, 2, "NY"],
        [10, 2, "MA"], [11, 2, ""], [0, 3, ""], [1, 3, "OR"], [2, 3, "NV"], [3, 3, "WY"], [4, 3, "SD"], [5, 3, "IA"],
        [6, 3, "IN"], [7, 3, "OH"], [8, 3, "PA"], [9, 3, "NJ"], [10, 3, "CT"], [11, 3, "RI"], [0, 4, ""], [1, 4, "CA"],
        [2, 4, "UT"], [3, 4, "CO"], [4, 4, "NE"], [5, 4, "MO"], [6, 4, "KY"], [7, 4, "WV"], [8, 4, "VA"], [9, 4, "MD"],
        [10, 4, "DE"], [11, 4, ""], [0, 5, ""], [1, 5, ""], [2, 5, "AZ"], [3, 5, "NM"], [4, 5, "KS"], [5, 5, "AR"],
        [6, 5, "TN"], [7, 5, "NC"], [8, 5, "SC"], [9, 5, "DC"], [10, 5, ""], [11, 5, ""], [0, 6, "HI"], [1, 6, ""],
        [2, 6, ""], [3, 6, ""], [4, 6, "OK"], [5, 6, "LA"], [6, 6, "MS"], [7, 6, "AL"], [8, 6, "GA"], [9, 6, ""],
        [10, 6, ""], [11, 6, ""], [0, 7, ""], [1, 7, ""], [2, 7, ""], [3, 7, ""], [4, 7, "TX"], [5, 7, ""],
        [6, 7, ""], [7, 7, ""], [8, 7, ""], [9, 7, "FL"], [10, 7, ""], [11, 7, ""]]
        .map(d => ({col: d[0], row: d[1], code: d[2]}));

    // set the dimensions and margins of the graph
    var margin_map = {top: 10, right: 10, bottom: 10, left: 10},
        width_map = 800 - margin_map.left - margin_map.right,
        height_map = 450 - margin_map.top - margin_map.bottom;

    const svg = d3.select("#map").append("svg")
        .attr("font-size", "09pt")
        .attr("width", width_map + margin_map.left + margin_map.right)
        .attr("height", height_map + margin_map.top + margin_map.bottom)
        .append("g")
        .attr("transform", "translate(" + margin_map.left + "," + margin_map.top + ")");

    const gmap = new GridMap(svg, width_map, height_map)
        .size([width_map, height_map])
        .cellPalette(d3.interpolateReds)
        .style({sizeByValue: false, legendTitle: "Nombre de personnes tués par la police", defaultTextColor: "black"})
        .field({code: "code", name: "name", total: "sum_value"})
        .mapGrid(map)
        .data(data.children)
        .render();

    svg.node();

}).then(function () {

    const sortedData = {children: []}
    data.children.forEach(function (state) {
        // Get top 5 cities and remove Others also
        state.children = state.children.sort(function (a, b) {
            return b.value - a.value;
        })
            .slice(0, numCitiesPerState+1) // Keep th top x city of the state
            .filter(function (item) {
                return item.name != "Other" && item.value > 2
            });
        if (state.children.length == 1) {
            state.children = state.children.filter(function (item) {
                return item.value > 5
            });
        }
        if (state.children.length > 0) {
            sortedData.children.push(state);
        }
    });

    TreemapObject(sortedData, numCitiesPerState);
}).then(function () {
    TableObject(data);
}).then(function () {
    var stackedData = [];
    data.children.forEach(state => state.shooting.forEach(function(shot){
        if (stackedData.findIndex(x => (x.date === shot.date) && (x.race === shot.race)) === -1) {
            stackedData.push(shot);
        } else {
            var o = stackedData.findIndex(x => (x.date === shot.date) && (x.race === shot.race))
            stackedData[o].value++;
        }
    }));
    stackedData.forEach(d => d.date = new Date(d.date));

    StackedObject(stackedData);
});