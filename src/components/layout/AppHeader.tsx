import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/NavigationMenu'

interface AppHeaderProps {
  currentClassName?: string
  activeTab: string
  onTabChange: (tab: string) => void
}

export function AppHeader({ currentClassName, activeTab, onTabChange }: AppHeaderProps) {
  return (
    <header className="retro-nav retro-header border-b-0 vhs-static flex-shrink-0 w-full" data-cy="app-header" role="banner">
      <div className="w-full max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-4 flex-shrink-0">
            <h1 
              className="retro-header text-2xl glitch-text" 
              data-text="🏠 בית מארח"
            >
              🏠 בית מארח
            </h1>
            {currentClassName && (
              <span className="neon-text-green text-sm hologram">
                • {currentClassName}
              </span>
            )}
          </div>
          <NavigationMenu className="flex-1">
            <NavigationMenuList className="gap-6">
              <NavigationMenuItem>
                <button
                  className={`retro-button px-6 py-3 text-sm retro-pulse ${activeTab === 'classes' ? 'neon-text-pink' : ''}`}
                  onClick={() => onTabChange('classes')}
                  type="button"
                  role="button"
                  aria-label="כיתות"
                  style={{ minHeight: '48px' }}
                  data-cy="tab-classes"
                >
                  כיתות
                </button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <button
                  className={`retro-button px-6 py-3 text-sm retro-pulse ${activeTab === 'students' ? 'neon-text-pink' : ''}`}
                  onClick={() => onTabChange('students')}
                  type="button"
                  role="button"
                  aria-label="תלמידים"
                  style={{ minHeight: '48px' }}
                  data-cy="tab-students"
                >
                  תלמידים
                </button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <button
                  className={`retro-button px-6 py-3 text-sm retro-pulse ${activeTab === 'rounds' ? 'neon-text-pink' : ''}`}
                  onClick={() => onTabChange('rounds')}
                  type="button"
                  role="button"
                  aria-label="סבבים"
                  style={{ minHeight: '48px' }}
                  data-cy="tab-rounds"
                >
                  סבבים
                </button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <button
                  className={`retro-button px-6 py-3 text-sm retro-pulse ${activeTab === 'plan' ? 'neon-text-pink' : ''}`}
                  onClick={() => onTabChange('plan')}
                  type="button"
                  role="button"
                  aria-label="תכנון"
                  style={{ minHeight: '48px' }}
                  data-cy="tab-plan"
                >
                  תכנון
                </button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  )
} 