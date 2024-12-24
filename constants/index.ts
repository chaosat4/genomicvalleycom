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
  
  export const FAQ_CONSTANTS = {
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions about our services",
    categories: [
      {
        title: "General",
        icon: "Target",
      },
      {
        title: "Services",
        icon: "ClipboardList",
      },
      {
        title: "Process",
        icon: "Clock",
      },
      {
        title: "Results",
        icon: "Eye",
      },
    ],
    questions: [
      // General Questions
      {
        category: "General",
        question: "What is GenomicValley?",
        answer: "GenomicValley is a cutting-edge genomics research and analysis platform that combines advanced technology with expert knowledge to provide comprehensive genomic solutions. We specialize in DNA sequencing, analysis, and interpretation for both research and clinical applications.",
      },
      {
        category: "General",
        question: "How long has GenomicValley been in operation?",
        answer: "GenomicValley has been at the forefront of genomic research for over a decade, established in 2013. During this time, we've contributed to numerous breakthrough discoveries and have served thousands of researchers and healthcare professionals worldwide.",
      },
      {
        category: "General",
        question: "What makes GenomicValley different from other genomics companies?",
        answer: "Our unique combination of state-of-the-art technology, experienced scientists, and personalized service sets us apart. We offer end-to-end solutions, from sample collection to data analysis, with industry-leading turnaround times and competitive pricing.",
      },
       // Services Questions
      {
        category: "Services",
        question: "What types of sequencing services do you offer?",
        answer: "We offer a comprehensive range of sequencing services including Whole Genome Sequencing (WGS), Whole Exome Sequencing (WES), RNA-Seq, ChIP-Seq, and targeted panel sequencing. Each service can be customized to meet specific research needs.",
      },
      {
        category: "Services",
        question: "Do you provide bioinformatics support?",
        answer: "Yes, we provide comprehensive bioinformatics support including data analysis, interpretation, and visualization. Our team of experienced bioinformaticians can help with everything from basic analysis to complex custom pipelines.",
      },
      {
        category: "Services",
        question: "What sample types do you accept?",
        answer: "We accept a wide range of sample types including blood, saliva, tissue samples, cell lines, and extracted DNA/RNA. Our laboratory is equipped to handle both human and non-human samples with appropriate quality control measures.",
      },
       // Process Questions
      {
        category: "Process",
        question: "How long does the sequencing process take?",
        answer: "Standard turnaround time for most sequencing projects is 2-3 weeks from sample receipt. However, this can vary depending on the service type and project complexity. We also offer expedited services for time-sensitive projects.",
      },
      {
        category: "Process",
        question: "What is your sample handling protocol?",
        answer: "All samples are handled following strict quality control protocols. Upon receipt, samples are logged into our LIMS system, quality checked, and stored in appropriate conditions. We maintain chain of custody documentation throughout the process.",
      },
      {
        category: "Process",
        question: "How do you ensure data security?",
        answer: "We implement industry-standard security measures including encrypted data storage, secure file transfer protocols, and restricted access controls. All data is backed up regularly and stored in compliance with HIPAA and GDPR regulations.",
      },
       // Results Questions
      {
        category: "Results",
        question: "How do you deliver results?",
        answer: "Results are delivered through our secure online portal in various formats including raw data, processed files, and detailed reports. We can customize the delivery format based on your preferences and requirements.",
      },
      {
        category: "Results",
        question: "What kind of analysis is included in the results?",
        answer: "Our standard analysis includes quality metrics, alignment statistics, variant calling, and basic interpretation. Additional analyses such as pathway analysis, comparative genomics, or custom bioinformatics can be added as needed.",
      },
      {
        category: "Results",
        question: "How long do you store the data?",
        answer: "We securely store all raw and processed data for a minimum of 12 months at no additional cost. Extended storage options are available upon request. You can access your data at any time through our secure portal.",
      },
    ],
  }

  
