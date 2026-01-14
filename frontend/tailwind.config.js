module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0084FF',
          deep: '#0F4C75',
          muted: '#8F929C',
        },
        surface: {
          light: '#FBFBFC',
          dark: '#12141C',
          card: '#1A1C23',
          sidebar: '#15171E',
          pure: '#FEFEFE',
        },
        content: {
          primary: '#25272D',
          heading: '#50555D',
          value: '#575A61',
          label: '#6B6E71',
          muted: '#A6AEB4',
          'muted-alt': '#74798B',
          secondary: '#7E8184',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
