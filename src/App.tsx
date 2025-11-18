import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from '@/components/ui/sonner'
import { AuthPage } from '@/components/AuthPage'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { StudentDashboard } from '@/components/student/StudentDashboard'
import type { User } from '@/lib/types'

function App() {
  const [currentUser, setCurrentUser] = useKV<User | null>('current-user', null)

  const handleLogin = (user: User) => {
    setCurrentUser(user)
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  if (!currentUser) {
    return (
      <>
        <AuthPage onLogin={handleLogin} />
        <Toaster position="top-right" />
      </>
    )
  }

  return (
    <>
      {currentUser.role === 'admin' ? (
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <StudentDashboard user={currentUser} onLogout={handleLogout} />
      )}
      <Toaster position="top-right" />
    </>
  )
}

export default App