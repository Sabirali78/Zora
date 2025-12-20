import React, { useState, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminNavbar from '@/components/AdminNavbar';
import { X, Upload, Image } from 'lucide-react';

const initialForm = {
  title: '',
  summary: '',
  content: '',
  category: '',
  tags: '',
  images: [], // for multiple uploads
  author: 'Admin',
  is_featured: false,
  image_url: '',
  image_public_id: '',
  slug: '',
};

export default function CreateArticle() {
  const [form, setForm] = useState(initialForm);
  const [imageFiles, setImageFiles] = useState([]); // for multiple images
  const [imagePreviews, setImagePreviews] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const { adminName } = usePage().props;
  const { errors } = usePage().props;
  const [darkMode, setDarkMode] = useState(
    window.localStorage.getItem('theme') === 'dark'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const mainImageInputRef = useRef(null);

  React.useEffect(() => {
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
    
    // Update form with file objects for backend
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

  const removeImage = (index) => {
    const updatedFiles = [...imageFiles];
    const updatedPreviews = [...imagePreviews];
    
    // Revoke object URL to prevent memory leaks
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
    setIsSubmitting(true);
    
    const data = new FormData();
    
    // Append all form fields
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'is_featured') {
        data.append(key, value ? 1 : 0);
      } else if (key === 'images') {
        // Skip the images array, handle files separately
        return;
      } else {
        data.append(key, value ?? '');
      }
    });
    
    // Append main image if uploaded
    if (mainImageFile) {
      data.append('main_image', mainImageFile);
    }
    
    // Append multiple image files
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file, idx) => {
        data.append('images[]', file);
      });
    }
    
    console.log('Submitting form data:', Object.fromEntries(data));
    
    router.post(route('admin.articles.store'), data, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
        setForm(initialForm);
        setImageFiles([]);
        setImagePreviews([]);
        setMainImageFile(null);
      },
      onError: (errors) => {
        setIsSubmitting(false);
        console.log('Form errors:', errors);
      },
      onFinish: () => {
        setIsSubmitting(false);
      }
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

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <AdminNavbar adminName={adminName} darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Create New Article</h1>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">+</span>
              </div>
            </div>
          </div>
          
          {errors && Object.keys(errors).length > 0 && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg border border-red-300 dark:border-red-700">
              <h3 className="font-bold mb-2">Please fix the following errors:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {Object.values(errors).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Title Field */}
          <div className="mb-2">
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" 
              placeholder="Enter article title"
              required
            />
          </div>

          {/* Summary Field */}
          <div className="mb-2">
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Summary</label>
            <textarea 
              name="summary" 
              value={form.summary} 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" 
              rows={3}
              placeholder="Brief summary of the article"
              required
            />
          </div>

          {/* Content Field */}
          <div className="mb-2">
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Content</label>
            <textarea 
              name="content" 
              value={form.content} 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all min-h-[300px]" 
              rows={8}
              placeholder="Write your article content here..."
              required
            />
          </div>

          {/* Category and Tags Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Category</label>
              <select 
                name="category" 
                value={form.category} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" 
                required
              >
                <option value="">Select Category</option>
                {categoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Tags (comma separated)</label>
              <input 
                name="tags" 
                value={form.tags} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" 
                placeholder="technology, news, analysis, etc."
              />
            </div>
          </div>

          {/* Author and Slug Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Author</label>
              <input 
                name="author" 
                value={form.author} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" 
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Slug (URL-friendly)</label>
              <input 
                name="slug" 
                value={form.slug} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" 
                placeholder="auto-generated-from-title"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Leave empty to auto-generate from title
              </p>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-6">
            {/* Main Image Upload */}
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Main Image</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Image URL (optional)</label>
                  <input 
                    name="image_url" 
                    value={form.image_url} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" 
                    placeholder="https://example.com/image.jpg"
                    disabled={mainImageFile}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Upload Main Image</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-red-400 dark:hover:border-red-400 transition-colors cursor-pointer"
                       onClick={() => mainImageInputRef.current?.click()}>
                    <input 
                      ref={mainImageInputRef}
                      type="file" 
                      name="main_image"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                    {mainImageFile ? (
                      <div className="relative">
                        <img 
                          src={URL.createObjectURL(mainImageFile)} 
                          alt="Main preview" 
                          className="w-full h-32 object-cover rounded"
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
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 dark:text-gray-400">Click to upload main image</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">PNG, JPG, GIF up to 4MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Images Upload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium text-gray-700 dark:text-gray-300">Additional Images</label>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {imageFiles.length} image(s) selected
                </span>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-red-400 dark:hover:border-red-400 transition-colors cursor-pointer"
                   onClick={() => fileInputRef.current?.click()}>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleChange}
                  className="hidden"
                />
                <Image className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-700 dark:text-gray-300 font-medium">Drag & drop or click to upload</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Upload multiple images (will be stored in images table)
                </p>
                <button
                  type="button"
                  className="mt-3 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse Files
                </button>
              </div>
              
              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Selected Images:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`} 
                          className="w-full h-24 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-transform transform scale-0 group-hover:scale-100"
                        >
                          <X size={14} />
                        </button>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                          {imageFiles[index]?.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Image Public ID and Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Image Public ID (optional)</label>
              <input 
                name="image_public_id" 
                value={form.image_public_id} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" 
                placeholder="cloudinary-public-id"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <label htmlFor="is_featured" className="font-medium text-gray-700 dark:text-gray-300">
                  Mark as Featured Article
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Featured articles appear prominently on the homepage
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
                    form.is_featured ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span className={`block w-6 h-6 mt-1 ml-1 rounded-full bg-white transform transition-transform ${
                    form.is_featured ? 'translate-x-6' : ''
                  }`} />
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
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
                disabled={isSubmitting}
                className={`flex-1 py-3 px-6 rounded-lg font-medium text-white transition-all ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl'
                } flex items-center justify-center gap-2`}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <span>Create Article</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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