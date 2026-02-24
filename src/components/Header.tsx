import React from 'react';
import { Link } from 'react-router-dom';
import { } from 'lucide-react'; // Empty import to keep the line if needed, or just remove
import './Header.css';

interface HeaderProps {
    transparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ transparent = false }) => {
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const headerClass = [
        'header',
        transparent && !scrolled ? 'header-transparent' : 'header-solid',
        scrolled && 'header-scrolled'
    ].filter(Boolean).join(' ');

    return (
        <header className={headerClass}>
            <div className="container">
                <div className="header-content">
                    <div className="header-left">
                        <Link to="/" className="header-logo">
                            <img src="/logo.png" alt="Discovr" className="header-logo-img" />
                            <span className="logo-text">discovr</span>
                        </Link>
                    </div>

                    <div className="header-center">
                        <nav className="header-nav">
                            <Link to="/careers" className="header-nav-link">Careers</Link>
                            <Link to="/creator" className="header-nav-link">For Creators</Link>
                            <Link to="/brand/login" className="header-nav-link">Sign In</Link>
                        </nav>
                    </div>

                    <div className="header-right">
                        <Link to="/brand/signup" className="header-cta">
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};
