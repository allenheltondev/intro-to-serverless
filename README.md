# Intro to Serverless

In this intro to serverless repo, we build a basic API to show how easy it is to get started. The API we create will allows consumers to create and update episodes for something like a podcast, vlog, or video channel.

## Prerequisites

To properly run this application, you must first install the following software on your machine:

* [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
* [NodeJS](https://nodejs.org/en/download/current/)

After the above software is installed, you must [configure your AWS profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) on your machine. 

## Deployment and Infrastructure as Code

All AWS resources are kept in the `template.yaml` file in the root of this repository. This file defines all of the AWS resources that will be created when it is deployed. This is known as [infrastructure as code](https://docs.aws.amazon.com/whitepapers/latest/introduction-devops-aws/infrastructure-as-code.html).

To deploy the resources defined in the `template.yaml` file, we will use the [Serverless Application Model (SAM)](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) CLI. This CLI will convert the infrastructure defined in the file into a CloudFormation template and pass it along to AWS to create all the resources.

Getting started with SAM is easy, all configuration is saved in the `samconfig.toml` file at the root. This file takes the arguments you would run on the command line when using SAM and passes them along for you. The file should already be configured to deploy into your AWS account *if your AWS CLI is configured o deploy to your AWS account via the* `default` *profile*.

To deploy the resources from this repository into your account, simply execute the following commands from a terminal in the root of the repo.

```bash
sam build
sam deploy
```

This will deploy the resources via CloudFormation to your personal account (or whatever account is defined in your default AWS profile).

## What is Deployed?

Once you have successfully deployed the stack, you will have the following resources in your AWS account. Don't worry, all of these resources are pay-for-what-you-use, so you will not be charged for having them in your account unused.

![Infrastructure diagram](./diagrams/infrastructure%20diagram.png)

## How Do I Use This?

Once deployed, you will see an output in your terminal that gives you a base url. This is a public url and can be hit immediately. 

However, if you do call it immediately you will receive a `401 Unauthorized`. This is because we deployed the API for use with an API key. Since security should be at the top of our minds, we never want to deploy something open to the public - even a proof of concept. 

To generate your API key, you will need to deploy the stack from [this github repository](https://github.com/allenheltondev/serverless-api-key-registration) and have it point to the API you just created. Look at the other outputs from your deployment to get the appropriate values. 

Once you deploy the *api key registration* microservice, you can hit the `POST /api-keys` endpoint to generate a key. Use this key in the `x-api-key` header in all your requests for this API.

## Available Endpoints

You can view the available endpoints via the `openapi.yaml` file in the root of this repository.

It is recommended that you make a [Postman](https://www.postman.com) account and [sync your API spec](https://learning.postman.com/docs/integrations/available-integrations/github/#api-sync-with-github) so any time the source is updated, the API is updated in Postman. Postman provides an easily consumable format for API definitions and allows you to test your endpoints quickly and easily.