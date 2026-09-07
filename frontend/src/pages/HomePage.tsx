import React, { useState } from "react";

import { Hero } from "../components/Hero";
import { StatsBar } from "../components/StatsBar";
import { ProblemSolution } from "../components/ProblemSolution";
import { SmartSolutions } from "../components/SmartSolutions";
import { HowItWorks } from "../components/HowItWorks";
import { CenterFinder } from "../components/farmerPortal/CenterFinder";
import { LiveQueueHero } from "../components/farmerPortal/LiveQueueHero";
import { DashboardPreview } from "../components/DashboardPreview";
import { ProcurementTimeline } from "../components/farmerPortal/ProcurementTimeline";
import { PaymentTrackingSection } from "../components/farmerPortal/PaymentTrackingSection";
import { NotificationsSection } from "../components/farmerPortal/NotificationsSection";
import { TrustSection } from "../components/TrustSection";
import { FaqSection } from "../components/FaqSection";
import { FinalCta } from "../components/FinalCta";

import { MandiPassModal } from "../components/farmerPortal/MandiPassModal";
import BookSlotModal from "../components/farmerPortal/BookSlotModal";

export const HomePage: React.FC = () => {
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50">

      {/* =====================================================
          PERSONALIZED FARMER HERO
      ===================================================== */}
      <Hero
        onBookSlot={() => setIsBookModalOpen(true)}
        onViewPass={() => setIsPassModalOpen(true)}
      />

      {/* =====================================================
          PERSONALIZED STATS
      ===================================================== */}
      <StatsBar />

      {/* =====================================================
          INFORMATIONAL SECTIONS
          These can remain public/general content.
      ===================================================== */}

      <ProblemSolution />

      <SmartSolutions />

      <HowItWorks />

      <CenterFinder />

      <LiveQueueHero />

      {/* =====================================================
          PERSONALIZED FARMER DATA
      ===================================================== */}

      <DashboardPreview />

      <ProcurementTimeline />

      <PaymentTrackingSection />

      <NotificationsSection />

      {/* =====================================================
          TRUST / FAQ / CTA
      ===================================================== */}

      <TrustSection />

      <FaqSection />

      <FinalCta
        onBookSlot={() => setIsBookModalOpen(true)}
      />

      {/* =====================================================
          MODALS
      ===================================================== */}

      <MandiPassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
      />

      <BookSlotModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
      />

    </main>
  );
};