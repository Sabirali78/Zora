import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminNavbar from '@/components/AdminNavbar';

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
  const { adminName } = usePage().props;
  const { errors } = usePage().props;
  const [darkMode, setDarkMode] = useState(
    window.localStorage.getItem('theme') === 'dark'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: checked }));
    } else if (type === 'file') {
      setImageFiles(Array.from(files));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
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
    
    // Append image files
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
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded shadow max-w-2xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold mb-2">Create Article</h1>
          
          {errors && Object.keys(errors).length > 0 && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded">
              {Object.values(errors).map((err, i) => (
                <div key={i}>{err}</div>
              ))}
            </div>
          )}

          {/* Title Field */}
          <div className="mb-2">
            <label className="block mb-1 font-medium">Title</label>
            <input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" 
              required
            />
          </div>

          {/* Summary Field */}
          <div className="mb-2">
            <label className="block mb-1 font-medium">Summary</label>
            <textarea 
              name="summary" 
              value={form.summary} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" 
              rows={2} 
              required
            />
          </div>

          {/* Content Field */}
          <div className="mb-2">
            <label className="block mb-1 font-medium">Content</label>
            <textarea 
              name="content" 
              value={form.content} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" 
              rows={4} 
              required
            />
          </div>

          {/* Other Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Category</label>
              <select 
                name="category" 
                value={form.category} 
                onChange={handleChange} 
                className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" 
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
              <label className="block mb-1 font-medium">Tags (comma separated)</label>
              <input 
                name="tags" 
                value={form.tags} 
                onChange={handleChange} 
                className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" 
                placeholder="tag1, tag2, tag3"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Author</label>
              <input 
                name="author" 
                value={form.author} 
                onChange={handleChange} 
                className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" 
                required
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Slug (URL-friendly)</label>
              <input 
                name="slug" 
                value={form.slug} 
                onChange={handleChange} 
                className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" 
                placeholder="auto-generated if empty"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Image URL (optional)</label>
              <input 
                name="image_url" 
                value={form.image_url} 
                onChange={handleChange} 
                className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" 
                placeholder="https://..."
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Image Public ID (optional)</label>
              <input 
                name="image_public_id" 
                value={form.image_public_id} 
                onChange={handleChange} 
                className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" 
                placeholder="cloudinary-public-id"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Additional Images (optional)</label>
            <input 
              name="images" 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" 
            />
            {imageFiles && imageFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {imageFiles.map((file, idx) => (
                  <div key={idx} className="w-20 h-16 border rounded overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <img src={URL.createObjectURL(file)} alt="Preview" className="object-cover w-full h-full" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input 
              type="checkbox" 
              id="is_featured" 
              name="is_featured" 
              checked={form.is_featured} 
              onChange={handleChange} 
              className="h-4 w-4 rounded"
            />
            <label htmlFor="is_featured" className="font-medium">
              Mark as Featured Article
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isSubmitting ? 'Creating...' : 'Create Article'}
          </button>
        </form>
      </div>
    </div>
  );
}