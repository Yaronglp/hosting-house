import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/NavigationMenu'
import { Button } from '@/components/ui/Button'

interface AppHeaderProps {
  currentClassName?: string
  activeTab: string
  onTabChange: (tab: string) => void
}

const navigationItems = [
  {
    id: 'plan',
    label: 'תכנון',
    ariaLabel: 'תכנון',
    dataCy: 'tab-plan'
  },
  {
    id: 'rounds',
    label: 'תאריכי מפגשים',
    ariaLabel: 'תאריכי מפגשים',
    dataCy: 'tab-rounds'
  },
  {
    id: 'students',
    label: 'תלמידים',
    ariaLabel: 'תלמידים',
    dataCy: 'tab-students'
  },
  {
    id: 'classes',
    label: 'כיתות',
    ariaLabel: 'כיתות',
    dataCy: 'tab-classes'
  }
]

export function AppHeader({ currentClassName, activeTab, onTabChange }: AppHeaderProps) {
  return (
    <header className="retro-nav border-b-0 vhs-static flex-shrink-0 w-full" data-cy="app-header" role="banner">
      <div className="w-full max-w-7xl mx-auto px-2 min-[700px]:px-4 py-2 min-[700px]:py-4">
        <div className="flex flex-col min-[700px]:flex-row min-[700px]:items-center min-[700px]:justify-between gap-3 min-[700px]:gap-8">
          <div className="flex flex-col items-center min-[700px]:items-start flex-shrink-0 justify-center min-[700px]:justify-start">
            <h1 
              className="text-4xl min-[700px]:text-4xl font-bold header-title m-4"
            >
              🏠 בית מארח
            </h1>
            {currentClassName && (
              <h3 className="neon-text-green text-lg min-[700px]:text-lg hologram padding-horizontal-default mt-0 mb-4">
                נבחר: {currentClassName}
              </h3>
            )}
          </div>
          <NavigationMenu className="w-full min-[700px]:w-auto min-[700px]:flex-1 justify-center min-[700px]:justify-start min-[700px]:ml-[1em] navigation-container">
            <NavigationMenuList className="gap-2 min-[700px]:gap-6 justify-between min-[700px]:justify-end navigation-container-list">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.id} className="flex-1 min-[700px]:flex-initial">
                  <Button
                    className={`w-full px-2 min-[700px]:px-6 py-2 min-[700px]:py-3 text-base retro-pulse ${activeTab === item.id ? 'neon-text-pink' : ''}`}
                    onClick={() => onTabChange(item.id)}
                    type="button"
                    aria-label={item.ariaLabel}
                    data-cy={item.dataCy}
                  >
                    {item.label}
                  </Button>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  )
} 