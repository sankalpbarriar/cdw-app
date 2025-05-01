import { HeroSection } from "@/components/homepage/hero-section";
import { PageProps } from "@/config/types";
export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  return (
    <div className="w-full min-h-screen bg-background">
      <HeroSection searchParams={searchParams}/>
    </div>
  );
} 
