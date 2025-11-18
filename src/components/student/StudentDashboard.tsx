import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { TopicSelection } from './TopicSelection'
import { QuizEngine } from './QuizEngine'
import { PerformanceDashboard } from './PerformanceDashboard'
import { BookOpen, Brain, Play, LogOut, ArrowLeft } from 'lucide-react'
import type { User, Topic } from '@/lib/types'

interface StudentDashboardProps {
  user: User
  onLogout: () => void
}

export function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState('quiz')
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [isQuizActive, setIsQuizActive] = useState(false)

  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic)
    setIsQuizActive(true)
  }

  const handleQuizComplete = () => {
    setIsQuizActive(false)
    setSelectedTopic(null)
    setActiveTab('performance')
  }

  const handleBackToTopics = () => {
    setIsQuizActive(false)
    setSelectedTopic(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
      <header className="glass-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Matma-Prosta.pl
                </h1>
                <p className="text-sm text-muted-foreground">
                  Student Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm text-muted-foreground">Student</div>
              </div>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isQuizActive && selectedTopic ? (
          <div className="space-y-4">
            <Button variant="outline" onClick={handleBackToTopics}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Topics
            </Button>
            <QuizEngine
              topicId={selectedTopic.id}
              topic={selectedTopic}
              user={user}
              onComplete={handleQuizComplete}
            />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                <span className="hidden sm:inline">Take Quiz</span>
                <span className="sm:hidden">Quiz</span>
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                <span className="hidden sm:inline">Performance</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quiz">
              <TopicSelection onSelectTopic={handleSelectTopic} />
            </TabsContent>

            <TabsContent value="performance">
              <PerformanceDashboard user={user} />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}
