import { useEffect } from 'react'

function Error() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.replace('/')
    }, 3000)

    return () => clearTimeout(timer)
  }, [])
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center">
      <h1 className="text-6xl font-bold text-destructive">404</h1>
      <p className="text-2xl mt-4">Page Not Found</p>
      <p className="mt-2 text-lg">The page you’re looking for doesn’t exist.</p>
      <p className="text-sm">Redirecting to home page...</p>
    </div>
  )
}

export default Error
