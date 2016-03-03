ng-d3
=====


Notes et piste de reflections pour la construction d'une directive angular pour wrapper D3.js

[TOC]


## Modéle des données
### [Chord Diagramme](http://bl.ocks.org/mbostock/4062006)
**• Affiche des données flat selon leur volume étant en relations entre elles de façon biderictionnels.**
• Mise en relations de data entres elles et croisé. Il y'a une relation parents enfants unique. Un parent detient un enfant, cet enfant peux lui même détenir le parent.
• La mise en relation se fait via une matrix :

**Représentation dans D3.js**

```javascript
var matrix = [
  [11975,  5871, 8916, 2868],
  [ 1951, 10048, 2060, 6171],
  [ 8010, 16145, 8090, 8045],
  [ 1013,   990,  940, 6907]
];
```

**Représentation de la donné**

```javascript
var data = {
    name : "flare",

};
```
*todo : <s>Réfléchir à un mode de données empirique possible comparable au bubble chart.</s>*

### [Bubble Chart](http://bl.ocks.org/mbostock/4063269)
**• Affiche des données deep selon leur volume ayant des relations parents enfants.**
• Représentation du volume d'entités contenant elle même d'autres entités.
• Structure de données empiriques. Chaque élèments peut avoir un ou plusieurs enfants.

```javascript
var data = {
    "name": "flare",
    "children": [
        {
        "name": "analytics",
        "children": [
            {
            "name": "cluster",
            "children": [
                {"name": "AgglomerativeCluster", "size": 3938},
                {...}
            ]
        },
        {...},
    ]
};
```

### [Sunburst Partition](http://bl.ocks.org/mbostock/4063423)
**• Affiche des données deep selon leur volume ayant des relations parents enfants.**
• Mise en relation de données inclues les unes dans les autres. Une entité parente détient une entité enfant. Pas de partage ente plusieurs données enfants.
• Utilise le même type de données empiriques que le bubble chart.

### [Streamgraph](http://bl.ocks.org/mbostock/4060954)
**• Affiche des données flat selon leur volume et un axe supplémentaire (temp) sans relations entres elles.**
• Evolution du volume des mêmes metrics (sur l'axe des Y) par rapport à une donné mesuré en X (souvent le temps).
• Les data se présente sous un axe x,y pour chaque metric donné

```javascript
var data = [
    [{
        "x" : 100,
        "y" : 50
    }, {
        ...
    }],
    [...]
];
```

*todo : <s>Réfléchir à un mode de données empirique possible comparable au bubble chart, avec seulement un enfant proposé</s>*

### Autres visualisations envisagés
- [force-collapsible chart](http://mbostock.github.io/d3/talk/20111116/force-collapsible.html) (parent / enfant)

<img src="http://4.bp.blogspot.com/-xUqRyt88dDs/UT9meyW00jI/AAAAAAAAAIo/7wZ09JZv-y0/s1600/force03.png">


## features
### All charts

*Options :*

* Width / Height (responsive)
* Légende
* Hover metrics
 * show data
 * show metric name

### Chord diagram
* Tableau permettant d'afficher les donées de façon plus précise

### Surbunst / Bubble
* Parents menant à un enfant au hover

```javascript
var options = {
    legende : true,
    hover   : {
        template : 'show_data_metric'
    },
    chord : {
        table : true
    },
    sunburst : {
        legend : {
            deep : true
        }
    }
};
```

## Pistes de réfléctions
- Ne pas s'appuyer sur une modèle de données unique mais adapter le bon chart selon le modèle de données reçu.
- Ne pas essayer de faire le café en faisant un modèle de donnée qui s'adaptera à tout les charts : chaque chart existe pour représenter un modèle différent !
- Séparer les charts en type de format de données et ce qu'ils peuvent représenter : un **chord** mettra en exergue des relations communes entres plusieurs entitées alors qu'un **bubble** ou un **sunburst** mette en avant des relations parents / enfants et leurs repartions par volume.
- **Modèles de données :**
 - Modèle de relations parents enfants (inscrites dans un scope global)
 - Modèle de relations matrixiel
 - Modèle de relations basés sur un axe x (progression) y (volume)

## Ressources
- [article] [bocoup](https://bocoup.com/weblog/reusability-with-d3) : Exploring Reusability with D3.js
- [article] [Mike Bostock](https://bost.ocks.org/mike/chart/) : Towards Reusable Charts
- [library] [misoproject](http://misoproject.com/d3-chart/tutorials/definechart) : Librairie permettant de faire des charts réutilisables
