import { ThemeToggle } from './components/ui/ThemeToggle'

function App() {
  return (
    <>
      <h1 className="bg-accent text-center p-2 font-bold">
        <div className="flex items-center justify-center gap-4">
          <span className="text-primary">STREAKO</span>
          <ThemeToggle />
        </div>
      </h1>
    </>
  )
}

export default App
