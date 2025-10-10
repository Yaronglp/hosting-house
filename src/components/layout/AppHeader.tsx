import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/NavigationMenu'
import { Button } from '@/components/ui/Button'

interface AppHeaderProps {
  currentClassName?: string
  activeTab: string
  onTabChange: (tab: string) => void
}

export function AppHeader({ currentClassName, activeTab, onTabChange }: AppHeaderProps) {
  return (
    <header className="retro-nav border-b-0 vhs-static flex-shrink-0 w-full" data-cy="app-header" role="banner">
      <div className="w-full max-w-7xl mx-auto px-2 min-[700px]:px-4 py-2 min-[700px]:py-4">
        <div className="flex flex-col min-[700px]:flex-row min-[700px]:items-center min-[700px]:justify-between gap-3 min-[700px]:gap-8">
          <div className="flex items-center gap-2 min-[700px]:gap-4 flex-shrink-0 justify-center min-[700px]:justify-start">
            <h1 
              className="text-lg min-[700px]:text-2xl font-bold header-title"
            >
              🏠 בית מארח
            </h1>
            {currentClassName && (
              <span className="neon-text-green text-xs min-[700px]:text-sm hologram header-class-selected">
                • {currentClassName}
              </span>
            )}
          </div>
          <NavigationMenu className="w-full min-[700px]:w-auto min-[700px]:flex-1 justify-center min-[700px]:justify-start min-[700px]:ml-[1em]">
            <NavigationMenuList className="gap-2 min-[700px]:gap-6 justify-between min-[700px]:justify-end">
              <NavigationMenuItem className="flex-1 min-[700px]:flex-initial">
                <Button
                  className={`w-full px-2 min-[700px]:px-6 py-2 min-[700px]:py-3 text-xs min-[700px]:text-sm retro-pulse ${activeTab === 'plan' ? 'neon-text-pink' : ''}`}
                  onClick={() => onTabChange('plan')}
                  type="button"
                  aria-label="תכנון"
                  style={{ minHeight: '44px' }}
                  data-cy="tab-plan"
                >
                  תכנון
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem className="flex-1 min-[700px]:flex-initial">
                <Button
                  className={`w-full px-2 min-[700px]:px-6 py-2 min-[700px]:py-3 text-xs min-[700px]:text-sm retro-pulse ${activeTab === 'rounds' ? 'neon-text-pink' : ''}`}
                  onClick={() => onTabChange('rounds')}
                  type="button"
                  aria-label="תאריכי מפגשים"
                  style={{ minHeight: '44px' }}
                  data-cy="tab-rounds"
                >
                  תאריכי מפגשים
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem className="flex-1 min-[700px]:flex-initial">
                <Button
                  className={`w-full px-2 min-[700px]:px-6 py-2 min-[700px]:py-3 text-xs min-[700px]:text-sm retro-pulse ${activeTab === 'students' ? 'neon-text-pink' : ''}`}
                  onClick={() => onTabChange('students')}
                  type="button"
                  aria-label="תלמידים"
                  style={{ minHeight: '44px' }}
                  data-cy="tab-students"
                >
                  תלמידים
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem className="flex-1 min-[700px]:flex-initial">
                <Button
                  className={`w-full px-2 min-[700px]:px-6 py-2 min-[700px]:py-3 text-xs min-[700px]:text-sm retro-pulse ${activeTab === 'classes' ? 'neon-text-pink' : ''}`}
                  onClick={() => onTabChange('classes')}
                  type="button"
                  aria-label="כיתות"
                  style={{ minHeight: '44px' }}
                  data-cy="tab-classes"
                >
                  כיתות
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  )
} 