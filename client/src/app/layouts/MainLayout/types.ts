
export type SidebarTab = 'Groups' | 'Chats' | 'Inbox' | 'Search' | 'Explore' | 'Filter'

export type Notifications = Record<Exclude<SidebarTab, 'Search'>, boolean>

