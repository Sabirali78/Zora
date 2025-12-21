import React from 'react';
import { Link } from '@inertiajs/react';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube, 
  FaLinkedin, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaShieldAlt,
  FaAward,
  FaCheckCircle
} from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';

export default function Footer() {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'All Insights', href: '/articles' },
    { name: 'Politics', href: '/category/politics' },
    { name: 'Business', href: '/category/business' },
    { name: 'Technology', href: '/category/technology' },
    { name: 'Sports', href: '/category/sports' },
    { name: 'Health', href: '/category/health' },
  ];

  const resourcesLinks = [
    { name: 'Archives', href: '#' },
    { name: 'Live TV', href: '#' },
    { name: 'Podcasts', href: '#' },
    { name: 'Mobile Apps', href: '#' },
    { name: 'Newsletters', href: '#' },
    { name: 'RSS Feeds', href: '#' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about-us' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '#' },
    { name: 'Press Center', href: '#' },
    { name: 'Advertise', href: '#' },

  ];

  const socialLinks = [
    { icon: FaFacebook, href: '#', label: 'Facebook', color: 'hover:bg-blue-600 dark:hover:bg-blue-700' },
    { icon: FaTwitter, href: '#', label: 'Twitter', color: 'hover:bg-blue-400 dark:hover:bg-blue-500' },
    { icon: FaInstagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-600 dark:hover:bg-pink-700' },
    { icon: FaYoutube, href: '#', label: 'YouTube', color: 'hover:bg-red-600 dark:hover:bg-red-700' },
    { icon: FaLinkedin, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-800 dark:hover:bg-blue-900' },
  ];

  const trustIndicators = [ { icon: FaCheckCircle},
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-t border-gray-200/50 dark:border-gray-800/50 mt-20">
      {/* Wave Decorative Element */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600 dark:from-red-700 dark:via-red-600 dark:to-red-700 transform -translate-y-1/2"></div>
      
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
          
          {/* Brand Section - Full width top */}
          <div className="lg:col-span-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              {/* Logo and Tagline */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">Z</span>
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-700 rounded-xl opacity-20 blur-sm"></div>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    The WriteLine
                  </h2>
                </div>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 lg:gap-10">
                {trustIndicators.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                        {item.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Divider */}
   
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center justify-between text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-2 transition-all duration-300 hover:pl-2"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></span>
                    </span>
                    <FiArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
              Resources
            </h3>
            <ul className="space-y-3">
              {resourcesLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center justify-between text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-2 transition-all duration-300 hover:pl-2"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></span>
                    </span>
                    <FiArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center justify-between text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-2 transition-all duration-300 hover:pl-2"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></span>
                    </span>
                    <FiArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
              Stay Connected
            </h3>
            
            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaMapMarkerAlt className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">123 News Street, Media City</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Karachi, Pakistan</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaPhone className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <a 
                  href="tel:+923001234567" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  +92 300 123 4567
                </a>
              </div>
              
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaEnvelope className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <a 
                  href="mailto:info@WriteLinenews.com" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  info@WriteLinenews.com
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Follow Us</h4>
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 ${social.color} hover:text-white transition-all duration-300 transform hover:-translate-y-1`}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-gray-200/50 dark:border-gray-800/50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Copyright */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>© {new Date().getFullYear()} The WriteLine Network. All rights reserved.</p>
              <p className="mt-1 text-xs">ISSN 1234-5678 • Registered with Press Council of Pakistan</p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-4 lg:gap-8">
              <Link href="/privacy-policy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link href="/ethics" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Ethics Code
              </Link>
              <Link href="/accessibility" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Accessibility
              </Link>
            </div>

            {/* Accreditations */}
            <div className="text-xs text-gray-400 dark:text-gray-500 text-right">
              <p>Member of Global News Association • Verified by Trust Project</p>
              <p className="mt-1">Editorial Independence • Non-partisan Reporting</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}