import { FormProps } from './types'
import { StyledForm } from './styles'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import BorderBox from '@/components/common/BorderBox'

export const Form = ({ children, onSubmit, errors, id }: FormProps) => {
  return (
    <StyledForm id={id} onSubmit={onSubmit} noValidate>
      {children}
      {errors?.root && (
        <CenteredContainer tw="mt-6">
          {Object.values(errors.root).map((error, index) => {
            const errorMessage =
              typeof error === 'string'
                ? error
                : typeof error === 'object' &&
                    error !== null &&
                    'message' in error
                  ? (error as { message: string }).message
                  : 'An error occurred'

            return (
              <BorderBox key={errorMessage + index} $color="error" tw="mb-4">
                <div tw="flex flex-col gap-3">
                  <p className="tp-body1 fs-16">
                    <strong>Error:</strong> {errorMessage}
                  </p>
                </div>
              </BorderBox>
            )
          })}
        </CenteredContainer>
      )}
    </StyledForm>
  )
}

export default Form
