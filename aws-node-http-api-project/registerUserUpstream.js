'use strict'
const AWS = require('aws-sdk')
const config = require('./config.js');

const sns = new AWS.SNS();
 
module.exports.registerUserUpstream = async (event) => {
  console.log(event);
  console.log(event.body);
  //console.log(Buffer.from(event.body, 'base64').toString())
  const body = JSON.parse(event.body)
//   const dynamoDb = new AWS.DynamoDB.DocumentClient()
  const name = body.name;
  const email = body.email;
  if (!name || !email) {
    return {
        statusCode: 400,
        body: JSON.stringify({error: 'Request parameter(s) incorrectly specified. Make sure user name and email are correctly specified.'})
    }
  }
//   const putParams = {
//     TableName: process.env.DYNAMODB_USER_TABLE,
//     Item: {
//       userId: body.userId,
//       name: body.name,
//       email: body.email
//     }
//   }
//   await dynamoDb.put(putParams).promise()
 
  const params = {
    Message: JSON.stringify({
      name: name,
      email: email  
    }),
    //TopicArn: `arn:aws:sns:us-east-1:${config.awsAccountId}:registerUserDownstream`,
    TopicArn: `arn:aws:sns:us-east-1:${config.awsAccountId}:registerUserDownstream`,
  };

  let response = {
    statusCode: 200,
    body: JSON.stringify({ message: 'Successfully queued up register user request' }),
  };
//   sns.publish(params, (error) => {
//     if (error) {
//       console.error(error);
//       callback(null, );
//     }
    
    
//     callback(null, response);
//   });
  try {
    const data = await sns.publish(params).promise();
    response.messageId = data.MessageId,
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