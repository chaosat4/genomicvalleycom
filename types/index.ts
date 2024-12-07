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
    icon?: React.ReactNode;
    title: string;
    description: string;
  }