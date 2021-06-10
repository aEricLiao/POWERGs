import { expect as expectCDK, haveResource, haveResourceLike, Capture } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import * as ServerCdk from '../lib/server_cdk-stack'
import { assumeRolePolicyDocument } from './utils/iam'

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

describe('ServerCdk contains resources to store gateway init messages into S3', () => {
  const app = new cdk.App()
  const stack = new ServerCdk.ServerCdkStack(app, 'MyTestStack')

  describe('ServerCdk', () => {
    test('has S3 bucket to store gateway init messages', () => {
      expectCDK(stack).to(haveResource('AWS::S3::Bucket', { BucketName: 'powergs-dev-logs' }))
    })

    test('has role to assumed by Firehose', () => {
      expectCDK(stack).to(
        haveResource('AWS::IAM::Role', {
          AssumeRolePolicyDocument: assumeRolePolicyDocument('Allow', 'firehose.amazonaws.com'),
          Path: '/service-role/',
        })
      )
    })

    test('has Firehose steam and policy, and configured to deliver messages to S3 bucket', () => {
      const bucketName = Capture.aString()
      const bucketName2 = Capture.aString()
      const roleName = Capture.aString()

      expectCDK(stack).to(
        haveResource('AWS::IAM::Policy', {
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: [
                  's3:AbortMultipartUpload',
                  's3:GetBucketLocation',
                  's3:GetObject',
                  's3:ListBucket',
                  's3:ListBucketMultipartUploads',
                  's3:PutObject',
                ],
                Resource: [
                  {
                    'Fn::GetAtt': [bucketName.capture(), 'Arn'],
                  },
                  {
                    'Fn::Join': [
                      '',
                      [
                        {
                          'Fn::GetAtt': [bucketName2.capture(), 'Arn'],
                        },
                        '/*',
                      ],
                    ],
                  },
                ],
              },
            ],
          },
          Roles: [
            {
              Ref: roleName.capture(),
            },
          ],
        })
      )
      expect(bucketName.capturedValue).toEqual(bucketName2.capturedValue)

      expectCDK(stack).to(
        haveResource('AWS::KinesisFirehose::DeliveryStream', {
          DeliveryStreamName: 'gwInitLog',
          ExtendedS3DestinationConfiguration: {
            CompressionFormat: 'UNCOMPRESSED',
            EncryptionConfiguration: {
              NoEncryptionConfig: 'NoEncryption',
            },
            Prefix: 'iot_gw_init/!{timestamp: yyyy/MM/dd}/',
            ErrorOutputPrefix: 'iot_gw_init/!{timestamp: yyyy/MM/dd}/!{firehose:error-output-type}/',
            BucketARN: {
              'Fn::GetAtt': [bucketName.capturedValue, 'Arn'],
            },
            RoleARN: {
              'Fn::GetAtt': [roleName.capturedValue, 'Arn'],
            },
          },
        })
      )
    })

    test('has role to assumed by IoT', () => {
      expectCDK(stack).to(
        haveResource('AWS::IAM::Role', {
          AssumeRolePolicyDocument: assumeRolePolicyDocument('Allow', 'iot.amazonaws.com'),
          Path: '/service-role/',
        })
      )
    })

    test('has IoT topic rule and policy, and configured to deliver messages to Firehose', () => {
      const roleName = Capture.aString()
      const ruleName = Capture.aString()

      expectCDK(stack).to(
        haveResource('AWS::IAM::Policy', {
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: 'firehose:PutRecord',
                Resource: {
                  'Fn::GetAtt': [ruleName.capture(), 'Arn'],
                },
              },
            ],
          },
          Roles: [
            {
              Ref: roleName.capture(),
            },
          ],
        })
      )

      expectCDK(stack).to(
        haveResourceLike('AWS::IoT::TopicRule', {
          RuleName: ruleName.capturedValue,
          TopicRulePayload: {
            Sql: "SELECT *, topic() as topic, timestamp() as timestamp FROM 'init/+/gw'",
            AwsIotSqlVersion: '2016-03-23',
            RuleDisabled: false,
            Actions: [
              {
                Firehose: {
                  BatchMode: false,
                  DeliveryStreamName: 'gwInitLog',
                  RoleArn: {
                    'Fn::GetAtt': [roleName.capturedValue, 'Arn'],
                  },
                },
              },
            ],
          },
        })
      )
    })
  })
})
