import { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import { PageSkeleton } from '@/components/common/LoadingSkeleton';
import { useUIStore } from '@/store/uiStore';
import { routes } from './routes';

function App() {
  const { theme } = useUIStore();

  useEffect(() => {
    // Apply theme on mount
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <Router>
      <IntersectObserver />
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
      </Suspense>
      <Toaster />
    </Router>
  );
}

export default App;
