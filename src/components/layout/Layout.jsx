import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ParticleBackground from '../effects/ParticleBackground';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ParticleBackground />
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
