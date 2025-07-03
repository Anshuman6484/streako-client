import PdfPreviewCard from '@/components/PdfPreviewCard'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/services/supabaseClient'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const getFiles = async () => {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { data, error } = await supabase.storage
        .from('documents')
        .list(`uploads/${user.id}`, { limit: 100 })

      if (error) {
        toast.error('Error fetching files')
        console.error(error)
        setLoading(false)
        return
      }

      const urls = await Promise.all(
        data.map((file) =>
          supabase.storage
            .from('documents')
            .getPublicUrl(`uploads/${user.id}/${file.name}`)
        )
      )

      const finalFiles = urls.map((res, i) => ({
        name: data[i].name,
        url: res.data.publicUrl,
      }))

      setFiles(finalFiles)
      setLoading(false)
    }

    getFiles()
  }, [])

  return (
    <div className="pt-24 px-6">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold">📄 Your Uploaded PDFs</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Click on a file to preview it
        </p>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground animate-pulse">
          Fetching your files...
        </p>
      ) : files.length === 0 ? (
        <div className="flex items-center justify-center">
          <div className="flex flex-col gap-4 items-center">
            <p className="text-center text-muted-foreground">
              You haven’t uploaded any files yet.
            </p>
            <Button
              className="max-w-[8rem] items-center justify-center"
              onClick={() => navigate('/upload')}
            >
              Upload files
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="flex flex-col gap-4 items-center">
            <Button
              className="max-w-[8rem] items-center justify-center"
              onClick={() => navigate('/upload')}
            >
              Upload files
            </Button>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {files.map((file) => (
                <PdfPreviewCard
                  key={file.name}
                  name={file.name}
                  url={file.url}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
