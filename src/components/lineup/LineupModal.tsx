'use client'

import { useState, useEffect } from 'react'
import './LineupModal.css'

interface LineupData {
  id: string
  type: 'lineup' | 'setup' | 'post-plant'
  agent: string
  abilities: string[]
  title: string
  description: string
  from: string
  to: string
  image: string
  map: string
  tags?: string[]
}

interface LineupModalProps {
  lineup: LineupData | null
  isOpen: boolean
  onClose: () => void
}

const LineupModal = ({ lineup, isOpen, onClose }: LineupModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(1)
  const [selectedAbility, setSelectedAbility] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      if (lineup?.abilities && lineup.abilities.length > 0) {
        setSelectedAbility(lineup.abilities[0])
      }
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, lineup])

  if (!isOpen || !lineup) return null

  // Mock images for demonstration - in real app these would come from data
  const allImages = Array.from({ length: 7 }, (_, i) => 
    lineup.type === 'setup' 
      ? `/static/setup_images/${lineup.id}/images/${Math.ceil((i + 1) / 2)}/${((i % 2) + 1)}.webp`
      : `/static/lineup_images/${lineup.id}/${i + 1}.webp`
  )

  const previousImage = () => {
    if (currentImageIndex > 1) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const nextImage = () => {
    if (currentImageIndex < allImages.length) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const goToImage = (imageNum: number) => {
    setCurrentImageIndex(imageNum)
  }

  const selectSetupAbility = (abilityTitle: string) => {
    setSelectedAbility(abilityTitle)
  }

  const shareLineup = () => {
    navigator.clipboard.writeText(window.location.origin + `/?id=${lineup.id}`)
  }

  const saveLineup = () => {
    // Implementation for save/unsave
    console.log('Save lineup:', lineup.id)
  }

  const abilities = lineup.abilities.map(ability => ({
    name: ability,
    icon: `/static/abilities/${ability}.webp`,
    description: `Description for ${ability} ability`
  }))

  return (
    <div 
      id="viewer_container" 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        backgroundColor: 'rgba(0,0,0,0.8)', 
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div 
        id="viewer_full" 
        data-click_interval="1758403773424" 
        data-id={lineup.id} 
        data-type={lineup.type} 
        style={{ 
          height: '377.944px', 
          '--xpos1': '-588.6328125px', 
          '--ypos': '180.3828125px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px',
          overflow: 'hidden'
        } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        <div id="viewer_image_div">
          <img 
            src={allImages[currentImageIndex - 1] || lineup.image} 
            id="viewer_image" 
            style={{ display: 'block', width: '100%', height: 'auto' }}
            alt="Lineup image"
          />
          <div id="viewer_image_buttons" style={{}}>
            <img 
              src="/static/ui_icons/back.png" 
              id="viewer_image_back" 
              onClick={previousImage} 
              style={{ display: currentImageIndex > 1 ? 'inline' : 'none' }} 
              title="Previous image"
            />
            <img 
              src="/static/ui_icons/forward.png" 
              id="viewer_image_next" 
              onClick={nextImage} 
              title="Next image" 
              style={{ display: currentImageIndex < allImages.length ? 'inline' : 'none' }}
            />
            <img 
              src="/static/ui_icons/liked.svg" 
              id="viewer_like_animation"
            />
          </div>
          <div id="viewer_loading" style={{ display: 'none' }}>
            <div style={{ left: '50%', top: '50%', width: '16.5rem', height: 'calc(100px + 3rem)', position: 'relative', transform: 'translate(-50%, -80%)' }}>
              <div className="loading-dots" style={{ animation: 'mymove 1.1s 0s infinite linear', left: '0px' }}></div>
              <div className="loading-dots" style={{ animation: 'mymove 1.1s 0.1s infinite linear', left: '4.5rem' }}></div>
              <div className="loading-dots" style={{ animation: 'mymove 1.1s 0.2s infinite linear', left: '9rem' }}></div>
              <div className="loading-dots" style={{ animation: 'mymove 1.1s 0.3s infinite linear', left: '13.5rem' }}></div>
            </div>
          </div>
        </div>

        <div id="viewer_title" style={{ display: 'flex' }}>
          <img 
            src="/static/ui_icons/back_material.png" 
            onClick={onClose} 
            id="viewer_back_button"
          />
          <div id="viewer_title_text">{lineup.title}</div>
          <img 
            src="/static/ui_icons/close.png" 
            onClick={onClose} 
            id="viewer_close"
          />
        </div>

        <div id="viewer_description" style={{ display: 'flex' }}>
          <div id="viewer_steps_title">Steps</div>
          <div id="viewer_description_text">
            <div id="setups_abilities_overview">
              {lineup.description}
              <br /><br />
              {lineup.type === 'setup' ? 'Setup instructions' : 'Lineup instructions'} for {lineup.agent} on {lineup.map}.
            </div>
            
            {lineup.type === 'setup' && (
              <div id="setups_abilities_parent">
                {abilities.map((ability, index) => (
                  <div 
                    key={index}
                    onClick={() => selectSetupAbility(ability.name)} 
                    className={`setups_abilities ${selectedAbility === ability.name ? 'selected' : ''}`} 
                    data-title={ability.name} 
                    data-description={ability.description}
                  >
                    <img src={ability.icon} alt={ability.name} />
                    <span>{ability.name}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div id="setups_abilities_description">
              {abilities.find(a => a.name === selectedAbility)?.description || lineup.description}
            </div>
          </div>

          <div id="viewer_translation_wrapper">
            <span id="viewer_translation_message">This lineup has been automatically translated. </span>
            <span id="viewer_translation_button">View original</span>
          </div>

          <div id="viewer_description_options">
            <img 
              src="/static/ui_icons/copy.svg" 
              onClick={shareLineup} 
              id="viewer_share" 
              title="Share"
            />
            <img 
              src="/static/ui_icons/save.svg" 
              onClick={saveLineup} 
              id="viewer_save" 
              title="Save/Unsave"
            />
            <span id="viewer_more_option_desktop">
              <img 
                src="/static/ui_icons/more_dots.png"
              />
              <div id="viewer_more_options_popup_desktop">
                <div className="viewer_desktop_options">
                  <img src="/static/ui_icons/report.svg" />
                  Report
                </div>
                <div className="viewer_desktop_options">
                  <img src="/static/ui_icons/overview.svg" />
                  <span id="viewer_overview_desktop">Show overview</span>
                </div>
              </div>
            </span>
          </div>

          <a href="/profile/user" id="viewer_owner_link">
            <img alt="User Profile Picture" src="/static/profile_pictures/knifed.svg" />
            <div>
              Uploaded by<br />
              <span id="viewer_username_text">User</span>
              <img id="verified_desc" src="/static/ui_icons/verified.svg" style={{ display: 'inline', verticalAlign: 'middle' }} />
              <span id="viewer_upload_date">on {new Date().toLocaleDateString()}</span>
            </div>
          </a>

          <div id="viewer_description_abilities" style={{ display: 'none' }}>
            <img src={`/static/agents/${lineup.agent}.webp`} alt={lineup.agent} />
            {lineup.abilities.map((ability, index) => (
              <img key={index} src={`/static/abilities/${ability}.webp`} alt={ability} />
            ))}
          </div>
        </div>

        <div id="viewer_image_overview_parent" style={{}}>
          <div id="viewer_image_overview">
            {allImages.map((imageSrc, index) => (
              <img 
                key={index + 1}
                src={imageSrc} 
                data-num={index + 1} 
                onClick={() => goToImage(index + 1)} 
                className={currentImageIndex === index + 1 ? 'selected' : ''}
                alt={`Image ${index + 1}`}
              />
            ))}
          </div>
          <div id="viewer_image_overview_options">
            <div id="viewer_image_counter">
              <span id="viewer_current_image">{currentImageIndex}</span>/
              <span id="viewer_max_image">{allImages.length}</span>
            </div>
            <img 
              src="/static/ui_icons/pin.svg" 
              title="Pin image overview" 
              id="viewer_image_overview_pin"
            />
            <img 
              src="/static/ui_icons/collapse.svg" 
              title="Expand image overview" 
              id="viewer_image_overview_expand"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LineupModal