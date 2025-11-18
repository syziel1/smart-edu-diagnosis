import { useKV } from '@github/spark/hooks'
import { GlassCard } from '@/components/GlassCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, BookOpen } from 'lucide-react'
import type { Subject, Topic, QuestionTemplate } from '@/lib/types'

interface TopicSelectionProps {
  onSelectTopic: (topic: Topic) => void
}

export function TopicSelection({ onSelectTopic }: TopicSelectionProps) {
  const [subjects] = useKV<Subject[]>('subjects', [])
  const [topics] = useKV<Topic[]>('topics', [])
  const [questions] = useKV<QuestionTemplate[]>('questions', [])

  const getQuestionCount = (topicId: string) => {
    return (questions || []).filter((q) => q.topicId === topicId).length
  }

  const groupedTopics = (subjects || []).map((subject) => ({
    subject,
    topics: (topics || []).filter((t) => t.subjectId === subject.id),
  }))

  if ((subjects || []).length === 0 || (topics || []).length === 0) {
    return (
      <GlassCard>
        <GlassCard.Content className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Topics Available</h3>
          <p className="text-muted-foreground">
            Your teacher hasn't created any topics yet. Check back later!
          </p>
        </GlassCard.Content>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-8">
      {groupedTopics.map(({ subject, topics: subjectTopics }) => {
        if (subjectTopics.length === 0) return null

        return (
          <div key={subject.id}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              {subject.name.en}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjectTopics.map((topic) => {
                const questionCount = getQuestionCount(topic.id)
                
                return (
                  <GlassCard key={topic.id} hover>
                    <GlassCard.Header>
                      <GlassCard.Title>{topic.name.en}</GlassCard.Title>
                      <GlassCard.Description>
                        {topic.name.pl}
                      </GlassCard.Description>
                    </GlassCard.Header>
                    <GlassCard.Content>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          {questionCount} question{questionCount !== 1 ? 's' : ''}
                        </Badge>
                        <Button
                          onClick={() => onSelectTopic(topic)}
                          disabled={questionCount === 0}
                          className="gradient-button hover:scale-105 transition-transform"
                          size="sm"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Quiz
                        </Button>
                      </div>
                    </GlassCard.Content>
                  </GlassCard>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
