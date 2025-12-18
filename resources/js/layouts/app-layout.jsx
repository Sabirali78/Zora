import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { ThemeProvider } from '../contexts/ThemeContext';

function AppLayoutContent({ children }) {
  const { auth } = usePage().props;
  
  return (
    <>
      <Head>
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <Header auth={auth} />
        <main className="flex-1 px-4 py-6 max-w-6xl mx-auto w-full" style={{ marginTop: '70px' }}>
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
  
  return (
    <ThemeProvider>
      <AppLayoutContent>
        {children}
      </AppLayoutContent>
    </ThemeProvider>
  );
}