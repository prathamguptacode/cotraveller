import { useEffect, useRef } from "react"

const placeHolderText = ["Tokyo", "Monaco", "California", "Germany"]

export const useAnimatedPlaceholder = () => {
    const ref = useRef<HTMLInputElement>(null)

    useEffect(() => {
        let i = 0
        let pos = 0

        async function dynamicPlaceholder() {
            if (!ref.current) return
            if (i === placeHolderText[pos].length) {
                i = 0;
                await new Promise((resolve) => setTimeout(resolve, 2500));
                ref.current.placeholder = "Search for "
                if (pos === placeHolderText.length - 1) {
                    pos = 0
                } else {
                    pos++
                }
                return dynamicPlaceholder()
            }
            ref.current.placeholder += placeHolderText[pos].charAt(i)
            i++;
            setTimeout(() => dynamicPlaceholder(), 120)
        }

        // Conditional env based animation for personal preference
        if (import.meta.env.VITE_ANIMATIONS_DISABLED !== 'true') dynamicPlaceholder()
        else if (ref.current?.placeholder) ref.current.placeholder += placeHolderText[0]
    }, [])

    return ref
}