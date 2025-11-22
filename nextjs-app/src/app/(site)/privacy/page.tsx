export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 md:py-16 md:py-16  md:px-8 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8" style={{ color: '#4B2E2B' }}>
          Privacy Policy
        </h1>
        <p className="text-gray-600 mb-6">Last updated: November 21, 2025</p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#4B2E2B' }}>
              1. Introduction
            </h2>
            <p>
              The Lil Gift Corner ("we", "our", or "us") operates the lilgiftcorner.com website
              (the "Service"). This page informs you of our policies regarding the collection,
              use, and disclosure of personal data when you use our Service and the choices you
              have associated with that data.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#4B2E2B' }}>
              2. Information Collection and Use
            </h2>
            <p className="mb-4">We collect several different types of information for various purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Name, email, password, address</li>
              <li><strong>Payment Information:</strong> Processed securely by Stripe (not stored locally)</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, clicks, referrer</li>
              <li><strong>Communication:</strong> Messages submitted through contact forms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#4B2E2B' }}>
              3. Use of Data
            </h2>
            <p className="mb-4">We use the collected data for various purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information for improving our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues and fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#4B2E2B' }}>
              4. Security of Data
            </h2>
            <p>
              We implement comprehensive security measures including HTTPS encryption, secure
              password hashing with bcryptjs, and JWT token-based authentication. However, no
              method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#4B2E2B' }}>
              5. Your GDPR Rights
            </h2>
            <p className="mb-4">If you are located in the EU, you have the following rights:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Right to access your personal data</li>
              <li>Right to correct inaccurate data</li>
              <li>Right to request deletion of your data</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#4B2E2B' }}>
              6. Account Deletion
            </h2>
            <p>
              You can request deletion of your account at any time through your profile settings.
              Upon deletion, we will anonymize your personal data while retaining order information
              for legal compliance.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#4B2E2B' }}>
              7. Cookies
            </h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our Service
              and hold certain information. You can set your browser to refuse cookies or alert
              you when cookies are being sent.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#4B2E2B' }}>
              8. Third-Party Services
            </h2>
            <p className="mb-4">Our Service may use third-party services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Stripe:</strong> Payment processing (see Stripe Privacy Policy)</li>
              <li><strong>MongoDB:</strong> Data storage (see MongoDB Privacy Policy)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#4B2E2B' }}>
              9. Changes to This Privacy Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any
              changes by posting the new Privacy Policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#4B2E2B' }}>
              10. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <strong>Email:</strong> privacy@lilgiftcorner.com
              <br />
              <strong>Address:</strong> The Lil Gift Corner
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
