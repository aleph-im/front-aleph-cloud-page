import { FormProps } from './types'
import { StyledForm } from './styles'
import { FormError, FormErrorProps } from '@aleph-front/core'
import { CenteredContainer } from '@/components/common/CenteredContainer'

export const Form = ({ children, onSubmit, errors, id }: FormProps) => {
  return (
    <StyledForm id={id} onSubmit={onSubmit} noValidate>
      {children}
      {errors?.root && (
        <CenteredContainer>
          {Object.values<FormErrorProps['error']>(errors.root).map((error) => (
            <FormError key={error + ''} error={error} tw="break-all" />
          ))}
        </CenteredContainer>
      )}
    </StyledForm>
  )
}

export default Form
