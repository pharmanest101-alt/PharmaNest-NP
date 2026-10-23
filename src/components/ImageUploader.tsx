import { useState, useRef, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import toast from 'react-hot-toast'
import { BsImage, BsX, BsCheck, BsTrash } from 'react-icons/bs'
import { supabaseAdmin as supabase } from '../lib/supabase'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  bucket?: string
  folder?: string
  aspect?: number
  label?: string
  className?: string
}

function getCroppedImg(imageSrc: string, pixelCrop: { x: number; y: number; width: number; height: number }): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = pixelCrop.width
      canvas.height = pixelCrop.height
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('No context')); return }
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      )
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Canvas toBlob failed'))
      }, 'image/jpeg', 0.9)
    }
    image.onerror = () => reject(new Error('Failed to load image'))
    image.src = imageSrc
  })
}

export default function ImageUploader({
  value,
  onChange,
  bucket = 'images',
  folder = 'uploads',
  aspect = 1,
  label = 'Photo',
  className = '',
}: ImageUploaderProps) {
  const [showCrop, setShowCrop] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setImageSrc(reader.result as string)
      setShowCrop(true)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }, [])

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleUpload = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return
    setUploading(true)
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
      const fileExt = 'jpg'
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, croppedImage, { contentType: 'image/jpeg', upsert: false })

      if (uploadError) {
        toast.error('Upload failed: ' + uploadError.message)
        setUploading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      onChange(urlData.publicUrl)
      setShowCrop(false)
      setImageSrc(null)
      toast.success('Image uploaded!')
    } catch (err) {
      toast.error('Failed to process image')
    } finally {
      setUploading(false)
    }
  }, [imageSrc, croppedAreaPixels, bucket, folder, onChange])

  const handleCancel = () => {
    setShowCrop(false)
    setImageSrc(null)
  }

  const handleRemove = () => {
    onChange('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-carbon mb-2">{label}</label>

      {/* Current Image Preview */}
      {value && !showCrop && (
        <div className="relative inline-block mb-3">
          <img src={value} alt="Preview" className="w-32 h-32 object-cover rounded-card border border-hairline" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <BsX size={14} />
          </button>
        </div>
      )}

      {/* Upload Button */}
      {!showCrop && (
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
            id={`upload-${label}`}
          />
          <label
            htmlFor={`upload-${label}`}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-frost hover:bg-hairline rounded-card text-sm font-medium text-carbon transition-colors"
          >
            <BsImage /> {value ? 'Change Photo' : 'Upload Photo'}
          </label>
          {value && (
            <button type="button" onClick={handleRemove} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-card transition-colors">
              <BsTrash /> Remove
            </button>
          )}
        </div>
      )}

      {/* Crop Modal */}
      {showCrop && imageSrc && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-card shadow-2xl w-full max-w-lg overflow-hidden" data-ui>
            <div className="flex items-center justify-between p-4 border-b border-hairline" data-ui>
              <h3 className="text-lg font-semibold text-carbon">Crop Image</h3>
              <button onClick={handleCancel} className="p-1 hover:bg-frost rounded-card">
                <BsX size={20} />
              </button>
            </div>

            <div className="relative w-full h-80 bg-carbon">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-carbon mb-1">Zoom</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-[#047857]"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancel}
                  className="btn-secondary inline-flex items-center gap-2"
                  disabled={uploading}
                >
                  <BsX /> Cancel
                </button>
                <button
                  onClick={handleUpload}
                  className="btn-primary inline-flex items-center gap-2"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <BsCheck /> Crop & Upload
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
