import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import App from './App'
import Settings from './Settings';

navigator.serviceWorker.register("dummy-sw.js").catch(err => {
  console.log('注册service worker失败 ', err)
}).then(() => {
  console.log('注册service worker成功')
})

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <App />
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/about",
        element: <div>TODO...</div>,
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
