export interface ThemeColors {
    primary: string;
    primaryRGB: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    accent: string;
    splash: string;
}

export interface Theme {
    colors: ThemeColors;
    filters: string;
}

export const themes: Record<string, Theme> = {
    default: {
        colors: {
            primary: '#f45c40',
            primaryRGB: '244, 92, 64',
            secondary: '#f5d9a0',
            background: '#f5d9a0',
            surface: '#ffffff',
            text: '#333333',
            accent: '#f45c40',
            splash: '#00c4a7'
        },
        filters: 'none'
    },
    breakfast: {
        colors: {
            primary: '#ff9a3c',
            primaryRGB: '255, 154, 60',
            secondary: '#ffe5d9',
            background: '#fff7e6',
            surface: '#ffffff',
            text: '#2d3436',
            accent: '#ff9a3c',
            splash: '#e91e63'
        },
        filters: 'hue-rotate(30deg) saturate(1.2)'
    },
    lunch: {
        colors: {
            primary: '#4caf50',
            primaryRGB: '76, 175, 80',
            secondary: '#e8f5e9',
            background: '#f1f8e9',
            surface: '#ffffff',
            text: '#2d3436',
            accent: '#4caf50',
            splash: '#ff6b6b'
        },
        filters: 'hue-rotate(60deg) saturate(1.3)'
    },
    supper: {
        colors: {
            primary: '#5c6bc0',
            primaryRGB: '92, 107, 192',
            secondary: '#e8eaf6',
            background: '#f5f6ff',
            surface: '#ffffff',
            text: '#2d3436',
            accent: '#5c6bc0',
            splash: '#ffd93d'
        },
        filters: 'hue-rotate(90deg) saturate(1.4)'
    },
    midnight: {
        colors: {
            primary: '#6366f1',
            primaryRGB: '99, 102, 241',
            secondary: '#1e1b4b',
            background: '#0f172a',
            surface: '#1e293b',
            text: '#f8fafc',
            accent: '#818cf8',
            splash: '#4ade80'
        },
        filters: 'hue-rotate(180deg) saturate(0.8) brightness(0.9)'
    }
}

export function applyTheme(themeName: string): void {
    const theme = themes[themeName] || themes.default;
    const root = document.documentElement;

    // Apply CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
    });

    // Apply theme class for filters and specific theme styles
    root.className = `theme-${themeName}`;
}

// Export color getters for TypeScript usage
export function getThemeColors(themeName: string): ThemeColors {
    return (themes[themeName] || themes.default).colors;
}

export function getThemeFilter(themeName: string): string {
    return (themes[themeName] || themes.default).filters;
} 