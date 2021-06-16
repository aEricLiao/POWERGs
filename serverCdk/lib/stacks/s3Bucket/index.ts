import * as cdk from '@aws-cdk/core'
import * as s3 from '@aws-cdk/aws-s3'
import { removalPolicy } from '../../common'

interface S3BucketProps {
  env: string
}

export class S3BucketStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: S3BucketProps) {
    super(scope, id)

    const env = props.env
    const s3Props = {
      enforceSSL: true,
      removalPolicy: removalPolicy(env),
    }
    const _emsBucket = new s3.Bucket(this, 'emsBucket', {
      bucketName: `powergs-${env}-ems`,
      ...s3Props,
    })
    const _webBucket = new s3.Bucket(this, 'webBucket', {
      bucketName: `powergs-${env}-web`,
      ...s3Props,
    })
  }
}
