import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { ThemeType } from '../store/slices/themeSlice';

export const useTheme = () => {
    const theme = useSelector((state: RootState) => state.theme.theme);

    useEffect(() => {
        const root = window.document.documentElement;

        const applyTheme = (targetTheme: ThemeType) => {
            let actualTheme: 'light' | 'dark';

            if (targetTheme === 'system') {
                actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            } else {
                actualTheme = targetTheme as 'light' | 'dark';
            }

            if (actualTheme === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };

        applyTheme(theme);

        // Listener for system changes
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme('system');

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme]);
};
