'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import adora from '../../../../public/adora3-logo.png'

const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const navItems = [
    { name: 'Terms', href: '/terms' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About us', href: '/about' },
    { name: 'Contact Us', href: '/contact' }
  ]

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Image src={adora} alt="Adora3" width={120} height={40} className="h-8 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href={'/login'} className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
              Log In
            </Link>
            <Link href={'/signup'} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors">
              Sign Up For Free
            </Link>
          </div>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200 space-y-2">
                <Link href='/login' className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors">
                  Log In
                </Link>
                <Link href='signup' className="bg-orange-600 hover:bg-orange-700 max-md:text-center text-white block w-full px-3 py-2 rounded-md text-base font-medium transition-colors">
                  Sign Up For Free
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default LandingHeader