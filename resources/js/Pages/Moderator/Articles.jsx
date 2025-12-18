import React from 'react';
import { Link } from '@inertiajs/react';
import ModeratorNavbar from '../../components/ModeratorNavbar';

export default function ModeratorArticles({ articles = [], moderatorName, moderator = null }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <ModeratorNavbar moderatorName={moderatorName} moderator={moderator} />

      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Your Articles</h1>
          {moderator && !moderator.email_verified_at ? (
            <button className="px-3 py-2 bg-gray-400 text-white rounded" disabled>Verify Email to Create</button>
          ) : (
            <Link href={route('moderator.articles.create')} className="px-3 py-2 bg-red-600 text-white rounded">Create Article</Link>
          )}
        </div>

        <div className="space-y-4">
          {articles.length === 0 && (
            <div className="p-4 bg-white dark:bg-gray-800 rounded shadow text-gray-600 dark:text-gray-300">No articles yet.</div>
          )}

          {articles.map((a) => {
            const canEdit = a.author && moderatorName && a.author === moderatorName;
            return (
              <article key={a.id} className="p-4 bg-white dark:bg-gray-800 rounded shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{a.title || a.title_urdu || 'Untitled'}</h2>
                    <div className="text-sm text-gray-500 dark:text-gray-300">{a.category} • {a.language}</div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">{new Date(a.created_at).toLocaleString()}</div>
                </div>

                <p className="mt-3 text-gray-700 dark:text-gray-300">{a.summary || a.summary_urdu}</p>

                <div className="mt-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-300">
                  <div>Author: {a.author}</div>
                  <div className="flex items-center gap-3">
                    <div>{a.language === 'multi' ? 'Multi' : a.language.toUpperCase()}</div>
                    {canEdit ? (
                      <Link href={route('moderator.articles.edit', { id: a.id })} className="px-2 py-1 bg-blue-600 text-white rounded text-sm">Edit</Link>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
