export type Language = 'en' | 'tr'

export interface TranslationKeys {
  // Navigation
  nav: {
    lineups: string
    crosshairs: string
    stats: string
    community: string
    signIn: string
    profile: string
    settings: string
    logout: string
  }
  
  // Hero Section
  hero: {
    badge: string
    title: {
      main: string
      highlight: string
    }
    subtitle: string
    buttons: {
      exploreLineups: string
      createCrosshair: string
    }
    stats: {
      activeUsers: string
      proLineups: string
      crosshairs: string
    }
    trustBadge: string
    features: {
      secure: string
      community: string
      professional: string
    }
  }
  
  // Lineups Page
  lineups: {
    hero: {
      badge: string
      title: {
        main: string
        highlight: string
      }
      subtitle: string
      search: {
        placeholder: string
        button: string
      }
      tabs: {
        all: string
        smokes: string
        flashes: string
        recon: string
        molotovs: string
      }
      stats: {
        lineups: string
        activeUsers: string
        updatedDaily: string
      }
      features: {
        proLevel: {
          title: string
          description: string
        }
        videoGuides: {
          title: string
          description: string
        }
        communityTested: {
          title: string
          description: string
        }
      }
    }
  }
  
  // Features
  features: {
    proLineups: {
      title: string
      description: string
    }
    crosshairEditor: {
      title: string
      description: string
    }
    liveStats: {
      title: string
      description: string
    }
    communityHub: {
      title: string
      description: string
    }
  }
  
  // Crosshairs Page
  crosshairs: {
    hero: {
      badge: string
      title: {
        main: string
        highlight: string
      }
      subtitle: string
      features: {
        accuracy: string
        presets: string
        community: string
      }
      actions: {
        startBuilding: string
        browsePresets: string
        communityCrosshairs: string
      }
      grid: {
        pixelPerfect: {
          title: string
          description: string
          badge: string
        }
        proPlayer: {
          title: string
          description: string
          badge: string
        }
        communityPowered: {
          title: string
          description: string
          badge: string
        }
      }
      howToUse: {
        title: string
        steps: {
          create: {
            title: string
            description: string
          }
          copyCode: {
            title: string
            description: string
          }
          openValorant: {
            title: string
            description: string
          }
          pastePlay: {
            title: string
            description: string
          }
        }
      }
    }
    builder: {
      title: string
      description: string
      profiles: {
        general: string
        primary: string
        ads: string
        sniper: string
      }
      actions: {
        reset: string
        random: string
        dotOnly: string
        import: string
        proPresets: string
        export: string
        shareCode: string
        shareCommunity: string
      }
      preview: {
        title: string
      }
    }
  }
  
  // Stats Page
  stats: {
    hero: {
      badge: string
      title: {
        main: string
        highlight: string
      }
      subtitle: string
      features: {
        liveData: string
        matchHistory: string
        rankTracking: string
      }
      featuredPlayers: {
        badge: string
        title: string
        subtitle: string
      }
      grid: {
        realTime: {
          title: string
          description: string
          badge: string
        }
        deepAnalytics: {
          title: string
          description: string
          badge: string
        }
        social: {
          title: string
          description: string
          badge: string
        }
      }
      improveTips: {
        title: string
        analyze: {
          title: string
          description: string
        }
        track: {
          title: string
          description: string
        }
        learn: {
          title: string
          description: string
        }
      }
    }
    playerSearch: {
      title: string
      placeholder: string
      helpText: string
      searchButton: string
      popularSearches: string
      tips: {
        trackProgress: {
          title: string
          description: string
        }
        compareWithFriends: {
          title: string
          description: string
        }
      }
    }
  }
  
  // Community Page
  community: {
    hero: {
      title: {
        main: string
        highlight: string
      }
      subtitle: string
      joinCommunity: string
      discordServer: string
      stats: {
        activeMembers: string
        lineupsShared: string
        crosshairsCreated: string
        likesGiven: string
      }
    }
    recentActivity: {
      title: string
      viewAll: string
      filters: {
        allActivity: string
        lineups: string
        crosshairs: string
        discussions: string
      }
      loadMore: string
      actions: {
        share: string
        downloads: string
      }
    }
    stats: {
      title: string
      labels: {
        totalMembers: string
        activeToday: string
        lineupsShared: string
        crosshairsCreated: string
      }
      thisWeek: string
      weeklyActivity: string
      membersByCountry: string
      recentMilestones: string
    }
    contributors: {
      title: string
      viewLeaderboard: string
      likes: string
      risingStars: string
      posts: string
    }
    joinDiscord: {
      title: string
      description: string
      button: string
    }
    features: {
      title: string
      connect: {
        title: string
        description: string
      }
      share: {
        title: string
        description: string
      }
      compete: {
        title: string
        description: string
      }
    }
  }
  
  // Common
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    save: string
    delete: string
    edit: string
    search: string
    filter: string
    sort: string
    language: string
    theme: string
  }
  
  // Auth
  auth: {
    login: string
    register: string
    loginHeroTitle: string
    registerHeroTitle: string
    loginHeroBadge: string
    registerHeroBadge: string
    loginSubtitle: string
    registerSubtitle: string
    email: string
    password: string
    confirmPassword: string
    forgotPassword: string
    createAccount: string
    alreadyHaveAccount: string
    dontHaveAccount: string
    demo: string
    registerFeatures: {
      exclusive: string
      community: string
      tracking: string
    }
    signInHere: string
  }
  
  // Features Section
  featuresSection: {
    title: string
    subtitle: string
    features: {
      advancedLineups: {
        title: string
        description: string
      }
      customCrosshairs: {
        title: string
        description: string
      }
      playerStatistics: {
        title: string
        description: string
      }
      communityHub: {
        title: string
        description: string
      }
      completeMaps: {
        title: string
        description: string
      }
      liveUpdates: {
        title: string
        description: string
      }
    }
    cta: {
      title: string
      subtitle: string
      joinCommunity: string
      exploreLineups: string
    }
    accessNow: string
  }
  
  // Stats Section
  statsSection: {
    title: string
    subtitle: string
    stats: {
      activeUsers: string
      lineupsCreated: string
      crosshairsShared: string
      rankImprovements: string
    }
    testimonial: {
      quote: string
      name: string
      rank: string
    }
  }

  // Footer
  footer: {
    description: string
    newsletter: {
      badge: string
      title: string
      subtitle: string
      placeholder: string
      button: string
    }
    categories: {
      features: string
      resources: string
      community: string
      support: string
    }
    links: {
      agentLineups: string
      crosshairBuilder: string
      playerStatistics: string
      communityHub: string
      mapGuides: string
      agentGuides: string
      proPlayerSettings: string
      patchNotes: string
      discordServer: string
      reddit: string
      twitter: string
      youtube: string
      helpCenter: string
      contactUs: string
      bugReports: string
      featureRequests: string
      privacyPolicy: string
      termsOfService: string
      cookiePolicy: string
    }
    copyright: string
  }
}

export const translations: Record<Language, TranslationKeys> = {
  en: {
    nav: {
      lineups: 'Lineups',
      crosshairs: 'Crosshairs', 
      stats: 'Stats',
      community: 'Community',
      signIn: 'Sign In',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout'
    },
    hero: {
      badge: 'Turkey\'s #1 Valorant Platform',
      title: {
        main: 'Master',
        highlight: 'Valorant'
      },
      subtitle: 'The ultimate platform for professional lineups, customizable crosshairs and detailed statistics. Elevate your gameplay to the next level.',
      buttons: {
        exploreLineups: 'Explore Lineups',
        createCrosshair: 'Create Crosshair'
      },
      stats: {
        activeUsers: 'Active Users',
        proLineups: 'Pro Lineups',
        crosshairs: 'Crosshairs'
      },
      trustBadge: 'Turkey\'s most trusted Valorant platform',
      features: {
        secure: 'Secure & Fast',
        community: 'Active Community',
        professional: 'Professional Content'
      }
    },
    lineups: {
      hero: {
        badge: 'Professional Valorant Lineups',
        title: {
          main: 'Master',
          highlight: 'Every Lineup'
        },
        subtitle: 'Discover precise lineups from pro players. Smokes, flashes, recon darts, and utility setups for every agent and map combination.',
        search: {
          placeholder: 'Search agents, maps, abilities...',
          button: 'Search'
        },
        tabs: {
          all: 'All Lineups',
          smokes: 'Smokes',
          flashes: 'Flashes',
          recon: 'Recon',
          molotovs: 'Molotovs'
        },
        stats: {
          lineups: 'Lineups',
          activeUsers: 'Active Users',
          updatedDaily: 'Updated Daily'
        },
        features: {
          proLevel: {
            title: 'Pro-Level Accuracy',
            description: 'Every lineup tested by professionals with exact crosshair placements and timing'
          },
          videoGuides: {
            title: 'Video Guides',
            description: 'Step-by-step video tutorials for every lineup with multiple camera angles'
          },
          communityTested: {
            title: 'Community Tested',
            description: 'Verified by thousands of players in competitive matches with success ratings'
          }
        }
      }
    },
    features: {
      proLineups: {
        title: 'Pro Lineups',
        description: 'Learn and apply smoke, flash and molotov lineups from professional players.'
      },
      crosshairEditor: {
        title: 'Crosshair Editor',
        description: 'Create the perfect crosshair with advanced customization tools.'
      },
      liveStats: {
        title: 'Live Statistics',
        description: 'Track your progress and compare with other players.'
      },
      communityHub: {
        title: 'Community Hub',
        description: 'Share and discover crosshairs with thousands of players.'
      }
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      language: 'Language',
      theme: 'Theme'
    },
    crosshairs: {
      hero: {
        badge: 'Professional Crosshair Builder',
        title: {
          main: 'Perfect Your',
          highlight: 'Crosshair'
        },
        subtitle: 'Create tournament-ready crosshairs with pixel-perfect accuracy. Featuring pro player presets, real-time preview, and instant Valorant codes.',
        features: {
          accuracy: '100% Accurate Codes',
          presets: 'Pro Player Presets',
          community: 'Community Sharing'
        },
        actions: {
          startBuilding: 'Start Building',
          browsePresets: 'Browse Presets',
          communityCrosshairs: 'Community Crosshairs'
        },
        grid: {
          pixelPerfect: {
            title: 'Pixel-Perfect Accuracy',
            description: 'Every crosshair code is tested and validated to match exactly what you see in Valorant. No more guesswork - what you build is what you get in-game.',
            badge: '100% Compatible'
          },
          proPlayer: {
            title: 'Pro Player Arsenal',
            description: 'Use the exact same crosshairs as TenZ, ScreaM, cNed, aspas, and other tournament champions. Battle-tested in professional matches.',
            badge: '15+ Pro Presets'
          },
          communityPowered: {
            title: 'Community Powered',
            description: 'Share your creations with thousands of players worldwide. Discover unique styles and vote on the best community crosshairs.',
            badge: '10K+ Shared'
          }
        },
        howToUse: {
          title: '⚡ How to Use Your Crosshair in Valorant',
          steps: {
            create: {
              title: 'Create',
              description: 'Design your crosshair using our builder with real-time preview'
            },
            copyCode: {
              title: 'Copy Code',
              description: 'Click "Share & Codes" and copy the Valorant crosshair code'
            },
            openValorant: {
              title: 'Open Valorant',
              description: 'Go to Settings → Crosshair → Import Profile Code'
            },
            pastePlay: {
              title: 'Paste & Play',
              description: 'Paste the code and enjoy your new crosshair in-game!'
            }
          }
        }
      },
      builder: {
        title: 'Crosshair Builder',
        description: 'Create your perfect Valorant crosshair with accurate in-game codes',
        profiles: {
          general: 'General',
          primary: 'Primary',
          ads: 'ADS',
          sniper: 'Sniper'
        },
        actions: {
          reset: 'Reset',
          random: 'Random',
          dotOnly: 'Dot Only',
          import: 'Import',
          proPresets: 'Pro Presets',
          export: 'Export',
          shareCode: 'Share & Codes',
          shareCommunity: 'Share to Community'
        },
        preview: {
          title: 'Live Preview'
        }
      }
    },
    
    stats: {
      hero: {
        badge: 'Real-Time Valorant Statistics',
        title: {
          main: 'Track Your',
          highlight: 'Performance'
        },
        subtitle: 'Get comprehensive Valorant statistics with real-time data from Riot\'s API. Track matches, analyze performance, and climb the ranks with data-driven insights.',
        features: {
          liveData: 'Live API Data',
          matchHistory: 'Match History',
          rankTracking: 'Rank Tracking'
        },
        featuredPlayers: {
          badge: 'Featured Players',
          title: 'Top Performers',
          subtitle: 'Learn from the best players and analyze their performance patterns'
        },
        grid: {
          realTime: {
            title: 'Real-Time Updates',
            description: 'Get the latest stats directly from Riot\'s official API. Your data updates automatically after every match.',
            badge: 'Official API'
          },
          deepAnalytics: {
            title: 'Deep Analytics',
            description: 'Comprehensive match history, agent performance, headshot percentages, and trend analysis to improve your gameplay.',
            badge: 'Advanced Stats'
          },
          social: {
            title: 'Social Features',
            description: 'Compare your performance with friends, share achievements, and discover top players in your region.',
            badge: 'Community'
          }
        },
        improveTips: {
          title: '📈 Improve Your Gameplay',
          analyze: {
            title: 'Analyze Your Stats',
            description: 'Review your performance after each session. Identify strengths and areas for improvement.'
          },
          track: {
            title: 'Track Progress',
            description: 'Monitor your rank progression and performance trends over time to see your growth.'
          },
          learn: {
            title: 'Learn from Pros',
            description: 'Compare your stats with professional players and learn from their performance patterns.'
          }
        }
      },
      playerSearch: {
        title: 'Search Player by Riot ID',
        placeholder: 'PlayerName#TAG',
        helpText: 'Enter your full Riot ID including the tag (e.g., PlayerName#NA1)',
        searchButton: 'Search Player',
        popularSearches: 'Popular Searches',
        tips: {
          trackProgress: {
            title: 'Track Your Progress',
            description: 'Monitor your rank progression, win rate, and performance metrics across all game modes.'
          },
          compareWithFriends: {
            title: 'Compare with Friends',
            description: 'Search for your friends\' profiles and compare your statistics to see who\'s improving faster.'
          }
        }
      }
    },
    
    community: {
      hero: {
        title: {
          main: 'Join the',
          highlight: 'Community'
        },
        subtitle: 'Connect with thousands of Valorant players, share your strategies, and learn from the best in the community. Your journey to improve starts here.',
        joinCommunity: 'Join Community',
        discordServer: 'Discord Server',
        stats: {
          activeMembers: 'Active Members',
          lineupsShared: 'Lineups Shared',
          crosshairsCreated: 'Crosshairs Created',
          likesGiven: 'Likes Given'
        }
      },
      recentActivity: {
        title: 'Recent Activity',
        viewAll: 'View All →',
        filters: {
          allActivity: 'All Activity',
          lineups: 'Lineups',
          crosshairs: 'Crosshairs',
          discussions: 'Discussions'
        },
        loadMore: 'Load More Activity',
        actions: {
          share: 'Share',
          downloads: 'downloads'
        }
      },
      stats: {
        title: 'Community Stats',
        labels: {
          totalMembers: 'Total Members',
          activeToday: 'Active Today',
          lineupsShared: 'Lineups Shared',
          crosshairsCreated: 'Crosshairs Created'
        },
        thisWeek: 'this week',
        weeklyActivity: 'Weekly Activity',
        membersByCountry: 'Members by Country',
        recentMilestones: 'Recent Milestones'
      },
      contributors: {
        title: 'Top Contributors',
        viewLeaderboard: 'View Full Leaderboard →',
        likes: 'likes',
        risingStars: 'Rising Stars',
        posts: 'posts'
      },
      joinDiscord: {
        title: 'Join the Discussion',
        description: 'Connect with players, share your strategies, and learn from the community.',
        button: 'Join Discord'
      },
      features: {
        title: '🌟 Join the Community',
        connect: {
          title: 'Connect & Learn',
          description: 'Join discussions, share strategies, and learn from experienced players worldwide.'
        },
        share: {
          title: 'Share Your Work',
          description: 'Upload lineups, crosshairs, and guides. Get recognition from the community.'
        },
        compete: {
          title: 'Compete & Grow',
          description: 'Participate in tournaments, challenges, and climb the community leaderboards.'
        }
      }
    },
    
    auth: {
      login: 'Login',
      register: 'Register',
      loginHeroTitle: 'Level Up Your Game',
      registerHeroTitle: 'Start Your Journey',
      loginHeroBadge: 'VALOCLASS GAMING HUB',
      registerHeroBadge: 'JOIN PLAYVALORANTGUIDES',
      loginSubtitle: 'Access your account to unlock exclusive features, track your progress, and connect with the community.',
      registerSubtitle: 'Create your account and join thousands of Valorant players. Access exclusive features, share your lineups, and elevate your gameplay.',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot Password?',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: 'Don\'t have an account?',
      demo: 'Demo',
      registerFeatures: {
        exclusive: 'Access to exclusive lineups and crosshairs',
        community: 'Connect with the Valorant community',
        tracking: 'Track your progress and stats'
      },
      signInHere: 'Sign in here'
    },
    featuresSection: {
      title: 'Everything You Need to Dominate',
      subtitle: 'From precise lineups to custom crosshairs, we provide all the tools and knowledge you need to improve your Valorant gameplay and climb the ranks.',
      features: {
        advancedLineups: {
          title: 'Advanced Lineups',
          description: 'Discover precise lineups for all agents and maps. Learn from pros and master every throwable ability.'
        },
        customCrosshairs: {
          title: 'Custom Crosshairs',
          description: 'Create, customize, and share crosshairs. Find the perfect setup for your playstyle and aim better.'
        },
        playerStatistics: {
          title: 'Player Statistics',
          description: 'Track your progress with detailed stats. Analyze your performance and identify areas for improvement.'
        },
        communityHub: {
          title: 'Community Hub',
          description: 'Connect with other players, share strategies, and learn from the best in the community.'
        },
        completeMaps: {
          title: 'Complete Maps',
          description: 'Comprehensive coverage of all Valorant maps with detailed callouts and strategic positions.'
        },
        liveUpdates: {
          title: 'Live Updates',
          description: 'Stay current with the latest patches, meta changes, and new strategies as they emerge.'
        }
      },
      cta: {
        title: 'Ready to Dominate?',
        subtitle: 'Join thousands of players who are already improving their game with PLAYVALORANTGUIDES.COM.',
        joinCommunity: 'Join the Community',
        exploreLineups: 'Explore Lineups'
      },
      accessNow: 'Access Now'
    },
    
    statsSection: {
      title: 'Success Stories',
      subtitle: 'Real achievements from our community members who elevated their gameplay.',
      stats: {
        activeUsers: 'Active Users',
        lineupsCreated: 'Lineups Created',
        crosshairsShared: 'Crosshairs Shared',
        rankImprovements: 'Rank Improvements'
      },
      testimonial: {
        quote: 'PLAYVALORANTGUIDES.COM completely changed my gameplay. The lineups are precise, the crosshair builder is amazing, and the community is incredibly helpful. Went from Silver to Immortal in just 3 months!',
        name: 'John Martinez',
        rank: 'Immortal 2 • 2,847 RR'
      }
    },

    footer: {
      description: 'The ultimate Valorant community hub for lineups, crosshairs, and player statistics. Master your gameplay and climb the ranks.',
      newsletter: {
        badge: 'STAY UPDATED',
        title: 'Get the Latest Updates',
        subtitle: 'Subscribe to receive the latest lineups, crosshair updates, and pro player settings directly in your inbox.',
        placeholder: 'Enter your email address',
        button: 'Subscribe Now'
      },
      categories: {
        features: 'Features',
        resources: 'Resources',
        community: 'Community',
        support: 'Support'
      },
      links: {
        agentLineups: 'Agent Lineups',
        crosshairBuilder: 'Crosshair Builder',
        playerStatistics: 'Player Statistics',
        communityHub: 'Community Hub',
        mapGuides: 'Map Guides',
        agentGuides: 'Agent Guides',
        proPlayerSettings: 'Pro Player Settings',
        patchNotes: 'Patch Notes',
        discordServer: 'Discord Server',
        reddit: 'Reddit',
        twitter: 'Twitter',
        youtube: 'YouTube',
        helpCenter: 'Help Center',
        contactUs: 'Contact Us',
        bugReports: 'Bug Reports',
        featureRequests: 'Feature Requests',
        privacyPolicy: 'Privacy Policy',
        termsOfService: 'Terms of Service',
        cookiePolicy: 'Cookie Policy'
      },
      copyright: '© 2024 PLAYVALORANTGUIDES.COM. All rights reserved.'
    }
  },
  tr: {
    nav: {
      lineups: 'Lineup\'lar',
      crosshairs: 'Crosshair\'lar',
      stats: 'İstatistikler',
      community: 'Topluluk',
      signIn: 'Giriş Yap',
      profile: 'Profil',
      settings: 'Ayarlar',
      logout: 'Çıkış'
    },
    hero: {
      badge: 'Türkiye\'nin #1 Valorant Platformu',
      title: {
        main: 'Valorant\'ta',
        highlight: 'Ustalaş'
      },
      subtitle: 'Profesyonel lineup\'lar, özelleştirilebilir crosshair\'lar ve detaylı istatistiklerle oyun seviyeni bir üst seviyeye taşı.',
      buttons: {
        exploreLineups: 'Lineup\'ları Keşfet',
        createCrosshair: 'Crosshair Oluştur'
      },
      stats: {
        activeUsers: 'Aktif Kullanıcı',
        proLineups: 'Pro Lineup',
        crosshairs: 'Crosshair'
      },
      trustBadge: 'Türkiye\'nin en güvenilir Valorant platformu',
      features: {
        secure: 'Güvenli ve Hızlı',
        community: 'Aktif Topluluk',
        professional: 'Profesyonel İçerik'
      }
    },
    lineups: {
      hero: {
        badge: 'Profesyonel Valorant Lineup\'ları',
        title: {
          main: 'Her',
          highlight: 'Lineup\'ta Usta Ol'
        },
        subtitle: 'Pro oyunculardan kesin lineup\'ları keşfet. Her ajan ve harita kombinasyonu için smoke, flash, keşif okları ve yardımcı kurulumları.',
        search: {
          placeholder: 'Ajan, harita, yetenekleri ara...',
          button: 'Ara'
        },
        tabs: {
          all: 'Tüm Lineup\'lar',
          smokes: 'Smoke\'lar',
          flashes: 'Flash\'lar',
          recon: 'Keşif',
          molotovs: 'Molotof\'lar'
        },
        stats: {
          lineups: 'Lineup',
          activeUsers: 'Aktif Kullanıcı',
          updatedDaily: 'Günlük Güncellenir'
        },
        features: {
          proLevel: {
            title: 'Profesyonel Seviye Doğruluk',
            description: 'Her lineup profesyoneller tarafından kesin crosshair konumları ve zamanlama ile test edilmiştir'
          },
          videoGuides: {
            title: 'Video Rehberleri',
            description: 'Her lineup için çoklu kamera açıları ile adım adım video eğitimleri'
          },
          communityTested: {
            title: 'Topluluk Tarafından Test Edildi',
            description: 'Binlerce oyuncu tarafından rekabetçi maçlarda başarı oranları ile doğrulanmış'
          }
        }
      }
    },
    features: {
      proLineups: {
        title: 'Pro Lineup\'lar',
        description: 'Profesyonel oyuncuların smoke, flash ve molotof lineup\'larını öğren ve uygula.'
      },
      crosshairEditor: {
        title: 'Crosshair Editörü',
        description: 'Gelişmiş özelleştirme araçlarıyla mükemmel crosshair\'ı oluştur.'
      },
      liveStats: {
        title: 'Canlı İstatistikler',
        description: 'İlerlemenizi takip edin ve diğer oyuncularla karşılaştırın.'
      },
      communityHub: {
        title: 'Topluluk',
        description: 'Binlerce oyuncu ile crosshair paylaş ve keşfet.'
      }
    },
    common: {
      loading: 'Yükleniyor...',
      error: 'Hata',
      success: 'Başarılı',
      cancel: 'İptal',
      save: 'Kaydet',
      delete: 'Sil',
      edit: 'Düzenle',
      search: 'Ara',
      filter: 'Filtrele',
      sort: 'Sırala',
      language: 'Dil',
      theme: 'Tema'
    },
    crosshairs: {
      hero: {
        badge: 'Profesyonel Crosshair Oluşturucu',
        title: {
          main: 'Mükemmel',
          highlight: 'Crosshair'
        },
        subtitle: 'Piksel mükemmelliğinde hassasiyetle turnuva hazır crosshair\'lar oluşturun. Pro oyuncu ön ayarları, gerçek zamanlı önizleme ve anında Valorant kodları içerir.',
        features: {
          accuracy: '%100 Doğru Kodlar',
          presets: 'Pro Oyuncu Ön Ayarları',
          community: 'Topluluk Paylaşımı'
        },
        actions: {
          startBuilding: 'Oluşturmaya Başla',
          browsePresets: 'Ön Ayarlara Gözat',
          communityCrosshairs: 'Topluluk Crosshair\'ları'
        },
        grid: {
          pixelPerfect: {
            title: 'Piksel Mükemmel Doğruluk',
            description: 'Her crosshair kodu test edilir ve Valorant\'ta gördüğünüzle tam olarak eşleşir. Artık tahmin yok - oluşturduğunuz oyun içinde aldığınızdır.',
            badge: '%100 Uyumlu'
          },
          proPlayer: {
            title: 'Pro Oyuncu Arşivi',
            description: 'TenZ, ScreaM, cNed, aspas ve diğer turnuva şampiyonlarının kullandığı crosshair\'ların aynısını kullanın. Profesyonel maçlarda savaş test edilmiş.',
            badge: '15+ Pro Ön Ayar'
          },
          communityPowered: {
            title: 'Topluluk Destekli',
            description: 'Kreasyonlarınızı dünya çapında binlerce oyuncuyla paylaşın. Benzersiz stilleri keşfedin ve en iyi topluluk crosshair\'larına oy verin.',
            badge: '10K+ Paylaşıldı'
          }
        },
        howToUse: {
          title: '⚡ Crosshair\'ınızı Valorant\'ta Nasıl Kullanırsınız',
          steps: {
            create: {
              title: 'Oluştur',
              description: 'Gerçek zamanlı önizleme ile oluşturucumuzu kullanarak crosshair\'ınızı tasarlayın'
            },
            copyCode: {
              title: 'Kodu Kopyala',
              description: '"Paylaş ve Kodlar" a tıklayın ve Valorant crosshair kodunu kopyalayın'
            },
            openValorant: {
              title: 'Valorant\'ı Aç',
              description: 'Ayarlar → Crosshair → Profil Kodunu İçe Aktar\'a gidin'
            },
            pastePlay: {
              title: 'Yapıştır ve Oyna',
              description: 'Kodu yapıştırın ve yeni crosshair\'ınızın oyun içindeki keyfini çıkarın!'
            }
          }
        }
      },
      builder: {
        title: 'Crosshair Oluşturucu',
        description: 'Doğru oyun içi kodlarla mükemmel Valorant crosshair\'ınızı oluşturun',
        profiles: {
          general: 'Genel',
          primary: 'Birincil',
          ads: 'ADS',
          sniper: 'Sniper'
        },
        actions: {
          reset: 'Sıfırla',
          random: 'Rastgele',
          dotOnly: 'Sadece Nokta',
          import: 'İçe Aktar',
          proPresets: 'Pro Ön Ayarları',
          export: 'Dışa Aktar',
          shareCode: 'Paylaş ve Kodlar',
          shareCommunity: 'Topluluğa Paylaş'
        },
        preview: {
          title: 'Canlı Önizleme'
        }
      }
    },
    
    stats: {
      hero: {
        badge: 'Gerçek Zamanlı Valorant İstatistikleri',
        title: {
          main: 'Performansınızı',
          highlight: 'Takip Edin'
        },
        subtitle: 'Riot\'ın API\'sinden gerçek zamanlı verilerle kapsamlı Valorant istatistikleri alın. Maçları takip edin, performansı analiz edin ve veri odaklı içgörülerle rank\'larda yükseltin.',
        features: {
          liveData: 'Canlı API Verisi',
          matchHistory: 'Maç Geçmişi',
          rankTracking: 'Rank Takibi'
        },
        featuredPlayers: {
          badge: 'Öne Çıkan Oyuncular',
          title: 'En İyi Performanslar',
          subtitle: 'En iyi oyunculardan öğrenin ve performans desenlerini analiz edin'
        },
        grid: {
          realTime: {
            title: 'Gerçek Zamanlı Güncellemeler',
            description: 'Riot\'ın resmi API\'sinden en son istatistikleri alın. Verileriniz her maçtan sonra otomatik olarak güncellenir.',
            badge: 'Resmi API'
          },
          deepAnalytics: {
            title: 'Derin Analitikler',
            description: 'Kapsamlı maç geçmişi, ajan performansı, headshot yüzdeleri ve oyununuzu geliştirmek için trend analizi.',
            badge: 'Gelişmiş İstatistikler'
          },
          social: {
            title: 'Sosyal Özellikler',
            description: 'Performansınızı arkadaşlarınızla karşılaştırın, başarıları paylaşın ve bölgenizdeki en iyi oyuncuları keşfedin.',
            badge: 'Topluluk'
          }
        },
        improveTips: {
          title: '📈 Oyununuzu Geliştirin',
          analyze: {
            title: 'İstatistiklerinizi Analiz Edin',
            description: 'Her seanstan sonra performansınızı gözden geçirin. Güçlü yanları ve geliştirilmesi gereken alanları belirleyin.'
          },
          track: {
            title: 'İlerlemeyi Takip Edin',
            description: 'Zaman içinde rank ilerleyişinizi ve performans trendlerinizi izleyerek büyümenizi görün.'
          },
          learn: {
            title: 'Profesyonellerden Öğrenin',
            description: 'İstatistiklerinizi profesyonel oyuncularla karşılaştırın ve performans desenlerinden öğrenin.'
          }
        }
      },
      playerSearch: {
        title: 'Riot ID ile Oyuncu Ara',
        placeholder: 'OyuncuAdı#TAG',
        helpText: 'Tag dahil olmak üzere tam Riot ID\'nizi girin (örn. OyuncuAdı#TR1)',
        searchButton: 'Oyuncu Ara',
        popularSearches: 'Popüler Aramalar',
        tips: {
          trackProgress: {
            title: 'İlerlemenizi Takip Edin',
            description: 'Tüm oyun modlarında rank ilerleyişinizi, kazanma oranınızı ve performans metriklerinizi izleyin.'
          },
          compareWithFriends: {
            title: 'Arkadaşlarla Karşılaştır',
            description: 'Arkadaşlarınızın profillerini arayın ve kim daha hızlı gelişiyor görmek için istatistiklerinizi karşılaştırın.'
          }
        }
      }
    },
    
    community: {
      hero: {
        title: {
          main: 'Topluluğa',
          highlight: 'Katıl'
        },
        subtitle: 'Binlerce Valorant oyuncusuyla bağlantı kur, stratejilerini paylaş ve topluluktaki en iyilerinden öğren. Gelişme yolculuğun burada başlıyor.',
        joinCommunity: 'Topluluğa Katıl',
        discordServer: 'Discord Sunucusu',
        stats: {
          activeMembers: 'Aktif Üyeler',
          lineupsShared: 'Paylaşılan Lineup\'lar',
          crosshairsCreated: 'Oluşturulan Crosshair\'lar',
          likesGiven: 'Verilen Beğeniler'
        }
      },
      recentActivity: {
        title: 'Son Aktiviteler',
        viewAll: 'Tümünü Gör →',
        filters: {
          allActivity: 'Tüm Aktiviteler',
          lineups: 'Lineup\'lar',
          crosshairs: 'Crosshair\'lar',
          discussions: 'Tartışmalar'
        },
        loadMore: 'Daha Fazla Aktivite Yükle',
        actions: {
          share: 'Paylaş',
          downloads: 'indirme'
        }
      },
      stats: {
        title: 'Topluluk İstatistikleri',
        labels: {
          totalMembers: 'Toplam Üyeler',
          activeToday: 'Bugün Aktif',
          lineupsShared: 'Paylaşılan Lineup\'lar',
          crosshairsCreated: 'Oluşturulan Crosshair\'lar'
        },
        thisWeek: 'bu hafta',
        weeklyActivity: 'Haftalık Aktivite',
        membersByCountry: 'Ülkelere Göre Üyeler',
        recentMilestones: 'Son Kilometre Taşları'
      },
      contributors: {
        title: 'En İyi Katkıda Bulunanlar',
        viewLeaderboard: 'Tam Skor Tablosunu Gör →',
        likes: 'beğeni',
        risingStars: 'Yükselen Yıldızlar',
        posts: 'gönderi'
      },
      joinDiscord: {
        title: 'Tartışmalara Katıl',
        description: 'Oyuncularla bağlantı kur, stratejilerini paylaş ve topluluktan öğren.',
        button: 'Discord\'a Katıl'
      },
      features: {
        title: '🌟 Topluluğa Katıl',
        connect: {
          title: 'Bağlan ve Öğren',
          description: 'Tartışmalara katılın, stratejileri paylaşın ve dünya çapında deneyimli oyunculardan öğrenin.'
        },
        share: {
          title: 'Çalışmalarınızı Paylaşın',
          description: 'Lineup\'lar, crosshair\'lar ve kılavuzlar yükleyin. Topluluktan tanınma kazanın.'
        },
        compete: {
          title: 'Yarışın ve Büyüyün',
          description: 'Turnuvalara katılın, meydan okumalara çıkın ve topluluk lider tahtalarında yükseltin.'
        }
      }
    },
    
    auth: {
      login: 'Giriş Yap',
      register: 'Kayıt Ol',
      loginHeroTitle: 'Oyununuzu Bir Üst Seviyeye Çıkarın',
      registerHeroTitle: 'Yolculuğunuzu Başlatın',
      loginHeroBadge: 'VALOCLASS OYUN MERKEZİ',
      registerHeroBadge: 'PLAYVALORANTGUIDES\'A KATIL',
      loginSubtitle: 'Hesabınıza erişin, özel özelliklerin kilidini açın, ilerlemenizi takip edin ve toplulukla bağlantı kurun.',
      registerSubtitle: 'Hesabınızı oluşturun ve binlerce Valorant oyuncusuna katılın. Özel özelliklere erişin, lineup\'larınızı paylaşın ve oyununuzu bir üst seviyeye taşıyın.',
      email: 'E-posta',
      password: 'Şifre',
      confirmPassword: 'Şifreyi Onayla',
      forgotPassword: 'Şifremi Unuttum?',
      createAccount: 'Hesap Oluştur',
      alreadyHaveAccount: 'Zaten hesabın var mı?',
      dontHaveAccount: 'Hesabın yok mu?',
      demo: 'Demo',
      registerFeatures: {
        exclusive: 'Özel lineup\'lar ve crosshair\'lara erişim',
        community: 'Valorant topluluğuyla bağlantı kur',
        tracking: 'İlerlemenizi ve istatistiklerinizi takip edin'
      },
      signInHere: 'Buradan giriş yapın'
    },
    featuresSection: {
      title: 'Hakim Olmak İçin İhtiyacınız Olan Her Şey',
      subtitle: 'Hassas lineup\'lardan özel crosshair\'lara kadar, Valorant oyununuzu geliştirmek ve rank\'larda yükselmek için ihtiyacınız olan tüm araçları ve bilgileri sağlıyoruz.',
      features: {
        advancedLineups: {
          title: 'Gelişmiş Lineup\'lar',
          description: 'Tüm ajanlar ve haritalar için kesin lineup\'ları keşfedin. Profesyonellerden öğrenin ve her fırlatılabilir yeteneğinde ustalaşın.'
        },
        customCrosshairs: {
          title: 'Özel Crosshair\'lar',
          description: 'Crosshair oluşturun, özelleştirin ve paylaşın. Oyun tarzınız için mükemmel kurulumu bulun ve daha iyi nişan alın.'
        },
        playerStatistics: {
          title: 'Oyuncu İstatistikleri',
          description: 'Detaylı istatistiklerle ilerlemenizi takip edin. Performansınızı analiz edin ve geliştirilmesi gereken alanları belirleyin.'
        },
        communityHub: {
          title: 'Topluluk Merkezi',
          description: 'Diğer oyuncularla bağlantı kurun, stratejileri paylaşın ve topluluktaki en iyilerinden öğrenin.'
        },
        completeMaps: {
          title: 'Komple Haritalar',
          description: 'Detaylı callout\'lar ve stratejik pozisyonlarla tüm Valorant haritalarının kapsamlı kapsamı.'
        },
        liveUpdates: {
          title: 'Canlı Güncellemeler',
          description: 'En son yamalar, meta değişiklikleri ve ortaya çıkan yeni stratejilerle güncel kalın.'
        }
      },
      cta: {
        title: 'Hakim Olmaya Hazır mısın?',
        subtitle: 'PLAYVALORANTGUIDES.COM ile oyunlarını geliştiren binlerce oyuncuya katıl.',
        joinCommunity: 'Topluluğa Katıl',
        exploreLineups: 'Lineup\'ları Keşfet'
      },
      accessNow: 'Şimdi Eriş'
    },
    
    statsSection: {
      title: 'Başarı Hikayeleri',
      subtitle: 'Oyunlarını yükselten topluluk üyelerimizden gerçek başarılar.',
      stats: {
        activeUsers: 'Aktif Kullanıcılar',
        lineupsCreated: 'Oluşturulan Lineup\'lar',
        crosshairsShared: 'Paylaşılan Crosshair\'lar',
        rankImprovements: 'Rank İyileştirmeleri'
      },
      testimonial: {
        quote: 'PLAYVALORANTGUIDES.COM oyunumu tamamen değiştirdi. Lineup\'lar kesin, crosshair oluşturucu harika ve topluluk inanılmaz yardımcı. Silver\'dan Immortal\'e sadece 3 ayda çıktım!',
        name: 'Ahmet Demir',
        rank: 'Immortal 2 • 2,847 RR'
      }
    },

    footer: {
      description: 'Lineup\'lar, crosshair\'lar ve oyuncu istatistikleri için nihai Valorant topluluk merkezi. Oyununuzda ustalaşın ve rank\'larda yükseltin.',
      newsletter: {
        badge: 'GÜNCEL KALIN',
        title: 'En Son Güncellemeleri Alın',
        subtitle: 'En yeni lineup\'ları, crosshair güncellemelerini ve pro oyuncu ayarlarını doğrudan gelen kutunuza almak için abone olun.',
        placeholder: 'E-posta adresinizi girin',
        button: 'Şimdi Abone Ol'
      },
      categories: {
        features: 'Özellikler',
        resources: 'Kaynaklar',
        community: 'Topluluk',
        support: 'Destek'
      },
      links: {
        agentLineups: 'Ajan Lineup\'ları',
        crosshairBuilder: 'Crosshair Oluşturucu',
        playerStatistics: 'Oyuncu İstatistikleri',
        communityHub: 'Topluluk Merkezi',
        mapGuides: 'Harita Kılavuzları',
        agentGuides: 'Ajan Kılavuzları',
        proPlayerSettings: 'Pro Oyuncu Ayarları',
        patchNotes: 'Yama Notları',
        discordServer: 'Discord Sunucusu',
        reddit: 'Reddit',
        twitter: 'Twitter',
        youtube: 'YouTube',
        helpCenter: 'Yardım Merkezi',
        contactUs: 'Bize Ulaşın',
        bugReports: 'Hata Raporları',
        featureRequests: 'Özellik İstekleri',
        privacyPolicy: 'Gizlilik Politikası',
        termsOfService: 'Hizmet Şartları',
        cookiePolicy: 'Çerez Politikası'
      },
      copyright: '© 2024 PLAYVALORANTGUIDES.COM. Tüm hakları saklıdır.'
    }
  }
}

export const defaultLanguage: Language = 'tr'
