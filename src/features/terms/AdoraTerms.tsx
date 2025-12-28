import { Shield, Users, CreditCard, Copyright, AlertTriangle, Gavel, Settings } from 'lucide-react'

const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
  <section className="mb-8">
    <div className="flex items-center gap-3 mb-4">
      <Icon className="w-6 h-6 text-blue-600" />
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    </div>
    {children}
  </section>
)

const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
    {children}
  </div>
)

const List = ({ items }: { items: string[] }) => (
  <ul className="space-y-2 ml-4">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2">
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
        <span className="text-gray-700">{item}</span>
      </li>
    ))}
  </ul>
)

export default function AdoraTerms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Introduction</h1>
              <p className="text-gray-600">Adora is a B2B AI-powered customer service platform provided by Poulina Inc</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Definition</h3>
              <p className="text-sm text-blue-800">Adora is a B2B AI-powered customer service platform provided by Poulina Inc</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-1">User</h4>
              <p className="text-sm text-green-800">Refers to businesses and authorized individuals accessing the platform.</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-1">Content</h4>
              <p className="text-sm text-purple-800">Includes any data, text, or media uploaded, processed, or generated using the Services.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
          <Section title="Use of Services" icon={Users}>
            <p className="text-gray-700 mb-6">Adora is designed to streamline customer service processes through AI-powered tools. Users must adhere to the following:</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <SubSection title="1. Eligibility">
                <p className="text-gray-700">You must be a registered business entity or authorized representative to use Adora.</p>
              </SubSection>
              
              <SubSection title="2. Account Responsibilities">
                <p className="text-gray-700">Maintain the confidentiality of login credentials. Notify Adora immediately of unauthorized account use.</p>
              </SubSection>
            </div>
            
            <SubSection title="3. Permitted Use">
              <p className="text-gray-700">You may use Adora only for lawful business purposes.</p>
            </SubSection>
            
            <SubSection title="4. Prohibited Activities">
              <List items={[
                "Use of platform for fraudulent or illegal activities is highly prohibited.",
                "Modify, reverse-engineer, or decompile Adora's code.",
                "Introduce malware, spam, or other disruptive elements."
              ]} />
            </SubSection>
          </Section>

          <Section title="Subscription and Billing" icon={CreditCard}>
            <div className="grid md:grid-cols-3 gap-6">
              <SubSection title="1. Payment Terms">
                <List items={[
                  "Subscription fees are billed monthly or annually, depending on your plan.",
                  "Payments are non-refundable unless explicitly stated otherwise."
                ]} />
              </SubSection>
              
              <SubSection title="2. Cancellation">
                <p className="text-gray-700">You may cancel your subscription at any time. Cancellation will take effect at the end of the billing cycle.</p>
              </SubSection>
              
              <SubSection title="3. Changes to Fees">
                <p className="text-gray-700">Adora reserves the right to adjust subscription fees with prior notice.</p>
              </SubSection>
            </div>
          </Section>

          <Section title="Intellectual Property" icon={Copyright}>
            <p className="text-gray-700">Adora and all related materials are the intellectual property of Poulina Inc. Users are granted a non-exclusive, non-transferable license to use the platform for their business operations.</p>
          </Section>

          <Section title="Limitation of Liability" icon={Shield}>
            <p className="text-gray-700 mb-4">Adora is provided "as-is" without warranties of any kind. Poulina Inc. is not liable for:</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-2">Losses</h4>
                <p className="text-sm text-red-800">Caused by user error, third-party service failures, or interruptions.</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">Indirect or Consequential Damages</h4>
                <p className="text-sm text-orange-800">Not covered under liability.</p>
              </div>
            </div>
          </Section>

          <Section title="Termination" icon={AlertTriangle}>
            <p className="text-gray-700">Adora may suspend or terminate your account if you violate these Terms. Upon termination, access to all platform features will cease immediately.</p>
          </Section>

          <Section title="Governing Law" icon={Gavel}>
            <p className="text-gray-700">These Terms are governed by the laws of Ontario, Canada.</p>
          </Section>

          <Section title="Changes to Terms" icon={Settings}>
            <p className="text-gray-700">We may update these Terms periodically. Continued use of the Services constitutes acceptance of any modifications.</p>
          </Section>
        </div>
      </div>
    </div>
  )
}