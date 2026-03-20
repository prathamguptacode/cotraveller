import { type ReactNode } from 'react'
import { GroupFormContext } from '../hooks/useGroupForm'
import type { UseFormReturn } from 'react-hook-form'
import type { GroupForm } from '../types'

type GroupFormProviderTypes = {
    value: UseFormReturn<GroupForm>,
    children: ReactNode
}

const GroupFormProvider = ({ value, children }: GroupFormProviderTypes) => {
    return (
        <GroupFormContext.Provider value={value}>
            {children}
        </GroupFormContext.Provider>
    )
}

export default GroupFormProvider
