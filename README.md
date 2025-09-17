# ValoClass - Valorant Community Hub

ValoClass is a comprehensive community platform for Valorant players, featuring lineup guides, crosshair customization, player statistics, and social features. Built with Next.js 15, TypeScript, and SCSS.

## 🎯 Features

### 🎯 Agent Lineups
- **Comprehensive Database**: Precise lineups for all Valorant agents and maps
- **Throwable Abilities**: Complete coverage of smokes, flashes, molotovs, and utility
- **Difficulty Levels**: Lineups categorized by skill level (Easy, Medium, Hard)
- **Advanced Filtering**: Filter by agent, map, ability type, side, and difficulty
- **Step-by-Step Guides**: Detailed instructions with images and positioning tips
- **Community Contributions**: User-submitted lineups with verification system

### 🎯 Crosshair Builder
- **Advanced Customization**: Complete crosshair designer with real-time preview
- **Visual Editor**: Intuitive controls for all crosshair parameters
- **Share Codes**: Generate and share crosshair configurations
- **Community Gallery**: Browse thousands of community-created crosshairs
- **Import/Export**: Save and load crosshair settings
- **Professional Presets**: Pre-built crosshairs from pro players

### 📊 Player Statistics
- **Real-time Data**: Live stats from Riot's official API
- **Comprehensive Analytics**: Detailed match history and performance metrics
- **Rank Tracking**: Monitor rank progression and RR changes
- **Agent Performance**: Per-agent statistics and win rates
- **Comparison Tools**: Compare stats with friends and pros
- **Leaderboards**: Top players and regional rankings

### 👥 Community Features
- **Social Hub**: Connect with players and share strategies
- **User Profiles**: Customizable profiles with stats and achievements
- **Activity Feed**: Real-time updates on community contributions
- **Discussion Forums**: Strategy discussions and Q&A
- **Achievement System**: Badges and milestones for active contributors
- **Top Contributors**: Recognition for valuable community members

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: SCSS with custom design system
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Development**: ESLint, TypeScript compiler

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/valoclass.git
   cd valoclass
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
valoclass/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── crosshairs/         # Crosshair builder pages
│   │   ├── lineups/           # Lineup pages
│   │   ├── stats/             # Statistics pages
│   │   ├── community/         # Community pages
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── layout/           # Layout components
│   │   ├── crosshair/        # Crosshair-related components
│   │   ├── lineup/           # Lineup-related components
│   │   ├── stats/            # Statistics components
│   │   ├── community/        # Community components
│   │   ├── ui/               # Reusable UI components
│   │   └── home/             # Homepage components
│   ├── styles/               # SCSS stylesheets
│   │   ├── globals.scss      # Global styles
│   │   ├── variables.scss    # SCSS variables
│   │   ├── mixins.scss       # SCSS mixins
│   │   └── components.scss   # Component styles
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   └── data/                 # Static data and mock data
├── public/                   # Static assets
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary**: Valorant Red (#ff4654)
- **Secondary**: Valorant Blue (#0f1419)
- **Accent**: Valorant Yellow (#f0db4f)
- **Success**: Valorant Green (#00c897)

### Agent Role Colors
- **Duelist**: Red (#ff6b6b)
- **Initiator**: Teal (#4ecdc4)
- **Controller**: Yellow (#ffe66d)
- **Sentinel**: Gray (#95a5a6)

### Typography
- **Primary**: Inter (Body text)
- **Heading**: Rajdhani (Headings)
- **Monospace**: JetBrains Mono (Code)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_VALORANT_API_KEY=your_api_key_here
```

### SCSS Variables

Key SCSS variables in `src/styles/_variables.scss`:

```scss
// Colors
$valorant-red: #ff4654;
$valorant-blue: #0f1419;
$valorant-accent: #f0db4f;

// Breakpoints
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
```

## 📱 Responsive Design

The application is fully responsive with mobile-first design:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Custom responsive utilities and mixins are available in `src/styles/_mixins.scss`.

## 🎯 API Integration

### Valorant API
- Player statistics via Riot Games API
- Real-time rank and match data
- Agent and map information

### Mock Data
Development uses comprehensive mock data for:
- Agent lineups and abilities
- Player statistics and match history
- Community activity and user profiles

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines
- Follow TypeScript best practices
- Use the existing SCSS design system
- Ensure mobile responsiveness
- Add appropriate type definitions
- Include comprehensive documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Riot Games** for the Valorant API and game assets
- **Next.js Team** for the excellent framework
- **Valorant Community** for inspiration and feedback
- **Open Source Contributors** for various libraries used

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/valoclass/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/valoclass/discussions)
- **Discord**: [Community Server](https://discord.gg/valoclass)

## 🔮 Roadmap

### Version 2.0
- [ ] Real Valorant API integration
- [ ] User authentication system
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Tournament bracket system
- [ ] Team management features

### Version 2.1
- [ ] AI-powered lineup recommendations
- [ ] Voice chat integration
- [ ] Stream integration
- [ ] Performance coaching tools
- [ ] Advanced community features

---

**Built with ❤️ for the Valorant community**
