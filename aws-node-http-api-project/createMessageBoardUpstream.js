'use strict'
const AWS = require('aws-sdk')
const config = require('./config.js');


const sqs = new AWS.SQS({
    apiVersion: 'latest',
    region: 'us-east-1',
});
 
module.exports.createMessageBoardUpstream = async (event) => {
  console.log('Queue upstream: ' + event);  
  //console.log(Buffer.from(event.body, 'base64').toString())
  const body = JSON.parse(event.body)
  // const dynamoDb = new AWS.DynamoDB.DocumentClient()
  const messageBoardName = body.messageBoardName;
//   const email = body.email;
  if (!messageBoardName) {
    return {
        statusCode: 400,
        body: JSON.stringify({error: 'Request parameter(s) incorrectly specified. Make sure message board name is correctly specified.'})
    }
  }
//   const putParams = {
//     TableName: process.env.DYNAMODB_MESSAGE_BOARD_TABLE,
//     Item: {
//       userId: body.userId,
//       name: body.name,
//       email: body.email
//     }
//   }
//   await dynamoDb.put(putParams).promise()

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


//   const params = {
//     Message: JSON.stringify({
//         messageBoardName: messageBoardName      
//     }),
//     //TopicArn: `arn:aws:sns:us-east-1:${config.awsAccountId}:registerUserDownstream`,
//     TopicArn: `arn:aws:sns:us-east-1:${config.awsAccountId}:createMessageBoardDownstream`,
//   };

  let response = {
    statusCode: 200,
    body: JSON.stringify({ message: 'Successfully queued up create message board request' }),
  };
//   sns.publish(params, (error) => {
//     if (error) {
//       console.error(error);
//       callback(null, );
//     }
    
    
//     callback(null, response);
//   });
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