'use strict'
const AWS = require('aws-sdk');

 
module.exports.listMessageBoards = async (event) => {
  console.log(event)
  //console.log(Buffer.from(event.pathParameters, 'base64').toString())
//   const pathParameters = event.pathParameters;
//   const email = pathParameters.email;
//   if (!email || typeof email != "string") {
//     return {
//       statusCode: 400,
//       body: JSON.stringify({error: 'Request parameter(s) incorrectly specified. Make sure user email is correctly specified.'})      
//     }
//   }

  const scanParams = {
    TableName: process.env.DYNAMODB_MESSAGE_BOARD_TABLE    
  }  

  const dynamodb = new AWS.DynamoDB.DocumentClient()
  const result = await dynamodb.scan(scanParams).promise()
 
  
  
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