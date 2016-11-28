// var js2xmlparser = require("js2xmlparser");
var xml = require('xml');
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
    "gexf": [
        {
            _attr: {
                xmlns: "http://www.gexf.net/1.3",
                version: "1.3",
                "xmlns:viz": "http://www.gexf.net/1.3/viz"
            }
        },
        {
            "graph": [
                {
                    _attr: {
                        mode: "static",
                        defaultedgetype: "directed"
                    }
                }, {
                    "nodes": []
                }, {
                    "edges": []
                }
            ]
        }
    ]
};
// console.log(data.nodes.length);
for (var i = 0; i < data.nodes.length; i++) {
    var node = {
        "node": [{
            _attr: {
                "id": data.nodes[i].id,
                "label": data.nodes[i].label
            }
        }]
    };
    if (data.nodes[i].betweennessTop) {
        node.node.push({
            'viz:color': {
                _attr: {
                    "r": "205",
                    "g": "0",
                    "b": "8"
                }
            }
        });
        node.node.push({
            'viz:size': {
                _attr: {
                    "value": "15"
                }
            }
        });
    }
    if (data.nodes[i].pageRankTop) {
        node.node.push({
            'viz:color': {
                _attr: {
                    "r": "62",
                    "g": "33",
                    "b": "201"
                }
            }
        });
        node.node.push({
            'viz:size': {
                _attr: {
                    "value": "15"
                }
            }
        });
    }
    obj.gexf[1].graph[1].nodes.push(node);
    console.log('generating node ' + Math.floor((i / data.nodes.length) * 100) + '%');
}
for (var k = 0; k < data.edges.length; k++) {
    obj.gexf[1].graph[2].edges.push({
        "edge": [{
            _attr: {
                "id": data.edges[k].id,
                "source": data.edges[k].source,
                "target": data.edges[k].target
            }
        }]
    });
    console.log('generating edge ' + Math.ceil((k / data.edges.length) * 100) + '%');
}
fs.writeFile(targetUrl, xml(obj, { declaration: true }), function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});