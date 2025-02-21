'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Check, Twitter, Linkedin } from 'lucide-react';
import { useEffect, useState } from 'react';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#0A1A2F] flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#00F5E9]"></div>
    </div>
  )
});

export default function Home() {
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setNavbarScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#0A1A2F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#00F5E9]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1A2F] text-white overflow-hidden">
      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          navbarScrolled
            ? 'backdrop-blur-lg bg-[#0A1A2F]/30 border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 h-20 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-[#6C5CE7] to-[#00F5E9] text-transparent bg-clip-text">
            CryptoFlux
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button
                variant="outline"
                className="rounded-full px-6 py-2 bg-white text-black hover:bg-gray-100 border-none"
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

      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <Spline scene="https://prod.spline.design/T9W30K5DiqkwYAJn/scene.splinecode" />
        </div>
        <div className="absolute inset-0 flex flex-col items-start justify-start">
          <div className="max-w-2xl mx-8 mt-32 z-10 space-y-8">
            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-[#6C5CE7] to-[#00F5E9] text-transparent bg-clip-text">
              
            </h1>

            {/* Buttons Container */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                
              </Link>
              <Link href="/docs">
                
              </Link>
            </div>
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

      {/* Testimonials Section */}
      <div className="py-20 bg-[#0A1A2F] border-t border-white/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#6C5CE7] to-[#00F5E9] text-transparent bg-clip-text">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 hover:border-[#6C5CE7]/50 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-4">
                <Star className="text-[#00F5E9]" />
                <Star className="text-[#00F5E9]" />
                <Star className="text-[#00F5E9]" />
                <Star className="text-[#00F5E9]" />
                <Star className="text-[#00F5E9]" />
              </div>
              <p className="text-gray-400 mb-4">
                "CryptoFlux has revolutionized how we handle payments. The multi-currency support is a game-changer!"
              </p>
              <p className="text-gray-300 font-semibold">— John Doe, CEO of Web3Pay</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 hover:border-[#6C5CE7]/50 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-4">
                <Star className="text-[#00F5E9]" />
                <Star className="text-[#00F5E9]" />
                <Star className="text-[#00F5E9]" />
                <Star className="text-[#00F5E9]" />
                <Star className="text-[#00F5E9]" />
              </div>
              <p className="text-gray-400 mb-4">
                "The API is so easy to integrate. We had it up and running in under an hour!"
              </p>
              <p className="text-gray-300 font-semibold">— Jane Smith, CTO of BlockTech</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 hover:border-[#6C5CE7]/50 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-4">
                <Star className="text-[#00F5E9]" />
                <Star className="text-[#00F5E9]" />
                <Star className="text-[#00F5E9]" />
                <Star className="text-[#00F5E9]" />
                <Star className="text-[#00F5E9]" />
              </div>
              <p className="text-gray-400 mb-4">
                "Instant settlement has saved us so much time. Highly recommend CryptoFlux!"
              </p>
              <p className="text-gray-300 font-semibold">— Alex Johnson, Founder of ChainPay</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="py-20 bg-gradient-to-r from-[#6C5CE7] to-[#00F5E9]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Join thousands of businesses already using CryptoFlux to power their payments.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="rounded-full bg-white text-black hover:bg-gray-100 transition-colors"
            >
              Sign Up Now <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-10 bg-[#0A1A2F] border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="text-2xl font-bold bg-gradient-to-r from-[#6C5CE7] to-[#00F5E9] text-transparent bg-clip-text">
              CryptoFlux
            </div>
            <div className="flex space-x-6">
              <Link href="https://twitter.com" className="text-gray-400 hover:text-[#00F5E9]">
                <Twitter />
              </Link>
              <Link href="https://github.com" className="text-gray-400 hover:text-[#00F5E9]">
                
              </Link>
              <Link href="https://linkedin.com" className="text-gray-400 hover:text-[#00F5E9]">
                <Linkedin />
              </Link>
            </div>
          </div>
          <div className="text-center text-gray-400 mt-6">
            &copy; {new Date().getFullYear()} CryptoFlux. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}