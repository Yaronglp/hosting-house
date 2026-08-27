import { Button } from '@/components/ui/Button'
import { cn } from '@/components/ui/utils'

interface AppHeaderProps {
  currentClassName?: string
  activeTab: string
  onTabChange: (tab: string) => void
}

const navigationItems = [
  {
    id: 'classes',
    label: 'כיתות',
    ariaLabel: 'כיתות',
    dataCy: 'tab-classes'
  },
  {
    id: 'students',
    label: 'תלמידים',
    ariaLabel: 'תלמידים',
    dataCy: 'tab-students'
  },
  {
    id: 'rounds',
    label: 'תאריכי מפגשים',
    ariaLabel: 'תאריכי מפגשים',
    dataCy: 'tab-rounds'
  },
  {
    id: 'plan',
    label: 'תכנון',
    ariaLabel: 'תכנון',
    dataCy: 'tab-plan'
  }
]

export function AppHeader({ currentClassName, activeTab, onTabChange }: AppHeaderProps) {
  return (
    <header className="app-header flex-shrink-0 w-full rounded-b-2xl mb-4" data-cy="app-header" role="banner">
      <div className="flex flex-col gap-3 px-2 py-4 min-[700px]:grid min-[700px]:grid-cols-[minmax(0,32%)_minmax(0,1fr)] min-[700px]:items-center min-[700px]:gap-8 min-[700px]:px-6">
        <div className="flex min-w-0 flex-col items-center min-[700px]:items-start justify-center min-[700px]:justify-start overflow-hidden">
          <h1 className="text-3xl min-[700px]:text-4xl app-title m-2">
            בית מארח
          </h1>
          <p
            className="app-subtitle text-base min-[700px]:text-lg padding-horizontal-default m-2 mb-4 mt-0 max-w-full truncate"
            title={currentClassName ? `נבחרה: ${currentClassName}` : undefined}
          >
            {currentClassName ? `נבחרה: ${currentClassName}` : 'לא נבחרה כיתה כרגע'}
          </p>
        </div>
        <nav
          className="w-full min-w-0 navigation-container app-header"
          aria-label="ניווט ראשי"
        >
          <ul className="navigation-container-list w-full min-w-0 list-none p-0 m-0 min-[700px]:flex min-[700px]:flex-row min-[700px]:gap-3">
            {navigationItems.map((item) => (
              <li key={item.id} className="w-full min-w-0 min-[700px]:flex-1">
                <Button
                  variant={activeTab === item.id ? 'default' : 'outline'}
                  className={cn(
                    'w-full min-h-12 px-4 min-[700px]:px-5 py-3 min-[700px]:py-2.5 text-base nav-tab',
                    activeTab === item.id ? 'nav-tab-active' : 'nav-tab-inactive'
                  )}
                  onClick={() => onTabChange(item.id)}
                  type="button"
                  aria-label={item.ariaLabel}
                  aria-current={activeTab === item.id ? 'page' : undefined}
                  data-cy={item.dataCy}
                >
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
