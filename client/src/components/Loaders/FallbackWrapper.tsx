import clsx from 'clsx'
import { type ReactNode } from 'react'
import ThreeDotLoader from './ThreeDotLoader'

type FallbackWrapperProps = {
    className?: string,
    children?: ReactNode,
    sidebarType?: 'overlay'
}

const FallbackWrapper = ({ className, children = <ThreeDotLoader /> ,sidebarType}: FallbackWrapperProps) => {
    return (
        <div data-sidebar-type={sidebarType} className={clsx(className, 'fallbackWrapper')}>
            {children}
        </div>
    )
}

export default FallbackWrapper
