import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSideBar from './AdminSideBar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white hidden md:block">
        <AdminSideBar />
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 bg-gray-100">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white shadow">
          <AdminHeader />
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
