import { Controller, Control, FieldValues } from 'react-hook-form'
import componentMap from './componentMap'
import FormHelperText from '@material-ui/core/FormHelperText'

interface Props {
  componentProps?: any
  controllerProps?: any
  name: string
  type: keyof typeof componentMap
  control: Control<FieldValues>
  errorMsg: string
}

export const ControlledComp = ({
  componentProps,
  controllerProps,
  name,
  type,
  control,
  errorMsg,
}: Props) => {
  const Comp = componentMap[type as keyof typeof componentMap] as (
    props: any
  ) => JSX.Element
  const isMuiTextFieldComp = type === 'Input' || 'OutlinedInput'

  return (
    <Controller
      name={name}
      control={control}
      {...controllerProps}
      render={({ field, fieldState }) => {
        const error = fieldState.invalid
        return (
          <>
            <Comp {...field} {...componentProps} error={error} />
            {error && isMuiTextFieldComp && (
              <FormHelperText error={error}>{errorMsg}</FormHelperText>
            )}
          </>
        )
      }}
    />
  )
}

export const ControlledOutlinedInput = (props: Omit<Props, 'type'>) => (
  <ControlledComp
    controllerProps={{ defaultValue: '' }}
    {...props}
    type="OutlinedInput"
  />
)
