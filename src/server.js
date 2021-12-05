
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
app.use(cors())
app.get('/db/:title/:year', sendinfo)
app.get('/actiondb/:action', makedelDB)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
var AWS = require('aws-sdk');

AWS.config.update({region: 'eu-west-1'});
var docClient = new AWS.DynamoDB.DocumentClient();

var s3 = new AWS.S3({apiVersion: '2006-03-01'});



var bcktparams = {
    Bucket: 'csu44000assignment220', /* required */
    Key: 'moviedata.json'
}


AWS.config.update({
    region: "eu-west-1",

});


var dynamodb = new AWS.DynamoDB();


function makedelDB(req, res) {
    let action = String(req.params.action);
    console.log(action);
    if(action === "make"){


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
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        };

        dynamodb.createTable(params, function(err, data) {
            if (err) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
            }
        });



        s3.getObject(bcktparams, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            var allMovies = JSON.parse(data.Body.toString('utf-8'));

            allMovies.forEach(function(movie) {
                var params = {
                    TableName: "Movies",
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

    }
    else if(action=== "del"){


        AWS.config.update({region: 'eu-west-1'});

        var paramsdel = {
            TableName : "Movies"
        };

        dynamodb.deleteTable(paramsdel, function(err, data) {
            if (err) {
                console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
            }
        });

    }
    res.json( { result : action });
    console.log(action);
}
function sendinfo(req, res) {

    let title = String(req.params.title);
    console.log(title)
    let year = String(req.params.year);
    console.log(year)

    var AWS = require('aws-sdk');
    AWS.config.update({region: 'eu-west-1'});



    var dynamodb = new AWS.DynamoDB();

    var params = {
        TableName : "Movies",
        KeyConditionExpression: "#yr = :yyyy AND begins_with(#ttl, :titleName)",
        ExpressionAttributeNames:{
            "#yr": "year",
            "#ttl": "title"
        },
        ExpressionAttributeValues: {
            ":yyyy": {"N": year},
            ":titleName": {"S": title}
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
            console.log("sending json")
            res.json( { result : data.Items });
            console.log(data.Items);
        }

    });


}
