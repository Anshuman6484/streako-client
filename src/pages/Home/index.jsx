import { pdfjs } from 'react-pdf'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min?url'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

// Tell react-pdf to use the correct worker
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

function Home() {
  const { isLoggedIn } = useAuth()

  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full bg-background text-foreground pt-20">
      <div className="text-center text-2xl font-bold mb-6">
        Welcome to <span className="text-primary">STREAKO</span>
      </div>
      {isLoggedIn && (
        <Button onclick={() => navigate('/dashboard')}>Get Started</Button>
      )}
    </div>
  )
}

export default Home
