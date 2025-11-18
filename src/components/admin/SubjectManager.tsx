import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard } from '@/components/GlassCard'
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import type { Subject } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function SubjectManager() {
  const [subjects, setSubjects] = useKV<Subject[]>('subjects', [])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    slug: '',
    nameEn: '',
    namePl: '',
  })

  const resetForm = () => {
    setFormData({ slug: '', nameEn: '', namePl: '' })
    setEditingId(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.slug || !formData.nameEn || !formData.namePl) {
      toast.error('Please fill in all fields')
      return
    }

    if (editingId) {
      setSubjects((current) =>
        (current || []).map((s) =>
          s.id === editingId
            ? {
                ...s,
                slug: formData.slug,
                name: { en: formData.nameEn, pl: formData.namePl },
              }
            : s
        )
      )
      toast.success('Subject updated')
    } else {
      const newSubject: Subject = {
        id: `subject-${Date.now()}`,
        slug: formData.slug,
        name: { en: formData.nameEn, pl: formData.namePl },
        createdAt: Date.now(),
      }
      setSubjects((current) => [...(current || []), newSubject])
      toast.success('Subject created')
    }

    setIsOpen(false)
    resetForm()
  }

  const handleEdit = (subject: Subject) => {
    setEditingId(subject.id)
    setFormData({
      slug: subject.slug,
      nameEn: subject.name.en,
      namePl: subject.name.pl,
    })
    setIsOpen(true)
  }

  const handleDelete = (id: string) => {
    setSubjects((current) => (current || []).filter((s) => s.id !== id))
    toast.success('Subject deleted')
  }

  return (
    <GlassCard>
      <GlassCard.Header>
        <div className="flex items-center justify-between">
          <div>
            <GlassCard.Title className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Subjects
            </GlassCard.Title>
            <GlassCard.Description>
              Manage mathematical subjects
            </GlassCard.Description>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="gradient-button hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Edit Subject' : 'Create Subject'}
                </DialogTitle>
                <DialogDescription>
                  Enter subject details in both languages
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="algebra"
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
                    placeholder="Algebra"
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
                    placeholder="Algebra"
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
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No subjects yet. Create your first subject to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slug</TableHead>
                <TableHead>English Name</TableHead>
                <TableHead>Polish Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(subjects || []).map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-mono text-sm">
                    {subject.slug}
                  </TableCell>
                  <TableCell>{subject.name.en}</TableCell>
                  <TableCell>{subject.name.pl}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(subject)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(subject.id)}
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
