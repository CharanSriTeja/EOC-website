import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Calendar, Users, Instagram, Linkedin, Twitter, Mail, ArrowRight, Code, Zap, Trophy } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import styles from './EOCLandingPage.module.css';

function EOCLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const goToSignIn = () => {
    navigate('/signin');
  };

  const goToSignUp = () => {
    navigate('/signup');
  };

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/events');
        
        if (response.data.success) {
          const allEvents = response.data.data;
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Separate upcoming and past events
          const upcoming = allEvents.filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate >= today && event.status !== 'completed';
          });

          const past = allEvents.filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate < today || event.status === 'completed';
          });

          setUpcomingEvents(upcoming);
          setPastEvents(past);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    } else {
      alert('Please login to your dashboard to register for events.');
      navigate('/signin');
    }
    setSelectedEvent(null);
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get default image
  const getEventImage = (event) => {
    return event.image || 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360';
  };

  return (
    <div className={styles.appContainer}>
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={`${styles.container} ${styles.navContainer}`}>
          <div className={styles.logoWrapper}>
            <img 
              src="https://res.cloudinary.com/dxpzm7irj/image/upload/v1761391988/EOC_logo_gbuw9j.jpg" 
              alt="EOC Logo" 
              className={styles.logoImage}
            />
            <div>
              <span className={styles.logoText}>EOC</span>
              <p className={styles.logoSubtext}>Event Organizing Cell</p>
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
                  <span>Dream. </span>
                  <span>Design. </span>
                  <span className={styles.textGradient}>Deliver.</span>
                </h1>
                <p className={styles.heroSubtitle}>
                  The Event Organizing Cell at SRKR Engineering College unites passionate students to plan, manage, and celebrate events that make campus life unforgettable.
                </p>
                <div className={styles.heroButtons}>
                  <button onClick={() => scrollToSection('events')} className={`${styles.button} ${styles.buttonPrimary}`}>
                    View Events <ArrowRight className={styles.buttonIcon} />
                  </button>
                  <button onClick={() => scrollToSection('about')} className={`${styles.button} ${styles.buttonSecondary}`}>
                    Know More
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
                  The Event Organizing Club (EOC) of SRKR Engineering College is dedicated to bringing together the campus community through well-planned and engaging events. Our mission is to foster connection, creativity and collaboration among students across disciplines, while our vision is to create memorable experiences and a lively campus culture.
                </p>
              </div>
              <div className={`${styles.grid} ${styles.aboutGrid}`}>
                <div className={styles.infoCard}>
                  <div className={styles.infoCardIconWrapper}>
                    <Users className={styles.infoCardIcon} />
                  </div>
                  <h3 className={styles.infoCardTitle}>Community</h3>
                  <p className={styles.infoCardText}>
                    Join a vibrant community of students at SRKR who love planning and organizing events that bring everyone together.
                  </p>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoCardIconWrapper}>
                    <Zap className={styles.infoCardIcon} />
                  </div>
                  <h3 className={styles.infoCardTitle}>Events</h3>
                  <p className={styles.infoCardText}>
                    Participate in cultural fests, workshops, competitions, and campus-wide celebrations organized throughout the year.
                  </p>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoCardIconWrapper}>
                    <Trophy className={styles.infoCardIcon} />
                  </div>
                  <h3 className={styles.infoCardTitle}>Experience</h3>
                  <p className={styles.infoCardText}>
                    Gain hands-on experience in event planning, teamwork, leadership, and creating unforgettable campus experiences.
                  </p>
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

              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <p>Loading events...</p>
                </div>
              ) : (
                <>
                  {/* Upcoming Events */}
                  <div className={styles.eventCategory}>
                    <div className={styles.divider}>
                      <h3 className={styles.dividerText}>Upcoming Events</h3>
                    </div>
                    {upcomingEvents.length > 0 ? (
                      <div className={`${styles.grid} ${styles.eventsGrid}`}>
                        {upcomingEvents.map(event => (
                          <div key={event._id} className={styles.eventCard}>
                            <div className={styles.eventCardImageWrapper}>
                              <img 
                                src={getEventImage(event)} 
                                alt={event.name} 
                                className={styles.eventCardImage}
                                onError={(e) => {
                                  e.target.src = 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360';
                                }}
                              />
                              <div className={styles.eventCardCategory}>
                                {event.category}
                              </div>
                            </div>
                            <div className={styles.eventCardContent}>
                              <h3 className={styles.eventCardTitle}>{event.name}</h3>
                              <div className={styles.eventCardDate}>
                                <Calendar width={16} height={16} />
                                <span>{formatDate(event.date)}</span>
                              </div>
                              <p className={styles.eventCardDesc}>
                                {event.description?.substring(0, 100)}
                                {event.description?.length > 100 ? '...' : ''}
                              </p>
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
                    ) : (
                      <p style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
                        No upcoming events at the moment. Check back soon!
                      </p>
                    )}
                  </div>

                  {/* Past Events */}
                  <div className={styles.eventCategory}>
                    <div className={styles.divider}>
                      <h3 className={styles.dividerText}>Past Events</h3>
                    </div>
                    {pastEvents.length > 0 ? (
                      <div className={`${styles.grid} ${styles.eventsGrid}`}>
                        {pastEvents.map(event => (
                          <div key={event._id} className={styles.eventCard}>
                            <div className={styles.eventCardImageWrapper}>
                              <img 
                                src={getEventImage(event)} 
                                alt={event.name} 
                                className={styles.eventCardImage}
                                onError={(e) => {
                                  e.target.src = 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360';
                                }}
                              />
                              <div className={styles.eventCardCategory}>
                                {event.category}
                              </div>
                            </div>
                            <div className={styles.eventCardContent}>
                              <h3 className={styles.eventCardTitle}>{event.name}</h3>
                              <div className={styles.eventCardDate}>
                                <Calendar width={16} height={16} />
                                <span>{formatDate(event.date)}</span>
                              </div>
                              <p className={styles.eventCardDesc}>
                                {event.description?.substring(0, 100)}
                                {event.description?.length > 100 ? '...' : ''}
                              </p>
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
                    ) : (
                      <p style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
                        No past events to display.
                      </p>
                    )}
                  </div>
                </>
              )}
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

            <img 
              src={getEventImage(selectedEvent)} 
              alt={selectedEvent.name} 
              className={styles.modalImage}
              onError={(e) => {
                e.target.src = 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360';
              }}
            />

            <div className={styles.modalBody}>
              <span className={styles.modalCategory}>
                {selectedEvent.category}
              </span>
              <h2 className={styles.modalTitle}>{selectedEvent.name}</h2>
              <div className={styles.modalDate}>
                <Calendar width={16} height={16} />
                <span>{formatDate(selectedEvent.date)}</span>
              </div>

              <div className={styles.modalDesc}>
                <p>{selectedEvent.description || 'No description available'}</p>
                {selectedEvent.theme && (
                  <p><strong className={styles.modalDescStrong}>Theme:</strong> {selectedEvent.theme}</p>
                )}
                {selectedEvent.details?.venue && (
                  <p><strong className={styles.modalDescStrong}>Venue:</strong> {selectedEvent.details.venue}</p>
                )}
                {selectedEvent.eligibility && (
                  <p><strong className={styles.modalDescStrong}>Eligibility:</strong> {selectedEvent.eligibility}</p>
                )}
              </div>

              {selectedEvent.details?.rules && selectedEvent.details.rules.length > 0 && (
                <>
                  <h3 className={styles.modalRulesTitle}>Rules & Guidelines</h3>
                  <ul className={styles.modalRulesList}>
                    {selectedEvent.details.rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </>
              )}

              <button
                onClick={handleJoinEvent}
                className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonFullWidth}`}
              >
                Sign In to Register
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
                  <img 
                    src="https://res.cloudinary.com/dxpzm7irj/image/upload/v1761391988/EOC_logo_gbuw9j.jpg" 
                    alt="EOC Logo" 
                    className={styles.logoImage}
                  />
                  <p className={styles.logoSubtext}>Event Organizing Cell</p>
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
                <a href="https://www.linkedin.com/school/srkr-engineering-college/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}><Twitter width={24} height={24} /></a>
                <a href="https://www.linkedin.com/school/srkr-engineering-college/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}><Linkedin width={24} height={24} /></a>
                <a href="https://www.instagram.com/srkr_eoc?igsh=ZDNlc21xbG5kNnJw" target="_blank" rel="noopener noreferrer" className={styles.socialLink}><Instagram width={24} height={24} /></a>
                <a href="mailto:eocsrkr@gmail.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}><Mail width={24} height={24} /></a>
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

export default EOCLandingPage;
