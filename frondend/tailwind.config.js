/** @type {import('tailwindcss').Config} */
export default {
  // Quan trọng: Dòng dưới này quy định Tailwind quét file nào
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        primary: '#009FFF',       
        dark: '#181821',          
        sidebar: '#E5E9ED',       
        card: '#DEE5ED', 
        // ... các màu khác giữ nguyên như tôi gửi lúc nãy
      },
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'],
      },
      spacing: {
        'sidebar': '120px',
        'admin-sidebar': '240px',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
}