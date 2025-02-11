import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Linkedin, Twitter } from 'lucide-react'
import Image from "next/image"

const leadershipData = {
  name: "Mr. Yogesh Agrawal",
  role: "Chairman",
  image: "/ya.jpeg",
  socialLinks: [
    { icon: Linkedin, href: "https://www.linkedin.com/in/yogesh-agrawal-b33b952a/" },
  ],
}

const teamData = [
  { name: "Mr. Vipul Garg", role: "Executive Assistant to MD", image: "/vg.jpg" },
  { name: "Mr. Sanjoy Gupta", role: "General Manager", image: "/sg.jpg" },
  { name: "Ms. Romasha Gupta", role: "Project Manager", image: "/rg.jpeg" },
]

export default function AboutUs() {
  return (
    <section className="py-12 bg-purple-50 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-purple-700 text-center mb-12">Leadership</h1>
        
        <Card className="max-w-md mx-auto mb-16 border-purple-500">
          <CardContent className="p-6 flex flex-col items-center">
            <Image
              src={leadershipData.image}
              alt={leadershipData.name}
              width={200}
              height={200}
              className="rounded-full mb-4"
            />
            <h2 className="text-2xl font-semibold mb-1">{leadershipData.name}</h2>
            <p className="text-muted-foreground mb-4">{leadershipData.role}</p>
            <div className="flex space-x-4">
              {leadershipData.socialLinks.map((link, index) => (
                <Button key={index} variant="ghost" size="icon" asChild>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    <link.icon className="h-5 w-5" />
                    <span className="sr-only">{link.icon.name}</span>
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <h2 className="text-3xl md:text-4xl font-bold text-purple-700 text-center mb-8">Our Team</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {teamData.map((member, index) => (
            <Card key={index} className="border-purple-500">
              <CardContent className="p-4 flex flex-col items-center">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150}
                  height={150}
                  className="rounded-full mb-3"
                />
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

