
export type SidebarTab = 'Groups' | 'Chats' | 'Inbox' | 'Search' | 'Explore'

export type Notifications = Record<Exclude<SidebarTab, 'Search'>, boolean>

