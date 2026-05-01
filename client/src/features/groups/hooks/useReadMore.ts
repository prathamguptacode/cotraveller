import { useLayoutEffect, useRef } from "react"

export const useReadMore = () => {
    const paragraphRef = useRef<HTMLParagraphElement>(null)
    const readMoreRef = useRef<HTMLLabelElement>(null)

    useLayoutEffect(() => {
        const paragraph = paragraphRef.current
        const readMoreButton = readMoreRef.current
        if (!paragraph || !readMoreButton) return
        if (paragraph.scrollHeight <= paragraph.clientHeight) readMoreButton.style.display = 'none'
        else readMoreButton.style.display = 'block'
    }, [])

    return { paragraphRef, readMoreRef }
}


// Currently works under the assumption that given text won't change accross renders unless the component is remounted as well