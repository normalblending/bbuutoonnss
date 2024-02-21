import {RefObject, useEffect} from 'react'

type Handler = (event: MouseEvent) => void

export function useClickOutside<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T>,
    handler: Handler,
    mouseEvent: 'mousedown' | 'mouseup' = 'mousedown',
): void {
    useEffect(() => {
        const _handler = (event) => {
            const el = ref?.current

            // Do nothing if clicking ref's element or descendent elements
            if (!el || el.contains(event.target as Node)) {
                return
            }

            handler(event)
        }
        document.addEventListener(mouseEvent, _handler)
        return () => {
            document.removeEventListener(mouseEvent, _handler)
        }
    }, [handler, mouseEvent])
}
