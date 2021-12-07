function getTextWidth(text, font) {
    // if given, use cached canvas for better performance
    // else, create new canvas
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}

function getTextHeight(text, font) {
    // if given, use cached canvas for better performance
    // else, create new canvas
    var canvas = getTextWidth.canvas || (getTextHeight.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.height;
}

function TreemapObject(data, topKCities, widthTreemap, heightTreemap) {
    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = widthTreemap - margin.left - margin.right,
        height = heightTreemap - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#treemap")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            `translate(${margin.left}, ${margin.top})`);
// Read data

    // Give the data to this cluster layout:
    const root = d3.hierarchy(data).sum(function (d) {
        return d.value
    }) // Here the size of each leave is given in the 'value' field in input data

    // Then d3.treemap computes the position of each element of the hierarchy
    d3.treemap()
        .size([width, height])
        .paddingTop(15)
        .paddingRight(7)
        .paddingInner(3)
        (root)

    let tooltip = d3
        .select('#treemap')
        .append('div')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('visibility', 'hidden')
        .style('background-color', 'white')
        .style('border', 'solid')
        .style('border-width', '2px')
        .style('border-radius', '5px')
        .style('padding', '5px');

    // prepare a color scale
    var color = d3.scaleOrdinal(["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b10"],
                                ["#263220","#4f6e56","#7ba267","#9cc658","#E0E265", "#e7a636","#c16d34", "#9B3331"])

    // And a opacity scale
    var opacity = d3.scaleLinear()
        .domain([10, 30])
        .range([.6, 1])

    // use this information to add rectangles:
    svg
        .selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr('x', function (d) {
            return d.x0;
        })
        .attr('y', function (d) {
            return d.y0;
        })
        .attr('width', function (d) {
            return d.x1 - d.x0;
        })
        .attr('height', function (d) {
            return d.y1 - d.y0;
        })
        .style("stroke", "black")
        .style("fill", function (d) {
            return color(d.parent.data.name)
        })
        .style("opacity", function (d) {
            return opacity(d.data.value)
        })
        .on('mouseover', function () {
            tooltip.style('visibility', 'visible');
        })
        .on("mousemove", function (event, d) {
            tooltip
                .style('top', event.pageY - 10 + 'px')
                .style('left', event.pageX + 10 + 'px')
                .text(`State : ${d.parent.data.name} | City : ${d.data.name} | Killing : ${d.data.value}`)
        })
        .on('mouseout', function () {
            tooltip.style('visibility', 'hidden');
        });
    // and to add the text labels
    // svg
    //     .selectAll("text")
    //     .data(root.leaves())
    //     .enter()
    //     .append("text")
    //     .attr("x", function (d) {
    //         return d.x0 + 5
    //     })    // +10 to adjust position (more right)
    //     .attr("y", function (d) {
    //         return d.y0 + 20
    //     })    // +20 to adjust position (lower)
    //     .text(function (d) {
    //         return d.data.name.replace('mister_', '')
    //     })
    //     .attr("font-size", "19px")
    //     .attr("fill", "white")

    // and to add the text labels
    svg
        .selectAll("vals")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", function (d) {
            return d.x0 + 4
        })    // +4 to adjust position (more right)
        .attr("y", function (d) {
            return d.y0 + 10
        })    // +10 to adjust position (lower)
        .text(function (d) {
            if (d.x1 - d.x0 - 10 >= getTextWidth(d.data.name.toString(), "11px") && d.y1 - d.y0 > 11) {
                return d.data.name
            }
        })
        .attr("font-size", "11px")
        .attr("fill", "white")


    // Add title for the 3 groups
    svg
        .selectAll("titles")
        .data(root.descendants().filter(function (d) {
            return d.depth == 1
        }))
        .enter()
        .append("text")
        .attr("x", function (d) {
            return d.x0
        })
        .attr("y", function (d) {
            return d.y0 + 10
        })
        .text(function (d) {
            if (d.x1 - d.x0 - 20 >= getTextWidth(d.data.name.replaceAll(' ', '_'), "14px")) {
                return d.data.name
            } else if (d.x1 - d.x0 - 10 >= getTextWidth(d.data.code, "14px")) {
                return d.data.code
            }

        })
        .attr("font-size", "14px")
        .attr("fill", function (d) {
            if (d.x1 - d.x0 - 10 >= getTextWidth(d.data.name, "14px")) {
                return color(d.data.name)
            } else if (d.x1 - d.x0 - 10 >= getTextWidth(d.data.code, "14px")) {
                return color(d.data.name)
            }

        })

    // Add title for the 3 groups
    // svg
    //     .append("text")
    //     .attr("x", 0)
    //     .attr("y", 0)    // +20 to adjust position (lower)
    //     .text("Three group leaders and 14 employees")
    //     .attr("font-size", "19px")
    //     .attr("fill", "grey")
}