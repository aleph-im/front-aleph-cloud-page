import {
  memo,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Button, Icon, Tooltip } from '@aleph-front/core'
import Link from 'next/link'

type MenuItem = {
  label: string
  href: string
}

type DetailsMenuButtonProps = {
  menuItems: MenuItem[]
}

export const DetailsMenuButton = ({ menuItems }: DetailsMenuButtonProps) => {
  const [open, setOpen] = useState(false)
  const tooltipRef: RefObject<HTMLButtonElement> = useRef(null)

  const handleClick = useCallback(() => setOpen(!open), [open, setOpen])
  const handleClose = useCallback(() => setOpen(false), [setOpen])

  // Handle click outside of the tooltip to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <>
      <Tooltip
        open={open}
        targetRef={tooltipRef}
        onCloseClick={handleClose}
        onClose={handleClose}
        variant={2}
        content={
          <div tw="flex flex-col min-w-[9.25rem]">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                tw="py-2 px-3"
                // tw="block px-4 py-2 text-sm text-base2 hover:bg-base1"
              >
                {item.label}
              </Link>
            ))}
          </div>
        }
        my="top-right"
        at="bottom-right"
        margin={{ x: 0, y: 2 }}
      />
      <Button
        kind="functional"
        variant="textOnly"
        onClick={handleClick}
        ref={tooltipRef}
      >
        <div
          className="bg-base0"
          tw="h-10 w-12 flex items-center justify-center"
        >
          <Icon name="ellipsis" size="lg" />
        </div>
      </Button>
    </>
  )
}
DetailsMenuButton.displayName = 'DetailsMenuButton'

export default memo(DetailsMenuButton) as typeof DetailsMenuButton
