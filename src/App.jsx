import './index.css'
import { lazy, Suspense } from "react";
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Spinner from './components/Spinner';
import { RequireAuth, RequireGuest, RequireRole } from './components/RouteGuards';


// Layouts
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import AuthLayout from './layouts/AuthLayout'

// Pages
const HomePage = lazy(() => import('./pages/HomePage'))
const JobsPage = lazy(() => import('./pages/JobsPage'))
const JobPage = lazy(() => import('./pages/JobPage'))
const MentorPage = lazy(() => import('./pages/MentorPage'))
const MentorsPage = lazy(() => import('./pages/MentorsPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const MyApplicationPage = lazy(() => import('./pages/MyApplicationPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))

const AdminPage = lazy(() => import('./pages/AdminDashboardPage'))
const AdminApplicationsPage = lazy(() => import('./pages/AdminApplicationsPage'))
const AdminCalendarPage = lazy(() => import('./pages/AdminCalendarPage'))
const AdminJobsPage = lazy(() => import('./pages/AdminJobsPage'))
const AdminMentorsPage = lazy(() => import('./pages/AdminMentorsPage'))
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'))
const AdminMentorshipPage = lazy(() => import('./pages/AdminMentorshipPage'))
const AdminApprenticePage = lazy(() => import('./pages/AdminApprenticePage'))
const AdmintTicketPage = lazy(() => import('./pages/AdmintTicketPage'))

const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Loader
const jobLoader = async (args) => {
  const module = await import('./pages/JobPage')
  return module.jobLoader(args)
}

const programLoader = async (args) => {
  const module = await import('./pages/MentorPage')
  return module.programLoader(args)
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
          <Route element={<RequireAuth />}>
            <Route path='jobs' element={<JobsPage />} />
            <Route path='jobs/:id' element={<JobPage />} loader={jobLoader} />
            <Route path='mentors' element={<MentorsPage />} />
            <Route path='programs/:id' element={<MentorPage />} loader={programLoader} />
            <Route path='about' element={<AboutPage />} />
            <Route path='profile' element={<ProfilePage />} loader={profileLoader} />
            <Route path='profile/:id' element={<ProfilePage />} loader={profileLoader} />
            <Route path='my-application' element={<MyApplicationPage />} />
            <Route path='*' element={<NotFoundPage />} />
          </Route>
        </Route>

        <Route path='/admin' element={<RequireRole allowedRoles={["Admin", "Reviewer", "Mentor"]} />}>
          <Route element={<AdminLayout />}>
            <Route element={<RequireRole allowedRoles={["Admin", "Reviewer"]} />}>
              <Route index element={<AdminPage />} />
              <Route path='admin-applications' element={<AdminApplicationsPage />} />
              <Route path='admin-calendar' element={<AdminCalendarPage />} />
              <Route path='admin-jobs' element={<AdminJobsPage />} />
              <Route path='admin-mentors' element={<AdminMentorsPage />} />
              <Route path='admin-users' element={<AdminUsersPage />} />
              <Route path='admin-ticket' element={<AdmintTicketPage />} />
            </Route>
            <Route element={<RequireRole allowedRoles={["Mentor"]} />}>
              <Route path='admin-mentorship' element={<AdminMentorshipPage />} />
              <Route path='admin-apprentice' element={<AdminApprenticePage />} />
            </Route>
          </Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route element={<RequireGuest />}>
            <Route path='/auth/login' element={<LoginPage />} />
            <Route path='/auth/forgot-password' element={<ForgotPasswordPage />} />
          </Route>
          <Route path='/auth/reset-password' element={<ResetPasswordPage />} />
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
