import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import Footer from '../components/Footer';
import Header from '../components/Header';

function AppLayoutContent({ children }) {
  const { auth, pageTitle, pageDescription, pageKeywords, pageImage } = usePage().props;

  const siteTitle = pageTitle || "The WriteLine – News, Opinion & Stories";
  const siteDescription = pageDescription || "Stay updated with latest articles, opinion pieces, creative stories, and tech news on The WriteLine.";
  const siteKeywords = pageKeywords || "News, Opinion, Analysis, Fiction, Stories, Tech, Miscellaneous";
  const siteImage = pageImage || "/default-og-image.jpg";
  const currentUrl = typeof window !== 'undefined' ? window.location.href : "";

  return (
    <>
      <Head>
        {/* Cache control */}
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />

        {/* SEO Meta */}
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="keywords" content={siteKeywords} />
        <link rel="canonical" href={currentUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:image" content={siteImage} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={siteImage} />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header auth={auth} />
        <main className="flex-1 px-4 py-6 max-w-7xl mx-auto w-full" style={{ marginTop: '70px' }}>
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}

export default function AppLayout({ children }) {
  const { props } = usePage();
  const currentLanguage = props.currentLanguage || 'en';

  return <AppLayoutContent>{children}</AppLayoutContent>;
}
