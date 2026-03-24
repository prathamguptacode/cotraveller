
export type SidebarTab = 'Groups' | 'Chats' | 'Inbox' | 'Search'

export type Notifications = Record<Exclude<SidebarTab, 'Search'>, boolean>

