import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/user/UserDashboard';
import SongLibrary from './pages/user/SongLibrary';
import SongViewer from './pages/user/SongViewer';
import MySongs from './pages/user/MySongs';
import PersonalSongViewer from './pages/user/PersonalSongViewer';
import ChordLibraryPage from './pages/user/ChordLibraryPage';
import ProgressionBuilderPage from './pages/user/ProgressionBuilderPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageChords from './pages/admin/ManageChords';
import ManageSongs from './pages/admin/ManageSongs';
import ManageUsers from './pages/admin/ManageUsers';
import Reports from './pages/admin/Reports';
import NotFound from './pages/NotFound';

// Layout component to keep things DRY
const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
    <Footer />
  </div>
);

const App = () => (
  <AuthProvider>
    <DataProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Routes (Protected) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout><UserDashboard /></Layout>} />
            <Route path="/songs" element={<Layout><SongLibrary /></Layout>} />
            <Route path="/songs/:id" element={<Layout><SongViewer /></Layout>} />
            <Route path="/my-songs" element={<Layout><MySongs /></Layout>} />
            <Route path="/my-songs/:id" element={<Layout><PersonalSongViewer /></Layout>} />
            <Route path="/chords" element={<Layout><ChordLibraryPage /></Layout>} />
            <Route path="/progression" element={<Layout><ProgressionBuilderPage /></Layout>} />
          </Route>

          {/* Admin Routes (Protected + Role Check) */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
            <Route path="/admin/chords" element={<Layout><ManageChords /></Layout>} />
            <Route path="/admin/songs" element={<Layout><ManageSongs /></Layout>} />
            <Route path="/admin/users" element={<Layout><ManageUsers /></Layout>} />
            <Route path="/admin/reports" element={<Layout><Reports /></Layout>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  </AuthProvider>
);

export default App;