import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Linkedin, Twitter } from 'lucide-react'
import Image from "next/image"



const teamData = [
  {name: "Mr. Yogesh Agrawal", role: "Director", image: "/ya.jpeg", socialLinks: [
    { icon: Linkedin, href: "https://www.linkedin.com/in/yogesh-agrawal-b33b952a/" },
  ]},
  {name: "Dr. Amit Chaurasia", role: "Chief Operating Officer", image: "/ac.jpeg", socialLinks: [
    { icon: Linkedin, href: "https://www.linkedin.com/in/amit-chaurasia-42728b13/" },
  ]},
  { name: "Ms. Romasha Gupta", role: "Senior Manager - Scientific Affairs", image: "/rg.jpeg", socialLinks: [
    { icon: Linkedin, href: "https://www.linkedin.com/in/romasha-gupta-98a44b190/" },
  ]},
  { name: "Mr. Vishal", role: "Bioinformatics Analyst", image: "/vishal.jpeg", socialLinks: [
    { icon: Linkedin, href: "https://www.linkedin.com/in/vishal-singh-a58491216/" },
  ]},
]

export default function AboutUs() {
  return (
    <section className="py-6 bg-purple-50 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <h1 className="text-4xl md:text-4xl font-bold text-purple-700 text-center mb-12">Our Team</h1>
               
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {teamData.map((member, index) => (
            <Card key={index} className="border-purple-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-4 flex flex-col items-center">
                <div className="relative w-32 h-32 mb-3">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-1 text-center">{member.name}</h3>
                <p className="text-sm text-muted-foreground text-center">{member.role}</p>
                <a href={member.socialLinks[0].href} target="_blank" rel="noopener noreferrer" className="mt-2">
                  <Linkedin className="w-5 h-5 text-purple-500 hover:text-purple-700 transition-colors" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

