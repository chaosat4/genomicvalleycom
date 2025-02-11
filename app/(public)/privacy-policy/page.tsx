export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-purple-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Information We Collect</h2>
            <p className="text-gray-600">
              At Genomic Valley, we collect various types of information to provide and improve our services:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Personal identification information (Name, email address, phone number)</li>
              <li>Genetic and health information</li>
              <li>Payment information</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">How We Use Your Information</h2>
            <p className="text-gray-600">
              We use the collected information for:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Providing and maintaining our services</li>
              <li>Improving our services</li>
              <li>Communicating with you</li>
              <li>Processing payments</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Data Security</h2>
            <p className="text-gray-600">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Encryption of sensitive data</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Secure data storage and transmission</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Your Rights</h2>
            <p className="text-gray-600">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Access your personal data</li>
              <li>Request data correction</li>
              <li>Request data deletion</li>
              <li>Withdraw consent</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at:
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