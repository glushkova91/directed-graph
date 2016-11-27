var fs = require('fs');
var size;
process.argv.forEach((val) => {
    if (~val.indexOf('size')) {
        size = val.split('=')[1];
    }
});
var grathInstance = new generateRandomGrath(size || 100);
var data = grathInstance.getData();

function generateRandomGrath(n) {

    var _size = n;
    var nodes = [];
    var lists = {};
    var edges = [];

    function generateNodes() {
        var i = 0;
        while (i < _size) {
            nodes.push({
                id: i,
                label: 'string' + i,
            });
            i++;
        }
    }

    function generateLinks() {
        var i = _size;
        var z = 0;
        for (var x = _size; x > 0; x--) {
            lists[x - 1] = {
                id: x - 1,
                neighbors: []
            };
        }

        while (i) {
            var k = _size;
            while (k) {
                if (i === k) {
                    k--;
                    continue;
                }
                if (Math.random() >= 0.5) {
                    edges.push({
                        source: i - 1,
                        target: k - 1,
                        id: z
                    });
                    lists[i - 1].neighbors.push(k - 1);
                    // lists[k - 1].neighbors.push(i-1);
                    z++;
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
            edges: edges
            // links
        };
    }

    return {
        getData
    }
}

fs.writeFile("../graph.json", JSON.stringify(data), function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file graph.json was saved!");
});