# directed-graph
The calculation of a betweenness centrality and page-rank of a random generated directed graph.
The generation of GEXF(xml) file format.

1.  npm install js2xmlparser
2.  cd js
    node generateGraph size=1000
    size is optional (default 100)

3.  node centrality source=../graph.json
    source is optional (default ../graph.json)

4.  node generateGEXF.js source=../graph.json target=../graphXML.gexf
    source is optional (default ../graph.json), target is optional (default ../graphXML.gexf)