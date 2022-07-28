const { DynamoDBClient, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { StatusCodes } = require('http-status-codes');

const ddb = new DynamoDBClient();

exports.handler = async (event) => {
  try {
    const input = JSON.parse(event.body);
    const id = event.pathParameters.episodeId;
    await exports.updateEpisode(id, input);

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

exports.updateEpisode = async (episodeId, input) => {
  const command = exports.buildUpdateEpisodeCommand(episodeId, input);
  await ddb.send(command);
};

exports.buildUpdateEpisodeCommand = (episodeId, input) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: marshall({
      pk: episodeId,
      sk: 'episode#'
    }),
    ConditionExpression: 'attribute_exists(#pk)',
    ExpressionAttributeNames: {
      '#pk': 'pk'
    },
    ExpressionAttributeValues: {}
  };

  let updateExpression = 'SET';
  for (const [key, value] of Object.entries(input)) {
    updateExpression = `${updateExpression} #${key} = :${key},`
    params.ExpressionAttributeNames[`#${key}`] = key;
    params.ExpressionAttributeValues[`:${key}`] = value;

    if (key == 'episodeNumber') {
      params.ExpressionAttributeNames['#GSI1SK'] = 'GSI1SK';
      params.ExpressionAttributeValues[':GSI1SK'] = `${value}`;
      updateExpression = `${updateExpression} #GSI1SK = :GSI1SK,`;
    }
  }

  params.UpdateExpression = updateExpression.slice(0, -1);
  params.ExpressionAttributeValues = marshall(params.ExpressionAttributeValues);

  return new UpdateItemCommand(params);
};