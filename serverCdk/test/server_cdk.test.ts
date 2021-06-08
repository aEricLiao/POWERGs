import { expect as expectCDK, haveResource, haveResourceLike } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import * as ServerCdk from '../lib/server_cdk-stack'

test('ServerCdk contains some resources', () => {
  const app = new cdk.App()
  // WHEN
  const stack = new ServerCdk.ServerCdkStack(app, 'MyTestStack')
  // THEN
  expectCDK(stack).to(haveResource('AWS::Lambda::Function', { Runtime: 'nodejs14.x' }))
  expectCDK(stack).to(haveResource('AWS::S3::Bucket', { BucketName: 'powergs-dev-logs' }))
  expectCDK(stack).to(haveResource('AWS::S3::Bucket', { BucketName: 'powergs-dev-ems' }))
  expectCDK(stack).to(haveResource('AWS::KinesisFirehose::DeliveryStream', { DeliveryStreamName: 'lambdaLog' }))
})

test('ServerCdk accepts env context', () => {
  const app = new cdk.App({
    context: {
      env: 'prod',
    },
  })
  // WHEN
  const stack = new ServerCdk.ServerCdkStack(app, 'MyTestStack')
  // THEN
  expectCDK(stack).to(haveResource('AWS::S3::Bucket', { BucketName: 'powergs-prod-logs' }))
  expectCDK(stack).to(haveResource('AWS::S3::Bucket', { BucketName: 'powergs-prod-ems' }))
})

test('ServerCdk contains resources to store gateway init messages into S3', () => {
  const app = new cdk.App()
  // WHEN
  const stack = new ServerCdk.ServerCdkStack(app, 'MyTestStack')
  // THEN
  expectCDK(stack).to(haveResource('AWS::S3::Bucket', { BucketName: 'powergs-dev-logs' }))
  expectCDK(stack).to(
    haveResourceLike('AWS::KinesisFirehose::DeliveryStream', {
      DeliveryStreamName: 'gwInitLog',
      ExtendedS3DestinationConfiguration: {
        CompressionFormat: 'UNCOMPRESSED',
        EncryptionConfiguration: {
          NoEncryptionConfig: 'NoEncryption',
        },
        Prefix: 'iot_gw_init/!{timestamp: yyyy/MM/dd}/',
        ErrorOutputPrefix: 'iot_gw_init/!{timestamp: yyyy/MM/dd}/!{firehose:error-output-type}/',
      },
    })
  )
  expectCDK(stack).to(
    haveResourceLike('AWS::IoT::TopicRule', {
      RuleName: 'gwInitLog',
      TopicRulePayload: {
        Sql: "SELECT *, topic() as topic, timestamp() as timestamp FROM 'init/+/gw'",
        AwsIotSqlVersion: '2016-03-23',
        RuleDisabled: false,
        Actions: [
          {
            Firehose: {
              BatchMode: false,
              DeliveryStreamName: 'gwInitLog',
            },
          },
        ],
      },
    })
  )
})
