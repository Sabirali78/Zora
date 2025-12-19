import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import AdminNavbar from '@/components/AdminNavbar';

const initialForm = {
  language: 'en',
  title: '',
  summary: '',
  content: '',
  title_urdu: '',
  summary_urdu: '',
  content_urdu: '',
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
  const { errors, currentLanguage: lang } = usePage().props;
  const currentLanguage = lang || 'en';
  const [darkMode, setDarkMode] = useState(
    window.localStorage.getItem('theme') === 'dark'
  );

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

  const handleLanguageChange = e => {
    const lang = e.target.value;
    setForm(f => ({ ...f, language: lang }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'image') return;
      // Only is_featured is relevant now
      if (key === 'is_featured') {
        data.append(key, value ? 1 : 0);
      } else {
        data.append(key, value ?? '');
      }
    });
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file, idx) => {
        data.append('images[]', file);
      });
    }
    router.post(route('admin.articles.store'), data, {
      forceFormData: true,
    });
  };

  // Category and region options (from Header.jsx)
  const categoryOptions = [
    { value: 'News', label: 'News' },
    { value: 'Opinion', label: 'Opinion' },
    { value: 'Analysis', label: 'Analysis' },
    { value: 'Mystery / Fiction', label: 'Mystery / Fiction' },
    { value: 'Stories / Creative', label: 'Stories / Creative' },
    { value: 'Miscellaneous', label: 'Miscellaneous' },
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

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <AdminNavbar adminName={adminName} darkMode={darkMode} setDarkMode={setDarkMode} />
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded shadow max-w-2xl w-full space-y-6">
        <h1 className="text-2xl font-bold mb-2">Create Article</h1>
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
            <label className="block mb-1 font-medium">Tags (comma separated)</label>
            <input name="tags" value={form.tags} onChange={handleChange} className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Image URL (optional)</label>
            <input name="image_url" value={form.image_url} onChange={handleChange} className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="https://..." />
            <label className="block mb-1 font-medium mt-2">Image public id (optional)</label>
            <input name="image_public_id" value={form.image_public_id} onChange={handleChange} className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="cloudinary-public-id" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Images</label>
            <input name="images" type="file" accept="image/*" multiple onChange={handleChange} className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" />
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
        <div className="flex gap-4 mt-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} /> Featured
          </label>
        </div>
        <button type="submit" className="w-full py-3 px-4 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white">Create</button>
      </form>
    </div>
  );
}