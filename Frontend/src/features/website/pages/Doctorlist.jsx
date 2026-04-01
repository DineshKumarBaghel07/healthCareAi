import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { Link } from "react-router";

const doctors = [
  {
    name: "Dr. Aanya Sharma",
    specialty: "Cardiologist",
    experience: "12+ years experience",
    availability: "Mon-Sat, 10:00 AM - 4:00 PM",
    fee: "Consultation: Rs. 900",
    languages: "Hindi, English",
    focus: "Heart rhythm care, hypertension management, preventive cardiology",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Dr. Rohan Mehta",
    specialty: "Neurologist",
    experience: "10+ years experience",
    availability: "Mon-Fri, 11:00 AM - 5:30 PM",
    fee: "Consultation: Rs. 1100",
    languages: "Hindi, English, Gujarati",
    focus: "Migraine care, stroke recovery, nerve disorder evaluation",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Dr. Kavya Singh",
    specialty: "Gynecologist",
    experience: "8+ years experience",
    availability: "Tue-Sun, 9:30 AM - 2:30 PM",
    fee: "Consultation: Rs. 800",
    languages: "Hindi, English",
    focus: "Women's wellness, prenatal care, menstrual health support",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Dr. Arjun Verma",
    specialty: "Orthopedic Surgeon",
    experience: "15+ years experience",
    availability: "Mon-Sat, 1:00 PM - 7:00 PM",
    fee: "Consultation: Rs. 1200",
    languages: "Hindi, English",
    focus: "Joint pain, fracture treatment, sports injury rehabilitation",
    image:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Dr. Ishita Rao",
    specialty: "Pediatrician",
    experience: "9+ years experience",
    availability: "Mon-Fri, 10:30 AM - 6:00 PM",
    fee: "Consultation: Rs. 700",
    languages: "Hindi, English, Marathi",
    focus: "Child growth, vaccinations, nutrition and fever management",
    image:
      "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Dr. Neel Patel",
    specialty: "Dermatologist",
    experience: "7+ years experience",
    availability: "Wed-Mon, 12:00 PM - 6:30 PM",
    fee: "Consultation: Rs. 850",
    languages: "Hindi, English, Gujarati",
    focus: "Skin allergies, acne solutions, hair and scalp treatment",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=80",
  },
];

const highlights = [
  { value: "25+", label: "Specialists available" },
  { value: "4.8/5", label: "Average patient rating" },
  { value: "Same Day", label: "Appointment support" },
];

export default function Doctorlist() {
  return (
    <>
      <Navbar />

      <section className="doctor-list-page">
        <div className="doctor-list-hero">
          <span className="eyebrow">Our Specialists</span>
          <h1>Meet experienced doctors across every major care department.</h1>
          <p className="doctor-list-text">
            Choose from trusted specialists with clear availability, focused
            expertise, and patient-friendly consultation support.
          </p>

          <div className="doctor-list-highlights">
            {highlights.map((item) => (
              <div key={item.label} className="doctor-highlight-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="doctor-card-grid">
          {doctors.map((doctor) => (
            <article key={doctor.name} className="doctor-profile-card">
              <img src={doctor.image} alt={doctor.name} />

              <div className="doctor-card-body">
                <span className="card-tag">{doctor.specialty}</span>
                <h3>{doctor.name}</h3>
                <p className="doctor-focus">{doctor.focus}</p>

                <div className="doctor-meta-list">
                  <span>{doctor.experience}</span>
                  <span>{doctor.availability}</span>
                  <span>{doctor.fee}</span>
                  <span>Languages: {doctor.languages}</span>
                </div>

                <Link to="/appointment" className="doctor-card-btn">
                  Book Appointment
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
