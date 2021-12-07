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
            range: ["#263220","#4f6e56","#7ba267","#9cc658",
                    "#E0E265", "#c16d34", "#9B3331"],
            legend: true
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
        plot
    );
}