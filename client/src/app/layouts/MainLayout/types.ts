
export type SidebarTab = 'Groups' | 'Chats' | 'Inbox' | 'Search' | 'Explore' | 'Filter'

export type Notifications = Record<Extract<SidebarTab, 'Chats' | 'Inbox'>, boolean>
