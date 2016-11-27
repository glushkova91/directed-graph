# directed-graph

1.  npm install js2xmlparser
2.  cd js
    node generateGraph size=1000
    size is optional (default 100)

3.  node centrality source=../graph.json
    source is optional (default ../graph.json)

4.  node generateGEXF.js source=../graph.json target=../graphXML.gexf
    source is optional (default ../graph.json), target is optional (default ../graphXML.gexf)