import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import NavItem from "./NavItem";

export default function Navbar() {
    const [isSticky, setIsSticky] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { url } = usePage();

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Browse tools", href: "/browse-tools" },
        { name: "How it works", href: "/how-it-works" },
    ];

    useEffect(() => {
        const handleScroll = () => setIsSticky(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <nav
                className={`fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 w-[95%] max-w-7xl
                bg-white text-gray-900 shadow-lg
                dark:bg-gray-900/90 dark:text-white dark:backdrop-blur-md dark:border-gray-800 rounded-full flex justify-between items-center px-4 md:px-8 py-3 ${
                    isSticky
                        ? "top-4 shadow-2xl border border-gray-100 dark:border-gray-700"
                        : "top-6"
                }`}
            >
                {/* Logo */}
                <Link href="/" className="flex items-center shrink-0">
                    <img
                        src="/assets/images/logo.png"
                        alt="Logo"
                        className="h-8 md:h-9 w-auto dark:invert dark:brightness-200"
                    />
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex space-x-10">
                    {navLinks.map((link) => (
                        <NavItem
                            key={link.href}
                            href={link.href}
                            active={url === link.href}
                        >
                            {link.name}
                        </NavItem>
                    ))}
                </div>

                {/* Right Buttons & Mobile Toggle */}
                <div className="flex items-center space-x-2 md:space-x-4">
                    <Link
                        href="/browse-tools"
                        className="hidden sm:block rounded-full border border-[#10513D] dark:border-emerald-500 px-4 md:px-6 py-2 text-xs md:text-sm font-bold text-[#10513D] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-all font-outfit"
                    >
                        List Tool
                    </Link>
                    <Link
                        href="/login"
                        className="flex items-center rounded-full bg-[#40885A] dark:bg-emerald-600 px-4 md:px-6 py-2 text-xs md:text-sm font-bold text-white hover:bg-[#10513D] dark:hover:bg-emerald-700 transition-all shadow-md active:scale-95 whitespace-nowrap"
                    >
                        Get Started <span className="hidden xs:inline ml-2">→</span>
                    </Link>
                    
                    {/* Mobile Menu Toggle */}
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div 
                className={`fixed inset-0 z-[90] bg-white/95 dark:bg-gray-950/98 backdrop-blur-xl transition-all duration-500 lg:hidden ${
                    mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            >
                <div className="flex flex-col items-center justify-center h-full space-y-8 p-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`text-2xl font-medium transition-all ${
                                url === link.href 
                                    ? "text-[#10513D] dark:text-emerald-400 font-bold scale-110" 
                                    : "text-gray-500 dark:text-gray-400 hover:text-[#10513D] dark:hover:text-emerald-400"
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-8 flex flex-col w-full max-w-xs space-y-4">
                        <Link
                            href="/browse-tools"
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full text-center rounded-2xl border-2 border-[#10513D] dark:border-emerald-500 py-4 font-bold text-[#10513D] dark:text-emerald-400"
                        >
                            List Your Tool
                        </Link>
                        <Link
                            href="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full text-center rounded-2xl bg-[#40885A] dark:bg-emerald-600 py-4 font-bold text-white shadow-xl"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
