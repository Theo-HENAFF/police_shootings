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

function TreemapObject(data, widthTreemap, heightTreemap) {
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
        return d.weight
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
        ["#263220", "#4f6e56", "#7ba267", "#9cc658", "#E0E265", "#e7a636", "#c16d34", "#9B3331"])

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
                .text(`Parent dir : ${d.parent.data.name} | Type : ${d.data.type} | Name : ${d.data.name} | Size : ${d.data.size}kB`)
        })
        .on('mouseout', function () {
            tooltip.style('visibility', 'hidden');
        });

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
}


function collapsTreeObject(data, width, height) {

    const dx = height / 40
    const dy = width / 4
    const margin = ({top: 10, right: 60, bottom: 10, left: 80})

    const root = d3.hierarchy(data);

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

    tree = d3.tree().nodeSize([dx, dy])

    diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)

    root.x0 = dy / 2;
    root.y0 = 0;
    root.descendants().forEach((d, i) => {
        d.id = i;
        d._children = d.children;
        if (d.depth && d.data.name.length !== 7) d.children = null;
    });

    const svg = d3.select("#collapsTree")
        .append("svg")
        .attr("viewBox", [-margin.left, -margin.top, width, dx])
        .style("font", "14px sans-serif")
        .style("user-select", "none");

    const gLink = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5);

    const gNode = svg.append("g")
        .attr("cursor", "pointer")
        .attr("pointer-events", "all");

    function update(source) {
        const duration = d3.event && d3.event.altKey ? 2500 : 250;
        const nodes = root.descendants().reverse();
        const links = root.links();

        // Compute the new tree layout.
        tree(root);

        let left = root;
        let right = root;
        root.eachBefore(node => {
            if (node.x < left.x) left = node;
            if (node.x > right.x) right = node;
        });

        const height = right.x - left.x + margin.top + margin.bottom;

        const transition = svg.transition()
            .duration(duration)
            .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
            .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

        // Update the nodes…
        const node = gNode.selectAll("g")
            .data(nodes, d => d.id);

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = node.enter().append("g")
            .attr("transform", d => `translate(${source.y0},${source.x0})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0)
            .on("click", (event, d) => {
                d.children = d.children ? null : d._children;
                update(d);
            });

        nodeEnter.append("circle")
            .attr("r", 2.5)
            .attr("fill", d => d._children ? "#555" : "#999")
            .attr("stroke-width", 10)
            .on('mouseover', function () {
                tooltip.style('visibility', 'visible');
            })
            .on("mousemove", function (event, d) {
                tooltip
                    .style('top', event.pageY - 10 + 'px')
                    .style('left', event.pageX + 10 + 'px')
                    .text(`Name : ${d.data.name} | Type : ${d.data.type} | Size : ${d.data.size}kB`)
            })
            .on('mouseout', function () {
                tooltip.style('visibility', 'hidden');
            });

        nodeEnter.append("text")
            .attr("dy", "0.31em")
            .attr("x", d => d._children ? -6 : 6)
            .attr("text-anchor", d => d._children ? "end" : "start")
            .text(d => d.data.name)
            .on('mouseover', function () {
                tooltip.style('visibility', 'visible');
            })
            .on("mousemove", function (event, d) {
                tooltip
                    .style('top', event.pageY - 10 + 'px')
                    .style('left', event.pageX + 10 + 'px')
                    .text(`Name : ${d.data.name} | Type : ${d.data.type} | Size : ${d.data.size}kB`)
            })
            .on('mouseout', function () {
                tooltip.style('visibility', 'hidden');
            })
            .clone(true).lower()
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
            .attr("stroke", "white");

        // Transition nodes to their new position.
        const nodeUpdate = node.merge(nodeEnter).transition(transition)
            .attr("transform", d => `translate(${d.y},${d.x})`)
            .attr("fill-opacity", 1)
            .attr("stroke-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        const nodeExit = node.exit().transition(transition).remove()
            .attr("transform", d => `translate(${source.y},${source.x})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0);

        // Update the links…
        const link = gLink.selectAll("path")
            .data(links, d => d.target.id);

        // Enter any new links at the parent's previous position.
        const linkEnter = link.enter().append("path")
            .attr("d", d => {
                const o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            });

        // Transition links to their new position.
        link.merge(linkEnter).transition(transition)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition(transition).remove()
            .attr("d", d => {
                const o = {x: source.x, y: source.y};
                return diagonal({source: o, target: o});
            });

        // Stash the old positions for transition.
        root.eachBefore(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    update(root);

    return svg.node();
}