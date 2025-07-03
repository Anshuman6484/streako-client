import { useEffect, useRef, useState } from 'react'
import { Document, Page } from 'react-pdf'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'

export default function PdfPreviewCard({ name, url }) {
  const [open, setOpen] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth)
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {/* Small preview */}
      <div
        className="cursor-pointer max-w-sm space-y-2 border rounded p-2 hover:shadow-md hover:scale-[1.02] transition-all duration-200"
        onClick={() => setOpen(true)}
      >
        <div
          className="overflow-hidden flex justify-center"
          style={{ height: 250 }}
        >
          <Document file={url} onLoadError={console.error}>
            <Page pageNumber={1} scale={3} width={200} />
          </Document>
        </div>
        <p className="font-medium truncate">{name}</p>
      </div>

      {/* Full-screen dialog preview */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-auto p-4">
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription>{name}</DialogDescription>
          <div ref={containerRef} className="w-full">
            <Document file={url} onLoadError={console.error}>
              <Page pageNumber={1} width={containerWidth} />
            </Document>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
