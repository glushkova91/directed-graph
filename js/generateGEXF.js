var js2xmlparser = require("js2xmlparser");
var fs = require('fs');
var source;
var target;
process.argv.forEach((val) => {
    if (~val.indexOf('source')) {
        source = val.split('=')[1];
    }
    if (~val.indexOf('target')) {
        target = val.split('=')[1];
    }
});
var sourceUrl = source || '../graph.json';
var targetUrl = target || '../graphXML.gexf';
var data = JSON.parse(fs.readFileSync(sourceUrl, 'utf8'));


var obj = {
    "graph": {
        "@": {
            "mode": "static",
            "defaultedgetype": "directed"
        },
        "nodes": {
            "node": []
        },
        "edges": {
            "edge": []
        }
    }
};
// console.log(data.nodes.length);
for (var i = 0; i < data.nodes.length; i++) {
    var node = {
        "@": {
            "id": data.nodes[i].id,
            "label": data.nodes[i].label
        }
    };
    if (data.nodes[i].betweennessTop) {
        node['viz:color'] = {
            "@": {
                "r": "205",
                "g": "0",
                "b": "8"
            }
        };
        node['viz:size'] = {
            "@": {
                "value": "15",
            }
        };
    }
    if (data.nodes[i].pageRankTop) {
        node['viz:color'] = {
            "@": {
                "r": "62",
                "g": "33",
                "b": "201"
            }
        };
        node['viz:size'] = {
            "@": {
                "value": "15",
            }
        };
    }
    obj.graph.nodes.node.push(node);
}
for (var k = 0; k < data.edges.length; k++) {
    obj.graph.edges.edge.push({
        "@": {
            "id": data.edges[k].id,
            "source": data.edges[k].source,
            "target": data.edges[k].target
        }
    })
}
fs.writeFile(targetUrl, js2xmlparser.parse("gexf", obj), function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});