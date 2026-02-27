import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between bg-black/20 backdrop-blur-lg rounded-full px-6 py-3 border border-white/10">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 text-white font-bold text-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 via-white to-green-500 flex items-center justify-center text-xs font-bold text-black">CI</div>
          <span>Héritage Vivant</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Accueil', 'Carte', 'Galerie', 'À propos'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-white/80 hover:text-white transition-colors">
              {item}
            </a>
          ))}
        </div>

        {/* CTA Button style shadcn */}
        <button className="hidden md:block px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
          Explorer
        </button>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 px-6 py-4 bg-zinc-900/95 backdrop-blur-lg border-t border-white/10">
           {['Accueil', 'Carte', 'Galerie', 'À propos'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="block py-3 text-white border-b border-white/10" onClick={() => setIsOpen(false)}>
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;