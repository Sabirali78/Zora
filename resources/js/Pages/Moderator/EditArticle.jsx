import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import ModeratorNavbar from '../../components/ModeratorNavbar';

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
  images: [],
  is_featured: !!article.is_featured,
  is_trending: !!article.is_trending,
  is_breaking: !!article.is_breaking,
  is_top_story: !!article.is_top_story,
  show_in_section: !!article.show_in_section,
  section_priority: article.section_priority || '',
  slug: article.slug || '',
});

export default function EditArticle({ article, moderatorName, moderator = null }) {
  const [form, setForm] = useState(initialForm(article));
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(article.images || []);
  const [darkMode, setDarkMode] = useState(window.localStorage.getItem('theme') === 'dark');
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

  const handleLanguageChange = e => setForm(f => ({ ...f, language: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if ([
        'is_featured', 'is_trending', 'is_breaking', 'is_top_story', 'show_in_section'
      ].includes(key)) {
        data.append(key, value ? 1 : 0);
      } else {
        data.append(key, value ?? '');
      }
    });
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach(file => data.append('images[]', file));
    }
    router.post(route('moderator.articles.update', { id: article.id }), data, {
      forceFormData: true,
      onFinish: () => setLoading(false),
    });
  };

  function handleRemoveImage(imageId) {
    if (!window.confirm('Remove this image?')) return;
    router.post(`/moderator/articles/${article.id}/remove-image/${imageId}`, {}, {
      onSuccess: () => setExistingImages(existingImages.filter(img => img.id !== imageId)),
      preserveScroll: true,
    });
  }

  const categoryOptions = [
    { value: 'politics', label: 'Politics' },
    { value: 'sports', label: 'Sports' },
    { value: 'technology', label: 'Technology' },
    { value: 'health', label: 'Health' },
    { value: 'business', label: 'Business' },
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
    { value: 'news', label: 'News' },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white`}>
      <ModeratorNavbar moderatorName={moderatorName} moderator={moderator} />
      {!moderator?.email_verified_at && (
        <div className="max-w-2xl mx-auto p-3 bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded mb-4">
          Your email is not verified. You cannot edit articles until your email is verified.
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow space-y-6">
        <h1 className="text-2xl font-bold">Edit Article</h1>

        {/* Language */}
        <div>
          <label className="block mb-1">Language</label>
          <select name="language" value={form.language} onChange={handleLanguageChange} className="w-full px-3 py-2 rounded border">
            <option value="en">English</option>
            <option value="ur">Urdu</option>
            <option value="multi">Multi</option>
          </select>
        </div>

        {(form.language === 'en' || form.language === 'multi') && (
          <div>
            <label className="block mb-1">Title (English)</label>
            <input name="title" value={form.title} onChange={handleChange} className="w-full px-3 py-2 rounded border" />
            <label className="block mb-1">Summary (English)</label>
            <textarea name="summary" value={form.summary} onChange={handleChange} className="w-full px-3 py-2 rounded border" rows={2} />
            <label className="block mb-1">Content (English)</label>
            <textarea name="content" value={form.content} onChange={handleChange} className="w-full px-3 py-2 rounded border" rows={4} />
          </div>
        )}

        {(form.language === 'ur' || form.language === 'multi') && (
          <div>
            <label className="block mb-1">Title (Urdu)</label>
            <input name="title_urdu" value={form.title_urdu} onChange={handleChange} className="w-full px-3 py-2 rounded border text-right" />
            <label className="block mb-1">Summary (Urdu)</label>
            <textarea name="summary_urdu" value={form.summary_urdu} onChange={handleChange} className="w-full px-3 py-2 rounded border text-right" rows={2} />
            <label className="block mb-1">Content (Urdu)</label>
            <textarea name="content_urdu" value={form.content_urdu} onChange={handleChange} className="w-full px-3 py-2 rounded border text-right" rows={4} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 rounded border">
              <option value="">Select</option>
              {categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1">Region</label>
            <select name="region" value={form.region} onChange={handleChange} className="w-full px-3 py-2 rounded border">
              <option value="">Select</option>
              {regionOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1">Country</label>
            <input name="country" value={form.country} onChange={handleChange} className="w-full px-3 py-2 rounded border" />
          </div>
          <div>
            <label className="block mb-1">Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full px-3 py-2 rounded border">
              <option value="">Select</option>
              {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1">Tags</label>
          <input name="tags" value={form.tags} onChange={handleChange} className="w-full px-3 py-2 rounded border" />
        </div>

        <div>
          <label className="block mb-1">Images</label>
          <input name="images" type="file" accept="image/*" multiple onChange={handleChange} className="w-full" />
          {existingImages && existingImages.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {existingImages.map(img => (
                <div key={img.id} className="w-20 h-16 relative bg-gray-100 rounded overflow-hidden">
                  <img src={`/storage/${img.path.replace(/^storage\//,'')}`} alt="img" className="object-cover w-full h-full" />
                  <button type="button" onClick={() => handleRemoveImage(img.id)} className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1">X</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1">Slug</label>
          <input name="slug" value={form.slug} onChange={handleChange} className="w-full px-3 py-2 rounded border" />
        </div>

        <div className="flex gap-3 flex-wrap">
          <label className="flex items-center gap-2"><input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} /> Featured</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="is_trending" checked={form.is_trending} onChange={handleChange} /> Trending</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="is_breaking" checked={form.is_breaking} onChange={handleChange} /> Breaking</label>
        </div>

        <div>
          <label className="block mb-1">Section Priority</label>
          <input type="number" min="0" name="section_priority" value={form.section_priority} onChange={handleChange} className="w-full px-3 py-2 rounded border" />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded" disabled={loading || (moderator && !moderator.email_verified_at)}>Update</button>
        </div>
      </form>
    </div>
  );
}
