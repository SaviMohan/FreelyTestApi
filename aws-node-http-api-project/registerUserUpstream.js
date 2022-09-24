'use strict'
const AWS = require('aws-sdk')
const config = require('./config.js');

const sns = new AWS.SNS();
 
module.exports.registerUserUpstream = async (event) => {
  console.log(event);
  
  const body = JSON.parse(event.body)
  
  const name = body.name;
  const email = body.email;
  if (!name || !email) {
    return {
        statusCode: 400,
        body: JSON.stringify({error: 'Request parameter(s) incorrectly specified. Make sure user name and email are correctly specified.'})
    }
  }

  const scanParams = {
    TableName: process.env.DYNAMODB_USER_TABLE,
    "FilterExpression": "email = :val",
    "ExpressionAttributeValues": {":val": email},
  }  

  const dynamodb = new AWS.DynamoDB.DocumentClient()
  const result = await dynamodb.scan(scanParams).promise()
  if (result.Count > 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({error: 'There is already a user registered with the same email'})
    }
  }


  const params = {
    Message: JSON.stringify({
      name: name,
      email: email  
    }),    
    TopicArn: `arn:aws:sns:us-east-1:${config.awsAccountId}:registerUserDownstream`,
  };

  let response = {
    statusCode: 200,
    body: JSON.stringify({ message: 'Successfully queued up register user request' }),
  };

  try {
    const data = await sns.publish(params).promise();    
    response.result = 'Success'
  } catch (e) {
    console.log(e.stack)
    response = {
      statusCode: 501,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({error: 'Internal Error: Couldn\'t queue the register user request. Try again later.'}),
    }
    response.result = 'Error'
  }
  return response
}