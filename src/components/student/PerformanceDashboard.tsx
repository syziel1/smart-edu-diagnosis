import { useKV } from '@github/spark/hooks'
import { GlassCard } from '@/components/GlassCard'
import { Brain, TrendingUp, Target } from 'lucide-react'
import type { QuizAttempt, Topic, PerformanceMetrics, User } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

interface PerformanceDashboardProps {
  user: User
}

export function PerformanceDashboard({ user }: PerformanceDashboardProps) {
  const [attempts] = useKV<QuizAttempt[]>('quiz-attempts', [])
  const [topics] = useKV<Topic[]>('topics', [])

  const userAttempts = (attempts || []).filter((a) => a.userId === user.id)

  const calculateMetrics = (): PerformanceMetrics[] => {
    const topicMap = new Map<string, PerformanceMetrics>()

    userAttempts.forEach((attempt) => {
      const topic = (topics || []).find((t) => t.id === attempt.topicId)
      if (!topic) return

      if (!topicMap.has(attempt.topicId)) {
        topicMap.set(attempt.topicId, {
          topicId: attempt.topicId,
          topicName: topic.name.en,
          totalAttempts: 0,
          averageScore: 0,
          beginnerScore: 0,
          intermediateScore: 0,
          advancedScore: 0,
        })
      }

      const metrics = topicMap.get(attempt.topicId)!
      metrics.totalAttempts++

      const beginnerQuestions = attempt.questions.filter((q) => q.difficulty === 'beginner')
      const intermediateQuestions = attempt.questions.filter(
        (q) => q.difficulty === 'intermediate'
      )
      const advancedQuestions = attempt.questions.filter((q) => q.difficulty === 'advanced')

      const beginnerCorrect = beginnerQuestions.filter((q) => q.isCorrect).length
      const intermediateCorrect = intermediateQuestions.filter((q) => q.isCorrect).length
      const advancedCorrect = advancedQuestions.filter((q) => q.isCorrect).length

      metrics.beginnerScore =
        beginnerQuestions.length > 0
          ? (beginnerCorrect / beginnerQuestions.length) * 100
          : 0
      metrics.intermediateScore =
        intermediateQuestions.length > 0
          ? (intermediateCorrect / intermediateQuestions.length) * 100
          : 0
      metrics.advancedScore =
        advancedQuestions.length > 0 ? (advancedCorrect / advancedQuestions.length) * 100 : 0

      metrics.averageScore = attempt.score
    })

    return Array.from(topicMap.values())
  }

  const metrics = calculateMetrics()

  const radarData = metrics.map((m) => ({
    topic: m.topicName.length > 15 ? m.topicName.slice(0, 15) + '...' : m.topicName,
    score: Math.round(m.averageScore),
  }))

  const barData = metrics.flatMap((m) => [
    {
      topic: m.topicName.length > 10 ? m.topicName.slice(0, 10) + '...' : m.topicName,
      difficulty: 'Beginner',
      score: Math.round(m.beginnerScore),
    },
    {
      topic: m.topicName.length > 10 ? m.topicName.slice(0, 10) + '...' : m.topicName,
      difficulty: 'Intermediate',
      score: Math.round(m.intermediateScore),
    },
    {
      topic: m.topicName.length > 10 ? m.topicName.slice(0, 10) + '...' : m.topicName,
      difficulty: 'Advanced',
      score: Math.round(m.advancedScore),
    },
  ])

  const overallScore =
    userAttempts.length > 0
      ? Math.round(
          userAttempts.reduce((sum, a) => sum + a.score, 0) / userAttempts.length
        )
      : 0

  const totalQuestions = userAttempts.reduce((sum, a) => sum + a.questions.length, 0)
  const correctAnswers = userAttempts.reduce(
    (sum, a) => sum + a.questions.filter((q) => q.isCorrect).length,
    0
  )

  if (userAttempts.length === 0) {
    return (
      <div className="space-y-6">
        <GlassCard>
          <GlassCard.Content className="text-center py-12">
            <Brain className="w-16 h-16 mx-auto mb-4 opacity-50 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Performance Data Yet</h3>
            <p className="text-muted-foreground">
              Complete some quizzes to see your performance analytics
            </p>
          </GlassCard.Content>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard hover>
          <GlassCard.Content className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-accent">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">{overallScore}%</div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </div>
            </div>
          </GlassCard.Content>
        </GlassCard>

        <GlassCard hover>
          <GlassCard.Content className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-accent to-secondary">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">{userAttempts.length}</div>
                <div className="text-sm text-muted-foreground">Quizzes Taken</div>
              </div>
            </div>
          </GlassCard.Content>
        </GlassCard>

        <GlassCard hover>
          <GlassCard.Content className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-secondary to-teal">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {correctAnswers}/{totalQuestions}
                </div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
            </div>
          </GlassCard.Content>
        </GlassCard>
      </div>

      <GlassCard>
        <GlassCard.Header>
          <GlassCard.Title>Performance by Topic</GlassCard.Title>
          <GlassCard.Description>
            Your average scores across different topics
          </GlassCard.Description>
        </GlassCard.Header>
        <GlassCard.Content>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="topic"
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </GlassCard.Content>
      </GlassCard>

      <GlassCard>
        <GlassCard.Header>
          <GlassCard.Title>Performance by Difficulty</GlassCard.Title>
          <GlassCard.Description>
            How you perform at different difficulty levels
          </GlassCard.Description>
        </GlassCard.Header>
        <GlassCard.Content>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="topic"
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--foreground))' }}
                domain={[0, 100]}
                label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="score" fill="hsl(var(--primary))" name="Score %" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard.Content>
      </GlassCard>

      <GlassCard>
        <GlassCard.Header>
          <GlassCard.Title>Topic Breakdown</GlassCard.Title>
        </GlassCard.Header>
        <GlassCard.Content>
          <div className="space-y-4">
            {metrics.map((metric) => (
              <div
                key={metric.topicId}
                className="p-4 rounded-lg bg-gradient-to-r from-muted/50 to-transparent"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{metric.topicName}</div>
                  <Badge
                    variant="outline"
                    className={
                      metric.averageScore >= 80
                        ? 'bg-teal/20 border-teal'
                        : metric.averageScore >= 60
                          ? 'bg-accent/20 border-accent'
                          : 'bg-destructive/20 border-destructive'
                    }
                  >
                    {Math.round(metric.averageScore)}%
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Beginner: </span>
                    <span className="font-medium">
                      {Math.round(metric.beginnerScore)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Intermediate: </span>
                    <span className="font-medium">
                      {Math.round(metric.intermediateScore)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Advanced: </span>
                    <span className="font-medium">
                      {Math.round(metric.advancedScore)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard.Content>
      </GlassCard>
    </div>
  )
}
