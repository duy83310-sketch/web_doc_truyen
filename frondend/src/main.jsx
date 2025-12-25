import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// QUAN TRỌNG: Import file CSS vừa tạo ở đây
import './assets/index.css' 
// Nếu bạn để file css ở chỗ khác (ví dụ src/index.css) thì sửa đường dẫn lại cho đúng

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)