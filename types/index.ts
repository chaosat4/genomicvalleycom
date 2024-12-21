export type NavigationItem = {
    name: string
    href: string
    features?: {
      title: string
      href: string
      description: string
    }[]
  }

  export interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
  }
  
  // Add this new type for the constants file
  export interface FeatureCardData {
    iconName: "Microscope" | "BarChart3" | "Heart" | "Home";
    title: string;
    description: string;
  }