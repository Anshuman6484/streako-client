import { LoginForm } from './components/login-form'
import { useEffect } from 'react'

function LogIn() {
  useEffect(() => {
    document.body.classList.add('no-scroll')
    document.documentElement.classList.add('no-scroll')

    return () => {
      document.body.classList.remove('no-scroll')
      document.documentElement.classList.remove('no-scroll')
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-xs flex flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <LoginForm />
      </div>
    </div>
  )
}

export default LogIn
