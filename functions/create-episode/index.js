const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const ULID = require('ulid');

const ddb = new DynamoDBClient();

exports.handler = async (event) => {
  const episode = exports.buildDbEpisode(event.data);
  await exports.saveEpisode(episode);

  return { id: episode.pk };
};

exports.buildDbEpisode = (data) => {
  return {
    pk: ULID.ulid(),
    sk: 'episode#',
    GSI1PK: 'episode#',
    GSI1SK: `${data.episodeNumber}`,
    name: data.name,
    isPublished: data.isPublished === true,
    ...data.description && { description: data.description },
    episodeNumber: data.episodeNumber,
    ...data.guest && {
      guest: {
        name: data.guest.name,
        bio: data.guest.bio,
        ...data.guest.twitter && { twitter: data.guest.twitter }
      }
    }
  };
};

exports.saveEpisode = async (episode) => {
  const command = exports.buildSaveEpisodeCommand(episode);
  await ddb.send(command);
};

exports.buildSaveEpisodeCommand = (episode) => {
  return new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: marshall(episode, { removeUndefinedValues: true }),
    ConditionExpression: 'attribute_not_exists(#pk)',
    ExpressionAttributeNames: {
      '#pk': 'pk'
    }
  });
};