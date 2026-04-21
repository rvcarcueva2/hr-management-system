import './index.css'
import { lazy, Suspense } from "react";
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Spinner from './components/Spinner';


// Layouts
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import AuthLayout from './layouts/AuthLayout'

// Pages
const HomePage = lazy(() => import('./pages/HomePage'))
const JobsPage = lazy(() => import('./pages/JobsPage'))
const JobPage = lazy(() => import('./pages/JobPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const MyApplicationPage = lazy(() => import('./pages/MyApplicationPage'))

const AdminPage = lazy(() => import('./pages/AdminDashboardPage'))
const AdminApplicationsPage = lazy(() => import('./pages/AdminApplicationsPage'))
const AdminCalendarPage = lazy(() => import('./pages/AdminCalendarPage'))
const AdminJobsPage = lazy(() => import('./pages/AdminJobsPage'))
const AdminMentorsPage = lazy(() => import('./pages/AdminMentorsPage'))
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'))
const AdmintTicketPage = lazy(() => import('./pages/AdmintTicketPage'))

const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Loader
const jobLoader = async (args) => {
  const module = await import('./pages/JobPage')
  return module.jobLoader(args)
}

const profileLoader = async (args) => {
  const module = await import('./pages/ProfilePage')
  return module.profileLoader(args)
}

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<MainLayout />} >
          <Route index element={<HomePage />} />
          <Route path='jobs' element={<JobsPage />} />
          <Route path='jobs/:id' element={<JobPage />} loader={jobLoader} />
          <Route path='profile' element={<ProfilePage />} loader={profileLoader} />
          <Route path='profile/:id' element={<ProfilePage />} loader={profileLoader} />
          <Route path='my-application' element={<MyApplicationPage />} />
          <Route path='*' element={<NotFoundPage />} />

        </Route>

        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminPage />} />
          <Route path='admin-applications' element={<AdminApplicationsPage />} />
          <Route path='admin-calendar' element={<AdminCalendarPage />} />
          <Route path='admin-jobs' element={<AdminJobsPage />} />
          <Route path='admin-mentors' element={<AdminMentorsPage />} />
          <Route path='admin-users' element={<AdminUsersPage />} />
          <Route path='admin-ticket' element={<AdmintTicketPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path='/auth/login' element={<LoginPage />} />

        </Route>

      </>

    )
  )


  return (
    <>
      <Suspense fallback={<Spinner loading />}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  )

}

export default App
