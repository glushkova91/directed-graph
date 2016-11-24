(function(){

    let grathInstance = new generateRandomGrath(6);
    let data = grathInstance.getData();
    console.log(JSON.stringify(data));
    console.log(betweennessCentrality(data));
    var width = 960,
        height = 500;

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    var force = d3.layout.force()
        .gravity(0.05)
        .distance(100)
        .charge(-100)
        .size([width, height]);

    d3.json("js/test-data.json", function(error, json) {
        if (error) throw error;

        force
            .nodes(json.nodes)
            .links(json.links)
            .start();

        var link = svg.selectAll(".link")
            .data(json.links)
            .enter().append("line")
            .attr("class", "link");

        var node = svg.selectAll(".node")
            .data(json.nodes)
            .enter().append("g")
            .attr("class", "node")
            .call(force.drag);

        node.append("image")
            .attr("x", -8)
            .attr("y", -8)
            .attr("width", 16)
            .attr("height", 16);

        node.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) { return d.name });

        force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        });
    });
})();

function generateRandomGrath(n) {

    let _size = n;
    let nodes = [];
    let links = [];
    let lists = [];

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
            lists[_size - i] = {
                node: i - 1,
                neighbors: []
            };
            while (k - (_size - i)) {
                if(Math.random()>=0.5){
                    links.push({
                        source: i-1,
                        target: k-1
                    })
                    lists[_size - i].neighbors.push(k-1);
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
            lists,
            links
        };
    }
    return {
        getData
    }
}

function betweennessCentrality(graphData) {
    var betweenness = {};
    graphData.nodes.forEach(function(node) {
        betweenness[node.id] = 0;
    });
    graphData.nodes.forEach(function(node) {
        var S = [], P = fillArray([], 1000), sigma = fillArray(0, 1000),  d = fillArray(-1, 1000),  Q = [];

        sigma[node.id] = 1;
        d[node.id] = 0;
        Q.push(node.id);

        while(Q.length) {
            var v = Q.shift();

            S.push(v);
            for (var w = 0; w < graphData.lists[v].length; w++) {
                // w found for the first time?
                var id = graphData.lists[v][w];
                if(d[id] < 0) {
                    Q.push(id);
                    d[id] = d[v] + 1;
                }
                // shortest path to w via v?
                if (d[id] === d[v] + 1){
                    sigma[id] += sigma[v];
                    P[id].push(v);
                }
            }
        }

        var delta = {};
        for(var i = 0; i < S.length; ++i){
            delta[S[i]] = 0;
        }

        // S returns vertices in order of non-increasing distance from s
        while(S.length) {
            var _w = S.pop(),
                coeff = (1 + delta[_w])/sigma[_w];
            for (i = 0; i < P[_w].length; ++i){
                var _v = P[_w][i];
                delta[_v] += sigma[_v] * coeff;
            }

            if (_w !== node) {
                betweenness[_w] += delta[_w];
            }
        }
    });

    return sortBetweennes(betweenness);
}

function sortBetweennes (b) {
    var sorted = [];
    for(var key in b){
        if (b.hasOwnProperty(key)){
            sorted.push({ key : key, value : b[key]});
        }
    }
    return sorted.sort(function(x, y) { return y.value - x.value; });
}

function fillArray(value, len) {
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr.push(value);
    }
    return arr;
}