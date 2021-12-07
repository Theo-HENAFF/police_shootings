function TableObject(dataObject, widthTable, heightTable) {
    let data = dataObject.children


    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = widthTable - margin.left - margin.right,
        height = heightTable - margin.top - margin.bottom;

    var sortAscending = true;
    var table = d3.select('#table').append('table')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var titles = Object.keys(data[0])//d3.keys(data[0]);
    var headers = table.append('thead').append('tr')
        .selectAll('th')
        .data(titles).enter()
        .append('th')
        .text(function (d) {
            return d;
        })
        .on('click', function (d) {
            headers.attr('class', 'header');

            if (sortAscending) {
                rows.sort(function (a, b) {
                    return b[d] - a[d];
                });
                sortAscending = false;
                this.className = 'aes';
            } else {
                rows.sort(function (a, b) {
                    return b[d] - a[d];
                });
                sortAscending = true;
                this.className = 'des';
            }

        });

    var rows = table.append('tbody').selectAll('tr')
        .data(data).enter()
        .append('tr');
    rows.selectAll('td')
        .data(function (d) {
            return titles.map(function (k) {
                return {'value': d[k], 'name': k};
            });
        }).enter()
        .append('td')
        .attr('data-th', function (d) {
            return d.name;
        })
        .text(function (d) {
            if (d.name === "shooting") {
                return `Total of ${d.value.length} killing`
            }
            return d.value;
        });

};