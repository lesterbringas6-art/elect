import { useEffect } from 'react'; // Hooks come from 'react'
import { useLocation, Link } from 'react-router-dom'; // Routing comes from here

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // This will now work correctly without the SyntaxError
    console.error("404 Error: Route not found ->", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center animate-in fade-in duration-500">
        <h1 className="mb-4 text-6xl font-black text-primary">404</h1>
        <p className="mb-6 text-xl text-muted-foreground font-medium">
          Oops! This page doesn't exist.
        </p>
        
        {/* Using Link instead of <a> for a smooth SPA transition */}
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 gradient-amber rounded-lg font-bold text-primary-foreground shadow-lg hover:scale-105 transition-transform"
        >
          Return to Dashboard
        </Link>
        
        <p className="mt-8 text-xs text-muted-foreground italic">
          Attempted path: {location.pathname}
        </p>
      </div>
    </div>
  );
};

export default NotFound;