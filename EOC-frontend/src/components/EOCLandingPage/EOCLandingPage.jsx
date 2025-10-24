import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Calendar, Users, Instagram, Linkedin, Twitter, Mail, ArrowRight, Code, Zap, Trophy } from 'lucide-react';
import styles from './EOCLandingPage.module.css';

const upcomingEvents = [
  {
    id: 1,
    title: "HackNova 2025",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=500&fit=crop",
    shortDesc: "24-hour hackathon featuring AI/ML challenges and exciting prizes.",
    fullDesc: "HackNova 2025 is our flagship hackathon event bringing together the brightest minds to solve real-world problems using cutting-edge technology.",
    date: "March 15-16, 2025",
    theme: "Innovation for Tomorrow",
    rules: ["Teams of 2-4 members", "Original code only", "All skill levels welcome", "Mentorship available"],
    category: "Hackathon"
  },
  {
    id: 2,
    title: "Web Dev Workshop",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
    shortDesc: "Hands-on workshop covering modern web development with React and Node.js.",
    fullDesc: "Learn modern web development from industry experts. This comprehensive workshop covers React, Node.js, MongoDB, and deployment strategies.",
    date: "February 28, 2025",
    theme: "Full Stack Mastery",
    rules: ["Bring your laptop", "Basic HTML/CSS knowledge helpful", "All materials provided", "Certificate of participation"],
    category: "Workshop"
  },
  {
    id: 3,
    title: "Code Sprint Challenge",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
    shortDesc: "Competitive coding event with algorithmic problem-solving challenges.",
    fullDesc: "Test your algorithmic skills in this intense competitive programming challenge. Solve problems and compete for top positions.",
    date: "March 5, 2025",
    theme: "Speed & Accuracy",
    rules: ["Individual participation", "3-hour time limit", "Online platform", "Prizes for top performers"],
    category: "Competition"
  }
];

const pastEvents = [
  {
    id: 4,
    title: "TechFest 2024",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop",
    shortDesc: "Annual technical festival with multiple tech competitions and guest lectures.",
    fullDesc: "TechFest 2024 was a grand success with over 500 participants across various technical events.",
    date: "December 10-12, 2024",
    theme: "Tech Revolution",
    rules: ["Open to all students", "Multiple event categories", "Inter-college participation"],
    category: "Festival"
  },
  {
    id: 5,
    title: "AI/ML Bootcamp",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
    shortDesc: "Intensive bootcamp on machine learning fundamentals and neural networks.",
    fullDesc: "A week-long intensive bootcamp covering machine learning fundamentals, neural networks, and practical AI applications.",
    date: "November 20-25, 2024",
    theme: "AI for Everyone",
    rules: ["Python knowledge required", "Hands-on projects", "Industry mentors"],
    category: "Bootcamp"
  },
  {
    id: 6,
    title: "Open Source Day",
    image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800&h=500&fit=crop",
    shortDesc: "Collaborative event introducing students to open source contributions.",
    fullDesc: "Students learned how to contribute to open source projects and collaborate with developers worldwide.",
    date: "October 15, 2024",
    theme: "Code Together",
    rules: ["GitHub account required", "Beginner friendly", "Collaborative learning"],
    category: "Workshop"
  }
];

function EOCLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [signUpRole, setSignUpRole] = useState('student');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const goToSignIn = () => {
    navigate('/signin');
  };

  const goToSignUp = () => {
    navigate('/signup');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleJoinEvent = () => {
    if (!isLoggedIn) {
      setCurrentPage('signin');
      setSelectedEvent(null);
    } else {
      // In a real app, this would be a modal or a toast notification
      console.log('Event registration successful!');
      alert('Event registration successful!');
    }
  };

  return (
    <div className={styles.appContainer}>
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={`${styles.container} ${styles.navContainer}`}>
          <div className={styles.logoWrapper}>
            <div className={styles.logo}>
              <div className={styles.logoBlur}></div>
              <div className={styles.logoIconWrapper}>
                <Code className={styles.logoIcon} />
              </div>
            </div>
            <div>
              <span className={styles.logoText}>EOC</span>
              <p className={styles.logoSubtext}>Engineers of Code</p>
            </div>
          </div>

          <div className={styles.navLinks}>
            <button onClick={() => { setCurrentPage('home'); scrollToSection('home'); }} className={styles.navLink}>Home</button>
            <button onClick={() => { setCurrentPage('home'); scrollToSection('events'); }} className={styles.navLink}>Events</button>
            <button onClick={() => { setCurrentPage('home'); scrollToSection('about'); }} className={styles.navLink}>About</button>
            <button onClick={() => { setCurrentPage('home'); scrollToSection('contact'); }} className={styles.navLink}>Contact</button>
            <button onClick={goToSignIn} className={styles.navLink}>Sign In</button>
            <button onClick={goToSignUp} className={`${styles.button} ${styles.buttonPrimary}`}>
              Join Now
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={styles.mobileMenuButton}>
            {mobileMenuOpen ? <X width={24} height={24} /> : <Menu width={24} height={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.mobileMenuLinks}>
              <button onClick={() => { setCurrentPage('home'); scrollToSection('home'); }} className={styles.mobileNavLink}>Home</button>
              <button onClick={() => { setCurrentPage('home'); scrollToSection('events'); }} className={styles.mobileNavLink}>Events</button>
              <button onClick={() => { setCurrentPage('home'); scrollToSection('about'); }} className={styles.mobileNavLink}>About</button>
              <button onClick={() => { setCurrentPage('home'); scrollToSection('contact'); }} className={styles.mobileNavLink}>Contact</button>
              <button onClick={goToSignIn} className={styles.mobileNavLink}>Sign In</button>
              <button onClick={goToSignUp} className={`${styles.button} ${styles.buttonPrimary} ${styles.mobileMenuButtonFull}`}>Join Now</button>
            </div>
          </div>
        )}
      </nav>

      {currentPage === 'home' && (
        <>
          <section id="home" className={`${styles.section} ${styles.hero}`}>
            <div className={styles.heroBlur}></div>
            <div className={`${styles.container} ${styles.grid} ${styles.heroGrid}`}>
              <div className={styles.heroContent}>
                <div className={styles.heroTag}>
                  <span>SRKR Engineering College</span>
                </div>
                <h1 className={styles.heroTitle}>
                  <span>Build. </span>
                  <span>Innovate. </span>
                  <span className={styles.textGradient}>Create.</span>
                </h1>
                <p className={styles.heroSubtitle}>
                  Join the premier coding community where passionate engineers unite to transform ideas into reality through hackathons, workshops, and cutting-edge tech events.
                </p>
                <div className={styles.heroButtons}>
                  <button onClick={() => scrollToSection('events')} className={`${styles.button} ${styles.buttonPrimary}`}>
                    Explore Events <ArrowRight className={styles.buttonIcon} />
                  </button>
                  <button onClick={() => scrollToSection('about')} className={`${styles.button} ${styles.buttonSecondary}`}>
                    Learn More
                  </button>
                </div>
              </div>
              <div className={styles.heroImageWrapper}>
                <div className={styles.heroImageBlur}></div>
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop" alt="Coding community" className={styles.heroImage} />
              </div>
            </div>
          </section>

          <section id="about" className={`${styles.section} ${styles.aboutSection}`}>
            <div className={styles.aboutBgGradient}></div>
            <div className={`${styles.container} ${styles.aboutContainer}`}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.textGradient}>About EOC</span>
                </h2>
                <p className={styles.sectionSubtitle}>
                  Engineers of Code is SRKR Engineering College's premier coding club, dedicated to fostering innovation and technical excellence.
                </p>
              </div>
              <div className={`${styles.grid} ${styles.aboutGrid}`}>
                <div className={styles.infoCard}>
                  <div className={styles.infoCardIconWrapper}>
                    <Users className={styles.infoCardIcon} />
                  </div>
                  <h3 className={styles.infoCardTitle}>Community</h3>
                  <p className={styles.infoCardText}>Join a vibrant community of 500+ passionate coders and tech enthusiasts.</p>
                </div>
                <div className={styles.infoCard}>
                  <div className={styles.infoCardIconWrapper}>
                    <Zap className={styles.infoCardIcon} />
                  </div>
                  <h3 className={styles.infoCardTitle}>Events</h3>
                  <p className={styles.infoCardText}>Regular hackathons, workshops, and coding competitions throughout the year.</p>
                </div>
                <div className={styles.infoCard}>
                  <div className={styles.infoCardIconWrapper}>
                    <Trophy className={styles.infoCardIcon} />
                  </div>
                  <h3 className={styles.infoCardTitle}>Innovation</h3>
                  <p className={styles.infoCardText}>Create impactful projects and learn cutting-edge technologies from experts.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="events" className={`${styles.section} ${styles.eventsSection}`}>
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.textGradient}>Our Events</span>
                </h2>
                <p className={styles.sectionSubtitle}>Discover upcoming hackathons, workshops, and competitions</p>
              </div>

              <div className={styles.eventCategory}>
                <div className={styles.divider}>
                  <h3 className={styles.dividerText}>Upcoming Events</h3>
                </div>
                <div className={`${styles.grid} ${styles.eventsGrid}`}>
                  {upcomingEvents.map(event => (
                    <div key={event.id} className={styles.eventCard}>
                      <div className={styles.eventCardImageWrapper}>
                        <img src={event.image} alt={event.title} className={styles.eventCardImage} />
                        <div className={styles.eventCardCategory}>{event.category}</div>
                      </div>
                      <div className={styles.eventCardContent}>
                        <h3 className={styles.eventCardTitle}>{event.title}</h3>
                        <div className={styles.eventCardDate}>
                          <Calendar width={16} height={16} />
                          <span>{event.date}</span>
                        </div>
                        <p className={styles.eventCardDesc}>{event.shortDesc}</p>
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonFullWidth}`}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.eventCategory}>
                <div className={styles.divider}>
                  <h3 className={styles.dividerText}>Past Events</h3>
                </div>
                <div className={`${styles.grid} ${styles.eventsGrid}`}>
                  {pastEvents.map(event => (
                    <div key={event.id} className={styles.eventCard}>
                      <div className={styles.eventCardImageWrapper}>
                        <img src={event.image} alt={event.title} className={styles.eventCardImage} />
                        <div className={styles.eventCardCategory}>{event.category}</div>
                      </div>
                      <div className={styles.eventCardContent}>
                        <h3 className={styles.eventCardTitle}>{event.title}</h3>
                        <div className={styles.eventCardDate}>
                          <Calendar width={16} height={16} />
                          <span>{event.date}</span>
                        </div>
                        <p className={styles.eventCardDesc}>{event.shortDesc}</p>
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonFullWidth}`}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="contact" className={`${styles.section} ${styles.contactSection}`}>
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.textGradient}>Get In Touch</span>
                </h2>
                <p className={styles.sectionSubtitle}>Have questions? Reach out to us!</p>
              </div>
              <div className={styles.contactFormWrapper}>
                <div className={styles.formGroup}>
                  <div>
                    <label className={styles.label}>Name</label>
                    <input type="text" className={styles.input} placeholder="Your name" />
                  </div>
                  <div>
                    <label className={styles.label}>Email</label>
                    <input type="email" className={styles.input} placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className={styles.label}>Message</label>
                    <textarea className={styles.textarea} placeholder="Your message"></textarea>
                  </div>
                  <button className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonFullWidth}`}>
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}


      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              onClick={() => setSelectedEvent(null)}
              className={styles.modalCloseButton}
            >
              <X width={28} height={28} />
            </button>

            <img src={selectedEvent.image} alt={selectedEvent.title} className={styles.modalImage} />

            <div className={styles.modalBody}>
              <span className={styles.modalCategory}>
                {selectedEvent.category}
              </span>
              <h2 className={styles.modalTitle}>{selectedEvent.title}</h2>
              <div className={styles.modalDate}>
                <Calendar width={16} height={16} />
                <span>{selectedEvent.date}</span>
              </div>

              <div className={styles.modalDesc}>
                <p>{selectedEvent.fullDesc}</p>
                <p><strong className={styles.modalDescStrong}>Theme:</strong> {selectedEvent.theme}</p>
              </div>

              <h3 className={styles.modalRulesTitle}>Rules & Guidelines</h3>
              <ul className={styles.modalRulesList}>
                {selectedEvent.rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>

              <button
                onClick={handleJoinEvent}
                className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonFullWidth}`}
              >
                {isLoggedIn ? 'Register for this Event' : 'Sign In to Register'}
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerContainer}`}>
          <div className={`${styles.grid} ${styles.footerGrid}`}>
            <div>
              <div className={styles.logoWrapper}>
                <div className={styles.logo}>
                  <div className={styles.logoBlur}></div>
                  <div className={styles.logoIconWrapper}>
                    <Code className={styles.logoIcon} />
                  </div>
                </div>
                <div>
                  <span className={styles.logoText}>EOC</span>
                  <p className={styles.logoSubtext}>Engineers of Code</p>
                </div>
              </div>
              <p className={styles.footerAddress}>SRKR Engineering College, Bhimavaram</p>
            </div>

            <div>
              <h3 className={styles.footerTitle}>Quick Links</h3>
              <ul className={styles.footerLinks}>
                <li><button onClick={() => { setCurrentPage('home'); scrollToSection('home'); }} className={styles.footerLink}>Home</button></li>
                <li><button onClick={() => { setCurrentPage('home'); scrollToSection('events'); }} className={styles.footerLink}>Events</button></li>
                <li><button onClick={() => { setCurrentPage('home'); scrollToSection('about'); }} className={styles.footerLink}>About</button></li>
                <li><button onClick={() => { setCurrentPage('home'); scrollToSection('contact'); }} className={styles.footerLink}>Contact</button></li>
              </ul>
            </div>

            <div>
              <h3 className={styles.footerTitle}>Follow Us</h3>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink}><Twitter width={24} height={24} /></a>
                <a href="#" className={styles.socialLink}><Linkedin width={24} height={24} /></a>
                <a href="#" className={styles.socialLink}><Instagram width={24} height={24} /></a>
                <a href="#" className={styles.socialLink}><Mail width={24} height={24} /></a>
              </div>
            </div>
          </div>
          <div className={styles.footerCopyright}>
            <p>&copy; 2025 EOC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// export default EOCLandingPage; // This line is often commented out or removed in single-file environments
// Instead, the component is usually rendered directly if this were an index.jsx
// For a library component, the export is correct.
// Assuming this is the main App component for a single-file build:
export default EOCLandingPage;

