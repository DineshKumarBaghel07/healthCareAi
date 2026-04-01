export default function Hero() {
  const announcement =
    "A Predictive AI Ecosystem for Multi-Pathy Wellness, Social Patient-Support, and Integrated Clinical Governance";

  return (
    <>
      <div className="hero-marquee" aria-label="Healthcare platform announcement">
        <div className="hero-marquee-track">
          <span>{announcement}</span>
          <span aria-hidden="true">{announcement}</span>
        </div>
      </div>

      <section className="hero">
        <div className="hero-left">
          <span className="eyebrow">Smart Care, Human Touch</span>
          <h1>Modern healthcare designed for calmer, faster patient journeys.</h1>

          <p>
            Book appointments, connect with trusted doctors, and access
            personalized support from a platform built to feel seamless at every
            step.
          </p>

          <div className="hero-icons">
            <span>Specialist Consultations</span>
            <span>Digital Prescriptions</span>
            <span>Emergency Response</span>
            <span>Continuous Care</span>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <strong>24/7</strong>
              <span>Patient assistance</span>
            </div>
            <div className="stat-card">
              <strong>120+</strong>
              <span>Qualified specialists</span>
            </div>
            <div className="stat-card">
              <strong>18k+</strong>
              <span>Appointments managed</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-image-shell">
            <img
              src="https://i.pinimg.com/736x/a7/51/8a/a7518a0437ced11277a8b67d1eb1e723.jpg"
              alt="Healthcare professionals"
            />
            <div className="hero-badge hero-badge-bottom">
              <strong>AI Assistant</strong>
              <span>instant guidance and support</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
