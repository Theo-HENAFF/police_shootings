// read json data
d3.json("/data/ENSIMAG_folder_tree.json", {
    cache: "no-store"
}).then(function (data) {
    const widthTreemap = 900;
    const heightTreemap = 500;

    const widthCollapsTree = 900;
    const heightCollapsTree = 800;

    TreemapObject(data, widthTreemap, heightTreemap);
    collapsTreeObject(data, widthCollapsTree, heightCollapsTree);
})