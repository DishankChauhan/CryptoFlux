"use client"
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

// Dynamically import Spline with proper client-side handling
const Spline = dynamic(
  () => import('@splinetool/react-spline'),
  { 
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[#0A1A2F]" />
  }
);

export default function Home() {
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Track client-side mount state
    const handleScroll = () => {
      setNavbarScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent hydration mismatch
  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#0A1A2F] text-white overflow-hidden">
      {/* Navbar with Scroll Effect */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          navbarScrolled
            ? 'backdrop-blur-lg bg-[#0A1A2F]/30 border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 h-20 flex justify-between items-center">
          {/* Logo with gradient text */}
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-[#6C5CE7] to-[#00F5E9] text-transparent bg-clip-text">
            CryptoFlux
          </Link>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="rounded-full px-6 py-2 text-white hover:bg-white/10 transition-colors border border-white/20 hover:border-[#6C5CE7]/50"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                className="rounded-full px-6 py-2 bg-gradient-to-r from-[#6C5CE7] to-[#00F5E9] hover:opacity-90 transition-opacity text-white"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Spline */}
      <div className="relative h-screen">
        {isMounted && (
          <div className="absolute inset-0">
            <Spline scene="https://prod.spline.design/T9W30K5DiqkwYAJn/scene.splinecode" />
          </div>
        )}

        {/* Buttons Positioned to the Left */}
        <div className="absolute inset-0 flex items-end justify-start pb-32 pl-8">
          <div className="flex flex-col sm:flex-row justify-start gap-4">
            <Link href="/signup">
              <Button
                size="lg"
                className="rounded-full w-full sm:w-auto bg-gradient-to-r from-[#6C5CE7] to-[#00F5E9] hover:opacity-90 transition-opacity"
              >
                Get Started Free <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full w-full sm:w-auto border-white/20 hover:bg-white/10 text-white hover:text-white"
              >
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-[#0A1A2F]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 hover:border-[#6C5CE7]/50 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4">Multi-Currency Support</h3>
              <p className="text-gray-400">Accept payments in ETH, USDC, USDT, and other popular tokens</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 hover:border-[#6C5CE7]/50 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4">Instant Settlement</h3>
              <p className="text-gray-400">Receive payments directly to your wallet with no delays</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 hover:border-[#6C5CE7]/50 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4">Developer-First</h3>
              <p className="text-gray-400">Simple API integration with comprehensive documentation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-[#0A1A2F] border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Column 1: About */}
            <div>
              <h3 className="text-lg font-semibold mb-4">About CryptoFlux</h3>
              <p className="text-gray-400">
                CryptoFlux is a leading platform for Web3 payments, enabling businesses to accept cryptocurrencies and unlock global commerce.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs" className="text-gray-400 hover:text-[#00F5E9] transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-400 hover:text-[#00F5E9] transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-[#00F5E9] transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-[#00F5E9] transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Social Media */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="https://twitter.com" className="text-gray-400 hover:text-[#00F5E9] transition-colors">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="https://linkedin.com" className="text-gray-400 hover:text-[#00F5E9] transition-colors">
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link href="https://github.com" className="text-gray-400 hover:text-[#00F5E9] transition-colors">
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
              <p className="text-gray-400 mb-4">
                Stay updated with the latest news and features from CryptoFlux.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#00F5E9]"
                />
                <Button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#00F5E9] hover:opacity-90 transition-opacity"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>© 2023 CryptoFlux. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}