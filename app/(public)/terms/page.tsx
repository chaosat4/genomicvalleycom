export default function TermsPage() {
  return (
    <div className="min-h-screen bg-purple-50 pt-44 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing and using Genomic Valley's services, you agree to be bound by these Terms & Conditions. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">2. Service Description</h2>
            <p className="text-gray-600">
              Genomic Valley provides genomic testing, analysis, and related services. Our services include:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Genetic testing and analysis</li>
              <li>Research services</li>
              <li>Diagnostic services</li>
              <li>Genetic counseling</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">3. User Responsibilities</h2>
            <p className="text-gray-600">
              Users of our services agree to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Provide accurate information</li>
              <li>Maintain confidentiality of their account</li>
              <li>Use services in compliance with laws</li>
              <li>Not misuse or abuse our services</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">4. Payment Terms</h2>
            <p className="text-gray-600">
              Payment terms and conditions include:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>All fees are in Indian Rupees (INR)</li>
              <li>Payment is required before service delivery</li>
              <li>Refunds are subject to our refund policy</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">5. Limitation of Liability</h2>
            <p className="text-gray-600">
              Genomic Valley shall not be liable for:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Indirect or consequential damages</li>
              <li>Service interruptions</li>
              <li>Third-party actions</li>
              <li>Force majeure events</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">6. Changes to Terms</h2>
            <p className="text-gray-600">
              We reserve the right to modify these terms at any time. Users will be notified of significant changes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Contact Information</h2>
            <p className="text-gray-600">
              For questions about these terms, contact us at:
            </p>
            <div className="text-gray-600">
              <p>Email: support@genomicvalley.com</p>
              <p>Phone: +91 8091366601</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 