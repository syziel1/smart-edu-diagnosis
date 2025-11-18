import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { GlassCard } from '@/components/GlassCard'
import { Plus, Sparkles, Eye, Trash2, Edit } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { MathRenderer } from '@/components/MathRenderer'
import type { Topic, QuestionTemplate, Difficulty, Subject } from '@/lib/types'
import { generateQuestion } from '@/lib/questionProcessor'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function QuestionCreator() {
  const [subjects] = useKV<Subject[]>('subjects', [])
  const [topics] = useKV<Topic[]>('topics', [])
  const [questions, setQuestions] = useKV<QuestionTemplate[]>('questions', [])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [previewQuestion, setPreviewQuestion] = useState<string | null>(null)
  const [previewAnswer, setPreviewAnswer] = useState<number | null>(null)
  
  const [formData, setFormData] = useState({
    topicId: '',
    difficulty: 'beginner' as Difficulty,
    questionEn: '',
    questionPl: '',
    answerTemplate: '',
    variables: [] as Array<{ name: string; min: number; max: number }>,
  })

  const resetForm = () => {
    setFormData({
      topicId: '',
      difficulty: 'beginner',
      questionEn: '',
      questionPl: '',
      answerTemplate: '',
      variables: [],
    })
    setEditingId(null)
    setPreviewQuestion(null)
    setPreviewAnswer(null)
  }

  const addVariable = () => {
    setFormData({
      ...formData,
      variables: [...formData.variables, { name: '', min: 1, max: 10 }],
    })
  }

  const removeVariable = (index: number) => {
    setFormData({
      ...formData,
      variables: formData.variables.filter((_, i) => i !== index),
    })
  }

  const updateVariable = (index: number, field: string, value: string | number) => {
    const updated = [...formData.variables]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, variables: updated })
  }

  const handlePreview = () => {
    if (!formData.questionEn || !formData.answerTemplate) {
      toast.error('Please fill in question and answer templates')
      return
    }

    const variables: Record<string, { min: number; max: number }> = {}
    formData.variables.forEach((v) => {
      if (v.name) {
        variables[v.name] = { min: v.min, max: v.max }
      }
    })

    const tempTemplate: QuestionTemplate = {
      id: 'preview',
      topicId: formData.topicId,
      difficulty: formData.difficulty,
      isDynamic: formData.variables.length > 0,
      content: {
        variables,
        questionTemplate: {
          en: formData.questionEn,
          pl: formData.questionPl || formData.questionEn,
        },
        answerTemplate: formData.answerTemplate,
      },
      createdAt: Date.now(),
    }

    try {
      const generated = generateQuestion(tempTemplate)
      setPreviewQuestion(generated.questionText)
      setPreviewAnswer(generated.correctAnswer)
      toast.success('Preview generated!')
    } catch (error) {
      toast.error('Error generating preview. Check your templates.')
      console.error(error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.topicId || !formData.questionEn || !formData.answerTemplate) {
      toast.error('Please fill in all required fields')
      return
    }

    const variables: Record<string, { min: number; max: number }> = {}
    formData.variables.forEach((v) => {
      if (v.name) {
        variables[v.name] = { min: v.min, max: v.max }
      }
    })

    if (editingId) {
      setQuestions((current) =>
        (current || []).map((q) =>
          q.id === editingId
            ? {
                ...q,
                topicId: formData.topicId,
                difficulty: formData.difficulty,
                isDynamic: formData.variables.length > 0,
                content: {
                  variables,
                  questionTemplate: {
                    en: formData.questionEn,
                    pl: formData.questionPl || formData.questionEn,
                  },
                  answerTemplate: formData.answerTemplate,
                },
              }
            : q
        )
      )
      toast.success('Question updated')
    } else {
      const newQuestion: QuestionTemplate = {
        id: `question-${Date.now()}`,
        topicId: formData.topicId,
        difficulty: formData.difficulty,
        isDynamic: formData.variables.length > 0,
        content: {
          variables,
          questionTemplate: {
            en: formData.questionEn,
            pl: formData.questionPl || formData.questionEn,
          },
          answerTemplate: formData.answerTemplate,
        },
        createdAt: Date.now(),
      }
      setQuestions((current) => [...(current || []), newQuestion])
      toast.success('Question created')
    }

    setIsOpen(false)
    resetForm()
  }

  const handleEdit = (question: QuestionTemplate) => {
    setEditingId(question.id)
    const variables = Object.entries(question.content.variables).map(
      ([name, config]) => ({
        name,
        min: config.min,
        max: config.max,
      })
    )
    setFormData({
      topicId: question.topicId,
      difficulty: question.difficulty,
      questionEn: question.content.questionTemplate.en,
      questionPl: question.content.questionTemplate.pl || '',
      answerTemplate: question.content.answerTemplate,
      variables,
    })
    setIsOpen(true)
  }

  const handleDelete = (id: string) => {
    setQuestions((current) => (current || []).filter((q) => q.id !== id))
    toast.success('Question deleted')
  }

  const getTopicName = (topicId: string) => {
    const topic = (topics || []).find((t) => t.id === topicId)
    return topic?.name.en || 'Unknown'
  }

  const difficultyColors: Record<Difficulty, string> = {
    beginner: 'bg-teal/20 text-teal-foreground border-teal',
    intermediate: 'bg-accent/20 text-accent-foreground border-accent',
    advanced: 'bg-secondary/20 text-secondary-foreground border-secondary',
  }

  return (
    <GlassCard>
      <GlassCard.Header>
        <div className="flex items-center justify-between">
          <div>
            <GlassCard.Title className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Question Templates
            </GlassCard.Title>
            <GlassCard.Description>
              Create dynamic questions with variables
            </GlassCard.Description>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="gradient-button hover:scale-105 transition-transform"
                disabled={(topics || []).length === 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Edit Question' : 'Create Question Template'}
                </DialogTitle>
                <DialogDescription>
                  Use {'{variable}'} syntax in your templates
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic</Label>
                    <Select
                      value={formData.topicId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, topicId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {(topics || []).map((topic) => (
                          <SelectItem key={topic.id} value={topic.id}>
                            {topic.name.en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) =>
                        setFormData({ ...formData, difficulty: value as Difficulty })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Variables</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addVariable}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Variable
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.variables.map((variable, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          placeholder="Name (e.g., a)"
                          value={variable.name}
                          onChange={(e) =>
                            updateVariable(index, 'name', e.target.value)
                          }
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          placeholder="Min"
                          value={variable.min}
                          onChange={(e) =>
                            updateVariable(index, 'min', parseInt(e.target.value))
                          }
                          className="w-20"
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={variable.max}
                          onChange={(e) =>
                            updateVariable(index, 'max', parseInt(e.target.value))
                          }
                          className="w-20"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariable(index)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="questionEn">Question Template (English)</Label>
                  <Textarea
                    id="questionEn"
                    value={formData.questionEn}
                    onChange={(e) =>
                      setFormData({ ...formData, questionEn: e.target.value })
                    }
                    placeholder="Calculate ${a}^2$ where a = {a}"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use $...$ for inline math, $$...$$ for display math
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="questionPl">Question Template (Polish)</Label>
                  <Textarea
                    id="questionPl"
                    value={formData.questionPl}
                    onChange={(e) =>
                      setFormData({ ...formData, questionPl: e.target.value })
                    }
                    placeholder="Oblicz ${a}^2$ gdzie a = {a}"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="answerTemplate">Answer Template</Label>
                  <Input
                    id="answerTemplate"
                    value={formData.answerTemplate}
                    onChange={(e) =>
                      setFormData({ ...formData, answerTemplate: e.target.value })
                    }
                    placeholder="a*a"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use variable names with operators: +, -, *, /, **
                  </p>
                </div>

                {previewQuestion && (
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <div className="font-semibold text-sm">Preview:</div>
                    <div className="text-lg">
                      <MathRenderer content={previewQuestion} />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Answer: {previewAnswer}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreview}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingId ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </GlassCard.Header>

      <GlassCard.Content>
        {(topics || []).length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Please create at least one topic first.</p>
          </div>
        ) : (questions || []).length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No questions yet. Create your first question template.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Question Preview</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(questions || []).map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="text-sm">
                    {getTopicName(question.topicId)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={difficultyColors[question.difficulty]}
                    >
                      {question.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {question.content.questionTemplate.en}
                  </TableCell>
                  <TableCell>
                    {question.isDynamic ? (
                      <Badge variant="outline" className="bg-accent/20">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Dynamic
                      </Badge>
                    ) : (
                      <Badge variant="outline">Static</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(question)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(question.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </GlassCard.Content>
    </GlassCard>
  )
}
