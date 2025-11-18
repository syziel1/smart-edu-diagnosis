import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard } from '@/components/GlassCard'
import { Plus, Edit, Trash2, Layers } from 'lucide-react'
import { toast } from 'sonner'
import type { Subject, Topic } from '@/lib/types'
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

export function TopicManager() {
  const [subjects] = useKV<Subject[]>('subjects', [])
  const [topics, setTopics] = useKV<Topic[]>('topics', [])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    subjectId: '',
    slug: '',
    nameEn: '',
    namePl: '',
  })

  const resetForm = () => {
    setFormData({ subjectId: '', slug: '', nameEn: '', namePl: '' })
    setEditingId(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.subjectId || !formData.slug || !formData.nameEn || !formData.namePl) {
      toast.error('Please fill in all fields')
      return
    }

    if (editingId) {
      setTopics((current) =>
        (current || []).map((t) =>
          t.id === editingId
            ? {
                ...t,
                subjectId: formData.subjectId,
                slug: formData.slug,
                name: { en: formData.nameEn, pl: formData.namePl },
              }
            : t
        )
      )
      toast.success('Topic updated')
    } else {
      const newTopic: Topic = {
        id: `topic-${Date.now()}`,
        subjectId: formData.subjectId,
        slug: formData.slug,
        name: { en: formData.nameEn, pl: formData.namePl },
        createdAt: Date.now(),
      }
      setTopics((current) => [...(current || []), newTopic])
      toast.success('Topic created')
    }

    setIsOpen(false)
    resetForm()
  }

  const handleEdit = (topic: Topic) => {
    setEditingId(topic.id)
    setFormData({
      subjectId: topic.subjectId,
      slug: topic.slug,
      nameEn: topic.name.en,
      namePl: topic.name.pl,
    })
    setIsOpen(true)
  }

  const handleDelete = (id: string) => {
    setTopics((current) => (current || []).filter((t) => t.id !== id))
    toast.success('Topic deleted')
  }

  const getSubjectName = (subjectId: string) => {
    const subject = (subjects || []).find((s) => s.id === subjectId)
    return subject?.name.en || 'Unknown'
  }

  return (
    <GlassCard>
      <GlassCard.Header>
        <div className="flex items-center justify-between">
          <div>
            <GlassCard.Title className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Topics
            </GlassCard.Title>
            <GlassCard.Description>
              Manage topics within subjects
            </GlassCard.Description>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="gradient-button hover:scale-105 transition-transform"
                disabled={(subjects || []).length === 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Topic
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Edit Topic' : 'Create Topic'}
                </DialogTitle>
                <DialogDescription>
                  Enter topic details in both languages
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select
                    value={formData.subjectId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, subjectId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {(subjects || []).map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="quadratic-equations"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nameEn">Name (English)</Label>
                  <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) =>
                      setFormData({ ...formData, nameEn: e.target.value })
                    }
                    placeholder="Quadratic Equations"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="namePl">Name (Polish)</Label>
                  <Input
                    id="namePl"
                    value={formData.namePl}
                    onChange={(e) =>
                      setFormData({ ...formData, namePl: e.target.value })
                    }
                    placeholder="Równania kwadratowe"
                  />
                </div>

                <Button type="submit" className="w-full">
                  {editingId ? 'Update' : 'Create'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </GlassCard.Header>

      <GlassCard.Content>
        {(subjects || []).length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Please create at least one subject first.</p>
          </div>
        ) : (topics || []).length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No topics yet. Create your first topic to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>English Name</TableHead>
                <TableHead>Polish Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(topics || []).map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell className="text-sm">
                    {getSubjectName(topic.subjectId)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {topic.slug}
                  </TableCell>
                  <TableCell>{topic.name.en}</TableCell>
                  <TableCell>{topic.name.pl}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(topic)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(topic.id)}
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
