import React from 'react';
import Image from 'next/image';
import { MapPin, Mail, Phone } from 'lucide-react';

interface ContactInfoProps {
  icon: React.ReactNode;
  text: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ icon, text }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="bg-orange-500 rounded-full p-2 flex-shrink-0">
      {icon}
    </div>
    <span className="text-gray-700">{text}</span>
  </div>
);

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  isTextarea?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  type = "text", 
  placeholder = "", 
  isTextarea = false 
}) => (
  <div className="mb-6">
    <label className="block text-gray-600 mb-2">{label}</label>
    {isTextarea ? (
      <textarea 
        className="w-full p-4 border border-gray-300 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
        placeholder={placeholder}
      />
    ) : (
      <input 
        type={type}
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        placeholder={placeholder}
      />
    )}
  </div>
);

const ContactSection: React.FC = () => (
  <div className="bg-gray-50 p-8 lg:p-12">
    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
      We'd Love To Hear From
    </h1>
    <p className="text-orange-500 text-xl mb-8">Get in Touch with Adora3 Support Team</p>
    
    <div className="space-y-1">
      <ContactInfo 
        icon={<MapPin className="w-5 h-5 text-white" />}
        text="734 States Street Mississauga, Ontario Canada."
      />
      <ContactInfo 
        icon={<Mail className="w-5 h-5 text-white" />}
        text="info@adora3.com"
      />
      <ContactInfo 
        icon={<Phone className="w-5 h-5 text-white" />}
        text="+1 (306) 551-0212"
      />
    </div>
  </div>
);

const ContactForm: React.FC = () => (
  <div className="bg-white p-8 lg:p-12">
    <form className="max-w-md mx-auto">
      <InputField label="Full Name" />
      <InputField label="Business Name" />
      <InputField label="Email Address" type="email" />
      <InputField 
        label="What would you like to discuss?" 
        isTextarea={true}
      />
    </form>
  </div>
);

const MainContactSection: React.FC = () => (
  <div className="min-h-screen bg-gray-100">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 min-h-screen">
        <ContactSection />
        <ContactForm />
      </div>
    </div>
  </div>
);

export default MainContactSection;