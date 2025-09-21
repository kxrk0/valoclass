'use client'

import { useState, useRef, useEffect } from 'react'
import { Heart, Bookmark, Share, Flag, ExternalLink, Copy } from 'lucide-react'
import './MoreOptionsMenu.css'

interface MoreOptionsMenuProps {
  lineup: {
    id: string
    title: string
    agent: string
    map: string
    image: string
  }
  isOpen: boolean
  onClose: () => void
  position: { x: number; y: number }
  onOpenModal: () => void
}

const MoreOptionsMenu = ({ lineup, isOpen, onClose, position, onOpenModal }: MoreOptionsMenuProps) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
    // Here you would typically make an API call
    onClose()
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
    // Here you would typically make an API call
    onClose()
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = `${window.location.origin}/lineups/${lineup.id}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: lineup.title,
          text: `Check out this ${lineup.agent} lineup on ${lineup.map}`,
          url
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(url)
      // You could show a toast notification here
    }
    onClose()
  }

  const handleCopyImage = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(lineup.image)
      // You could show a toast notification here
    } catch (error) {
      console.error('Failed to copy image URL:', error)
    }
    onClose()
  }

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Here you would open a report modal or send to reporting endpoint
    console.log('Report lineup:', lineup.id)
    onClose()
  }

  const handleOpenSource = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(lineup.image, '_blank')
    onClose()
  }

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    onOpenModal()
    onClose()
  }

  if (!isOpen) return null

  // Calculate menu position to keep it within viewport
  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    left: Math.min(position.x, window.innerWidth - 200),
    top: Math.min(position.y, window.innerHeight - 300),
    zIndex: 1000
  }

  return (
    <div 
      ref={menuRef}
      className="more-options-menu"
      style={menuStyle}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="more-options-header">
        <img 
          src={`/static/agents/${lineup.agent}.webp`}
          alt={lineup.agent}
          className="more-options-agent-icon"
        />
        <div className="more-options-info">
          <div className="more-options-title">{lineup.title}</div>
          <div className="more-options-meta">{lineup.agent} • {lineup.map}</div>
        </div>
      </div>

      <div className="more-options-divider" />

      <div className="more-options-actions">
        <button 
          className="more-options-action"
          onClick={handleViewDetails}
        >
          <ExternalLink size={16} />
          <span>View Details</span>
        </button>

        <button 
          className={`more-options-action ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <Heart size={16} fill={isLiked ? '#ff4654' : 'none'} />
          <span>{isLiked ? 'Unlike' : 'Like'}</span>
        </button>

        <button 
          className={`more-options-action ${isBookmarked ? 'bookmarked' : ''}`}
          onClick={handleBookmark}
        >
          <Bookmark size={16} fill={isBookmarked ? '#fbbf24' : 'none'} />
          <span>{isBookmarked ? 'Remove Bookmark' : 'Bookmark'}</span>
        </button>

        <button 
          className="more-options-action"
          onClick={handleShare}
        >
          <Share size={16} />
          <span>Share</span>
        </button>

        <button 
          className="more-options-action"
          onClick={handleCopyImage}
        >
          <Copy size={16} />
          <span>Copy Image URL</span>
        </button>

        <button 
          className="more-options-action"
          onClick={handleOpenSource}
        >
          <ExternalLink size={16} />
          <span>Open Original</span>
        </button>

        <div className="more-options-divider" />

        <button 
          className="more-options-action danger"
          onClick={handleReport}
        >
          <Flag size={16} />
          <span>Report</span>
        </button>
      </div>
    </div>
  )
}

export default MoreOptionsMenu
