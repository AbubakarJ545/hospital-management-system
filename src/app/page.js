"use client";
import { useState } from "react";

import Footer from "./_components/Footer";
import Hero from "./_components/Hero";

import Navbar from "./_components/Navbar";
import PatientFormModal from "./_components/PatientFormModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Navbar />
      <Hero onBookAppointment={() => setIsModalOpen(true)} />
      <Footer />
      <PatientFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
