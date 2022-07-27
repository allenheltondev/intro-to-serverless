const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { StatusCodes } = require('http-status-codes');

const ddb = new DynamoDBClient();

exports.handler = async (event) => {
  try {
    const input = JSON.parse(event.body);
    const id = event.pathParameters.episodeId;
    await exports.replaceEpisode(id, input);

    return {
      statusCode: StatusCodes.NO_CONTENT,
      headers: { 'Access-Control-Allow-Origin': '*' }
    };
  }
  catch (err) {
    console.error(err);

    const response = {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      headers: { 'Access-Control-Allow-Origin': '*' }
    }

    let message = 'Something went wrong';
    if (err.name == 'ConditionalCheckFailedException') {
      response.statusCode = StatusCodes.NOT_FOUND;
      message = 'An episode with the provided id could not be found';
    }

    response.body = JSON.stringify({ message });
    return response;
  }
};

exports.replaceEpisode = async (episodeId, input) => {
  const command = exports.buildReplaceEpisodeCommand(episodeId, input);
  await ddb.send(command);
};

exports.buildReplaceEpisodeCommand = (episodeId, input) => {
  return new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: marshall({
      pk: episodeId,
      sk: 'episode#',
      ...input,
      ...input.episodeNumber && {
        GSI1PK: 'episode#',
        GSI1SK: input.episodeNumber
      }
    }),
    ConditionExpression: 'attribute_exists(#pk)',
    ExpressionAttributeNames: {
      '#pk': 'pk'
    }
  });
};