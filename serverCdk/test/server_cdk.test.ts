import { expect as expectCDK, matchTemplate, MatchStyle, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as ServerCdk from '../lib/server_cdk-stack';

test('ServerCdk contains some resources', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new ServerCdk.ServerCdkStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(haveResource('AWS::Lambda::Function', { Runtime: "nodejs14.x" }));
  expectCDK(stack).to(haveResource('AWS::S3::Bucket', { BucketName: 'powergs-dev-logs' }));
  expectCDK(stack).to(haveResource('AWS::S3::Bucket', { BucketName: 'powergs-dev-ems' }));
});

test('ServerCdk accepts env context', () => {
  const app = new cdk.App({
    context: {
      env: 'prod',
    }
  });
  // WHEN
  const stack = new ServerCdk.ServerCdkStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(haveResource('AWS::S3::Bucket', { BucketName: 'powergs-prod-logs' }));
  expectCDK(stack).to(haveResource('AWS::S3::Bucket', { BucketName: 'powergs-prod-ems' }));
})
