import { expect as expectCDK, matchTemplate, MatchStyle, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as ServerCdk from '../lib/server_cdk-stack';

test('ServerCdk contain lambda resource', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new ServerCdk.ServerCdkStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(haveResource('AWS::Lambda::Function', { Runtime: "nodejs14.x" }))
});
