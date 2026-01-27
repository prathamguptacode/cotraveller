export const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] as const
export type Month = typeof Months[number]

export const Years = ['2026', '2027', '2028', '2029', '2030']
export type Year = typeof Years[number]

export const Modes = ['Airplane', 'Railway', 'Taxi', 'Transport?'] as const;
export type Mode = typeof Modes[number]