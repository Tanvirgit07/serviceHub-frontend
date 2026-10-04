import React from "react";
import HeroSection from "./_components/HeroSection";
import PopularServices from "./_components/popularServices";
import HowItWorks from "./_components/HowItWorks";
import BecomeAProvider from "./_components/BecomeAProvider";

function page() {
  return (
    <div>
      <HeroSection />
      <PopularServices />
      <HowItWorks />
      <BecomeAProvider />
    </div>
  );
}

export default page;
