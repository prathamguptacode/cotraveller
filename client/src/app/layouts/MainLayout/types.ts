
export type SidebarTab = 'Groups' | 'Chats' | 'Inbox' | 'Search' | 'Explore'

export type Notifications = Record<Extract<SidebarTab, 'Chats' | 'Inbox'>, boolean>
