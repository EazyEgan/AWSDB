// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'eu-west-1'});
//var docClient = new AWS.DynamoDB.DocumentClient();

// Create S3 service object
//var s3 = new AWS.S3({apiVersion: '2006-03-01'});
/*
// Create the parameters for calling createBucket
var bucketParams = {
    Bucket : "csu44000assignment220"
};

// call S3 to create the bucket
s3.createBucket(bucketParams, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data.Location);
    }
});

*/

//var bucket = "https://csu44000assignment220.s3.eu-west-1.amazonaws.com/moviedata.json"
//var bcktparams = {
//    Bucket: 'csu44000assignment220', /* required */
//    Key: 'moviedata.json'
//}


AWS.config.update({
    region: "eu-west-1",
    //endpoint: "http://localhost:8000"
});


var dynamodb = new AWS.DynamoDB();


//var docClient = new AWS.DynamoDB.DocumentClient();

//console.log("Querying for movies from 1992 - titles A-L, with genres and lead actor");

console.log("Querying for movies from 1985.");

var params = {
    TableName : "Movies",
    KeyConditionExpression: "#yr = :yyyy AND begins_with :title",
    ExpressionAttributeNames:{
        "#yr": "year"
    },
    ExpressionAttributeValues: {
        ":yyyy": {"N": year},
        ":title": {"S": title},
    }
};
dynamodb.query(params, function(err, data) {
    if (err) {
        console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");

        data.Items.forEach(function(item) {
            console.log(" -", JSON.stringify(item.year) + ": " + JSON.stringify(item.title)
                + " ... " + JSON.stringify(item.genres)
                + " ... " + JSON.stringify(item.rating));
        });
    }
});
