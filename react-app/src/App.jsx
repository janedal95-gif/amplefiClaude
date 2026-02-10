import { useState, useCallback } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Divider from './components/Divider';
import WhatWeDo from './components/WhatWeDo';
import HowWeDoIt from './components/HowWeDoIt';
import CtaBottom from './components/CtaBottom';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <>
      <Nav onRequestDemo={openModal} />
      <Hero onRequestDemo={openModal} />
      <Divider />
      <WhatWeDo />
      <HowWeDoIt />
      <CtaBottom onRequestDemo={openModal} />
      <Footer />
      <ContactModal open={modalOpen} onClose={closeModal} />
    </>
  );
}
