// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'eu-west-1'});
var docClient = new AWS.DynamoDB.DocumentClient();

// Create S3 service object
var s3 = new AWS.S3({apiVersion: '2006-03-01'});
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
var bcktparams = {
    Bucket: 'csu44000assignment220', /* required */
    Key: 'moviedata.json'
}


AWS.config.update({
    region: "eu-west-1",
    //endpoint: "http://localhost:8000"
});


var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "Movies",
    KeySchema: [
        { AttributeName: "year", KeyType: "HASH"},  //Partition key
        { AttributeName: "title", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "year", AttributeType: "N" },
        { AttributeName: "title", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});

//var fs = require('fs');

s3.getObject(bcktparams, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    //else     console.log(JSON.stringify(data));           // successful response

    var allMovies = JSON.parse(data.Body.toString('utf-8'));
    /*fs.writeFile('myjsonfile.json', data.Body.toString('utf-8'), (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });*/

    allMovies.forEach(function(movie) {
        var params = {
            TableName: "Movies2",
            Item: {
                "year":  movie.year,
                "title": movie.title,
                "genres":  movie.info.genres,
                "rating":  movie.info.rating
            }
        };

        docClient.put(params, function(err) {
            if (err) {
                console.error("Unable to add movie", movie.title, ". Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("PutItem succeeded:", movie.title);
            }
        });
    });
});
