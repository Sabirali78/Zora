import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import ModeratorNavbar from '../../components/ModeratorNavbar';

const initialForm = {
  language: 'en',
  title: '',
  summary: '',
  content: '',
  title_urdu: '',
  summary_urdu: '',
  content_urdu: '',
  category: '',
  region: '',
  country: '',
  type: '',
  tags: '',
  images: [],
  is_featured: false,
  is_trending: false,
  is_breaking: false,
  is_top_story: false,
  show_in_section: false,
  section_priority: '',
  slug: '',
};

export default function CreateArticle({ moderatorName, moderator = null }) {
  const [form, setForm] = useState(initialForm);
  const [imageFiles, setImageFiles] = useState([]);
  const { errors } = usePage().props;
  const [darkMode, setDarkMode] = useState(window.localStorage.getItem('theme') === 'dark');

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

  const handleLanguageChange = e => setForm(f => ({ ...f, language: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
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
    router.post(route('moderator.articles.store'), data, { forceFormData: true });
  };

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

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white`}>
      <ModeratorNavbar moderatorName={moderatorName} moderator={moderator} />
      {!moderator?.email_verified_at && (
        <div className="max-w-2xl mx-auto p-3 bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded mb-4">
          Your email is not verified. Verify your email or wait for admin verification to create articles.
        </div>
      )}

      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Create Article</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Language</label>
            <select name="language" value={form.language} onChange={handleLanguageChange} className="w-full px-3 py-2 rounded border">
              <option value="en">English</option>
              <option value="ur">Urdu</option>
              <option value="multi">Multi-language</option>
            </select>
          </div>

          {(form.language === 'en' || form.language === 'multi') && (
            <>
              <div>
                <label className="block mb-1">Title (English)</label>
                <input name="title" value={form.title} onChange={handleChange} className="w-full px-3 py-2 rounded border" />
              </div>
              <div>
                <label className="block mb-1">Summary (English)</label>
                <textarea name="summary" value={form.summary} onChange={handleChange} className="w-full px-3 py-2 rounded border" rows={2} />
              </div>
              <div>
                <label className="block mb-1">Content (English)</label>
                <textarea name="content" value={form.content} onChange={handleChange} className="w-full px-3 py-2 rounded border" rows={6} />
              </div>
            </>
          )}

          {(form.language === 'ur' || form.language === 'multi') && (
            <>
              <div>
                <label className="block mb-1">Title (Urdu)</label>
                <input name="title_urdu" value={form.title_urdu} onChange={handleChange} className="w-full px-3 py-2 rounded border text-right" />
              </div>
              <div>
                <label className="block mb-1">Summary (Urdu)</label>
                <textarea name="summary_urdu" value={form.summary_urdu} onChange={handleChange} className="w-full px-3 py-2 rounded border text-right" rows={2} />
              </div>
              <div>
                <label className="block mb-1">Content (Urdu)</label>
                <textarea name="content_urdu" value={form.content_urdu} onChange={handleChange} className="w-full px-3 py-2 rounded border text-right" rows={6} />
              </div>
            </>
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
            {imageFiles && imageFiles.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {imageFiles.map((file, idx) => (
                  <div key={idx} className="w-20 h-16 bg-gray-100 rounded overflow-hidden">
                    <img src={URL.createObjectURL(file)} alt="preview" className="object-cover w-full h-full" />
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
            <label className="flex items-center gap-2"><input type="checkbox" name="is_top_story" checked={form.is_top_story} onChange={handleChange} /> Top Story</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="show_in_section" checked={form.show_in_section} onChange={handleChange} /> Show in Section</label>
          </div>

          <div>
            <label className="block mb-1">Section Priority</label>
            <input type="number" min="0" name="section_priority" value={form.section_priority} onChange={handleChange} className="w-full px-3 py-2 rounded border" />
          </div>

          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded" disabled={moderator && !moderator.email_verified_at}>Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
