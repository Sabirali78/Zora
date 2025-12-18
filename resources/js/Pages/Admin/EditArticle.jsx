
import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
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
  region: article.region || '',
  country: article.country || '',
  type: article.type || '',
  tags: article.tags || '',
  images: [], // for new uploads
  author: article.author || 'Admin',
  is_featured: !!article.is_featured,
  is_trending: !!article.is_trending,
  is_breaking: !!article.is_breaking,
  is_top_story: !!article.is_top_story,
  show_in_section: !!article.show_in_section,
  section_priority: article.section_priority || '',
  slug: article.slug || '',
});

export default function EditArticle({ article }) {
  const [form, setForm] = useState(initialForm(article));
  const [imageFiles, setImageFiles] = useState([]); // for new uploads
  const [existingImages, setExistingImages] = useState(article.images || []); // for showing/removing
  const { errors, currentLanguage: lang, adminName } = usePage().props;
  const currentLanguage = lang || 'en';
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
      setImageFiles(Array.from(files));
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
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'image') return;
      // Always send 1 or 0 for all boolean fields
      if ([
        'is_featured',
        'is_trending',
        'is_breaking',
        'is_top_story',
        'show_in_section'
      ].includes(key)) {
        data.append(key, value ? 1 : 0);
      } else {
        data.append(key, value);
      }
    });
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file, idx) => {
        data.append('images[]', file);
      });
    }
    router.post(route('admin.articles.update', { id: article.id }), data, {
      forceFormData: true,
      onFinish: () => setLoading(false),
    });
  };

  // Category and region options (from Header.jsx)
  const categoryOptions = [
    { value: 'politics', label: 'Politics' },
    { value: 'sports', label: 'Sports' },
    { value: 'technology', label: 'Technology' },
    { value: 'health', label: 'Health' },
    { value: 'business', label: 'Business' },
    { value: 'science', label: 'Science' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'environment', label: 'Environment' },
    { value: 'education', label: 'Education' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'arts-culture', label: 'Arts & Culture' },
    { value: 'weather', label: 'Weather' },
    { value: 'food', label: 'Food' },
    { value: 'travel', label: 'Travel' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'news', label: 'News' },
  ];
  const regionOptions = [
    { value: 'asia', label: 'Asia' },
    { value: 'america', label: 'America' },
    { value: 'africa', label: 'Africa' },
    { value: 'europe', label: 'Europe' },
    { value: 'middle-east', label: 'Middle East' },
  ];
  const typeOptions = [
    { value: 'standard', label: 'Standard' },
    { value: 'breaking', label: 'Breaking' },
    { value: 'exclusive', label: 'Exclusive' },
    { value: 'investigation', label: 'Investigation' },
    { value: 'analysis', label: 'Analysis' },
    { value: 'feature', label: 'Feature' },
    { value: 'interview', label: 'Interview' },
    { value: 'opinion', label: 'Opinion' },
    { value: 'editorial', label: 'Editorial' },
    { value: 'factCheck', label: 'Fact Check' },
    { value: 'live', label: 'Live' },
    { value: 'obituary', label: 'Obituary' },
    { value: 'review', label: 'Review' },
    { value: 'news', label: 'News' },
  ];

  // Remove image handler (must be above return)
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
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded shadow max-w-2xl w-full m-auto space-y-6">
        <h1 className="text-2xl font-bold mb-2">Edit Article</h1>
        {loading && <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">Updating...</div>}
        {errors && Object.keys(errors).length > 0 && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {Object.values(errors).map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </div>
        )}
        {/* Language Selection */}
        <div className="mb-2">
          <label className="block mb-1 font-medium">Language</label>
          <select name="language" value={form.language} onChange={handleLanguageChange} className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600">
            <option value="en">English</option>
            <option value="ur">Urdu</option>
            <option value="multi">Multi-language</option>
          </select>
        </div>
        {/* English Fields */}
        {(form.language === 'en' || form.language === 'multi') && (
          <div className="space-y-2">
            <label className="block mb-1 font-medium">Title (English)</label>
            <input name="title" value={form.title} onChange={handleChange} className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" required={form.language !== 'ur'} disabled={form.language === 'ur'} />
            <label className="block mb-1 font-medium">Summary (English)</label>
            <textarea name="summary" value={form.summary} onChange={handleChange} className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" rows={2} required={form.language !== 'ur'} disabled={form.language === 'ur'} />
            <label className="block mb-1 font-medium">Content (English)</label>
            <textarea name="content" value={form.content} onChange={handleChange} className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" rows={4} required={form.language !== 'ur'} disabled={form.language === 'ur'} />
          </div>
        )}
        {/* Urdu Fields */}
        {(form.language === 'ur' || form.language === 'multi') && (
          <div className="space-y-2">
            <label className="block mb-1 font-medium">Title (Urdu)</label>
            <input name="title_urdu" value={form.title_urdu} onChange={handleChange} className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" required={form.language !== 'en'} disabled={form.language === 'en'} />
            <label className="block mb-1 font-medium">Summary (Urdu)</label>
            <textarea name="summary_urdu" value={form.summary_urdu} onChange={handleChange} className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" rows={2} required={form.language !== 'en'} disabled={form.language === 'en'} />
            <label className="block mb-1 font-medium">Content (Urdu)</label>
            <textarea name="content_urdu" value={form.content_urdu} onChange={handleChange} className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" rows={4} required={form.language !== 'en'} disabled={form.language === 'en'} />
          </div>
        )}
        {/* Other Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" required>
              <option value="">Select Category</option>
              {categoryOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Region</label>
            <select name="region" value={form.region} onChange={handleChange} className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600">
              <option value="">Select Region</option>
              {regionOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Country</label>
            <input name="country" value={form.country} onChange={handleChange} className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" required>
              <option value="">Select Type</option>
              {typeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Tags (comma separated)</label>
            <input name="tags" value={form.tags} onChange={handleChange} className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Images</label>
            <input name="images" type="file" accept="image/*" multiple onChange={handleChange} className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" />
            {/* Existing images with remove option */}
            {existingImages && existingImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {existingImages.map((img, idx) => (
                  <div key={img.id} className="relative w-20 h-16 border rounded overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <img src={`/storage/${img.path.replace(/^storage\//, '')}`} alt="Current" className="object-cover w-full h-full" />
                    <button type="button" onClick={() => handleRemoveImage(img.id)} className="absolute top-0 right-0 bg-red-600 text-white rounded-bl px-1 text-xs">X</button>
                  </div>
                ))}
              </div>
            )}
            {/* New uploads preview */}
    </div>
  </div>
  <div>
  {/* (Removed duplicate handleRemoveImage function definition) */}
  </div>
                <div>
          <label className="block mb-1 font-medium">Slug (URL-friendly)</label>
          <input 
            name="slug" 
            value={form.slug || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" 
            placeholder="auto-generated if empty"
          />
        </div>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} /> Featured
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_trending" checked={form.is_trending} onChange={handleChange} /> Trending
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_breaking" checked={form.is_breaking} onChange={handleChange} /> Breaking
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_top_story" checked={form.is_top_story} onChange={handleChange} /> Top Story
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="show_in_section" checked={form.show_in_section} onChange={handleChange} /> Show in Section
          </label>
        </div>
        <div className="mt-2">
          <label className="block mb-1 font-medium">Section Priority</label>
          <input name="section_priority" value={form.section_priority} onChange={handleChange} className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" type="number" min="0" />
        </div>
        <button type="submit" className="w-full py-3 px-4 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>Update</button>
      </form>
    </div>
  );
}