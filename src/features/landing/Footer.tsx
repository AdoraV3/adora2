'use client'

import Image from 'next/image'
import { ArrowUp } from 'lucide-react'
import adoraLogo from '../../../public/adora3-logo.png'
import Link from 'next/link'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigationLinks = [
    { name: 'About', href: '/about' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Terms', href: '/terms' },
    { name: 'Contact', href: '/contact' },
    { name: 'Get Started', href: '/signup' }
  ]

  const socialLinks = [
    { name: 'Facebook', href: '#' },
    { name: 'Twitter', href: '#' },
    { name: 'LinkedIn', href: '#' },
    { name: 'Instagram', href: '#' }
  ]

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="mb-6">
              <Image src={adoraLogo} alt="Adora3" width={120} height={40} className="h-8 w-auto" />
            </div>
            
            <div className="space-y-2 text-sm">
              <p>734 States Street Mississauga,</p>
              <p>Ontario Canada.</p>
            </div>
            
            <div className="space-y-2 text-sm">
              <p>
                <a 
                  href="mailto:info@adora3.com" 
                  className="hover:text-orange-400 transition-colors"
                >
                  info@adora3.com
                </a>
              </p>
              <p>
                <a 
                  href="tel:+13065510212" 
                  className="hover:text-orange-400 transition-colors"
                >
                  +1 (306) 551-0212
                </a>
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base">Quick Links</h3>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-orange-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base">Follow Us</h3>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-orange-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-12 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2025 Adora3. All rights reserved.
            </p>
            
            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full transition-all duration-200 transform hover:scale-110 shadow-lg"
              aria-label="Back to top"
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer