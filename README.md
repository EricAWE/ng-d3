ng-d3
=====

nd-d3 is a library for creating reusable data visualizations from different types of charts well known in [d3.js](https://d3js.org/). 

ng-d3 propose pour l'instant 3 types de charts. Le nombre de chart réalisable tant à grandir avec le temps.
Pour l'instant les charts proposés sont le [bubble chart](http://bl.ocks.org/mbostock/4063269), le [sunburst](http://bl.ocks.org/mbostock/4063423) et le [chord diagram](http://bl.ocks.org/mbostock/4062006).

**Currently ng-d3 is in development.**

## Data Formating
Pour tous les charts ng-d3 que vous utiliserez, le même modèle de donné devra être fournis. 

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

##Get Started

###Install
Pour installer ng-d3, il vous suffit de la télécharger avec npm ou de télécharger le repository github.

###Loading
Pour charger ng-d3 ajouter simplement la librairie (pas de dépendance nécessaire ! Si d3.js est déja installer il utilisera la version utilisé, si non il loadera la dernière version).

```html
<link rel="stylesheet" href="path/to/src/ng-d3.min.css" />
<script type="text/javascript" src="path/to/src/ng-d3.min.js"></script>
```

### Using
Une fois ng-d3 chargé vous n'avez plus qu'a préparer votre directive et y injecter les paramètres voulus.

A chaque fois que $scope.parameter sera mis à jour, le chart s'updatera.

*demoController.js*

```javascript
angular
    .module('Demo')
    .controller('DemoController', demoController);

demoController.$inject = ['$scope'];

function demoController($scope) {
    $scope.parameters = {
        chart: 'bubble',
        data: data,
        options: {
            supports: [
                {key:'referal', name: 'Referal', color: '#ab4880'},
                {key:'seo', name: 'Seo', color: '#5aab76'},
                {key:'sea', name: 'Sea', color: '#50a0cd'}
            ],
            legend: {
                enable: true,
                position: 'right',
                width: 0.5,
                columns: [
                    {'name': 'relation', 'head': 'Cannaux', 'text-align': 'left'},
                    {'name': 'value', 'head': 'Transactions', 'text-align': 'center'},
                    {'name': 'relativeValue', 'head': '% du total', 'text-align': 'center'}
                ],
                desc: 'des visites totales'
            }
        }
    };
}
```

*index.html*

```html
<ng-d3 parameters="parameters"></ng-d3>
```

## Documentation

### Base
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| chart |String (*required*)|null|Le type de chart rendu. Voir les [types de charts disponibles]()|
| data |data (*required*)|null|Les données du chart|

### Options
Les options sont à renseigner dans **`parameters.options`**

#### options.supports
Array d'objet 

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| key | String |null|La key corespondant au données|
| name | String|null|Le nom de la data corespondante|
| color | String |null|La couleur du support en hexadecimal|

#### options.legend
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| enable | Bool |true|Autorise l'affichage de la légende|
| position | String|right| right, left, top, bottom. Position de la légende  |
| width | Number |0.2|Width de la légende en pourcentage|
| desc | String | of the total | description pour le sunburst |

## Todo
[ ] Créer des template css
[ ] Personalisation de la légende via des fonctions
[ ] Améliorer le responsive
