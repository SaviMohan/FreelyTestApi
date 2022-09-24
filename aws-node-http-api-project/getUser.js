'use strict'
const AWS = require('aws-sdk');

 
module.exports.getUser = async (event) => {
  console.log(event)
  
  const pathParameters = event.pathParameters;
  const email = pathParameters.email;
  if (!email || typeof email != "string") {
    return {
      statusCode: 400,
      body: JSON.stringify({error: 'Request parameter(s) incorrectly specified. Make sure user email is correctly specified.'})      
    }
  }

  const scanParams = {
    TableName: process.env.DYNAMODB_USER_TABLE,
    "FilterExpression": "email = :val",
    "ExpressionAttributeValues": {":val": email},
  }  

  const dynamodb = new AWS.DynamoDB.DocumentClient()
  const result = await dynamodb.scan(scanParams).promise()
 
  
  
  if (result.Count === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({error: 'Specified user not found'})
    }
  }
  const user = result.Items[0];
  return {
    statusCode: 200,
    body: JSON.stringify({
      
      userId: user.userId,
      name: user.name,
      email: user.email      
    })
  }
}