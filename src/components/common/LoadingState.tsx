import { Card, CardContent } from '@/components/ui/Card'

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = "טוען..." }: LoadingStateProps) {
  return (
    <Card>
      <CardContent className="py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan mx-auto"></div>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </CardContent>
    </Card>
  )
}
