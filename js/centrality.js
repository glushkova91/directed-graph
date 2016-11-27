var fs = require('fs');
var source;
process.argv.forEach((val) => {
    if (~val.indexOf('source')) {
        source = val.split('=')[1];
    }
});
var sourceUrl = source || '../graph.json';
var data = JSON.parse(fs.readFileSync(sourceUrl, 'utf8'));
var betweennessData = betweennessCentrality(data, true);
var pageRankData = pageRank(data);

for (var i = 0; i < 10; i++) {
    data.nodes[betweennessData[i].key].betweennessTop = betweennessData[i].value;
    data.nodes[pageRankData[i].key].pageRankTop = pageRankData[i].value;
}

function betweennessCentrality(graphData, directed) {
    var betweenness = {};
    graphData.nodes.forEach(function (node) {
        betweenness[node.id] = 0;
    });
    graphData.nodes.forEach(function (node) {
        var S = [], P = {}, sigma = {}, d = {}, Q = [];

        graphData.nodes.forEach(function (node) {
            P[node.id] = [];
            sigma[node.id] = 0;
            d[node.id] = -1;
        });

        sigma[node.id] = 1;
        d[node.id] = 0;
        Q.push(node.id);

        while (Q.length) {
            var v = Q.shift();

            S.push(v);
            for (var w = 0; w < graphData.lists[v].neighbors.length; w++) {
                // w found for the first time?
                var id = graphData.lists[v].neighbors[w];
                if (d[id] < 0) {
                    Q.push(id);
                    d[id] = d[v] + 1;
                }
                // shortest path to w via v?
                if (d[id] === d[v] + 1) {
                    sigma[id] += sigma[v];
                    P[id].push(v);
                }
            }
        }

        var delta = {};
        for (var i = 0; i < S.length; ++i) {
            delta[S[i]] = 0;
        }

        // S returns vertices in order of non-increasing distance from s
        while (S.length) {
            var _w = S.pop(),
                coeff = (1 + delta[_w]) / sigma[_w];
            for (var a = 0; a < P[_w].length; a++) {
                var _v = P[_w][a];
                delta[_v] += sigma[_v] * coeff;
            }

            if (_w !== node.id) {
                betweenness[_w] += delta[_w];
            }
        }
    });
    betweenness = reScale(betweenness);
    return sortBetweennes(betweenness);

    function reScale(b) {
        var l = graphData.nodes.length;
        var division = (l - 1) * (l - 2) / (directed ? 1 : 2);
        var rescaled = {};

        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                rescaled[key] = b[key] / division;
            }
        }
        return rescaled;
    }

    function sortBetweennes(b) {
        var sorted = [];
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                sorted.push({key: key, value: b[key]});
            }
        }
        return sorted.sort(function (x, y) {
            return y.value - x.value;
        });
    }
}

function pageRank(graphData) {
    var pagerank = {};
    var initialValue = 1 / graphData.nodes.length;

    graphData.nodes.forEach(function (node) {
        pagerank[node.id] = 0;
    });

    for (var key in graphData.lists) {
        if (graphData.lists.hasOwnProperty(key)) {
            var links = graphData.lists[key].neighbors;
            if (!links.length) continue;
            var id = graphData.lists[key]['id'];
            var B = initialValue / links.length;

            for (var i = 0; i < links.length; i++) {
                pagerank[links[i]] += B;
            }
        }
    }

    return sortPageRank(pagerank);
    function sortPageRank(g) {
        var sorted = [];
        for (var key in g) {
            if (g.hasOwnProperty(key)) {
                sorted.push({key: key, value: g[key]});
            }
        }
        return sorted.sort(function (x, y) {
            return y.value - x.value;
        });
    }
}

fs.writeFile(sourceUrl, JSON.stringify(data), function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file graph.json was modified!");
});