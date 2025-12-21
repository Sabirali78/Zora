import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

// ...existing code...

import { usePage } from '@inertiajs/react';
export default function PrivacyPolicy(props) {
  const { currentLanguage = 'en' } = usePage().props;
  const [darkMode, setDarkMode] = useState(
    typeof window !== 'undefined' && window.localStorage.getItem('theme') === 'dark'
  );

  const pageTitle = "The WriteLine – Privacy & Policy";
  const pageDescription = "Read the Privacy & Policy on The WriteLine.";

  // TODO: Replace with Inertia-provided language prop or server-side value

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Urdu content
  const urduContent = (
    <>
      <p>
        <b>پرائیویسی پالیسی</b>
      </p>
      <p>
        ہم آپ کی پرائیویسی کا احترام کرتے ہیں اور آپ کی ذاتی معلومات کی حفاظت کے لیے پرعزم ہیں۔ یہ پالیسی وضاحت کرتی ہے کہ ہم آپ کی معلومات کیسے جمع کرتے ہیں، استعمال کرتے ہیں اور محفوظ رکھتے ہیں۔
      </p>
      <ul>
        <li>ہم صرف وہ معلومات جمع کرتے ہیں جو آپ ہمیں فراہم کرتے ہیں یا جو خودکار طور پر جمع ہوتی ہیں۔</li>
        <li>ہم آپ کی معلومات کو صرف خبروں کی فراہمی اور ویب سائٹ کی بہتری کے لیے استعمال کرتے ہیں۔</li>
        <li>ہم آپ کی معلومات کو کسی تیسرے فریق کے ساتھ شیئر نہیں کرتے سوائے قانونی تقاضوں کے۔</li>
        <li>آپ کی معلومات کی حفاظت کے لیے ہم جدید سیکیورٹی اقدامات استعمال کرتے ہیں۔</li>
      </ul>
      <p>مزید معلومات یا سوالات کے لیے ہم سے رابطہ کریں: info@zoranews.com</p>
    </>
  );

  // English content
  const englishContent = (
    <>
      <p>
        <b>Privacy Policy</b>
      </p>
      <p>
        We respect your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.
      </p>
      <ul>
        <li>We only collect information you provide to us or that is automatically collected.</li>
        <li>We use your information solely to deliver news and improve our website.</li>
        <li>We do not share your information with third parties except as required by law.</li>
        <li>We use modern security measures to protect your data.</li>
      </ul>
      <p>For more information or questions, contact us at: info@zoranews.com</p>
    </>
  );

  return (
    <AppLayout darkMode={darkMode}>
           <Head>
              <title>{pageTitle}</title>
              <meta name="description" content={pageDescription} />
            </Head>
            
      <div className='bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen' dir={currentLanguage === 'ur' ? 'rtl' : 'ltr'}>
        <main className="max-w-3xl mx-auto py-12 px-4">
          <h1 className="text-4xl font-bold mb-6 text-center">
            {currentLanguage === 'ur' ? 'پرائیویسی پالیسی' : 'Privacy Policy'}
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            {currentLanguage === 'ur' ? urduContent : englishContent}
          </div>
        </main>
      </div>
    </AppLayout>
  );
}
