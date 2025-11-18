import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GlassCard } from '@/components/GlassCard'
import { BookOpen, UserCog, User as UserIcon } from 'lucide-react'
import type { User, UserRole } from '@/lib/types'
import { toast } from 'sonner'

interface AuthPageProps {
  onLogin: (user: User) => void
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student')
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    if (!isLogin && !name) {
      toast.error('Please enter your name')
      return
    }

    const user: User = {
      id: `user-${Date.now()}`,
      email,
      role: selectedRole,
      name: name || email.split('@')[0],
    }

    toast.success(`Welcome ${isLogin ? 'back' : ''}!`)
    onLogin(user)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-12 h-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Matma-Prosta.pl
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Matematyka wytłumaczona krok po kroku
          </p>
        </div>

        <GlassCard className="max-w-md mx-auto">
          <GlassCard.Header>
            <GlassCard.Title className="text-2xl text-center">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </GlassCard.Title>
            <GlassCard.Description className="text-center">
              Choose your role and enter your credentials
            </GlassCard.Description>
          </GlassCard.Header>

          <GlassCard.Content className="space-y-6">
            <div className="space-y-4">
              <Label>Select Role</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedRole('student')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    selectedRole === 'student'
                      ? 'border-primary bg-primary/10 shadow-lg'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <UserIcon className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-semibold">Student</div>
                  <div className="text-sm text-muted-foreground">Take quizzes</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    selectedRole === 'admin'
                      ? 'border-secondary bg-secondary/10 shadow-lg'
                      : 'border-border hover:border-secondary/50'
                  }`}
                >
                  <UserCog className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-semibold">Teacher</div>
                  <div className="text-sm text-muted-foreground">Manage content</div>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full gradient-button hover:scale-105 transition-transform"
                size="lg"
              >
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </GlassCard.Content>
        </GlassCard>
      </div>
    </div>
  )
}
