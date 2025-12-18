import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './contexts/ThemeContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => {
        return resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx')
        );
    },
    setup({ el, App, props }) {
        // Clear any existing content
        el.innerHTML = '';
        
        const root = createRoot(el);
        root.render(
            <ThemeProvider>
                <App {...props} />
            </ThemeProvider>
        );
        
        // Add beforeunload handler to prevent content restoration
        window.addEventListener('beforeunload', () => {
            document.body.innerHTML = '';
        });
    },
    progress: {
        color: '#4B5563',
    },
});