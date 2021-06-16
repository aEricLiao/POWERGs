import * as s3 from '@aws-cdk/aws-s3'
import * as iam from '@aws-cdk/aws-iam'

export const firehoseRoleProps = {
  assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
  path: '/service-role/',
}

export const firehoseS3PolicyStatement = (logBucket: s3.Bucket): iam.PolicyStatement => {
  return new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: [
      's3:AbortMultipartUpload',
      's3:GetBucketLocation',
      's3:GetObject',
      's3:ListBucket',
      's3:ListBucketMultipartUploads',
      's3:PutObject',
    ],
    resources: [logBucket.bucketArn, logBucket.arnForObjects('*')],
  })
}

export const firehoseKinesisPolicyStatement = (region: string, account: string): iam.PolicyStatement => {
  return new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: ['kinesis:DescribeStream', 'kinesis:GetShardIterator', 'kinesis:GetRecords', 'kinesis:ListShards'],
    resources: [`arn:aws:kinesis:${region}:${account}:stream/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`],
  })
}

export const iotInitLambdaKinesisPolicyStatement = (region: string, account: string): iam.PolicyStatement => {
  return new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: [
      'kinesis:ListStreams',
      'kinesis:ListShards',
      'kinesis:GetShardIterator',
      'kinesis:GetRecords',
      'kinesis:DescribeStream',
    ],
    resources: [`arn:aws:kinesis:${region}:${account}:stream/*`],
  })
}