'use strict'
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

 
module.exports.postMessageToBoardDownstream = async (event) => {
  console.log(event);
  //console.log(Buffer.from(event.Records[0].Sns.Message, 'base64').toString());
  const body = JSON.parse(event.Records[0].Sns.Message);
  const dynamoDb = new AWS.DynamoDB.DocumentClient()
  
  //const userId = uuidv4();

  const putParams = {
    TableName: process.env.DYNAMODB_MESSAGE_BOARD_TABLE,
    Item: {
      messageBoardId: body.messageBoardId,
      messageBoardName: body.messageBoardName,
      messages: body.messages
    }
  }
  await dynamoDb.put(putParams).promise()
 
  return {
    statusCode: 201
  }
}