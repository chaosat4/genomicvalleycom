'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dna } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface ServiceData {
  id: number;
  name: string;
  overview: string;
  commitment: string;
  contact: string;
  price: number;
  whyChoose: { feature: string; description: string }[];
  whoCanBenefit: { type: string; description: string }[];
  diseasesSupported: { name: string; relevance: string }[];
  process: { step: string; description: string }[];
  faqs: { question: string; answer: string }[];
}

export default function ServiceDetails({ id }: { id: string }) {
  const [data, setData] = useState<ServiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchService = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/services/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch service details');
        }
        
        const serviceData = await response.json();
        
        // Validate required arrays exist
        if (!serviceData.whyChoose) serviceData.whyChoose = [];
        if (!serviceData.whoCanBenefit) serviceData.whoCanBenefit = [];
        if (!serviceData.diseasesSupported) serviceData.diseasesSupported = [];
        if (!serviceData.process) serviceData.process = [];
        if (!serviceData.faqs) serviceData.faqs = [];
        
        setData(serviceData);
        setError(null);
      } catch (err) {
        console.error('Error fetching service:', err);
        setError(err instanceof Error ? err.message : 'Failed to load service');
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleBuyNow = () => {
    router.push(`/checkout/${id}`);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error || 'Service not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 text-foreground pt-40 pb-12">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <Dna className="inline-block w-16 h-16 text-primary mb-4" />
          <h1 className="text-5xl font-bold mb-4 text-primary">{data.name}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">{data.overview}</p>
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={handleBuyNow}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Buy Now
            </button>
          </div>
        </header>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-primary">Why Choose Our Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.whyChoose.map((feature, index) => (
              <Card key={index} className="bg-accent shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-primary">{feature.feature}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-primary">Who Can Benefit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.whoCanBenefit.map((item, index) => (
              <Card key={index} className="bg-secondary shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-primary">{item.type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-secondary-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-primary">Diseases Supported</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.diseasesSupported.map((disease, index) => (
              <Card key={index} className="bg-muted shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-primary">{disease.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{disease.relevance}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-primary">Our Process</h2>
          <ol className="list-none space-y-4">
            {data.process.map((step, index) => (
              <li key={index} className="bg-accent rounded-lg p-4 shadow-md">
                <span className="font-semibold text-primary text-lg block mb-2">{step.step}</span>
                <p className="text-accent-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-primary">Our Commitment</h2>
          <Card className="bg-secondary shadow-lg">
            <CardContent className="p-6">
              <p className="text-lg text-secondary-foreground">{data.commitment}</p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-primary">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {data.faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-primary/20">
                <AccordionTrigger className="text-primary hover:text-primary/80">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-primary">Contact Us</h2>
          <Card className="bg-accent shadow-lg">
            <CardContent className="p-6">
              <p className="text-lg text-center text-accent-foreground">{data.contact}</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}