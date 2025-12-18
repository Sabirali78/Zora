import React from 'react';
import { Link } from '@inertiajs/react';
// ...existing code...
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

import { usePage } from '@inertiajs/react';

export default function Footer() {
  const { currentLanguage = 'en' } = usePage().props;
  const isRTL = currentLanguage === 'ur';
  // Minimal translations for Footer
  const translations = {
    en: {
      quickLinks: 'Quick Links', pakistanNews: 'Pakistan News', politics: 'Politics', sports: 'Sports', business: 'Business', tech: 'Technology', health: 'Health', privacyPolicy: 'Privacy Policy', termsOfService: 'Terms of Service', aboutUs: 'About Us', contactUs: 'Contact Us', newsletter: 'Newsletter'
    },
    ur: {
      quickLinks: 'فوری روابط', pakistanNews: 'پاکستان کی خبریں', politics: 'سیاست', sports: 'کھیل', business: 'کاروبار', tech: 'ٹیکنالوجی', health: 'صحت', privacyPolicy: 'پرائیویسی پالیسی', termsOfService: 'سروس کی شرائط', aboutUs: 'ہمارے بارے میں', contactUs: 'ہم سے رابطہ کریں', newsletter: 'نیوز لیٹر'
    }
  };
  const t = (key) => translations[currentLanguage]?.[key] || key;
  return (
    <footer className={`w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 mt-auto`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Zora */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Z</span>
              </div>
              <span className="text-xl font-bold text-white">Zora</span>
            </div>
            <p className="text-gray-900 dark:text-white">
              {currentLanguage === 'ur'
                ? 'آپ کا قابل اعتماد ذریعہ تازہ ترین خبریں، تجزیے اور دنیا بھر کی کہانیاں۔ انگریزی اور اردو میں درست اور بروقت معلومات فراہم کرنا۔'
                : 'Your trusted source for the latest news, analysis, and stories from around the world. Delivering accurate and timely information in English and Urdu.'}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-900 dark:text-white hover:text-white transition">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-900 dark:text-white hover:text-white transition">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-900 dark:text-white hover:text-white transition">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-900 dark:text-white hover:text-white transition">
                <FaYoutube size={20} />
              </a>
              <a href="#" className="text-gray-900 dark:text-white hover:text-white transition">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/country/pakistan" className="text-gray-900 dark:text-white hover:text-white transition">
                  {t('pakistanNews')}
                </Link>
              </li>
              <li>
                <Link href="/category/politics" className="text-gray-900 dark:text-white hover:text-white transition">
                  {t('politics')}
                </Link>
              </li>
              <li>
                <Link href="/category/sports" className="text-gray-900 dark:text-white hover:text-white transition">
                  {t('sports')}
                </Link>
              </li>
              <li>
                <Link href="/category/business" className="text-gray-900 dark:text-white hover:text-white transition">
                  {t('business')}
                </Link>
              </li>
              <li>
                <Link href="/category/technology" className="text-gray-900 dark:text-white hover:text-white transition">
                  {t('tech')}
                </Link>
              </li>
              <li>
                <Link href="/category/health" className="text-gray-900 dark:text-white hover:text-white transition">
                  {t('health')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('contactUs')}</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="mt-1 text-red-500" />
                <p>{currentLanguage === 'ur' ? '123 نیوز اسٹریٹ، میڈیا سٹی، کراچی، پاکستان' : '123 News Street, Media City, Karachi, Pakistan'}</p>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-red-500" />
                <div>
                  <p>+92 300 1234567</p>
                  <p>+92 21 9876543</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-red-500" />
                <p>info@zoranews.com</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('newsletter')}</h3>
            <p className="text-gray-400">
              {currentLanguage === 'ur' ? 'ہماری نیوز لیٹر کے لیے سبسکرائب کریں اور روزانہ کی خبریں اپنے ان باکس میں حاصل کریں۔' : 'Subscribe to our newsletter for daily news updates delivered to your inbox.'}
            </p>
            <form className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder={currentLanguage === 'ur' ? 'آپ کا ای میل ایڈریس' : 'Your email address'}
                className="px-4 py-2 rounded bg-gray-700 text-white dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white dark:text-white rounded transition"
              >
                {currentLanguage === 'ur' ? 'سبسکرائب کریں' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-900 dark:text-white text-sm">
            &copy; {new Date().getFullYear()} Zora News. {currentLanguage === 'ur' ? 'جملہ حقوق محفوظ ہیں۔' : 'All rights reserved.'}
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href={route('privacy.policy')} className="text-gray-900 dark:text-white hover:text-white text-sm transition">
              {t('privacyPolicy')}
            </Link>
            <Link href={route('about.us')} className="text-gray-900 dark:text-white hover:text-white text-sm transition">
              {t('aboutUs')}
            </Link>
            <Link href="/contact" className="text-gray-900 dark:text-white hover:text-white text-sm transition">
              {t('contact')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
