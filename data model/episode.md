# Episode

An episode is the primary entity of the API in this repository. It represents an episode of a podcast/video/vlog.

## Access patterns

* Get episode by id (pk/sk)
* Get list of episodes (GSI1)

## Example

```jsonc
{
  "pk": "01G8V9W3QDS9Y2R9YFQSMJJ899", // episode id
  "sk": "episode#",
  "GSI1PK": "episode#",
  "GSI1SK": "1", // episode number
  "name": "Intro to Serverless",
  "description": "In this episode, Allen talks to us about serverless",
  "isPublished": true,
  "episodeNumber": 1,
  "recordedDate": "2022-07-04",
  "guest": {
    "name": "Allen Helton",
    "bio": "Allen is a serverless cloud architect",
    "twitter": "@allenheltondev"
  }
}