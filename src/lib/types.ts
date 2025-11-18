export type UserRole = 'student' | 'admin'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface User {
  id: string
  email: string
  role: UserRole
  name: string
}

export interface Subject {
  id: string
  slug: string
  name: {
    en: string
    pl: string
  }
  createdAt: number
}

export interface Topic {
  id: string
  subjectId: string
  slug: string
  name: {
    en: string
    pl: string
  }
  createdAt: number
}

export interface QuestionVariable {
  min: number
  max: number
}

export interface QuestionContent {
  variables: Record<string, QuestionVariable>
  questionTemplate: {
    en: string
    pl?: string
  }
  answerTemplate: string
}

export interface QuestionTemplate {
  id: string
  topicId: string
  difficulty: Difficulty
  isDynamic: boolean
  content: QuestionContent
  createdAt: number
}

export interface GeneratedQuestion {
  id: string
  templateId: string
  topicId: string
  difficulty: Difficulty
  questionText: string
  correctAnswer: number
  variables: Record<string, number>
}

export interface QuizAttempt {
  id: string
  userId: string
  topicId: string
  subjectId: string
  questions: {
    questionId: string
    templateId: string
    difficulty: Difficulty
    userAnswer: number | null
    correctAnswer: number
    isCorrect: boolean
  }[]
  score: number
  completedAt: number
  startedAt: number
}

export interface PerformanceMetrics {
  topicId: string
  topicName: string
  totalAttempts: number
  averageScore: number
  beginnerScore: number
  intermediateScore: number
  advancedScore: number
}
