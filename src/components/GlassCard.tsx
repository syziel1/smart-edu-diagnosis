import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
}

export function GlassCard({ children, className, hover = false, ...props }: GlassCardProps) {
  return (
    <Card
      className={cn(
        'glass-card transition-all duration-300',
        hover && 'hover:shadow-2xl hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </Card>
  )
}

GlassCard.Header = CardHeader
GlassCard.Title = CardTitle
GlassCard.Description = CardDescription
GlassCard.Content = CardContent
GlassCard.Footer = CardFooter
