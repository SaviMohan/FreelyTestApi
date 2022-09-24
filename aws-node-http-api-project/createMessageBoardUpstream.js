'use strict'
const AWS = require('aws-sdk')
const config = require('./config.js');


const sqs = new AWS.SQS({
    apiVersion: 'latest',
    region: 'us-east-1',
});
 
module.exports.createMessageBoardUpstream = async (event) => {
  console.log('Queue upstream: ' + event);    
  const body = JSON.parse(event.body)  
  const messageBoardName = body.messageBoardName;

  if (!messageBoardName) {
    return {
        statusCode: 400,
        body: JSON.stringify({error: 'Request parameter(s) incorrectly specified. Make sure message board name is correctly specified.'})
    }
  }

  const scanParams = {
    TableName: process.env.DYNAMODB_MESSAGE_BOARD_TABLE,
    "FilterExpression": "messageBoardName = :val",
    "ExpressionAttributeValues": {":val": messageBoardName},
  }  

  const dynamodb = new AWS.DynamoDB.DocumentClient()
  const result = await dynamodb.scan(scanParams).promise()
  if (result.Count > 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({error: 'There is already a message board registered with the same name'})
    }
  }

  let response = {
    statusCode: 200,
    body: JSON.stringify({ message: 'Successfully queued up create message board request' }),
  };

  try {
    await sqs.sendMessage({
        QueueUrl: process.env.QUEUE_URL,        
        MessageBody: JSON.stringify({
            messageBoardName: messageBoardName
        }),
    }).promise();
    response.result = 'Success'
  } catch (e) {
    console.log(e.stack)
    response = {
      statusCode: 501,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({error: 'Internal Error: Couldn\'t queue the register message board request. Try again later.'}),
    }
    response.result = 'Error'
  }
  return response
}