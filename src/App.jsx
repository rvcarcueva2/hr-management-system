import './index.css'

import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import JobsPage from './pages/JobsPage'
import JobPage, { jobLoader } from './pages/JobPage'


import AdminLayout from './layouts/AdminLayout'
import AdminPage from './pages/AdminDashboardPage'
import AdminJobsPage from './pages/AdminJobsPage'
import AdminCalendarPage from './pages/AdminCalendarPage'

import AuthLayout from './layouts/AuthLayout'
import LoginPage from './pages/auth/LoginPage'
import SignUpPage from './pages/auth/SignUpPage'
import AdmintTicketPage from './pages/AdmintTicketPage'

import NotFoundPage from './pages/NotFoundPage'


function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path='jobs' element={<JobsPage />} />
          <Route path='jobs/:id' element={<JobPage />} loader={jobLoader} />

          <Route path='*' element={<NotFoundPage />} />

        </Route>

        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminPage />} />
          <Route path='admin-jobs' element={<AdminJobsPage />} />
          <Route path='admin-calendar' element={<AdminCalendarPage />} />
          <Route path='admin-ticket' element={<AdmintTicketPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path='/auth/login' element={<LoginPage />} />
          <Route path='/auth/sign-up' element={<SignUpPage />} />
        </Route>

      </>

    )
  )


  return (
    <>
      <RouterProvider router={router} />
    </>
  )

}

export default App
