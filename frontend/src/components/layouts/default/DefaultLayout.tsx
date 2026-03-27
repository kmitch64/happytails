
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DefaultHeader from '../../layouts/default/DefaultHeader';
import DefaultFooter from '../../layouts/default/DefaultFooter';

import './default.css';


export default function DefaultLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app-container">
      <DefaultHeader path={pathname} />
      <main className="main-content">
        <Outlet />
      </main>
      {!pathname.includes('/dashboard') && <DefaultFooter path={pathname} />}
    </div>
  );
};
