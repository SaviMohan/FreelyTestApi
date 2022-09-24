'use strict'
const AWS = require('aws-sdk')
const config = require('./config.js');

const sns = new AWS.SNS();
 
module.exports.postMessageToBoardUpstream = async (event) => {
  console.log(event);
  console.log(event.body);
  
  const body = JSON.parse(event.body)
  
  const messageBoardName = body.messageBoardName;
  const message = body.message;
  if (!messageBoardName || !message) {
    return {
        statusCode: 400,
        body: JSON.stringify({error: 'Request parameter(s) incorrectly specified. Make sure the message board name and the message to post on the board are correctly specified.'})
    }
  }

  const scanParams = {
    TableName: process.env.DYNAMODB_MESSAGE_BOARD_TABLE,
    "FilterExpression": "messageBoardName = :val",
    "ExpressionAttributeValues": {":val": messageBoardName},
  }  

  const dynamodb = new AWS.DynamoDB.DocumentClient()
  const result = await dynamodb.scan(scanParams).promise()
  if (result.Count === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({error: 'The message board name you specified does not exist'})
    }
  }

  const messageBoard = result.Items[0];


  const params = {
    Message: JSON.stringify({
      messageBoardId: messageBoard.messageBoardId,
      messageBoardName: messageBoard.messageBoardName,
      messages: messageBoard.messages + '\n' + message
    }),    
    TopicArn: `arn:aws:sns:us-east-1:${config.awsAccountId}:postMessageToBoardDownstream`,
  };

  let response = {
    statusCode: 200,
    body: JSON.stringify({ message: 'Successfully queued up message post to board request' }),
  };

  try {
    const data = await sns.publish(params).promise();
    response.messageId = data.MessageId,
    response.result = 'Success'
  } catch (e) {
    console.log(e.stack)
    response = {
      statusCode: 501,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({error: 'Internal Error: Couldn\'t queue the message to board request. Try again later.'}),
    }
    response.result = 'Error'
  }
  return response
}