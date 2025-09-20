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
    auth: {
      login: 'Login',
      register: 'Register',
      loginSubtitle: 'Access your account to unlock exclusive features, track your progress, and connect with the community.',
      registerSubtitle: 'Create your account and join thousands of Valorant players. Access exclusive features, share your lineups, and elevate your gameplay.',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot Password?',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: 'Don\'t have an account?',
      demo: 'Demo'
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
    auth: {
      login: 'Giriş Yap',
      register: 'Kayıt Ol',
      loginSubtitle: 'Hesabınıza erişin, özel özelliklerin kilidini açın, ilerlemenizi takip edin ve toplulukla bağlantı kurun.',
      registerSubtitle: 'Hesabınızı oluşturun ve binlerce Valorant oyuncusuna katılın. Özel özelliklere erişin, lineup\'larınızı paylaşın ve oyununuzu bir üst seviyeye taşıyın.',
      email: 'E-posta',
      password: 'Şifre',
      confirmPassword: 'Şifreyi Onayla',
      forgotPassword: 'Şifremi Unuttum?',
      createAccount: 'Hesap Oluştur',
      alreadyHaveAccount: 'Zaten hesabın var mı?',
      dontHaveAccount: 'Hesabın yok mu?',
      demo: 'Demo'
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
