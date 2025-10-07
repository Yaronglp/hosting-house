# 🏠 בית מארח (Hosting House) - Student Hosting Management System

A modern Progressive Web App (PWA) for teachers to manage student hosting rotations with a retro 90s arcade aesthetic. Built with React, TypeScript, and Vite.

## ✨ Key Features

### 🎯 Core Capabilities
- **Multi-Class Management** - Create and manage multiple classes with different settings
- **Student Management** - Add students with hosting preferences, capacity settings, and social preferences
- **Round Management** - Create hosting rounds with optional date windows
- **Smart Plan Generation** - AI-powered algorithm for fair student assignments with retry logic
- **Interactive Planning Board** - Manual adjustments with select-and-move interface
- **Comprehensive Validation** - Real-time error checking and warnings
- **Data Export/Import** - JSON backup and restore functionality
- **Sharing & Communication** - WhatsApp summaries, printable views, and clipboard integration
- **Progressive Web App** - Installable on mobile and desktop, works offline
- **Accessibility** - Full keyboard navigation and screen reader support

### 🔧 Technical Features
- **Offline-First** - All data stored locally using Dexie.js
- **Persistent Storage** - Data survives browser restarts and device reboots
- **RTL Support** - Full Hebrew language support with right-to-left layout
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **PWA Capabilities** - Installable app with service worker for offline functionality

## 📱 Progressive Web App (PWA)

### Installation
- **Desktop**: Click the install button in your browser's address bar
- **Mobile**: Add to home screen from your browser's menu
- **Features**: Works offline, has app-like interface, receives updates automatically

### Offline Capabilities
- All data is stored locally on your device
- Works without internet connection
- Automatic data synchronization when online
- Persistent storage prevents data loss

## 🎯 User Guide

### 1. Class Management
- **Create Classes**: Set up multiple classes with different names and years
- **Class Settings**: Configure group size (default: 6 students per group)
- **Switch Classes**: Easily switch between different classes

### 2. Student Management
- **Add Students**: Paste a list of student names (one per line)
- **Student Attributes**:
  - **Hosting Capability**: Mark if student can host (default: yes)
  - **Capacity**: Set minimum and maximum group size for hosting
  - **Preferences**: Set "like" and "avoid" relationships with other students
- **Edit Students**: Modify any student information after adding

### 3. Round Management
- **Create Rounds**: Define hosting rounds with names and optional date windows
- **Round Order**: Set the sequence of hosting rounds
- **Flexible Scheduling**: Add as many rounds as needed

### 4. Plan Generation
- **Smart Algorithm**: 
  - Ensures each student hosts exactly once across all rounds
  - Respects hosting capacity constraints
  - Honors "avoid" relationships (hard constraints)
  - Optimizes for "like" preferences (soft constraints)
  - Includes fairness pass to reduce repeated pairings
- **Retry Logic**: Automatically retries with different seeds if initial generation fails
- **Seed Control**: View and regenerate plans with different random seeds

### 5. Manual Adjustments
- **Interactive Board**: Visual representation of all groups per round
- **Select and Move**: Click on students to move them between groups
- **Real-time Validation**: Immediate feedback on valid/invalid moves
- **Undo Support**: Revert invalid moves automatically

### 6. Validation System
- **Blocking Errors**:
  - Duplicate hosts across rounds
  - Capacity overflow in groups
  - Insufficient hosts for all rounds
- **Warnings**:
  - Avoid relationships violated
  - Repeated pairings across rounds
  - Unmet "like" preferences
- **Auto-Fix**: Attempt to resolve issues automatically

### 7. Sharing & Export
- **WhatsApp Summary**: Generate Hebrew text summaries for messaging
- **Print View**: Clean, printable layout for physical distribution
- **JSON Export**: Complete data backup in JSON format
- **JSON Import**: Restore data from backup files
- **Clipboard Integration**: Copy summaries directly to clipboard

## 🔧 Technical Details

### Architecture
- **Frontend**: React 19 + TypeScript + Vite
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Storage**: Dexie.js (IndexedDB wrapper)
- **PWA**: Vite PWA plugin with Workbox
- **State Management**: Custom hooks with local storage

### Data Model
```typescript
// Core entities
Class: { id, name, year, createdAt, updatedAt }
Student: { id, classId, name, canHost, capacity, like[], avoid[] }
Round: { id, classId, name, dateWindow?, order }
Group: { id, roundId, hostId, memberIds[], notes? }
Assignment: { roundId, groups[] }
```

### Algorithm Details
- **Host Selection**: Greedy algorithm ensuring each student hosts exactly once
- **Guest Assignment**: Balanced distribution with preference optimization
- **Fairness Pass**: Local swaps to minimize repeated pairings
- **Retry Logic**: Multiple attempts with different random seeds
- **Constraint Handling**: Hard constraints (capacity, avoid) vs soft constraints (like)

### Storage Strategy
- **Local-First**: All data stored in browser's IndexedDB
- **Persistent Storage**: Requests `navigator.storage.persist()` for data protection
- **Backup System**: JSON export/import for data portability
- **Privacy**: No external servers, data never leaves the device

## 🎨 Design System

### Visual Theme
- **Retro 90s Arcade**: Neon colors, grid backgrounds, retro typography
- **Hebrew RTL**: Right-to-left layout optimized for Hebrew text
- **Responsive**: Mobile-first design with desktop enhancements
- **Accessibility**: High contrast, keyboard navigation, screen reader support

### Color Palette
- Primary: Neon green (#00ff41)
- Secondary: Electric blue (#0080ff)
- Accent: Hot pink (#ff0080)
- Background: Dark grid pattern
- Text: High contrast white/black

## 🔒 Privacy & Security

### Data Protection
- **Local Storage Only**: No external servers or databases
- **No Tracking**: No analytics or user tracking
- **Offline-First**: Works completely offline
- **User Control**: Full control over data export/import

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Support**: iOS Safari, Android Chrome
- **PWA Support**: Installable on all major platforms

## 🚀 Deployment

### GitHub Pages (Production)
The app is automatically deployed to GitHub Pages using GitHub Actions.

#### Production URL
🌐 **https://yaronglp.github.io/hosting-house/**

#### Automatic Deployment
- **Trigger**: Every push to `main` branch triggers automatic deployment
- **Build**: GitHub Actions builds the app (`npm run build`)
- **Deploy**: Official GitHub Actions deploy to GitHub Pages
- **PWA**: Full PWA functionality works on production (offline, installable)

#### First-Time Setup
If deploying for the first time:
1. Go to repository **Settings** → **Pages**
2. Under **"Build and deployment"** → **"Source"**
3. Select **"GitHub Actions"** (NOT "Deploy from a branch")
4. Push to `main` branch to trigger deployment
5. Wait ~2 minutes for deployment to complete
6. Visit the production URL

#### Manual Deployment
You can also trigger deployment manually:
1. Go to **Actions** tab in GitHub
2. Select **"Deploy to GitHub Pages"** workflow
3. Click **"Run workflow"** → **"Run workflow"**

#### Testing PWA on Mobile
**iOS (Safari):**
1. Open `https://yaronglp.github.io/hosting-house/` in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"**
5. App icon appears on home screen

**Android (Chrome):**
1. Open `https://yaronglp.github.io/hosting-house/` in Chrome
2. Tap the menu (three dots)
3. Tap **"Add to Home screen"**
4. Tap **"Add"**
5. App icon appears on home screen

### Local Development

#### Build Process
```bash
# Development server (with hot reload)
npm run dev

# Production build (creates dist/ folder)
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint

# Run Cypress tests
npm run cy:open      # Interactive mode
npm run cy:run       # Headless mode
npm run test:e2e     # Run all E2E tests
npm run test:all     # Run all tests
```

### Deployment Architecture
```
Push to main → GitHub Actions Workflow Triggered
              ↓
         Build App (npm run build)
              ↓
         Upload Artifact (dist/)
              ↓
         Deploy via GitHub Pages API
              ↓
    Live at yaronglp.github.io/hosting-house
```

### Deployment Features
- ✅ **Automatic deployment** on every push to main
- ✅ **No manual intervention** required
- ✅ **Proper SPA routing** with 404 fallback
- ✅ **PWA functionality** (offline, installable)
- ✅ **HTTPS** with automatic SSL certificate
- ✅ **Global CDN** for fast loading worldwide
- ✅ **Workflow status** visible in GitHub Actions tab

## 📊 Performance

### Optimization Features
- **Code Splitting**: Lazy loading of components
- **Service Worker**: Caching for offline functionality
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: Optimized icons and assets

### Storage Efficiency
- **Compressed Data**: Efficient storage of student preferences
- **Incremental Updates**: Only changed data is saved
- **Cleanup**: Automatic removal of orphaned data

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
│   ├── common/         # Shared components
│   ├── forms/          # Form components
│   ├── layout/         # Layout components
│   ├── lists/          # List components
│   ├── managers/       # Management views
│   ├── planning/       # Planning interface
│   ├── sharing/        # Sharing components
│   ├── ui/             # UI components
│   └── views/          # Main views
├── hooks/              # Custom React hooks
├── lib/                # Core libraries
│   ├── accessibility/  # A11y utilities
│   ├── generator/      # Plan generation
│   ├── sharing/        # Export/sharing
│   └── validation/     # Validation logic
└── types/              # TypeScript types
```

### Key Dependencies
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type safety and better DX
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Dexie.js**: IndexedDB wrapper for local storage
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Accessibility**: WCAG 2.1 AA compliance

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Common Issues
- **Data Loss**: Enable persistent storage and create regular backups
- **Generation Failures**: Check student constraints and try different seeds
- **Mobile Issues**: Ensure PWA is properly installed

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and feature requests on GitHub
- **Community**: Join discussions in the project repository

---

**בית מארח** - Making student hosting management simple, fair, and fun! 🏠✨