import React from 'react';
import Image from 'next/image';
import image from '../../../public/CSAgent.jpg'

interface SectionHeaderProps {
  title: string;
  highlightedWord: string;
  description: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, highlightedWord, description }) => (
  <div className="mb-8 lg:mb-0">
    <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6 leading-tight">
      {title} <span className="text-orange-500">{highlightedWord}</span>
    </h2>
    <p className="text-gray-700 text-lg leading-relaxed max-w-md">
      {description}
    </p>
  </div>
);

interface ContentBlockProps {
  children: React.ReactNode;
}

const ContentBlock: React.FC<ContentBlockProps> = ({ children }) => (
  <div className="text-gray-700 text-lg leading-relaxed">
    {children}
  </div>
);

const HowWeMakeDifference: React.FC = () => (
  <section className="bg-white py-16 lg:py-24">
    <div className="container mx-auto px-4">
      <div className="flex justify-between flex-wrap-reverse max-md:gap-16">
        
        {/* Left Content */}
        <div className="w-1/2 max-md:w-full">
          <SectionHeader 
            title="How We Make a"
            highlightedWord="Difference"
            description="At Adora, we specialize in leveraging cutting-edge AI technology to transform customer service."
          />
          
          <ContentBlock>
            <p>
              We provide businesses with innovative solutions that combine the empathy of human 
              agents with the efficiency and scalability of AI. From setting up AI-powered call 
              centers to delivering personalized customer interactions, we're dedicated to 
              redefining the customer service experience for businesses worldwide.
            </p>
          </ContentBlock>
        </div>
        
        {/* Right Image */}
        <div className="flex-1">
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <Image 
                src={image}
                alt="Customer service representative wearing headset, speaking animatedly while providing support"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </section>
);

export default HowWeMakeDifference;