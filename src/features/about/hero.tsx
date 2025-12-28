import React from 'react';
import Image from 'next/image';
import image from '../../../public/empowerment.jpg'

interface DecorativeShapeProps {
  className?: string;
}

const DecorativeShape: React.FC<DecorativeShapeProps> = ({ className = "" }) => (
  <div className={`bg-orange-200 opacity-30 ${className}`} />
);

const AboutUsHero: React.FC = () => (
  <div className="min-h-screen bg-white relative overflow-hidden">
    {/* Decorative background shapes */}
    <DecorativeShape className="absolute top-0 left-0 w-32 h-64 lg:w-48 lg:h-96" />
    <DecorativeShape className="absolute top-0 left-32 w-24 h-32 lg:left-48 lg:w-36 lg:h-48" />
    <DecorativeShape className="absolute top-16 left-56 w-20 h-40 lg:left-84 lg:w-32 lg:h-64" />
    <DecorativeShape className="absolute top-12 right-0 w-28 h-48 lg:w-40 lg:h-72" />
    <DecorativeShape className="absolute bottom-0 right-28 w-24 h-32 lg:right-40 lg:w-36 lg:h-48" />
    
    <div className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
      <div className="flex flex-col max-md:flex-col-reverse gap-8">
        
        {/* Text Content */}
        <div className="order-2 lg:order-1">
          <div className="mb-6">
            <span className="text-orange-500 font-medium text-lg">About us</span>
          </div>
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
            Empowering<br/> businesses to thrive
          </h1>
        </div>
        
        {/* Image Section */}
        <div className="order-1 lg:order-2">
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <Image 
              src={image}
              alt="Team collaboration - diverse group of professionals working together in a modern office"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
        
      </div>
    </div>
  </div>
);

export default AboutUsHero;