import React from 'react';

const ThemeContext = React.createContext({
    darkMode: false,
    setDarkMode: () => {},
});

export default ThemeContext;
