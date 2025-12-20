import React, { useState, useEffect, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminNavbar from '@/components/AdminNavbar';
import { X, Upload, Image, Trash2, Edit } from 'lucide-react';

const initialForm = (article) => ({
  title: article.title || '',
  summary: article.summary || '',
  content: article.content || '',
  category: article.category || '',
  tags: article.tags || '',
  images: [],
  author: article.author || 'Admin',
  is_featured: !!article.is_featured,
  image_url: article.image_url || '',
  image_public_id: article.image_public_id || '',
  slug: article.slug || '',
});

export default function EditArticle({ article }) {
  const [form, setForm] = useState(initialForm(article));
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [existingImages, setExistingImages] = useState(article.images || []);
  const { errors, adminName } = usePage().props;
  const [darkMode, setDarkMode] = useState(
    window.localStorage.getItem('theme') === 'dark'
  );
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const mainImageInputRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: checked }));
    } else if (type === 'file') {
      if (name === 'images') {
        handleMultipleImages(files);
      } else if (name === 'main_image') {
        handleMainImage(files[0]);
      }
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleMultipleImages = (files) => {
    if (!files || files.length === 0) return;
    
    const newFiles = Array.from(files);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    
    setImageFiles(prev => [...prev, ...newFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
    
    // Update form with file objects
    setForm(f => ({ 
      ...f, 
      images: [...f.images, ...newFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }))]
    }));
  };

  const handleMainImage = (file) => {
    if (!file) return;
    setMainImageFile(file);
    
    // If user uploads main image, clear the URL field
    setForm(f => ({ ...f, image_url: '' }));
  };

  const removeNewImage = (index) => {
    const updatedFiles = [...imageFiles];
    const updatedPreviews = [...imagePreviews];
    
    // Revoke object URL
    URL.revokeObjectURL(updatedPreviews[index]);
    
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    
    setImageFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
    
    // Update form
    setForm(f => ({
      ...f,
      images: f.images.filter((_, i) => i !== index)
    }));
  };

  const removeMainImage = () => {
    setMainImageFile(null);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    
    // Append all form fields
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'is_featured') {
        data.append(key, value ? 1 : 0);
      } else if (key === 'images' || key === 'main_image') {
        return;
      } else {
        data.append(key, value ?? '');
      }
    });
    
    // Append main image file
    if (mainImageFile) {
      data.append('main_image', mainImageFile);
    }
    
    // Append additional image files
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        data.append('images[]', file);
      });
    }
    
    router.post(route('admin.articles.update', { id: article.id }), data, {
      forceFormData: true,
      onSuccess: () => {
        setLoading(false);
      },
      onError: () => setLoading(false),
      onFinish: () => setLoading(false),
    });
  };

  // Category options
  const categoryOptions = [
    { value: 'News', label: 'News' },
    { value: 'Opinion', label: 'Opinion' },
    { value: 'Analysis', label: 'Analysis' },
    { value: 'Mystery / Fiction', label: 'Mystery / Fiction' },
    { value: 'Stories / Creative', label: 'Stories / Creative' },
    { value: 'Miscellaneous', label: 'Miscellaneous' },
  ];

// Remove existing image
// Remove existing image - DEBUG VERSION
const handleRemoveImage = (imageId) => {
  if (!window.confirm('Are you sure you want to remove this image?')) return;
  
  console.log('DEBUG - Starting image removal:');
  console.log('Article ID:', article.id);
  console.log('Image ID:', imageId);
  console.log('Full URL:', `/admin/articles/${article.id}/remove-image/${imageId}`);
  
  // Test the route first
  fetch(`/admin/articles/${article.id}/remove-image/${imageId}`, {
    method: 'GET', // Just to check if route exists
  })
  .then(response => {
    console.log('Route test response:', response.status, response.statusText);
    if (response.status === 405) {
      console.log('Good! Route exists but wrong method (expected)');
    }
  })
  .catch(error => {
    console.error('Route test error:', error);
  });
  
  // Now try the actual POST
  router.post(`/admin/articles/${article.id}/remove-image/${imageId}`, {}, {
    onSuccess: (response) => {
      console.log('Success response:', response);
      setExistingImages(existingImages.filter(img => img.id !== imageId));
      alert('Image removed successfully!');
    },
    onError: (errors) => {
      console.error('Error response:', errors);
      alert('Error removing image. Check console for details.');
    },
    preserveScroll: true,
  });
};
  // Get image URL
  const getImageUrl = (img) => {
    if (img.path.startsWith('http')) return img.path;
    return `/storage/${img.path.replace(/^storage\//, '')}`;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <AdminNavbar adminName={adminName} darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Edit Article</h1>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Edit className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                ID: {article.id}
              </span>
            </div>
          </div>
          
          {/* Loading and Error States */}
          {loading && (
            <div className="mb-4 p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-300 dark:border-blue-700">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Updating article...</span>
              </div>
            </div>
          )}
          
          {errors && Object.keys(errors).length > 0 && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg border border-red-300 dark:border-red-700">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <X className="h-5 w-5" />
                Please fix the following errors:
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {Object.values(errors).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Title</label>
              <input 
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Category</label>
              <select 
                name="category" 
                value={form.category} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                required
              >
                <option value="">Select Category</option>
                {categoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Summary</label>
            <textarea 
              name="summary" 
              value={form.summary} 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              rows={3}
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Content</label>
            <textarea 
              name="content" 
              value={form.content} 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[400px]" 
              rows={8}
              required
            />
          </div>

          {/* Author and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Author</label>
              <input 
                name="author" 
                value={form.author} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Tags (comma separated)</label>
              <input 
                name="tags" 
                value={form.tags} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                placeholder="technology, news, analysis, etc."
              />
            </div>
          </div>

          {/* Slug and Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Slug (URL-friendly)</label>
              <input 
                name="slug" 
                value={form.slug} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                placeholder="auto-generated-if-empty"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Leave empty to auto-generate from title
              </p>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <label htmlFor="is_featured" className="font-medium text-gray-700 dark:text-gray-300">
                  Mark as Featured Article
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Featured articles appear prominently
                </p>
              </div>
              <div className="relative">
                <input 
                  type="checkbox" 
                  id="is_featured" 
                  name="is_featured" 
                  checked={form.is_featured} 
                  onChange={handleChange} 
                  className="sr-only"
                />
                <label 
                  htmlFor="is_featured" 
                  className={`block w-14 h-8 rounded-full cursor-pointer transition-colors ${
                    form.is_featured ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span className={`block w-6 h-6 mt-1 ml-1 rounded-full bg-white transform transition-transform ${
                    form.is_featured ? 'translate-x-6' : ''
                  }`} />
                </label>
              </div>
            </div>
          </div>

          {/* Main Image Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Main Image</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Main Image */}
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Current Main Image</label>
                {article.image_url ? (
                  <div className="relative group">
                    <img 
                      src={article.image_url} 
                      alt="Current main" 
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600" 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-white font-medium">Current Main Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">No main image set</span>
                  </div>
                )}
                
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Image URL (or upload below)</label>
                  <input 
                    name="image_url" 
                    value={form.image_url} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    placeholder="https://example.com/image.jpg"
                    disabled={mainImageFile}
                  />
                </div>
              </div>
              
              {/* New Main Image Upload */}
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Upload New Main Image</label>
                <div 
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-blue-400 dark:hover:border-blue-400 transition-colors cursor-pointer h-48 flex flex-col items-center justify-center"
                  onClick={() => mainImageInputRef.current?.click()}
                >
                  <input 
                    ref={mainImageInputRef}
                    type="file" 
                    name="main_image"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                  {mainImageFile ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={URL.createObjectURL(mainImageFile)} 
                        alt="New main preview" 
                        className="w-full h-full object-cover rounded" 
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMainImage();
                        }}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 font-medium">Click to upload new main image</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Will replace current main image</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Image Public ID (optional - for cloudinary)</label>
              <input 
                name="image_public_id" 
                value={form.image_public_id} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                placeholder="cloudinary-public-id"
              />
            </div>
          </div>

          {/* Existing Additional Images */}
          {existingImages.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Existing Additional Images</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {existingImages.map((img) => (
                  <div key={img.id} className="relative group">
                    <img 
                      src={getImageUrl(img)} 
                      alt="Existing" 
                      className="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600" 
                    />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveImage(img.id)} 
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-transform transform scale-0 group-hover:scale-100"
                      title="Remove image"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate px-1">
                      {img.original_name || 'Image'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Additional Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Add New Additional Images</h3>
            
            <div 
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                name="images"
                accept="image/*"
                multiple
                onChange={handleChange}
                className="hidden"
              />
              <Image className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-700 dark:text-gray-300 font-medium">Click to upload additional images</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Upload multiple images (will be added to images table)
              </p>
              <button
                type="button"
                className="mt-3 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </button>
            </div>
            
            {/* New Image Previews */}
            {imagePreviews.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">New Images to Upload:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={preview} 
                        alt={`New upload ${index + 1}`} 
                        className="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600" 
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-transform transform scale-0 group-hover:scale-100"
                      >
                        <X size={14} />
                      </button>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate px-1">
                        {imageFiles[index]?.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => router.visit(route('admin.articles'))}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className={`flex-1 py-3 px-6 rounded-lg font-medium text-white transition-all ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                } flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <span>Update Article</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}