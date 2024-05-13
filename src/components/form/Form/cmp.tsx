import { FormProps } from './types'
import { StyledForm } from './styles'
import { FormError, FormErrorProps } from '@aleph-front/core'
import Container from '@/components/common/CenteredContainer'

export const Form = ({ children, onSubmit, errors }: FormProps) => {
  return (
    <StyledForm onSubmit={onSubmit} noValidate as={'form'}>
      {children}
      {errors?.root && (
        <Container as={'div'}>
          {Object.values<FormErrorProps['error']>(errors.root).map((error) => (
            <FormError key={error + ''} error={error} tw="break-all" />
          ))}
        </Container>
      )}
    </StyledForm>
  )
}

export default Form
