'use strict'
const AWS = require('aws-sdk');
 
module.exports.listMessageBoards = async (event) => {
  console.log(event);  

  const scanParams = {
    TableName: process.env.DYNAMODB_MESSAGE_BOARD_TABLE    
  }  

  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const result = await dynamodb.scan(scanParams).promise();  
  
  if (result.Count === 0) {
    return {
      statusCode: 200,
      body: JSON.stringify({message: 'No message boards are currently initialised'})
    }
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items)
    }
  }   
}