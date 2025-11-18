import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GlassCard } from '@/components/GlassCard'
import { Progress } from '@/components/ui/progress'
import { MathRenderer } from '@/components/MathRenderer'
import { Check, X, ArrowRight, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import type { QuestionTemplate, GeneratedQuestion, QuizAttempt, Topic, User } from '@/lib/types'
import { generateQuestion } from '@/lib/questionProcessor'

interface QuizEngineProps {
  topicId: string
  topic: Topic
  user: User
  onComplete: () => void
}

export function QuizEngine({ topicId, topic, user, onComplete }: QuizEngineProps) {
  const [templates] = useKV<QuestionTemplate[]>('questions', [])
  const [attempts, setAttempts] = useKV<QuizAttempt[]>('quiz-attempts', [])
  
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [startTime] = useState(Date.now())
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)

  useEffect(() => {
    // Mark as loaded when templates change from initial state
    if (templates && templates.length >= 0 && !hasLoadedOnce) {
      setHasLoadedOnce(true)
    }

    // Only check for empty after initial load to avoid race condition
    if (!hasLoadedOnce) {
      return
    }

    const topicTemplates = (templates || []).filter((t) => t.topicId === topicId)
    
    if (topicTemplates.length === 0) {
      toast.error('No questions available for this topic')
      onComplete()
      return
    }

    const generated = topicTemplates
      .slice(0, 10)
      .map((template) => generateQuestion(template))
    
    setQuestions(generated)
    setUserAnswers(new Array(generated.length).fill(null))
  }, [topicId, templates, hasLoadedOnce, onComplete])

  const currentQuestion = questions[currentIndex]

  const handleSubmitAnswer = () => {
    if (currentAnswer === '') {
      toast.error('Please enter an answer')
      return
    }

    const answer = parseFloat(currentAnswer)
    const correct = Math.abs(answer - currentQuestion.correctAnswer) < 0.01

    setIsCorrect(correct)
    setShowFeedback(true)
    
    const newAnswers = [...userAnswers]
    newAnswers[currentIndex] = answer
    setUserAnswers(newAnswers)

    if (correct) {
      toast.success('Correct!')
    } else {
      toast.error(`Incorrect. The answer was ${currentQuestion.correctAnswer}`)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setCurrentAnswer('')
      setShowFeedback(false)
      setIsCorrect(false)
    } else {
      handleFinishQuiz()
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setCurrentAnswer(userAnswers[currentIndex - 1]?.toString() || '')
      setShowFeedback(false)
      setIsCorrect(false)
    }
  }

  const handleFinishQuiz = () => {
    const correctCount = questions.reduce((count, question, index) => {
      const answer = userAnswers[index]
      if (answer !== null && Math.abs(answer - question.correctAnswer) < 0.01) {
        return count + 1
      }
      return count
    }, 0)

    const score = (correctCount / questions.length) * 100

    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      userId: user.id,
      topicId,
      subjectId: topic.subjectId,
      questions: questions.map((q, index) => ({
        questionId: q.id,
        templateId: q.templateId,
        difficulty: q.difficulty,
        userAnswer: userAnswers[index],
        correctAnswer: q.correctAnswer,
        isCorrect:
          userAnswers[index] !== null &&
          Math.abs(userAnswers[index]! - q.correctAnswer) < 0.01,
      })),
      score,
      startedAt: startTime,
      completedAt: Date.now(),
    }

    setAttempts((current) => [...(current || []), attempt])
    
    toast.success(`Quiz complete! Score: ${score.toFixed(0)}%`)
    onComplete()
  }

  if (!hasLoadedOnce || questions.length === 0) {
    return (
      <GlassCard>
        <GlassCard.Content className="text-center py-12">
          <p className="text-muted-foreground">Loading questions...</p>
        </GlassCard.Content>
      </GlassCard>
    )
  }

  const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <div className="space-y-6">
      <GlassCard>
        <GlassCard.Header>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <GlassCard.Title>{topic.name.en}</GlassCard.Title>
              <span className="text-sm text-muted-foreground">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </GlassCard.Header>

        <GlassCard.Content className="space-y-6">
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 min-h-[120px] flex items-center justify-center">
            <div className="text-xl text-center">
              <MathRenderer content={currentQuestion.questionText} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                type="number"
                step="any"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Enter your answer"
                disabled={showFeedback}
                className="text-lg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !showFeedback) {
                    handleSubmitAnswer()
                  }
                }}
              />
              {!showFeedback && (
                <Button
                  onClick={handleSubmitAnswer}
                  className="gradient-button hover:scale-105 transition-transform"
                  size="lg"
                >
                  Submit
                </Button>
              )}
            </div>

            {showFeedback && (
              <div
                className={`p-4 rounded-lg flex items-center gap-3 ${
                  isCorrect
                    ? 'bg-teal/20 border-2 border-teal'
                    : 'bg-destructive/20 border-2 border-destructive'
                }`}
              >
                {isCorrect ? (
                  <Check className="w-6 h-6 text-teal-foreground" />
                ) : (
                  <X className="w-6 h-6 text-destructive" />
                )}
                <div>
                  <div className="font-semibold">
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </div>
                  {!isCorrect && (
                    <div className="text-sm">
                      The correct answer is: {currentQuestion.correctAnswer}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </GlassCard.Content>

        <GlassCard.Footer>
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!showFeedback}
              className="gradient-button hover:scale-105 transition-transform"
            >
              {currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </GlassCard.Footer>
      </GlassCard>
    </div>
  )
}
