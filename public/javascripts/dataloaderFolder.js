// read json data
d3.json("/data/ENSIMAG_folder_tree.json", {
    cache: "no-store"
}).then(function (data) {
    const widthTreemap = 1200;
    const heightTreemap = 600;

    const widthCollapsTree = 1200;
    const heightCollapsTree = 600;

    TreemapObject(data, widthTreemap, heightTreemap);
    collapsTreeObject(data, widthCollapsTree, heightCollapsTree);
})