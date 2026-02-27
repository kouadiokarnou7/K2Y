import { motion } from 'framer-motion';

const galleryItems = [
  { id: 1, title: 'Masque Dan', img: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=600&q=80', desc: 'Art traditionnel' },
  { id: 2, title: 'Basilique', img: 'https://images.unsplash.com/photo-1621922688758-359fc864071e?w=600&q=80', desc: 'Yamoussoukro' },
  { id: 3, title: 'Savane', img: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=600&q=80', desc: 'Nord du pays' },
];

const GallerySection = () => {
  return (
    <section id="galerie" className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Notre Culture</h2>
          <p className="text-zinc-400">Un aperçu visuel de notre richesse.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-900 cursor-pointer"
            >
              <img 
                src={item.img} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="text-orange-400 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;