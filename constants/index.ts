import { NavigationItem } from "@/types";


export const navigationItems: NavigationItem[] = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "About",
      href: "/about-us",
    },
    {
      name: "Services",
      href: "/services",
      features: [
        {
          title: "Diagnostic Services",
          href: "/diagnostic",
          description: "We offer a wide range of diagnostic services, including genomics, proteomics, and bioinformatics. Our team of experienced researchers and bioinformaticians can help you with everything from basic analysis to complex custom pipelines."
        },
        {
          title: "Research Services",
          href: "/research",
          description: "We offer a wide range of research services, including genomics, proteomics, and bioinformatics. Our team of experienced researchers and bioinformaticians can help you with everything from basic analysis to complex custom pipelines."
        }
      ]
    },
    {
      name: "Panels",
      href: "/panels",
    },
    {
      name: "Genetic Counseling",
      href: "/genetic-counseling",
    },
    {
      name: "Contact Us",
      href: "/contact"
      // No features for Contact Us
    }
  ]

  export const featureCards = [
    {
      iconName: "Target",
      title: "Precision Analysis",
      description: "Trust our experienced team to deliver accurate and reliable NGS data. Our expert-curated data ensures that your research is built on a foundation of precision and excellence."
    },
    {
      iconName: "BarChart3",
      title: "Unlocking Discoveries with Cutting-Edge Tech",
      description: "Stay ahead of the curve with our state-of-the-art NGS technologies. Our commitment to innovation ensures that you have access to the latest advancements in genomics research."
    },
    {
      iconName: "Globe2",
      title: "Your Global Partner in Genomics Research",
      description: "Tap into our network of labs and experts worldwide. Our global reach enables us to provide seamless support, no matter where your research takes you."
    },
    {
      iconName: "LineChart",
      title: "Transforming Data into Insights",
      description: "Our expert bioinformaticians and analysts turn complex NGS data into actionable insights. Let us help you unlock the full potential of your research."
    },
    {
      iconName: "Clock",
      title: "Reliable, Rapid, and Customized NGS Solutions",
      description: "Get the data you need, when you need it. Our flexible and scalable NGS services are designed to meet your unique research requirements, with rapid turnaround times and uncompromising quality."
    },
    {
      iconName: "FlaskConical",
      title: "Elevate Your Research with Our Expert NGS Services",
      description: "Take your research to the next level with our comprehensive NGS services. From library preparation to data analysis, our team of experts is dedicated to helping you achieve your research goals."
    }
  ] as const;

  export const FOOTER_CONSTANTS = {
    columns: [
      {
        title: "Company Info",
        links: [
          { text: "About Us", href: "/about-us" },
          { text: "Career", href: "/contact" },
          { text: "We are hiring", href: "/contact" },
        ]
      },
      {
        title: "Services",
        links: [
          { text: "Genetic Counselling", href: "/genetic-counseling" },
          { text: "Research Services", href: "/services/research" },
          { text: "Diagnostic Services", href: "/services/diagnostic" },
        ]
      },
      {
        title: "Resources",
        links: [
          { text: "Testimonials", href: "/testimonials" },
          { text: "Privacy Policy", href: "/privacy-policy" },
          { text: "Terms & Conditions", href: "/terms" },
        ]
      }
    ],
    getInTouch: {
      title: "Get in Touch",
      phone: "+91 98113 41542",
      email: "info@genomicvalley.in",
      address: "2nd Floor G74,\n Pushkar Enclave, Paschim Vihar,\n New Delhi, India - 110063",
    },
    copyright: "Made With Love By Genomic Valley Bharat Limited All Right Reserved",
    socialLinks: [
      { name: "Facebook", href: "#", icon: "FacebookIcon" },
      { name: "Instagram", href: "#", icon: "InstagramIcon" },
      { name: "Twitter", href: "#", icon: "TwitterIcon" }
    ],
    supportBanner: {
      title: "Talk to our Customer support for assistance",
      buttons: [
        { 
          text: "Request a call now", 
          action: "/request-call" 
        },
        { 
          text: "Talk to us on Whatsapp", 
          action: "https://wa.me/918091366601" 
        }
      ]
    }
  } as const;
  
  export const FAQ_CONSTANTS = {
    title: "Frequently Asked Questions",
    subtitle: "Learn more about our AI-driven genomics services and research focus",
    categories: [
      {
        title: "Diagnostics & Predisposition",
        icon: "TestTube"
      },
      {
        title: "Personalized Healthcare",
        icon: "UserCheck"
      },
      {
        title: "Community Health",
        icon: "Globe"
      },
      {
        title: "Oncology Research",
        icon: "Microscope"
      }
    ],
    questions: [
      // Diagnostics & Predisposition
      {
        category: "Diagnostics & Predisposition",
        question:
          "What are the primary diagnostic services offered by Genomic Valley Biotech Limited?",
        answer:
          "We specialize in Next-Generation Sequencing (NGS)-based molecular diagnostics, leveraging advanced AI to detect genetic mutations and abnormalities. This approach enables early identification of risk factors and supports customized treatment strategies, especially in oncology."
      },
      {
        category: "Diagnostics & Predisposition",
        question: "Could you explain your genetic disease predisposition services?",
        answer:
          "We utilize NGS to evaluate hereditary risk factors and conduct pharmacogenomic assessments, providing proactive healthcare strategies. This helps patients and healthcare professionals make informed decisions based on genetic insights."
      },
  
      // Personalized Healthcare
      {
        category: "Personalized Healthcare",
        question:
          "What are the key components of your personalized healthcare services?",
        answer:
          "Our personalized care model combines NGS with AI to tailor medical treatments according to individual genetic profiles. This approach improves therapy effectiveness, minimizes side effects, and ensures patient-focused care."
      },
  
      // Community Health
      {
        category: "Community Health",
        question:
          "How does Genomic Valley Biotech Limited support community health through genomic initiatives?",
        answer:
          "By integrating AI into large-scale NGS efforts, we enable population-wide genetic screening to identify common health risks. These insights guide targeted community health programs and preventive measures aimed at improving public health outcomes."
      },
  
      // Oncology Research
      {
        category: "Oncology Research",
        question:
          "How does Genomic Valley Biotech Limited contribute to oncology research?",
        answer:
          "Building on over a decade of experience in NGS and AI, we drive innovation in cancer research by discovering novel biomarkers and genetic targets. We partner with leading institutions to develop more precise diagnostic methods and therapeutic strategies."
      }
    ]
  };
  

  
