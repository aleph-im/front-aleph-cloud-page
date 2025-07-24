import { Button, ButtonProps } from '@aleph-front/core'

export function FunctionalButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      variant="functional"
      size="sm"
      className="bg-purple0 text-main0"
      tw="px-6 py-2 rounded-full flex items-center justify-center leading-none gap-x-3 font-bold
         transition-all duration-200
         disabled:(opacity-50 cursor-not-allowed)"
      {...props}
    >
      {children}
    </Button>
  )
}
export default FunctionalButton
