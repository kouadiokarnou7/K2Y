import { motion } from 'framer-motion';

const AboutSection = () => (
  <section id="à propos" className="py-20 bg-zinc-900 text-white">
    <div className="max-w-4xl mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-orange-500 text-sm font-bold uppercase tracking-widest">À Propos</span>
        <h2 className="text-4xl font-bold mt-4 mb-6">L'Éléphant des Nations</h2>
        <p className="text-lg text-zinc-400 leading-relaxed">
          La Côte d'Ivoire, pays d'hospitalité et de traditions vibrantes. De la lagune Ébrié aux savanes du Nord, 
          ce projet numérique met en lumière un héritage vivant, porté par la jeunesse et respecté par les aînés.
        </p>
      </motion.div>
    </div>
  </section>
);

export default AboutSection;