(function(){
    var width = 3000,
        height = 3000;

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    var force = d3.layout.force()
        // .gravity(0.05)
        // .distance(100)
        // .charge(-100)
        .size([width, height])
        .linkDistance(600);

    d3.json("js/data.json", function(error, data) {
        if (error) throw error;
//     let grathInstance = new generateRandomGrath(1000);
//     let data = grathInstance.getData();
// console.log(JSON.stringify(data));
        force
            .nodes(data.nodes)
            .links(data.links);
        setTimeout(function() {

            var n = 100;
            force.start();
            for (var i = n * n; i > 0; --i) force.tick();
            force.stop();

            var link = svg.selectAll(".link")
                .data(data.links)
                .enter().append("line")
                .attr("class", "link");

            var node = svg.selectAll(".node")
                .data(data.nodes)
                .enter().append("g")
                .attr("class", "node")
                .call(force.drag);
            // node.append("text")
            // // .attr("dx", 12)
            // // .attr("dy", ".35em")
            //     .text(function(d) { return d.name });
                link.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        }, 100);




        // node.append("image")
        //     .attr("xlink:href", "https://github.com/favicon.ico")
        //     .attr("x", -8)
        //     .attr("y", -8)
        //     .attr("width", 16)
        //     .attr("height", 16);



        // force.on("tick", function() {
        //     link.attr("x1", function(d) { return d.source.x; })
        //         .attr("y1", function(d) { return d.source.y; })
        //         .attr("x2", function(d) { return d.target.x; })
        //         .attr("y2", function(d) { return d.target.y; });
        //
        //     node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        // });
    });
})();

function generateRandomGrath(n) {

    let _size = n;
    let nodes = [];
    let links = [];

    function generateNodes() {
        let i = _size;
        while (i) {
            nodes.push({id: i-1, name: 'string'+i});
            i--;
        }
    }
    function generateLinks() {
        let i = _size;

        while (i) {
            let k = _size;
            while (k) {
                if(Math.random()>=0.5){
                    links.push({
                        source: i-1,
                        target: k-1
                    })
                }
                k--;
            }
            i--;
        }
    }
    generateNodes();
    generateLinks();

    function getData() {
        return {
            nodes,
            links
        };
    }
    return {
        getData
    }
}