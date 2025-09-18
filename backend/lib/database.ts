// Database schema and types for ValorantGuides
// This would normally use Prisma or another ORM

export interface DatabaseUser {
  id: string
  email: string
  username: string
  passwordHash: string
  avatar?: string
  banner?: string
  bio?: string
  location?: string
  website?: string
  riotId?: string
  role: 'user' | 'admin' | 'moderator'
  isVerified: boolean
  isPremium: boolean
  preferences: {
    theme: 'dark' | 'light' | 'system'
    language: string
    timezone: string
    notifications: {
      email: boolean
      inApp: boolean
      newLineups: boolean
      crosshairUpdates: boolean
      weeklyDigest: boolean
      marketing: boolean
    }
    privacy: {
      profileVisibility: 'public' | 'followers' | 'private'
      showStats: boolean
      showActivity: boolean
      allowMessages: 'everyone' | 'followers' | 'none'
      searchable: boolean
    }
  }
  stats: {
    lineupsCreated: number
    crosshairsCreated: number
    totalLikes: number
    totalViews: number
    reputation: number
    followers: number
    following: number
  }
  lastLoginAt?: Date
  emailVerifiedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface DatabaseLineup {
  id: string
  title: string
  description: string
  agent: string
  ability: string
  map: string
  side: 'attacker' | 'defender'
  difficulty: 'easy' | 'medium' | 'hard'
  position: {
    x: number
    y: number
    angle: number
    description: string
  }
  instructions: string[]
  images: string[]
  videoUrl?: string
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  verified: boolean
  createdBy: string
  moderatedBy?: string
  moderatedAt?: Date
  stats: {
    views: number
    likes: number
    dislikes: number
    bookmarks: number
    shares: number
    comments: number
  }
  seo: {
    slug: string
    metaTitle?: string
    metaDescription?: string
    keywords: string[]
  }
  createdAt: Date
  updatedAt: Date
}

export interface DatabaseCrosshair {
  id: string
  name: string
  description?: string
  shareCode: string
  settings: {
    color: string
    outlines: boolean
    outlineOpacity: number
    outlineThickness: number
    centerDot: boolean
    centerDotOpacity: number
    centerDotThickness: number
    innerLines: boolean
    innerLineOpacity: number
    innerLineLength: number
    innerLineThickness: number
    innerLineOffset: number
    outerLines: boolean
    outerLineOpacity: number
    outerLineLength: number
    outerLineThickness: number
    outerLineOffset: number
    movementError: number
    firingError: number
  }
  tags: string[]
  isPublic: boolean
  featured: boolean
  createdBy: string
  stats: {
    downloads: number
    likes: number
    bookmarks: number
    shares: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface DatabaseComment {
  id: string
  content: string
  parentId?: string // for replies
  entityType: 'lineup' | 'crosshair' | 'user'
  entityId: string
  authorId: string
  isEdited: boolean
  stats: {
    likes: number
    dislikes: number
    replies: number
  }
  status: 'active' | 'hidden' | 'deleted'
  createdAt: Date
  updatedAt: Date
}

export interface DatabaseRating {
  id: string
  entityType: 'lineup' | 'crosshair'
  entityId: string
  userId: string
  rating: number // 1-5 stars
  review?: string
  createdAt: Date
  updatedAt: Date
}

export interface DatabaseFollow {
  id: string
  followerId: string
  followingId: string
  createdAt: Date
}

export interface DatabaseLike {
  id: string
  entityType: 'lineup' | 'crosshair' | 'comment'
  entityId: string
  userId: string
  createdAt: Date
}

export interface DatabaseBookmark {
  id: string
  entityType: 'lineup' | 'crosshair'
  entityId: string
  userId: string
  collectionId?: string
  createdAt: Date
}

export interface DatabaseCollection {
  id: string
  name: string
  description?: string
  isPublic: boolean
  userId: string
  itemCount: number
  createdAt: Date
  updatedAt: Date
}

export interface DatabaseNotification {
  id: string
  userId: string
  type: 'follow' | 'like' | 'comment' | 'mention' | 'lineup_featured' | 'crosshair_downloaded'
  title: string
  message: string
  data: Record<string, any>
  isRead: boolean
  createdAt: Date
}

export interface DatabaseAchievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'content' | 'social' | 'engagement' | 'special'
  requirements: {
    type: 'count' | 'milestone' | 'streak'
    target: number
    metric: string
  }
  rewards: {
    reputation: number
    badge: boolean
    title?: string
  }
  isActive: boolean
  createdAt: Date
}

export interface DatabaseUserAchievement {
  id: string
  userId: string
  achievementId: string
  earnedAt: Date
  progress?: number
}

export interface DatabaseReport {
  id: string
  reporterId: string
  entityType: 'lineup' | 'crosshair' | 'comment' | 'user'
  entityId: string
  reason: 'spam' | 'inappropriate' | 'copyright' | 'harassment' | 'other'
  description?: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  reviewedBy?: string
  reviewedAt?: Date
  resolution?: string
  createdAt: Date
}

export interface DatabaseActivity {
  id: string
  userId: string
  type: 'lineup_created' | 'crosshair_shared' | 'comment_posted' | 'user_followed' | 'achievement_earned'
  entityType?: string
  entityId?: string
  data: Record<string, any>
  isPublic: boolean
  createdAt: Date
}

export interface DatabaseSession {
  id: string
  userId: string
  token: string
  refreshToken: string
  expiresAt: Date
  ipAddress?: string
  userAgent?: string
  lastActivity: Date
  createdAt: Date
}

export interface DatabaseAnalytics {
  id: string
  entityType: 'lineup' | 'crosshair' | 'user' | 'site'
  entityId?: string
  event: string
  data: Record<string, any>
  sessionId?: string
  userId?: string
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}

// Database operations interface
export interface DatabaseOperations {
  // Users
  createUser(user: Omit<DatabaseUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseUser>
  getUserById(id: string): Promise<DatabaseUser | null>
  getUserByEmail(email: string): Promise<DatabaseUser | null>
  getUserByUsername(username: string): Promise<DatabaseUser | null>
  updateUser(id: string, data: Partial<DatabaseUser>): Promise<DatabaseUser>
  deleteUser(id: string): Promise<void>

  // Lineups
  createLineup(lineup: Omit<DatabaseLineup, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseLineup>
  getLineupById(id: string): Promise<DatabaseLineup | null>
  getLineupsByUser(userId: string): Promise<DatabaseLineup[]>
  searchLineups(query: string, filters?: any): Promise<DatabaseLineup[]>
  updateLineup(id: string, data: Partial<DatabaseLineup>): Promise<DatabaseLineup>
  deleteLineup(id: string): Promise<void>

  // Crosshairs
  createCrosshair(crosshair: Omit<DatabaseCrosshair, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseCrosshair>
  getCrosshairById(id: string): Promise<DatabaseCrosshair | null>
  getCrosshairsByUser(userId: string): Promise<DatabaseCrosshair[]>
  getCrosshairByShareCode(shareCode: string): Promise<DatabaseCrosshair | null>
  updateCrosshair(id: string, data: Partial<DatabaseCrosshair>): Promise<DatabaseCrosshair>
  deleteCrosshair(id: string): Promise<void>

  // Comments
  createComment(comment: Omit<DatabaseComment, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseComment>
  getCommentsByEntity(entityType: string, entityId: string): Promise<DatabaseComment[]>
  updateComment(id: string, data: Partial<DatabaseComment>): Promise<DatabaseComment>
  deleteComment(id: string): Promise<void>

  // Social features
  followUser(followerId: string, followingId: string): Promise<DatabaseFollow>
  unfollowUser(followerId: string, followingId: string): Promise<void>
  likeEntity(userId: string, entityType: string, entityId: string): Promise<DatabaseLike>
  unlikeEntity(userId: string, entityType: string, entityId: string): Promise<void>
  bookmarkEntity(userId: string, entityType: string, entityId: string): Promise<DatabaseBookmark>
  unbookmarkEntity(userId: string, entityType: string, entityId: string): Promise<void>

  // Analytics
  trackEvent(event: Omit<DatabaseAnalytics, 'id' | 'createdAt'>): Promise<void>
  getAnalytics(entityType: string, entityId?: string, timeRange?: { start: Date; end: Date }): Promise<any>
}

// Mock database implementation for development
export class MockDatabase implements DatabaseOperations {
  private users: Map<string, DatabaseUser> = new Map()
  private lineups: Map<string, DatabaseLineup> = new Map()
  private crosshairs: Map<string, DatabaseCrosshair> = new Map()
  private comments: Map<string, DatabaseComment> = new Map()
  private follows: Map<string, DatabaseFollow> = new Map()
  private likes: Map<string, DatabaseLike> = new Map()
  private bookmarks: Map<string, DatabaseBookmark> = new Map()

  // User operations
  async createUser(userData: Omit<DatabaseUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseUser> {
    const user: DatabaseUser = {
      ...userData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.users.set(user.id, user)
    return user
  }

  async getUserById(id: string): Promise<DatabaseUser | null> {
    return this.users.get(id) || null
  }

  async getUserByEmail(email: string): Promise<DatabaseUser | null> {   
    for (const user of Array.from(this.users.values())) {
      if (user.email === email) return user
    }
    return null
  }

  async getUserByUsername(username: string): Promise<DatabaseUser | null> {
    for (const user of Array.from(this.users.values())) {
      if (user.username === username) return user
    }
    return null
  }

  async updateUser(id: string, data: Partial<DatabaseUser>): Promise<DatabaseUser> {
    const user = this.users.get(id)
    if (!user) throw new Error('User not found')
    
    const updatedUser = { ...user, ...data, updatedAt: new Date() }
    this.users.set(id, updatedUser)
    return updatedUser
  }

  async deleteUser(id: string): Promise<void> {
    this.users.delete(id)
  }

  // Lineup operations
  async createLineup(lineupData: Omit<DatabaseLineup, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseLineup> {
    const lineup: DatabaseLineup = {
      ...lineupData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.lineups.set(lineup.id, lineup)
    return lineup
  }

  async getLineupById(id: string): Promise<DatabaseLineup | null> {
    return this.lineups.get(id) || null
  }

  async getLineupsByUser(userId: string): Promise<DatabaseLineup[]> {
    return Array.from(this.lineups.values()).filter(lineup => lineup.createdBy === userId)
  }

  async searchLineups(query: string, filters?: any): Promise<DatabaseLineup[]> {
    // Simple search implementation
    const results = Array.from(this.lineups.values()).filter(lineup => {
      const titleMatch = lineup.title.toLowerCase().includes(query.toLowerCase())
      const descMatch = lineup.description.toLowerCase().includes(query.toLowerCase())
      return titleMatch || descMatch
    })
    return results
  }

  async updateLineup(id: string, data: Partial<DatabaseLineup>): Promise<DatabaseLineup> {
    const lineup = this.lineups.get(id)
    if (!lineup) throw new Error('Lineup not found')
    
    const updatedLineup = { ...lineup, ...data, updatedAt: new Date() }
    this.lineups.set(id, updatedLineup)
    return updatedLineup
  }

  async deleteLineup(id: string): Promise<void> {
    this.lineups.delete(id)
  }

  // Crosshair operations
  async createCrosshair(crosshairData: Omit<DatabaseCrosshair, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseCrosshair> {
    const crosshair: DatabaseCrosshair = {
      ...crosshairData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.crosshairs.set(crosshair.id, crosshair)
    return crosshair
  }

  async getCrosshairById(id: string): Promise<DatabaseCrosshair | null> {
    return this.crosshairs.get(id) || null
  }

  async getCrosshairsByUser(userId: string): Promise<DatabaseCrosshair[]> {
    return Array.from(this.crosshairs.values()).filter(crosshair => crosshair.createdBy === userId)
  }

  async getCrosshairByShareCode(shareCode: string): Promise<DatabaseCrosshair | null> {
    for (const crosshair of Array.from(this.crosshairs.values())) {
      if (crosshair.shareCode === shareCode) return crosshair
    }
    return null
  }

  async updateCrosshair(id: string, data: Partial<DatabaseCrosshair>): Promise<DatabaseCrosshair> {
    const crosshair = this.crosshairs.get(id)
    if (!crosshair) throw new Error('Crosshair not found')
    
    const updatedCrosshair = { ...crosshair, ...data, updatedAt: new Date() }
    this.crosshairs.set(id, updatedCrosshair)
    return updatedCrosshair
  }

  async deleteCrosshair(id: string): Promise<void> {
    this.crosshairs.delete(id)
  }

  // Comment operations
  async createComment(commentData: Omit<DatabaseComment, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseComment> {
    const comment: DatabaseComment = {
      ...commentData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.comments.set(comment.id, comment)
    return comment
  }

  async getCommentsByEntity(entityType: string, entityId: string): Promise<DatabaseComment[]> {
    return Array.from(this.comments.values()).filter(
      comment => comment.entityType === entityType && comment.entityId === entityId
    )
  }

  async updateComment(id: string, data: Partial<DatabaseComment>): Promise<DatabaseComment> {
    const comment = this.comments.get(id)
    if (!comment) throw new Error('Comment not found')
    
    const updatedComment = { ...comment, ...data, updatedAt: new Date() }
    this.comments.set(id, updatedComment)
    return updatedComment
  }

  async deleteComment(id: string): Promise<void> {
    this.comments.delete(id)
  }

  // Social operations
  async followUser(followerId: string, followingId: string): Promise<DatabaseFollow> {
    const follow: DatabaseFollow = {
      id: generateId(),
      followerId,
      followingId,
      createdAt: new Date()
    }
    this.follows.set(follow.id, follow)
    return follow
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    for (const [id, follow] of Array.from(this.follows.entries())) {
      if (follow.followerId === followerId && follow.followingId === followingId) {
        this.follows.delete(id)
        break
      }
    }
  }

  async likeEntity(userId: string, entityType: string, entityId: string): Promise<DatabaseLike> {
    const like: DatabaseLike = {
      id: generateId(),
      entityType: entityType as any,
      entityId,
      userId,
      createdAt: new Date()
    }
    this.likes.set(like.id, like)
    return like
  }

  async unlikeEntity(userId: string, entityType: string, entityId: string): Promise<void> {
    for (const [id, like] of Array.from(this.likes.entries())) {
      if (like.userId === userId && like.entityType === entityType && like.entityId === entityId) {
        this.likes.delete(id)
        break
      }
    }
  }

  async bookmarkEntity(userId: string, entityType: string, entityId: string): Promise<DatabaseBookmark> {
    const bookmark: DatabaseBookmark = {
      id: generateId(),
      entityType: entityType as any,
      entityId,
      userId,
      createdAt: new Date()
    }
    this.bookmarks.set(bookmark.id, bookmark)
    return bookmark
  }

  async unbookmarkEntity(userId: string, entityType: string, entityId: string): Promise<void> {
    for (const [id, bookmark] of Array.from(this.bookmarks.entries())) {
      if (bookmark.userId === userId && bookmark.entityType === entityType && bookmark.entityId === entityId) {
        this.bookmarks.delete(id)
        break
      }
    }
  }

  // Analytics
  async trackEvent(event: Omit<DatabaseAnalytics, 'id' | 'createdAt'>): Promise<void> {
    // Simple analytics tracking
    console.log('Analytics event:', event)
  }

  async getAnalytics(entityType: string, entityId?: string, timeRange?: { start: Date; end: Date }): Promise<any> {
    // Mock analytics data
    return {
      views: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 100),
      shares: Math.floor(Math.random() * 50)
    }
  }
}

// Utility function to generate IDs
function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Export singleton instance
export const db = new MockDatabase()
export default db
