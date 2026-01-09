import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { ThemeType } from '../store/slices/themeSlice';

export const useTheme = () => {
    const theme = useSelector((state: RootState) => state.theme.theme);

    useEffect(() => {
        const root = window.document.documentElement;

        const applyTheme = (targetTheme: ThemeType) => {
            if (targetTheme === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };

        applyTheme(theme);
    }, [theme]);
};
