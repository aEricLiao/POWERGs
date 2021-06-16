#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { ServerCdkStack } from '../lib/server_cdk-stack'
import { DynamodbStack } from '../lib/stacks/dynamodb'
import { S3BucketStack } from '../lib/stacks/s3Bucket'
import { CognitoStack } from '../lib/stacks/cognito'
import { ApiStack } from '../lib/stacks/apiStack'

const app = new cdk.App()

const env = app.node.tryGetContext('env') || 'dev'

const dynamodbStack = new DynamodbStack(app, `DynamodbStack-${env}`, { env })

new S3BucketStack(app, `S3BucketStack-${env}`, { env })

new CognitoStack(app, `CognitoStack-${env}`, { env })

new ApiStack(app, `ApiStack-${env}`, { env, messageTable: dynamodbStack.messageTable })

new ServerCdkStack(app, `ServerCdkStack-${env}`, {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */
  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
})
