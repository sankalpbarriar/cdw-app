import { FeaturesSection } from "@/components/homepage/feature-section";
import { HeroSection } from "@/components/homepage/hero-section";
import { LatestArraivals } from "@/components/homepage/latest-arrivals";
import { OurBrandSection } from "@/components/homepage/out-brands-section";
import { PageProps } from "@/config/types";
export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  return (
    <div className="w-full min-h-screen bg-background">
      <HeroSection searchParams={searchParams}/>
      <FeaturesSection/>
      <LatestArraivals/>
      <OurBrandSection/>
    </div>
  );
} 
