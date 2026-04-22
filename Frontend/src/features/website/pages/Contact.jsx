import { useState } from "react";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    date: "",
    problem: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone is required";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!formData.department) {
      newErrors.department = "Select department";
    }

    if (!formData.date) {
      newErrors.date = "Select date";
    }

    if (!formData.problem) {
      newErrors.problem = "Describe your problem";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess("");
      return;
    }

    console.log("Form Data:", formData);

    setSuccess("✅ Appointment booked successfully!");
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
      date: "",
      problem: "",
    });
  };

  return (
    <>
      <Navbar />

      <div className="page contact-page">
        <span className="eyebrow">Appointments</span>
        <h1>Book care in minutes with a cleaner, guided experience.</h1>

        <p className="contact-text">
          Share a few details and our team will help schedule the right
          consultation.
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
          
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <small style={{ color: "red" }}>{errors.name}</small>}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <small style={{ color: "red" }}>{errors.phone}</small>}

          {/* Department */}
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            <option>General Medicine</option>
            <option>Cardiology</option>
            <option>Orthopedics</option>
            <option>Gynecology</option>
            <option>Pediatrics</option>
          </select>
          {errors.department && (
            <small style={{ color: "red" }}>{errors.department}</small>
          )}

          {/* Date */}
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
          {errors.date && <small style={{ color: "red" }}>{errors.date}</small>}

          {/* Problem */}
          <textarea
            name="problem"
            rows="5"
            placeholder="Describe your problem"
            value={formData.problem}
            onChange={handleChange}
          />
          {errors.problem && (
            <small style={{ color: "red" }}>{errors.problem}</small>
          )}

          <button className="contact-btn">Book Appointment</button>

          {success && (
            <p style={{ color: "green", marginTop: "10px" }}>{success}</p>
          )}
        </form>
      </div>

      <Footer />
    </>
  );
}