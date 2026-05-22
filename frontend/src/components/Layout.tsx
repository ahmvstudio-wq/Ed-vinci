import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', icon: 'home', path: '/dashboard' },
    { name: 'Identity', icon: 'fingerprint', path: '/identity' },
    { name: 'Stack', icon: 'layers', path: '/stack' },
    { name: '30-Day Path', icon: 'timeline', path: '/path' },
    { name: 'Community', icon: 'groups', path: '/community' },
  ];

  return (
    <div className="bg-background text-on-background antialiased min-h-screen flex w-full">
      {/* SideNavBar */}
      <nav className="hidden md:flex flex-col h-screen py-gutter px-4 bg-surface-container-lowest border-r border-outline-variant w-64 fixed left-0 top-0 z-50">
        <div className="mb-8 px-4">
          <h1 className="text-headline-lg font-headline-lg font-bold text-primary tracking-tighter">Ed Vinci</h1>
          <p className="text-label-caps font-label-caps text-on-surface-variant mt-1">AI Activation</p>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                className={`flex items-center gap-4 px-4 py-3 rounded transition-all ${
                  isActive 
                    ? 'text-primary font-bold border-r-2 border-primary bg-surface-container/50' 
                    : 'text-on-surface-variant font-medium hover:bg-surface-container-high hover:text-primary'
                }`}
                to={link.path}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {link.icon}
                </span>
                <span className="text-label-caps font-label-caps">{link.name}</span>
              </Link>
            );
          })}
        </div>
        <div className="mt-auto space-y-2 pt-4 border-t border-outline-variant/30">
          <Link className="flex items-center gap-4 px-4 py-3 rounded text-on-surface-variant font-medium hover:bg-surface-container-high hover:text-primary transition-all" to="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-label-caps font-label-caps">Settings</span>
          </Link>
          <button className="w-full mt-4 bg-gradient-to-r from-primary-container to-inverse-primary text-on-primary-container font-bold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.2)] hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all">
            Upgrade to Pro
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="flex justify-between items-center h-16 px-gutter bg-background/80 backdrop-blur-xl border-b border-outline-variant shadow-sm sticky top-0 z-40">
          <h2 className="text-headline-sm font-headline-sm font-bold tracking-tight text-primary md:hidden">Ed Vinci</h2>
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <span className="text-label-caps font-label-caps text-on-surface-variant hidden sm:block">Active Status</span>
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant overflow-hidden ml-2">
              <img alt="Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfWBFBFk_xc8ZD2nib2BEjp-nf18dS9EBxbRTbMo6PU5syG_fRmrY7tyqCbOLJwakOm5ryq99Pb0RHnhVd-WrckwEcLjTh-5oMWGgLZSkFrW0aq0DYxEVmBh7x6qSEmcvkO6pQGOZqH0NX-1T6pNBuPSoB6epPzqSdlSer8IZZ56P_-q-NrmKCDAjhHx8MzsARz571t8J214yYbCcXxax31Qc7x8LSvlQtSPK2oUt9Qb83ZTP5WLbQ0m2z2ftNw--XQROKKZkp-Bc" />
            </div>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
