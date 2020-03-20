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
    res.send( "Hello world!" );
} );

var status;
var missingElements = new Boolean();
const elementsWithoutRegionCost = new Array();




app.post('/calculate', function(request, response) {
    let bodyJson =request.body;
    costs = calculateFunction(bodyJson);
    response.json({"responseData":{"architectureCost":costs, "status":status, "missingElements":missingElements,
            "MissingCosts": elementsWithoutRegionCost}});
    response.end("yes");
});



function calculateFunction(bodyJson){


    elementsWithoutRegionCost.length = 0;
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
           elementsWithoutRegionCost.push(receivedData.data.typeInstances[item]);
       }
       if(elementsWithoutRegionCost.length > 0) {
           missingElements = true;
       }
       status = "200";
   }
   console.log(costSum);
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