import { useState } from "react";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

const appointmentTips = [
  "Select your preferred doctor or department",
  "Share your preferred date and time slot",
  "Briefly describe your symptoms or visit reason",
];

export default function Appointment() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    department: "",
    doctor: "",
    date: "",
    time: "",
    symptoms: "",
  });
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleAppointmentSubmit = (event) => {
    event.preventDefault();
    const savedAppointments = JSON.parse(
      localStorage.getItem("appointments") || "[]"
    );

    const appointmentEntry = {
      id: Date.now(),
      ...formData,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    localStorage.setItem(
      "appointments",
      JSON.stringify([...savedAppointments, appointmentEntry])
    );

    setSubmitMessage("Appointment request submitted successfully.");
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      age: "",
      department: "",
      doctor: "",
      date: "",
      time: "",
      symptoms: "",
    });
  };

  return (
    <>
      <Navbar />

      <section className="appointment-page">
        <div className="appointment-hero">
          <span className="eyebrow">Appointment Booking</span>
          <h1>Book your hospital appointment with a simple guided form.</h1>
          <p className="appointment-text">
            Fill in your details and our team will help schedule the right
            consultation with the right specialist at the right time.
          </p>
        </div>

        <div className="appointment-layout">
          <div className="appointment-form-card">
            <h3>Patient Details</h3>
            <form className="appointment-form" onSubmit={handleAppointmentSubmit}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="age"
                min="0"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required
              />

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Department
                </option>
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Gynecology</option>
                <option>Orthopedics</option>
                <option>Pediatrics</option>
                <option>Dermatology</option>
              </select>

              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Preferred Doctor
                </option>
                <option>Dr. Aanya Sharma</option>
                <option>Dr. Rohan Mehta</option>
                <option>Dr. Kavya Singh</option>
                <option>Dr. Arjun Verma</option>
                <option>Dr. Ishita Rao</option>
                <option>Dr. Neel Patel</option>
              </select>

              <div className="appointment-inline-fields">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>

              <textarea
                name="symptoms"
                rows="5"
                placeholder="Describe symptoms or reason for appointment"
                value={formData.symptoms}
                onChange={handleChange}
                required
              />

              <button type="submit" className="contact-btn appointment-btn">
                Confirm Appointment
              </button>

              {submitMessage ? (
                <p className="appointment-success-message">{submitMessage}</p>
              ) : null}
            </form>
          </div>

          <aside className="appointment-info-card">
            <span className="card-tag">Need Help?</span>
            <h3>What to keep ready before booking</h3>
            <p>
              A few clear details help our team assign the best available slot
              and reduce waiting time during your hospital visit.
            </p>

            <div className="appointment-tip-list">
              {appointmentTips.map((tip) => (
                <div key={tip} className="appointment-tip-item">
                  <strong>{tip}</strong>
                </div>
              ))}
            </div>

            <div className="appointment-support-box">
              <h4>Support Hours</h4>
              <p>Mon-Sat, 9:00 AM - 7:00 PM</p>
              <p>Call: +91 8824487607</p>
              <p>Email: hospital@email.com</p>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </>
  );
}
