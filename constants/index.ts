import { NavigationItem } from "@/types";


export const navigationItems: NavigationItem[] = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "About",
      href: "/about",
    },
    {
      name: "Services",
      href: "/services",
      features: [
        {
          title: "Feature 1",
          href: "/feature-1",
          description: "Description of Feature 1 related to Services."
        },
        {
          title: "Feature 2",
          href: "/feature-2",
          description: "Description of Feature 2 related to Services."
        }
      ]
    },
    {
      name: "How we Work",
      href: "/how-we-work",
      features: [
        {
          title: "Feature 1",
          href: "/feature-1",
          description: "Description of Feature 1 related to How we Work."
        },
        {
          title: "Feature 2",
          href: "/feature-2",
          description: "Description of Feature 2 related to How we Work."
        }
      ]
    },
    {
      name: "Clinical Test",
      href: "/clinical-test",
      features: [
        {
          title: "Feature 1",
          href: "/feature-1",
          description: "Description of Feature 1 related to Clinical Test."
        },
        {
          title: "Feature 2",
          href: "/feature-2",
          description: "Description of Feature 2 related to Clinical Test."
        }
      ]
    },
    {
      name: "Knowledge Center",
      href: "/knowledge-center",
    },
    {
      name: "Contact Us",
      href: "/contact"
      // No features for Contact Us
    }
  ]

  export const featureCards = [
    {
      iconName: "Microscope",
      title: "Advanced Analysis",
      description: "State-of-the-art genomic analysis tools powered by cutting-edge algorithms and machine learning."
    },
    {
      iconName: "BarChart3",
      title: "Data Visualization",
      description: "Interactive and intuitive visualization tools to help you understand complex genomic data."
    },
    {
      iconName: "Heart",
      title: "Healthcare Integration",
      description: "Seamless integration with healthcare systems for improved patient care and research outcomes."
    },
    {
      iconName: "Home",
      title: "User-Friendly Platform",
      description: "Easy-to-use interface designed for both researchers and healthcare professionals."
    }
  ] as const;

  export const FOOTER_CONSTANTS = {
    supportBanner: {
      title: "Talk to our Customer support for assistance",
      buttons: [
        { text: "Request a call now", action: "#" },
        { text: "Talk to us on Whatsapp", action: "#" }
      ]
    },
    columns: [
      {
        title: "Company Info",
        links: [
          { text: "About Us", href: "#" },
          { text: "Career", href: "#" },
          { text: "We are hiring", href: "#" },
          { text: "Blog", href: "#" }
        ]
      },
      {
        title: "Features",
        links: [
          { text: "Business Marketing", href: "#" },
          { text: "User Analytics", href: "#" },
          { text: "Live Chat", href: "#" },
          { text: "Unlimited Support", href: "#" }
        ]
      },
      {
        title: "Doctors",
        links: [
          { text: "Phlebotomy", href: "#" },
          { text: "Sample Pickup", href: "#" },
          { text: "We are hiring", href: "#" },
          { text: "Blog", href: "#" }
        ]
      },
      {
        title: "Resources",
        links: [
          { text: "iOS & Android", href: "#" },
          { text: "Watch a Demo", href: "#" },
          { text: "Customers", href: "#" },
          { text: "API", href: "#" }
        ]
      }
    ],
    getInTouch: {
      title: "Get in Touch",
      phone: "+91 9100693399",
      address: "Plot No:60 & 47B,\nWest Road, Beside Ayappa Society,\nMadhapur, Hyderabad.",
      email: "info@cpathlab.com"
    },
    copyright: "Made With Love By FlyingStars Informatics All Right Reserved",
    socialLinks: [
      { name: "Facebook", href: "#", icon: "FacebookIcon" },
      { name: "Instagram", href: "#", icon: "InstagramIcon" },
      { name: "Twitter", href: "#", icon: "TwitterIcon" }
    ]
  }
  
  