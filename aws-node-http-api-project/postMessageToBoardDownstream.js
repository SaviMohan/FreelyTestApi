'use strict'
const AWS = require('aws-sdk');
 
module.exports.postMessageToBoardDownstream = async (event) => {
  console.log(event);  
  const body = JSON.parse(event.Records[0].Sns.Message);
  const dynamoDb = new AWS.DynamoDB.DocumentClient();  
  
  const putParams = {
    TableName: process.env.DYNAMODB_MESSAGE_BOARD_TABLE,
    Item: {
      messageBoardId: body.messageBoardId,
      messageBoardName: body.messageBoardName,
      messages: body.messages
    }
  }
  await dynamoDb.put(putParams).promise();
 
  return {
    statusCode: 201
  }
}