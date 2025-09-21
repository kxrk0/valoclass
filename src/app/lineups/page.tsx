'use client'

import { useState, useMemo, useCallback } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LineupModal from '@/components/lineup/LineupModal'
import MoreOptionsMenu from '@/components/lineup/MoreOptionsMenu'
import { comprehensiveLineupData } from '@/data/lineupData'
import './lineups.css'

interface LineupData {
  id: string
  type: 'lineup' | 'setup'
  agent: string
  abilities: string[] // Multiple abilities support
  title: string
  description: string
  from: string
  to: string
  image: string
  map: string
  tags?: string[] // Additional tags like "retake", etc.
}

// Using comprehensive lineup data from /data/lineupData.ts
// This replaces the previous mockLineupData array

export default function LineupsPage() {
  const [selectedMap, setSelectedMap] = useState('Any')
  const [selectedAgent, setSelectedAgent] = useState('All')
  const [selectedAbility, setSelectedAbility] = useState('All')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedSide, setSelectedSide] = useState('0')
  const [isMapDropdownOpen, setIsMapDropdownOpen] = useState(false)
  const [isMinimapVisible, setIsMinimapVisible] = useState(false)
  const [minimapMode, setMinimapMode] = useState<'start' | 'end'>('end')
  const [startMarker, setStartMarker] = useState<{x: number, y: number, location: string} | null>(null)
  const [endMarker, setEndMarker] = useState<{x: number, y: number, location: string} | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Modal and Menu states
  const [selectedLineup, setSelectedLineup] = useState<LineupData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [moreOptionsMenu, setMoreOptionsMenu] = useState<{
    isOpen: boolean
    lineup: LineupData | null
    position: { x: number; y: number }
  }>({
    isOpen: false,
    lineup: null,
    position: { x: 0, y: 0 }
  })

  const maps = [
    'Any', 'Corrode', 'Ascent', 'Abyss', 'Split', 'Bind', 'Haven', 
    'Sunset', 'Lotus', 'Breeze', 'Icebox', 'Fracture', 'Pearl'
  ]

  // Enhanced callouts from lineup data + default locations
  const calloutsByMap: Record<string, string[]> = {
    'Bind': ['A Site', 'B Site', 'A Short', 'A Truck', 'A Lamps', 'B Long', 'B Elbow', 'B Halls', 'Hookah', 'Showers', 'Teleporter A', 'Teleporter B', 'A Site Default', 'B Site Default', 'B Truck', 'B Spawn'],
    'Ascent': ['A Site', 'B Site', 'A Main', 'A Lobby', 'A Ramp', 'A Generator', 'A Rafters', 'A Boxes', 'B Main', 'B Lobby', 'B Front', 'B Logs', 'Mid', 'Mid Top', 'Mid Catwalk', 'Mid Link', 'Mid Cubby', 'A Site Default', 'B Site Default', 'A Wine', 'Mid Market', 'Mid Pizza', 'Boathouse'],
    'Haven': ['A Site', 'B Site', 'C Site', 'A Long', 'A Short', 'A Lobby', 'B Long', 'B Lobby', 'C Long', 'C Garage', 'Sewers', 'A Heaven', 'A Hell', 'Bottom Mid', 'C Cubby', 'C Link', 'C Logs', 'Mid Courtyard', 'Mid Window', 'Attackers', 'Defenders', 'Mid Doors', 'C Window', 'Backsite B'],
    'Split': ['A Site', 'B Site', 'A Main', 'A Ramp', 'A Hell', 'A Heaven', 'B Main', 'B Lobby', 'Mid', 'Top Mid', 'Bottom Mid', 'A Alley', 'B Alley'],
    'Icebox': ['A Site', 'B Site', 'A Main', 'A Screens', 'A Belt', 'A Nest', 'B Main', 'B Green', 'B Yellow', 'Mid', 'Mid Top', 'Mid Pallet'],
    'Breeze': ['A Site', 'B Site', 'A Main', 'A Lobby', 'A Cave', 'B Main', 'B Elbow', 'B Tunnel', 'Mid', 'Mid Pillar', 'Mid Cannon', 'Mid Bottom'],
    'Pearl': ['A Main', 'A Site', 'B Site', 'B Club', 'B Tower', 'B Link', 'B Screen', 'B Hall', 'B Tunnel', 'Mid Doors', 'Ramp Stairs'],
    'Lotus': ['A Site', 'A Main', 'A Root', 'A Tree', 'A Top', 'B Site', 'B Main', 'B Pillars', 'C Site', 'C Lobby', 'C Bend', 'C Gravel'],
    'Sunset': ['A Site', 'A Main', 'A Lobby', 'A Alley', 'B Site', 'Mid', 'Mid Tile', 'Mid Stairs', 'A Elbow', 'A Link', 'A Top', 'Attacker Spawn', 'B Boba', 'B Market', 'B Site Plant', 'Defender Spawn', 'Mid Bottom', 'Mid Courtyard', 'Mid Top'],
    'Fracture': ['A Site', 'A Hall', 'B Site', 'B Main', 'B Bench', 'B Tower', 'B Tunnel', 'Attacker Side Spawn', 'Defender Side Spawn'],
    'Abyss': ['A Site', 'A Main', 'A Vent', 'B Site', 'Mid Top', 'Mid Catwalk', 'Mid Bottom', 'A Bridge', 'A Link', 'A Lobby', 'A Security', 'A Tower', 'Attackers', 'B Danger', 'B Lobby', 'B Nest', 'B Tower', 'Defenders', 'Mid Library', 'A Secret'],
    'Corrode': ['A Site', 'B Site', 'A Back', 'A Crane', 'A Elbow', 'A Front', 'A Link', 'A Lobby', 'A Main', 'A Pocket', 'A Yard', 'Attacker Side Spawn', 'B Arch', 'B Link', 'B Lobby', 'B Main', 'B Tower', 'B Elbow', 'Mid Bottom', 'Mid Stairs', 'Mid Top', 'Mid Window']
  }

  const agents = [
    'All', 'Astra', 'Breach', 'Brimstone', 'Chamber', 'Cypher', 'Deadlock', 'Fade',
    'Gekko', 'Harbor', 'KAYO', 'Killjoy', 'Neon', 'Omen', 'Phoenix', 'Raze',
    'Sage', 'Skye', 'Sova', 'Tejo', 'Viper', 'Vyse', 'Yoru'
  ]

  const getAgentAbilities = (agent: string) => {
    const abilities: Record<string, Array<{name: string, icon: string}>> = {
      // Only using abilities with available images
      'Breach': [
        { name: 'Aftershock', icon: '/static/abilities/Aftershock.webp' }
      ],
      'Brimstone': [
        { name: 'Incendiary', icon: '/static/abilities/Incendiary.webp' }
      ],
      'Chamber': [
        { name: 'Trademark', icon: '/static/abilities/Trademark.webp' }
      ],
      'Cypher': [
        { name: 'Trapwire', icon: '/static/abilities/Trapwire.webp' },
        { name: 'Cyber Cage', icon: '/static/abilities/Cyber Cage.webp' },
        { name: 'Spycam', icon: '/static/abilities/Spycam.webp' }
      ],
      'Deadlock': [
        { name: 'GravNet', icon: '/static/abilities/GravNet.webp' },
        { name: 'Sonic Sensor', icon: '/static/abilities/Sonic Sensor.webp' },
        { name: 'Barrier Mesh', icon: '/static/abilities/Barrier Mesh.webp' },
        { name: 'Annihilation', icon: '/static/abilities/Annihilation.webp' }
      ],
      'Fade': [
        { name: 'Seize', icon: '/static/abilities/Seize.webp' },
        { name: 'Haunt', icon: '/static/abilities/Haunt.webp' }
      ],
      'Gekko': [
        { name: 'Mosh Pit', icon: '/static/abilities/Mosh Pit.webp' },
        { name: 'Dizzy', icon: '/static/abilities/Dizzy.webp' }
      ],
      'Harbor': [
        { name: 'Cove', icon: '/static/abilities/Cove.webp' }
      ],
      'KAYO': [
        { name: 'FRAG/ment', icon: '/static/abilities/Frag_Ment.webp' },
        { name: 'FLASH/drive', icon: '/static/abilities/Flash_Drive.webp' },
        { name: 'ZERO/point', icon: '/static/abilities/Zero_Point.webp' }
      ],
      'Killjoy': [
        { name: 'Nanoswarm', icon: '/static/abilities/Nanoswarm.webp' }
      ],
      'Neon': [
        { name: 'Relay Bolt', icon: '/static/abilities/Relay Bolt.webp' }
      ],
      'Omen': [
        { name: 'Dark Cover', icon: '/static/abilities/Dark Cover.webp' }
      ],
      'Phoenix': [
        { name: 'Hot Hands', icon: '/static/abilities/Hot Hands.webp' }
      ],
      'Raze': [
        { name: 'Boom Bot', icon: '/static/abilities/Boom Bot.webp' },
        { name: 'Paint Shells', icon: '/static/abilities/Paint Shells.webp' }
      ],
      'Sage': [
        { name: 'Barrier Orb', icon: '/static/abilities/Barrier Orb.webp' },
        { name: 'Slow Orb', icon: '/static/abilities/Slow Orb.webp' }
      ],
      'Sova': [
        { name: 'Shock Bolt', icon: '/static/abilities/Shock Bolt.webp' },
        { name: 'Recon Bolt', icon: '/static/abilities/Recon Bolt.webp' }
      ],
      'Tejo': [
        { name: 'Special Delivery', icon: '/static/abilities/Special Delivery.webp' }
      ],
      'Viper': [
        { name: 'Snake Bite', icon: '/static/abilities/Snake Bite.webp' },
        { name: 'Poison Cloud', icon: '/static/abilities/Poison Cloud.webp' },
        { name: 'Toxic Screen', icon: '/static/abilities/Toxic Screen.webp' },
        { name: 'Vipers Pit', icon: '/static/abilities/Vipers Pit.webp' }
      ],
      'Vyse': [
        { name: 'Razorvine', icon: '/static/abilities/Razorvine.webp' }
      ],
      'Yoru': [
        { name: 'Fakeout', icon: '/static/abilities/Fakeout.webp' },
        { name: 'Blindside', icon: '/static/abilities/Blindside.webp' },
        { name: 'Gatecrash', icon: '/static/abilities/Gatecrash.webp' }
      ]
    }
    return abilities[agent] || []
  }

  const selectMap = useCallback((mapName: string) => {
    setSelectedMap(mapName)
    setIsMapDropdownOpen(false)
    // Show minimap if not "Any"
    setIsMinimapVisible(mapName !== 'Any')
  }, [])

  const selectAgent = useCallback((agent: string) => {
    setSelectedAgent(agent)
    // Reset ability to first one of the selected agent
    const abilities = getAgentAbilities(agent)
    if (abilities.length > 0) {
      setSelectedAbility(abilities[0].name)
    }
  }, [])

  const toggleMinimapPos = (mode: 0 | 1) => {
    setMinimapMode(mode === 0 ? 'start' : 'end')
  }

  const toggleResultType = useCallback((type: string) => {
    setSelectedType(type)
  }, [])

  const toggleResultSide = useCallback((side: string) => {
    setSelectedSide(side)
  }, [])

  const handleMinimapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isMinimapVisible) return
    
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    
    // Find nearest callout (simplified - would need actual map callout data)
    const location = getLocationFromCoordinates(selectedMap)
    
    if (minimapMode === 'start') {
      setStartMarker({ x, y, location })
    } else {
      setEndMarker({ x, y, location })
    }
  }

  const getLocationFromCoordinates = (map: string): string => {
    // Use comprehensive callout data
    const mapLocations = calloutsByMap[map] || ['Unknown Location']
    // Return random location for now - in real implementation, would calculate based on coordinates
    return mapLocations[Math.floor(Math.random() * mapLocations.length)]
  }

  const clearMarker = (type: 'start' | 'end') => {
    if (type === 'start') {
      setStartMarker(null)
    } else {
      setEndMarker(null)
    }
  }

  // Modal and Menu handlers
  const openLineupModal = (lineup: LineupData) => {
    setSelectedLineup(lineup)
    setIsModalOpen(true)
  }

  const closeLineupModal = () => {
    setIsModalOpen(false)
    setSelectedLineup(null)
  }

  const openMoreOptions = (event: React.MouseEvent, lineup: LineupData) => {
    event.preventDefault()
    event.stopPropagation()
    
    const rect = event.currentTarget.getBoundingClientRect()
    setMoreOptionsMenu({
      isOpen: true,
      lineup,
      position: { 
        x: rect.left + rect.width + 10, 
        y: rect.top 
      }
    })
  }

  const closeMoreOptions = () => {
    setMoreOptionsMenu({
      isOpen: false,
      lineup: null,
      position: { x: 0, y: 0 }
    })
  }

  // Optimized filtering with useMemo
  const filteredLineups = useMemo(() => {
    const filtered = comprehensiveLineupData.filter(lineup => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = lineup.title.toLowerCase().includes(query)
        const matchesAgent = lineup.agent.toLowerCase().includes(query)
        const matchesMap = lineup.map.toLowerCase().includes(query)
        const matchesAbilities = lineup.abilities.some(ability => 
          ability.toLowerCase().includes(query)
        )
        const matchesFrom = lineup.from.toLowerCase().includes(query)
        const matchesTo = lineup.to.toLowerCase().includes(query)
        const matchesTags = lineup.tags?.some(tag => 
          tag.toLowerCase().includes(query)
        ) || false
        
        if (!matchesTitle && !matchesAgent && !matchesMap && !matchesAbilities && 
            !matchesFrom && !matchesTo && !matchesTags) {
          return false
        }
      }
      
      // Filter by agent
      if (selectedAgent && selectedAgent !== 'All' && lineup.agent !== selectedAgent) {
        return false
      }
      
      // Filter by ability (check if any of the lineup's abilities match)
      if (selectedAbility && selectedAbility !== 'All' && !lineup.abilities.includes(selectedAbility)) {
        return false
      }
      
      // Filter by map
      if (selectedMap && selectedMap !== 'Any' && lineup.map !== selectedMap) {
        return false
      }
      
      // Filter by type
      if (selectedType !== 'all' && lineup.type !== selectedType) {
        return false
      }
      
      // Filter by markers (if set)
      if (startMarker?.location && !lineup.from.toLowerCase().includes(startMarker.location.toLowerCase())) {
        return false
      }
      
      if (endMarker?.location && !lineup.to.toLowerCase().includes(endMarker.location.toLowerCase())) {
        return false
      }
      
      return true
    })
    
    // Debug: uncomment to see filtering stats
    // console.log('🔍 Filtering Debug:', { filteredCount: filtered.length, totalLineups: comprehensiveLineupData.length })
    
    return filtered
  }, [searchQuery, selectedAgent, selectedAbility, selectedMap, selectedType, startMarker, endMarker])

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-white">
      <Header />
      
      <div id="all_page_content">
        <div id="home_content" className="page active">
          <main>
            <h1 style={{ display: 'none' }}>Easy VALORANT Lineups and Guides | LineupsValorant</h1>
            <p style={{ display: 'none' }}>Lineups valorant is the best lineups website built directly for gamers of all Valorant ranks</p>

            {/* Search Bar */}
            <div className="search-bar-container">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search lineups, agents, abilities, maps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <div className="search-icon">🔍</div>
              </div>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="clear-search-btn"
                >
                  Clear
                </button>
              )}
      </div>

            <section 
              id="search_filters_parent" 
              className={`search_filters_map_closed search_filters_agent_selected ${isMinimapVisible ? 'search_filters_map_open' : ''}`}
            >
              {/* Map Selector */}
              <div id="map_selector_parent">
                <div style={{ padding: '0 1.1em', marginBottom: '1em' }}>Map</div>
                <div id="map_selector">
                  {maps.map((map) => (
                    <a 
                      key={map}
                      data-value={map}
                      className={`map_selector_option ${selectedMap === map ? 'map_selector_option_selected' : ''}`}
                      href={`/?map=${map}`}
                      onClick={(e) => {
                        e.preventDefault()
                        selectMap(map)
                      }}
                    >
                      {map}
                    </a>
                  ))}
                </div>
                <div 
                  id="map_selector_dropdown" 
                  onClick={() => setIsMapDropdownOpen(true)}
                >
                  <span id="map_selector_dropdown_text">{selectedMap}</span>
                  <div></div>
                </div>
      </div>

              {/* Interactive Minimap */}
              {isMinimapVisible && (
                <div id="minimap_parent" className="show">
                  <div id="minimap_text">
                    <span id="minimap_prompt_text">Click on map to select lineup start or end location</span>
                    <span id="minimap_location_text">
                      Lineup position from <span id="lineup_start_pos">{startMarker?.location || 'Anywhere'}</span> to <span id="lineup_end_pos">{endMarker?.location || 'Anywhere'}</span>
                    </span>
                    <div className="search_toggles">
                      <button 
                        id="minimap_toggle_start" 
                        onClick={() => toggleMinimapPos(0)}
                        className={minimapMode === 'start' ? 'search_toggle_selected' : ''}
                      >
                        Start
                      </button>
                      <button 
                        id="minimap_toggle_end" 
                        onClick={() => toggleMinimapPos(1)}
                        className={minimapMode === 'end' ? 'search_toggle_selected' : ''}
                      >
                        End
                      </button>
                    </div>
                  </div>
                  <div id="minimap_image" onClick={handleMinimapClick}>
                    <img 
                      src={`/static/maps/${selectedMap.toLowerCase()}/minimap.webp`} 
                      alt="valorant minimap" 
                      loading="lazy"
                      onError={(e) => {
                        // Minimap not found, fallback to placeholder
                        e.currentTarget.src = '/static/ui_icons/placeholder.png'
                      }}
                    />
                    <div>
                      {startMarker && (
                        <div 
                          id="minimap_start_marker" 
                          style={{ 
                            left: `${startMarker.x}%`, 
                            top: `${startMarker.y}%`,
                            display: 'block'
                          }}
                        >
                          <img src="/static/ui_icons/marker.png" loading="lazy" alt="start marker" />
                          <span onClick={(e) => {
                            e.stopPropagation()
                            clearMarker('start')
                          }}>Clear</span>
                        </div>
                      )}
                      {endMarker && (
                        <div 
                          id="minimap_end_marker"
                          style={{ 
                            left: `${endMarker.x}%`, 
                            top: `${endMarker.y}%`,
                            display: 'block'
                          }}
                        >
                          <img src="/static/ui_icons/marker.png" loading="lazy" alt="end marker" />
                          <span onClick={(e) => {
                            e.stopPropagation()
                            clearMarker('end')
                          }}>Clear</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}


              {/* Ability Selector */}
              <div id="abilities_selector_parent" style={{ display: selectedAgent !== 'All' ? 'block' : 'none' }}>
                <span>Ability</span>
                <div id="abilities_selector">
                  {selectedAgent === 'All' ? (
                    <button 
                      className={`ability_option ${selectedAbility === 'All' ? 'ability_option_selected' : ''}`}
                      title="All Abilities"
                      data-ability="All"
                      onClick={() => setSelectedAbility('All')}
                      style={{ fontSize: '14px', fontWeight: 'bold' }}
                    >
                      All
                    </button>
                  ) : (
                    getAgentAbilities(selectedAgent).map((ability) => (
                      <button 
                        key={ability.name}
                        className={`ability_option ${selectedAbility === ability.name ? 'ability_option_selected' : ''}`}
                        title={ability.name}
                        data-ability={ability.name}
                        onClick={() => setSelectedAbility(ability.name)}
                      >
                        <img src={ability.icon} alt={ability.name} />
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Type Selector */}
              <div id="type_selector_parent">
                <span>Type</span>
                <div className="search_toggles">
                  <button 
                    data-value="all" 
                    onClick={() => toggleResultType('all')}
                    className={selectedType === 'all' ? 'search_toggle_selected' : ''}
                  >
                    All
                  </button>
                  <button 
                    data-value="lineup" 
                    onClick={() => toggleResultType('lineup')}
                    className={selectedType === 'lineup' ? 'search_toggle_selected' : ''}
                  >
                    Lineup
                  </button>
                  <button 
                    data-value="setup" 
                    onClick={() => toggleResultType('setup')}
                    className={selectedType === 'setup' ? 'search_toggle_selected' : ''}
                  >
                    Setup
                  </button>
                </div>
              </div>

              {/* Side Selector */}
              <div id="side_selector_parent">
                <span>Side</span>
                <div className="search_toggles">
                  <button 
                    data-value="0" 
                    onClick={() => toggleResultSide('0')}
                    className={selectedSide === '0' ? 'search_toggle_selected' : ''}
                  >
                    All
                  </button>
                  <button 
                    data-value="1" 
                    onClick={() => toggleResultSide('1')}
                    className={selectedSide === '1' ? 'search_toggle_selected' : ''}
                  >
                    Defense
                  </button>
                  <button 
                    data-value="2" 
                    onClick={() => toggleResultSide('2')}
                    className={selectedSide === '2' ? 'search_toggle_selected' : ''}
                  >
                    Attack
                  </button>
                  </div>
                </div>

              {/* Agent Selector - Moved to Bottom with Modern Grid Layout */}
              <div id="agents_selector_parent">
                <span>Agent</span>
                <div id="agents_selector">
                  {agents.map((agent) => (
                    <a 
                      key={agent}
                      className={`agent_option ${selectedAgent === agent ? 'agent_option_selected' : ''}`}
                      href={`?agent=${agent}`}
                      data-agent={agent}
                      onClick={(e) => {
                        e.preventDefault()
                        selectAgent(agent)
                      }}
                    >
                      {agent === 'All' ? (
                        <div className="all-agents-icon">ALL</div>
                      ) : (
                        <picture>
                          <source media="(max-width: 15000px)" srcSet={`/static/agents/${agent}.webp`} />
                          <img src={`/static/agents/${agent}.webp`} alt={agent} title={agent} />
                        </picture>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </section>

            {/* Results Title */}
            <h2 id="lineups_grid_title">Top Results ({filteredLineups.length} results)</h2>

            {/* Lineups Grid */}
            <section id="lineups_grid" className="grid-container">
              {filteredLineups.map((lineup) => (
                <a 
                  key={lineup.id}
                  href={`/?id=${lineup.id}`}
                  className="lineup-box"
                  rel="nofollow"
                  tabIndex={0}
                  data-id={lineup.id}
                  data-type={lineup.type}
                  onClick={(e) => {
                    e.preventDefault()
                    openLineupModal(lineup)
                  }}
                >
                  <div className="lineups-box-image-div">
                    <img 
                      loading="lazy" 
                      alt="lineup image" 
                      className="lineup-box-image" 
                      src={lineup.image || `/static/lineup_images/${lineup.id}/cover.webp`}
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.src = '/static/ui_icons/placeholder.png';
                      }}
                    />
                    <div className="lineup-box-darken"></div>
                    <div className="lineup-box-abilities">
                      {lineup.abilities.map((ability, index) => (
                        <img 
                          key={index}
                          alt={`VALORANT ${ability}`} 
                          src={`/static/abilities/${ability.replace(/\s+/g, ' ').trim()}.webp`} 
                          loading="lazy" 
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ))}
                    </div>
                    <img 
                      loading="lazy" 
                      className="lineup-box-agent" 
                      alt={lineup.agent} 
                      src={`/static/agents/${lineup.agent}.webp`} 
                      onError={(e) => {
                        e.currentTarget.src = '/static/ui_icons/placeholder.png';
                      }}
                    />
                  </div>
                  <div className="lineup-box-text">
                    <span className="lineup-box-title">{lineup.title}</span>
                    <br />
                    <span className="lineup-box-position">
                      {lineup.type === 'setup' ? (
                        <>For <a onClick={(e) => e.stopPropagation()} href={`/?map=${lineup.map}&start=${lineup.from}`}>
                          {lineup.from}
                        </a></>
                      ) : (
                        <>From <a onClick={(e) => e.stopPropagation()} href={`/?map=${lineup.map}&start=${lineup.from}`}>
                          {lineup.from}
                        </a> to <a onClick={(e) => e.stopPropagation()} href={`/?map=${lineup.map}&end=${lineup.to}`}>
                          {lineup.to}
                        </a></>
                      )}
                    </span>
                    <div 
                      onClick={(e) => openMoreOptions(e, lineup)} 
                      data-id={lineup.id} 
                      data-type={lineup.type} 
                      className="lineup_box_options_parent"
                    >
                      <img src="/static/ui_icons/more_dots.png" alt="more options" />
                    </div>
                  </div>
                </a>
              ))}
            </section>
          </main>

          {/* Map Dropdown Modal */}
          {isMapDropdownOpen && (
            <div id="map_dropdown_bg" style={{ display: 'flex' }}>
              <div id="map_dropdown_popup">
                <span>Select a map</span>
                <div id="map_dropdown_options">
                  {maps.map((map) => (
                    <div 
                      key={map}
                      data-value={map}
                      className={`${selectedMap === map ? 'map_dropdown_selected' : ''}`}
                      onClick={() => selectMap(map)}
                    >
                      {map}
                  </div>
                  ))}
                  </div>
                <div id="map_dropdown_buttons">
                  <button 
                    style={{ backgroundColor: 'transparent' }} 
                    onClick={() => setIsMapDropdownOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    style={{ backgroundColor: 'var(--accent-clr)' }} 
                    onClick={() => setIsMapDropdownOpen(false)}
                  >
                    Select
                  </button>
                  </div>
                </div>
              </div>
          )}

          {/* Jump to Results Button (Mobile) */}
          <a id="jump_to_results" href="#lineups_grid_title">Jump to results</a>
          </div>
        </div>
      
      {/* Modal and Menu Components */}
      <LineupModal
        lineup={selectedLineup}
        isOpen={isModalOpen}
        onClose={closeLineupModal}
      />
      
      <MoreOptionsMenu
        lineup={moreOptionsMenu.lineup ? {
          id: moreOptionsMenu.lineup.id,
          title: moreOptionsMenu.lineup.title,
          agent: moreOptionsMenu.lineup.agent,
          map: moreOptionsMenu.lineup.map,
          image: moreOptionsMenu.lineup.image
        } : {
          id: '',
          title: '',
          agent: '',
          map: '',
          image: ''
        }}
        isOpen={moreOptionsMenu.isOpen}
        onClose={closeMoreOptions}
        position={moreOptionsMenu.position}
        onOpenModal={() => {
          if (moreOptionsMenu.lineup) {
            openLineupModal(moreOptionsMenu.lineup)
          }
        }}
      />
      
      <Footer />
    </div>
  )
}
