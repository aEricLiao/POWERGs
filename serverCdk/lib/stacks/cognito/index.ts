import * as cdk from '@aws-cdk/core'
import * as cognito from '@aws-cdk/aws-cognito'

interface CognitoStackProps {
  env: string
}

export class CognitoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: CognitoStackProps) {
    super(scope, id)

    const env = props.env
    // Cognito
    const _userPool = new cognito.UserPool(this, 'userPool', {
      userPoolName: `userPool-${env}`,
      autoVerify: { email: true },
      selfSignUpEnabled: true,
      signInCaseSensitive: false,
      standardAttributes: {
        email: { required: true },
      },
    })
  }
}
