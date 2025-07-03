import React, { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Rnd } from 'react-rnd'
import { PDFDocument, rgb } from 'pdf-lib'
import { supabase } from '@/services/supabaseClient'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min?url'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import { toast } from 'sonner'

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

function Signature() {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [signatures, setSignatures] = useState([])
  const [droppedItems, setDroppedItems] = useState([])

  const pdfWrapperRef = useRef(null)
  const toastIdRef = useRef(null)

  // ✅ Download as image-based PDF
  const downloadPdf = async () => {
    toastIdRef.current = toast.loading('Downloading...')

    try {
      // 1. Load the original PDF
      const existingPdfBytes = await fetch(pdfUrl).then((res) =>
        res.arrayBuffer()
      )
      const pdfDoc = await PDFDocument.load(existingPdfBytes)
      const page = pdfDoc.getPages()[0]
      const pageHeight = page.getHeight()

      // 2. Process and embed each signature
      for (let item of droppedItems) {
        const imageRes = await fetch(item.url)
        const imageBytes = await imageRes.arrayBuffer()
        const contentType = imageRes.headers.get('Content-Type')

        let embeddedImage

        if (contentType === 'image/png') {
          embeddedImage = await pdfDoc.embedPng(imageBytes)
        } else if (
          contentType === 'image/jpeg' ||
          contentType === 'image/jpg'
        ) {
          embeddedImage = await pdfDoc.embedJpg(imageBytes)
        } else {
          console.warn('Unsupported image type:', contentType)
          continue
        }

        // Scale the image to a consistent width (e.g., 100pt)
        const targetWidth = 100
        const scaleFactor = targetWidth / embeddedImage.width
        const scaled = embeddedImage.scale(scaleFactor)

        // Convert canvas Y (top-left origin) to PDF Y (bottom-left origin)
        const pdfY = pageHeight - item.y - scaled.height

        // 3. Draw the image
        page.drawImage(embeddedImage, {
          x: item.x,
          y: pdfY,
          width: scaled.width,
          height: scaled.height,
        })
      }

      // 4. Save and trigger download
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'signed_document.pdf'
      link.click()

      toast.success('PDF downloaded successfully!', {
        id: toastIdRef.current,
      })
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download PDF', { id: toastIdRef.current })
    } finally {
      toastIdRef.current = null
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { data: pdfList } = await supabase.storage
        .from('documents')
        .list(`uploads/${user.id}`)

      if (pdfList?.length) {
        const latestPdf = pdfList[pdfList.length - 1]
        const {
          data: { publicUrl },
        } = supabase.storage
          .from('documents')
          .getPublicUrl(`uploads/${user.id}/${latestPdf.name}`)

        setPdfUrl(publicUrl)
      }

      const { data: sigs } = await supabase.storage
        .from('documents')
        .list(`signatures/${user.id}`)

      const signatureUrls = await Promise.all(
        sigs.map((sig) =>
          supabase.storage
            .from('documents')
            .getPublicUrl(`signatures/${user.id}/${sig.name}`)
        )
      )

      setSignatures(
        signatureUrls.map((res, i) => ({
          name: sigs[i].name,
          url: res.data.publicUrl,
        }))
      )
    }

    fetchData()
  }, [])

  const handleDrop = (e) => {
    e.preventDefault()
    const signatureUrl = e.dataTransfer.getData('text/plain')
    const bounds = pdfWrapperRef.current.getBoundingClientRect()

    const x = e.clientX - bounds.left
    const y = e.clientY - bounds.top

    // Check bounds
    if (x >= 0 && y >= 0 && x <= bounds.width && y <= bounds.height) {
      setDroppedItems((prev) => [
        ...prev,
        { url: signatureUrl, x, y, width: 96, height: 32 },
      ])
    }
  }

  return (
    <div className="flex h-screen pt-20 overflow-hidden">
      {/* Left: Signatures Panel */}
      <div className="w-1/4 bg-muted p-4 border-r overflow-auto">
        <h2 className="text-lg font-semibold mb-4">Your Signatures</h2>
        {signatures.map((sig) => (
          <img
            key={sig.name}
            src={sig.url}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', sig.url)}
            className="w-24 h-auto cursor-grab mb-4 border rounded shadow"
            alt="Signature"
          />
        ))}
        <button
          className="mt-8 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          onClick={downloadPdf}
        >
          Download Signed PDF
        </button>
      </div>

      {/* Right: PDF Panel */}
      <div className="flex-1 flex justify-center items-start p-4 overflow-auto">
        {pdfUrl ? (
          <div
            className="relative"
            ref={pdfWrapperRef}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <Document file={pdfUrl}>
              <Page pageNumber={1} width={600} />
            </Document>

            {/* Dropped Signatures */}
            {droppedItems.map((item, index) => (
              <Rnd
                key={index}
                bounds="parent"
                default={{
                  x: item.x,
                  y: item.y,
                  width: item.width,
                  height: item.height,
                }}
                onDragStop={(e, d) => {
                  const newItems = [...droppedItems]
                  newItems[index].x = d.x
                  newItems[index].y = d.y
                  setDroppedItems(newItems)
                }}
                onResizeStop={(e, dir, ref, delta, pos) => {
                  const newItems = [...droppedItems]
                  newItems[index] = {
                    ...newItems[index],
                    width: parseInt(ref.style.width),
                    height: parseInt(ref.style.height),
                    x: pos.x,
                    y: pos.y,
                  }
                  setDroppedItems(newItems)
                }}
              >
                <img
                  src={item.url}
                  alt="Signature"
                  className="w-full h-full object-contain cursor-move"
                />
              </Rnd>
            ))}
          </div>
        ) : (
          <p>Loading PDF...</p>
        )}
      </div>
    </div>
  )
}

export default Signature
