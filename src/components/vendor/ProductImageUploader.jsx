import React, { useState, useEffect } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { normalizeProductImage } from '../../utils/productImages';

const ProductImageUploader = ({ 
  maxImages = 4, 
  maxSizeMB = 5, 
  initialImages = [], 
  onImagesChange 
}) => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      const initialPreviews = initialImages.map(img => 
        typeof img === 'string' ? normalizeProductImage(img) : URL.createObjectURL(img)
      );
      setPreviews(initialPreviews);
      setImages(initialImages);
    }
  }, [initialImages]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (images.length + files.length > maxImages) {
      toast.error(`You can only upload a maximum of ${maxImages} images`);
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    files.forEach(file => {
      if (!file.type.match('image.*')) {
        toast.error(`${file.name} is not a valid image file`);
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`${file.name} exceeds the ${maxSizeMB}MB limit`);
        return;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    if (validFiles.length > 0) {
      const updatedImages = [...images, ...validFiles];
      const updatedPreviews = [...previews, ...newPreviews];
      setImages(updatedImages);
      setPreviews(updatedPreviews);
      onImagesChange(updatedImages);
    }
    
    // Reset input
    e.target.value = null;
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    
    // Revoke object URL to avoid memory leaks
    if (images[index] instanceof File) {
      URL.revokeObjectURL(previews[index]);
    }

    setImages(updatedImages);
    setPreviews(updatedPreviews);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label className="block text-[12px] font-extrabold text-slate-700 uppercase tracking-wider">
          Product Images ({images.length}/{maxImages})
        </label>
        <p className="mt-1 text-[11px] font-medium text-slate-500">
          Upload up to {maxImages} images. First image will be used as the cover image.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative aspect-square rounded-xl border border-slate-200 overflow-hidden group">
            <img 
              src={preview} 
              alt={`Preview ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            {index === 0 && (
              <div className="absolute top-0 left-0 w-full bg-[#1E3A8A]/80 text-white text-[10px] font-bold text-center py-1.5 uppercase tracking-wider backdrop-blur-sm shadow-sm">
                Cover Image
              </div>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeImage(index);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <div className="relative aspect-square rounded-xl border-2 border-slate-200 border-dashed hover:border-[#1E3A8A] hover:bg-blue-50/50 transition-colors bg-slate-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden group">
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-[#1E3A8A] transition-colors mb-2" />
            <span className="text-[11px] font-extrabold text-[#1E3A8A]">Add Image</span>
            <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Max {maxSizeMB}MB</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageUploader;
