const Footer = () => (
  <footer className="bg-black border-t border-zinc-800 py-8">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-zinc-500 text-sm">
      <div className="flex items-center gap-2 mb-4 md:mb-0">
        <span className="font-bold text-white">Héritage Vivant</span> © 2024
      </div>
      <div className="flex gap-4">
        {/* Drapeau CI miniature */}
        <div className="flex h-4 w-10 rounded overflow-hidden">
          <div className="w-1/3 bg-orange-500"></div>
          <div className="w-1/3 bg-white"></div>
          <div className="w-1/3 bg-green-500"></div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;