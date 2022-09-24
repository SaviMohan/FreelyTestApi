## Intro
This repo houses a Serverless deployment for endpoints for creating users and posting messages on message boards.

### Deployment
FIRST, modify the AWS account id in `config.js` to the account you want to use. Note that the app is currently configured to work in `us-east-1` region.

```
$ serverless deploy
```

### Available endpoints 
  POST - https://dw6ljxubel.execute-api.us-east-1.amazonaws.com/createMessageBoard                                                                            
  POST - https://dw6ljxubel.execute-api.us-east-1.amazonaws.com/postMessageToBoard
  POST - https://dw6ljxubel.execute-api.us-east-1.amazonaws.com/registerUser
  GET - https://a6veis2j2j.execute-api.us-east-1.amazonaws.com/dev/getUser/{email}
  GET - https://a6veis2j2j.execute-api.us-east-1.amazonaws.com/dev/listMessageBoards


### Example Curl test commands to endpoints

curl --header "Content-Type: application/json" -X POST https://dw6ljxubel.execute-api.us-east-1.amazonaws.com/createMessageBoard --data '{"messageBoardName": "testmessageBoard4"}'

curl --header "Content-Type: application/json" -X POST https://dw6ljxubel.execute-api.us-east-1.amazonaws.com/postMessageToBoard --data '{"messageBoardName": "testmessageBoard", "message":"test messages 10"}'

curl --header "Content-Type: application/json" -X POST https://dw6ljxubel.execute-api.us-east-1.amazonaws.com/registerUser --data '{ "name": "TestGuy3", "email": "TestGuy4@gmail.com" }'

curl -X GET https://a6veis2j2j.execute-api.us-east-1.amazonaws.com/dev/getUser/TestGuy@gmail.com

curl -X GET https://a6veis2j2j.execute-api.us-east-1.amazonaws.com/dev/listMessageBoards

### Future/Extension Work

- Remove requirement for app to be region locked to `us-east-1`.
- Add ability to subscribe to new messages topics
- More advanced messaging, e.g. being able to delete sent messages
- Add authentication to lambdas
- Redo lambda code in Typescript
