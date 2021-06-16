import * as cdk from '@aws-cdk/core'

const isEnvDev = (env: string): boolean => /dev/.test(env)

export const removalPolicy = (env: string): cdk.RemovalPolicy => {
  return isEnvDev(env) ? cdk.RemovalPolicy.DESTROY : cdk.RemovalPolicy.RETAIN
}
