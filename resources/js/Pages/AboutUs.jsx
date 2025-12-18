import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';

export default function AboutUs(props) {
  const { currentLanguage = 'en' } = usePage().props;

  const [darkMode, setDarkMode] = useState(
    typeof window !== 'undefined' && window.localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Urdu content
  const urduContent = (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
          <b className="text-2xl font-bold text-gray-900 dark:text-white">زورا نیوز</b> آپ کا قابل اعتماد ذریعہ ہے تازہ ترین خبریں، تجزیے اور دنیا بھر کی کہانیاں فراہم کرنے کے لیے۔ ہم اپنے قارئین کو انگریزی اور اردو دونوں زبانوں میں درست، بروقت اور غیر جانبدار معلومات فراہم کرنے کے لیے پرعزم ہیں، تاکہ خبریں ہر ایک کے لیے قابل رسائی ہوں۔
        </p>
        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          ہمارا مقصد اپنے قارئین کو علم سے بااختیار بنانا، بامعنی مباحثوں کو فروغ دینا اور اہم آوازوں کے لیے ایک پلیٹ فارم فراہم کرنا ہے۔ چاہے وہ بریکنگ نیوز ہو، تفصیلی فیچرز یا بصیرت افروز تجزیہ، زورا نیوز صحافت کے اعلیٰ ترین معیار کو برقرار رکھنے کی کوشش کرتا ہے۔
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
          ہم کیا پیش کرتے ہیں:
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <li className="flex items-start space-x-3 space-x-reverse">
            <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700 dark:text-gray-300">قومی اور بین الاقوامی خبروں کی جامع کوریج</span>
          </li>
          <li className="flex items-start space-x-3 space-x-reverse">
            <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700 dark:text-gray-300">پاکستان اور جنوبی ایشیا پر خصوصی توجہ</span>
          </li>
          <li className="flex items-start space-x-3 space-x-reverse">
            <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700 dark:text-gray-300">ماہر آراء، اداریے، اور تحقیقی رپورٹس</span>
          </li>
          <li className="flex items-start space-x-3 space-x-reverse">
            <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700 dark:text-gray-300">کثیر لسانی سپورٹ (انگریزی اور اردو)</span>
          </li>
          <li className="flex items-start space-x-3 space-x-reverse">
            <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700 dark:text-gray-300">جدید، صارف دوست تجربہ اور ڈارک/لائٹ موڈ</span>
          </li>
        </ul>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
          ہم سے رابطہ کریں:
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-red-600 dark:text-red-400 font-bold">@</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">ای میل</p>
              <p className="text-gray-600 dark:text-gray-400">info@zoranews.com</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-red-600 dark:text-red-400 font-bold">📞</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">فون</p>
              <p className="text-gray-600 dark:text-gray-400">+92 300 1234567</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 space-x-reverse">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-red-600 dark:text-red-400 font-bold">📍</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">پتہ</p>
              <p className="text-gray-600 dark:text-gray-400">123 نیوز اسٹریٹ، میڈیا سٹی، کراچی، پاکستان</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // English content
  const englishContent = (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
          <b className="text-2xl font-bold text-gray-900 dark:text-white">Zora</b> is your trusted source for the latest news, analysis, and stories from around the world. We are committed to delivering accurate, timely, and unbiased information in both English and Urdu, making news accessible to a diverse audience.
        </p>
        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          Our mission is to empower our readers with knowledge, foster informed discussions, and provide a platform for voices that matter. Whether it's breaking news, in-depth features, or insightful analysis, Zora strives to uphold the highest standards of journalism.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
          What We Offer:
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <li className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700 dark:text-gray-300">Comprehensive coverage of national and international news</span>
          </li>
          <li className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700 dark:text-gray-300">Special focus on Pakistan and South Asia</span>
          </li>
          <li className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700 dark:text-gray-300">Expert opinions, editorials, and investigative reports</span>
          </li>
          <li className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700 dark:text-gray-300">Multi-language support (English & Urdu)</span>
          </li>
          <li className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700 dark:text-gray-300">Modern, user-friendly experience with dark/light mode</span>
          </li>
        </ul>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
          Contact Us:
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-red-600 dark:text-red-400 font-bold">@</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Email</p>
              <p className="text-gray-600 dark:text-gray-400">info@zoranews.com</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-red-600 dark:text-red-400 font-bold">📞</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Phone</p>
              <p className="text-gray-600 dark:text-gray-400">+92 300 1234567</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-red-600 dark:text-red-400 font-bold">📍</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Address</p>
              <p className="text-gray-600 dark:text-gray-400">123 News Street, Media City, Karachi, Pakistan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout darkMode={darkMode}>
      <div className='bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen py-8' dir={currentLanguage === 'ur' ? 'rtl' : 'ltr'}>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-3xl">Z</span>
              </div>
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
                {currentLanguage === 'ur' ? 'زورا نیوز' : 'Zora'}
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {currentLanguage === 'ur' 
                ? 'درست، بروقت اور قابل اعتماد خبریں' 
                : 'Accurate, Timely & Trusted News'
              }
            </p>
          </div>

          {/* Content Sections */}
          {currentLanguage === 'ur' ? urduContent : englishContent}
        </main>
      </div>
    </AppLayout>
  );
}