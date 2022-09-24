'use strict'
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

 
module.exports.createMessageBoardDownstream = async (event) => {
  console.log('Queue: ' + event);
  for (const message of event.Records) {
    const body = JSON.parse(message.body);
    if (body.messageBoardName) {
      const dynamoDb = new AWS.DynamoDB.DocumentClient()
    
      const messageBoardId = uuidv4();

      const putParams = {
        TableName: process.env.DYNAMODB_MESSAGE_BOARD_TABLE,
        Item: {
          messageBoardId: messageBoardId,
          messageBoardName: body.messageBoardName,
          messages: "Messages:"
        }
      }
      await dynamoDb.put(putParams).promise()
    }
  }  
}