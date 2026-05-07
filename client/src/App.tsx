import Nav from './components/Nav';
import Hero from './components/Hero';
import Capabilities from './components/Capabilities';
import Power from './components/Power';
import Models from './components/Models';
import Stories from './components/Stories';
import CursorTrail from './components/CursorTrail';
import Waitlist from './components/Waitlist';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <Nav />
      <main>
        <Hero />
        <Capabilities />
        <Power />
        <Models />
        <Stories />
        <CursorTrail />
        <Waitlist />
      </main>
      <Footer />
    </div>
  );
}
