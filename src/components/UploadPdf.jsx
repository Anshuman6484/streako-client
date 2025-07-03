import { useRef, useState } from 'react'
import { supabase } from '@/services/supabaseClient'
import { toast } from 'sonner'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

export default function UploadPdf() {
  const [file, setFile] = useState(null)
  const [sign, setSign] = useState(null)

  const navigate = useNavigate()
  const toastIdRef = useRef(null)

  const handleFileUpload = async () => {
    if (!file) {
      toast.error('Please select a file')
      return
    }
    toastIdRef.current = toast.loading('Uploading PDF...')

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const filePath = `uploads/${user.id}/${file.name}`

    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, file)

    if (error) {
      toast.error('Upload failed: ' + error.message, { id: toastIdRef.current })
    } else {
      toast.success('PDF uploaded successfully!', {
        id: toastIdRef.current,
        onAutoClose: () => {
          toastIdRef.current = null
        },
      })
      console.log('Uploaded path:', data.path)
    }
  }

  const handleSignatureUpload = async () => {
    if (!sign) {
      toast.error('Please select a signature')
      return
    }
    toastIdRef.current = toast.loading('Uploading Signature...')

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const filePath = `signatures/${user.id}/${sign.name}`

    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, sign)

    if (error) {
      toast.error('Upload failed: ' + error.message, { id: toastIdRef.current })
    } else {
      toast.success('Signature uploaded successfully!', {
        id: toastIdRef.current,
        onAutoClose: () => {
          toastIdRef.current = null
        },
      })
      console.log('Uploaded path:', data.path)
    }
  }

  return (
    <div className="flex justify-center mt-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold text-primary">Upload Document</h1>
        <div className="flex gap-4 max-w-sm">
          <Input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="cursor-pointer"
          />
          <Button onClick={handleFileUpload}>Upload PDF</Button>
        </div>
        <div className="flex gap-4 max-w-sm">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setSign(e.target.files[0])}
            className="cursor-pointer"
          />
          <Button onClick={handleSignatureUpload}>Upload Signature</Button>
        </div>
        {file && sign && (
          <Button onClick={() => navigate('/signature')}>Sign Document</Button>
        )}
      </div>
    </div>
  )
}
