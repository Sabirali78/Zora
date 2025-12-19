import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminNavbar from '@/components/AdminNavbar';

const initialForm = (article) => ({
  language: article.language || 'en',
  title: article.title || '',
  summary: article.summary || '',
  content: article.content || '',
  title_urdu: article.title_urdu || '',
  summary_urdu: article.summary_urdu || '',
  content_urdu: article.content_urdu || '',
  category: article.category || '',
  tags: article.tags || '',
  images: [], // for new uploads
  author: article.author || 'Admin',
  is_featured: !!article.is_featured,
  image_url: article.image_url || '',
  image_public_id: article.image_public_id || '',
  slug: article.slug || '',
});

export default function EditArticle({ article }) {
  const [form, setForm] = useState(initialForm(article));
  const [imageFiles, setImageFiles] = useState([]); // for new uploads
  const [mainImageFile, setMainImageFile] = useState(null); // for main image
  const [existingImages, setExistingImages] = useState(article.images || []); // for showing/removing
  const { errors, adminName } = usePage().props;
  const [darkMode, setDarkMode] = useState(
    window.localStorage.getItem('theme') === 'dark'
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: checked }));
    } else if (type === 'file') {
      if (name === 'images') {
        setImageFiles(Array.from(files));
      } else if (name === 'main_image') {
        setMainImageFile(files[0]);
      }
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleLanguageChange = e => {
    const lang = e.target.value;
    setForm(f => ({ ...f, language: lang }));
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
        // Skip these, handle files separately
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
      imageFiles.forEach((file, idx) => {
        data.append('images[]', file);
      });
    }
    
    router.post(route('admin.articles.update', { id: article.id }), data, {
      forceFormData: true,
      onSuccess: () => {
        setLoading(false);
        // Refresh the page to get updated data
        window.location.reload();
      },
      onError: () => setLoading(false),
      onFinish: () => setLoading(false),
    });
  };

  // Category options (updated to match your table structure)
// In EditArticle.jsx
const categoryOptions = [
  { value: 'News', label: 'News' },
  { value: 'Opinion', label: 'Opinion' },
  { value: 'Analysis', label: 'Analysis' },
  { value: 'Mystery / Fiction', label: 'Mystery / Fiction' },
  { value: 'Stories / Creative', label: 'Stories / Creative' },
  { value: 'Miscellaneous', label: 'Miscellaneous' },
];

  // Remove image handler
  function handleRemoveImage(imageId) {
    if (!window.confirm('Remove this image?')) return;
    router.post(`/admin/articles/${article.id}/remove-image/${imageId}`, {}, {
      onSuccess: () => setExistingImages(existingImages.filter(img => img.id !== imageId)),
      preserveScroll: true,
    });
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <AdminNavbar adminName={adminName} darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded shadow max-w-2xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold mb-2">Edit Article</h1>
          
          {loading && <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">Updating...</div>}
          {errors && Object.keys(errors).length > 0 && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded">
              {Object.values(errors).map((err, i) => (
                <div key={i}>{err}</div>
              ))}
            </div>
          )}
          
          {/* Language Selection */}
          <div className="mb-2">
            <label className="block mb-1 font-medium">Language</label>
            <select 
              name="language" 
              value={form.language} 
              onChange={handleLanguageChange} 
              className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="en">English</option>
              <option value="ur">Urdu</option>
              <option value="multi">Multi-language</option>
            </select>
          </div>
          
          {/* English Fields */}
          {(form.language === 'en' || form.language === 'multi') && (
            <div className="space-y-2">
              <label className="block mb-1 font-medium">Title (English)</label>
              <input 
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" 
                required={form.language !== 'ur'} 
                disabled={form.language === 'ur'} 
              />
              <label className="block mb-1 font-medium">Summary (English)</label>
              <textarea 
                name="summary" 
                value={form.summary} 
                onChange={handleChange} 
                className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" 
                rows={2} 
                required={form.language !== 'ur'} 
                disabled={form.language === 'ur'} 
              />
              <label className="block mb-1 font-medium">Content (English)</label>
              <textarea 
                name="content" 
                value={form.content} 
                onChange={handleChange} 
                className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" 
                rows={4} 
                required={form.language !== 'ur'} 
                disabled={form.language === 'ur'} 
              />
            </div>
          )}
          
          {/* Urdu Fields */}
          {(form.language === 'ur' || form.language === 'multi') && (
            <div className="space-y-2">
              <label className="block mb-1 font-medium">Title (Urdu)</label>
              <input 
                name="title_urdu" 
                value={form.title_urdu} 
                onChange={handleChange} 
                className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" 
                required={form.language !== 'en'} 
                disabled={form.language === 'en'} 
              />
              <label className="block mb-1 font-medium">Summary (Urdu)</label>
              <textarea 
                name="summary_urdu" 
                value={form.summary_urdu} 
                onChange={handleChange} 
                className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" 
                rows={2} 
                required={form.language !== 'en'} 
                disabled={form.language === 'en'} 
              />
              <label className="block mb-1 font-medium">Content (Urdu)</label>
              <textarea 
                name="content_urdu" 
                value={form.content_urdu} 
                onChange={handleChange} 
                className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" 
                rows={4} 
                required={form.language !== 'en'} 
                disabled={form.language === 'en'} 
              />
            </div>
          )}
          
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
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
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
          
          {/* Main Image Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Current Main Image URL</label>
                {article.image_url && (
                  <div className="mt-2">
                    <img 
                      src={article.image_url} 
                      alt="Current main" 
                      className="w-32 h-32 object-cover rounded border" 
                    />
                    <p className="text-sm text-gray-500 mt-1 truncate">{article.image_url}</p>
                  </div>
                )}
                <input 
                  name="image_url" 
                  value={form.image_url} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 mt-2" 
                  placeholder="https://..."
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Upload New Main Image</label>
                <input 
                  name="main_image" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" 
                />
                {mainImageFile && (
                  <div className="mt-2">
                    <img 
                      src={URL.createObjectURL(mainImageFile)} 
                      alt="New main preview" 
                      className="w-32 h-32 object-cover rounded border" 
                    />
                    <p className="text-sm text-gray-500 mt-1">{mainImageFile.name}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Image Public ID (optional - for cloudinary)</label>
              <input 
                name="image_public_id" 
                value={form.image_public_id} 
                onChange={handleChange} 
                className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" 
                placeholder="cloudinary-public-id"
              />
            </div>
          </div>
          
          {/* Additional Images */}
          <div>
            <label className="block mb-1 font-medium">Existing Additional Images</label>
            {existingImages && existingImages.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {existingImages.map((img, idx) => (
                  <div key={img.id} className="relative w-20 h-16 border rounded overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <img 
                      src={img.path.startsWith('http') ? img.path : `/storage/${img.path.replace(/^storage\//, '')}`} 
                      alt="Existing" 
                      className="object-cover w-full h-full" 
                    />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveImage(img.id)} 
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-bl px-1 text-xs hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No additional images</p>
            )}
          </div>
          
          {/* Add New Additional Images */}
          <div>
            <label className="block mb-1 font-medium">Add New Additional Images (optional)</label>
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
                  <div key={idx} className="relative w-20 h-16 border rounded overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <img src={URL.createObjectURL(file)} alt="New upload" className="object-cover w-full h-full" />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Featured Checkbox */}
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
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Updating...' : 'Update Article'}
          </button>
        </form>
      </div>
    </div>
  );
}