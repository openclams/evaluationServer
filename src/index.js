const express = require( "express" );
var bodyParser = require("body-parser");
var cors= require('cors')
const app = express();
const port = 8080; // default port to listen

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Please use http://localhost:8080/calculate" );
} );

var status;
var missingElements = new Boolean();
var abstractComponentsInProject = new Array();
var receivedComponents = new Array();
var activeGraphComponents = new Array();
var activeGraphAbstractComponents = new Array();
var activeGraphCost = new Number();
var projectCost = new Number();


app.post('/calculate', function(request, response) {
    let bodyJson = request.body;
    let activeGraph;
    abstractComponentsInProject = [];
    receivedComponents = [];
    activeGraphComponents = [];
    activeGraphAbstractComponents = [];


    for(let frameKey of bodyJson.data.project.frames) {
        activeGraph = frameKey.activeGrpah;
    }
    for(let component of bodyJson.data.project.components){
        receivedComponents.push(component);
        if(component.type == 'Pattern'){
            abstractComponentsInProject.push(component.id);
        }
    }
    getActiveGraphComponents(activeGraph, bodyJson.data);
    calculateActiveGraphCost();
    calculateProjectCost();

    for(let entry of bodyJson.data.graphs){
        if(entry.nodes.length != null){
        }
    }


    response.json({"responseData":{ "architectureCost": projectCost,
            "abstractComponentsInProject": abstractComponentsInProject,
            "activeGraphCost": activeGraphCost, "abstracComponentsInActivegraph": activeGraphAbstractComponents,
            "status": status
            }});
    response.end("yes");
});

    function calculateActiveGraphCost(){
        let componentIdx = new Number();
        activeGraphCost = 0;
        let componentCost = 0;
        console.log(activeGraphComponents);
    for (let activeGraphComponent of activeGraphComponents){
        if(activeGraphComponent.type == 'Instance') {
            componentIdx = activeGraphComponent.componentIdx;
            componentCost = receivedComponents[componentIdx];
            for(let attribute of componentCost.attributes){
                if(attribute.id == 'cost') {
                   // console.log(attribute);
                    activeGraphCost = activeGraphCost + (attribute.value.units * attribute.value.cost);
                }
            }
        } else {
            if (activeGraphComponent.component){
                activeGraphAbstractComponents.push(activeGraphComponent.component.id);
            } else {
                // activeGraphAbstractComponents.push(activeGraphComponent);
            }

        }
    }

    return activeGraphCost;
}


function getActiveGraphComponents(activeGraph, receivedProject){
    for(let graph of receivedProject.graphs){
        if (graph.id == activeGraph){
            for(let node of graph.nodes) {
                    if(node.type == 'Instance'){
                        receivedConcreteComponent = receivedComponents[node.componentIdx];
                        nodeType =  getNodeOfActiveGraph(receivedConcreteComponent);
                        if( nodeType == 'Pattern' ){
                            activeGraphAbstractComponents.push(receivedConcreteComponent.id)
                        } else {
                            activeGraphComponents.push(node);
                        }
                    } else {
                        if (node.type == 'Template') {
                            console.log('Template Found');
                            for(let element of node.elements) {
                                concreteComponentInTemplate = receivedComponents[element.componentIdx];
                                nodeType = getNodeOfActiveGraph(concreteComponentInTemplate);
                                if( nodeType == 'Pattern' ){
                                    activeGraphAbstractComponents.push(concreteComponentInTemplate.id)
                                } else {
                                    activeGraphComponents.push(node);
                                }
                            }
                        }
                    }
            }
        }
    }
}

function getNodeOfActiveGraph(activeGraphComponent){
        console.log(activeGraphComponent);
        if(activeGraphComponent.type == 'Pattern' ) {
            nodeType = activeGraphComponent.type;
            return nodeType;
        } else {
            nodeType = activeGraphComponent.type;
            return nodeType
        }
}

function calculateProjectCost(){
        projectCost = 0;
        for(let component of receivedComponents) {
            if( component.type == 'Service') {
                for(let attribute of component.attributes) {
                    if(attribute.id == 'cost') {
                        projectCost = projectCost + (attribute.value.units * attribute.value.cost);
                    }
                }
            }
        }
}


function calculateFunction(bodyJson){
    abstractComponentsInProject.length = 0;
    costsum = 0;
    let costSum = 0;
    const receivedData = bodyJson;
   for (let item in bodyJson.data.typeInstances) {
       // console.log(bodyJson.data.typeInstances[item]);
       const receivedItem = receivedData.data.typeInstances[item];
       costModelCheck(receivedItem);
       if(receivedData.data.typeInstances[item].selectedRegion != null) {
           costSum = Number(receivedData.data.typeInstances[item].selectedRegion.costValue) * Number(receivedData.data.typeInstances[item].selectedRegion.costModelValue) + costSum;
           missingElements = false;
       } else {
           abstractComponentsInProject.push(receivedData.data.typeInstances[item]);
       }
       if(abstractComponentsInProject.length > 0) {
           missingElements = true;
       }
       status = "200";
   }
   // console.log(costSum);
   return costSum;
}

/**
 * The received item from the Frontend
 * @param receivedItem
 * @returns {number}
 */
function costModelCheck(receivedItem) {
    let costModel;
    let costModelValue;
    let costs;
    let costModelUnitSum;

    if(receivedItem.selectedRegion != null){
        costModel = receivedItem.selectedRegion.costModel;
        if(costModel == 'timeBased' || costModel == null){
            costModelValue = receivedItem.selectedRegion.costModelValue;
            console.log('Model 1 ' + costModelValue);
            costModelUnitSum = receivedItem.selectedRegion.costvalue * costModelValue;
            console.log('Gesamtkosten' + costModelUnitSum);
        } else if (costModel == 'callBased'){
            costModelValue = item.costModelValue;
            console.log('Model 2 ' + costModelValue);
            costs = item.selectedRegion.costValue;
            costModelUnitSum = cost * costModelValue;
            costModelUnitSum = costs * costModelValue;
        } else if (costModel == 'troughputbased'){
            costModelValue = item.costModelValue;
            console.log('Model 2 ' + costModelValue);
            costs = item.selectedRegion.costValue;
            costModelUnitSum = costs * costModelValue;
        }


    }

    return costModelUnitSum
}


// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
