function swatches({
                      colour,
                      swatchRadius = 6,
                      swatchPadding = swatchRadius * (2/3),
                      labelFont = "12px sans-serif",
                      labelFormat = x => x,
                      labelPadding = swatchRadius * 1.5,
                      marginLeft = 0
                  } = {}) {

    const spacing = colour
        .domain()
        .map(d => labelFormat(d))
        .map(d => getLabelLength(d, labelFont) + (swatchRadius * 2) + swatchPadding + labelPadding)
        .map((_, i, g) => d3.cumsum(g)[i] + marginLeft)

    const width = d3.max(spacing)
    const height = swatchRadius * 2 + swatchPadding * 2

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .style("overflow", "visible")
        .style("display", "block");

    const g = svg
        .append("g")
        .attr("transform", `translate(0, ${height / 2})`)
        .selectAll("g")
        .data(colour.domain())
        .join("g")
        .attr("transform", (d, i) => `translate(${spacing[i - 1] || marginLeft}, 0)`);

    g.append("circle")
        .attr("fill", colour)
        .attr("r", swatchRadius)
        .attr("cx", swatchRadius)
        .attr("cy", 0);

    g.append("text")
        .attr("x", swatchRadius * 2 + swatchPadding)
        .attr("y", 0)
        .attr("dominant-baseline", "central")
        .style("font", labelFont)
        .text(d => labelFormat(d));

    return svg.node()

}
// adapted from https://observablehq.com/@mbostock/autosize-svg
getLabelLength = (label, labelFont = "12px sans-serif") => {
    const id = DOM.uid("label").id;
    const svg = html`<svg>
    <style> .${id} { font: ${labelFont} } </style>
    <g id=${id}>
      <text class="${id}">${DOM.text(label)}</text>
    </g>
  </svg>`;

    // Add the SVG element to the DOM so we can determine its size.
    document.body.appendChild(svg);

    // Compute the bounding box of the content.
    const width = svg.getElementById(id).getBBox().width;

    // Remove the SVG element from the DOM.
    document.body.removeChild(svg);

    return width;
}
function StackedObject(data){
    const races = [...new Set(data.map(d => d.race))];
    const plot = Plot.plot({
        x: {label: "Année"},
        y: {
            grid: true,
            label: "Race",
            tickFormat: "s",
        },
        color: {
            domain: races,
            color: "tableau10"
        },
        marks: [
            Plot.areaY(data, Plot.stackY(Plot.groupX({y: "sum"}, {x: "date", y: "value", fill: "race"})))
        ]
    });

    wrap = (...elems) => {
        const div = document.getElementById("stacked_area");
        elems.forEach(el => div.appendChild(el));
        return div;
    }
    return wrap(
        // Swatches(d3.scaleOrdinal([...new Set(data.map(d => d.race))], d3.schemeCategory10)),
       /* swatches({
            colour: d3.scaleOrdinal(["blueberries with redundant text", "oranges with redundant text", "apples with redundant text"], d3.schemeCategory10),
            labelFormat: l => l.replace("with redundant text", "")
        }),*/
        plot
    );
}