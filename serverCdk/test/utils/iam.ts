type Effect = 'Allow' | 'Deny'
type Service = string

export const assumeRolePolicyDocument = (effect: Effect, service: Service) => ({
  Version: '2012-10-17',
  Statement: [
    {
      Effect: effect,
      Action: 'sts:AssumeRole',
      Principal: {
        Service: service,
      },
    },
  ],
})
