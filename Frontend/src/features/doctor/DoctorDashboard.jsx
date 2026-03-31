import { useMemo, useState } from "react";
import {
  doctorAlerts,
  doctorAppointments,
  doctorAvailabilitySlots,
  doctorPatients,
  doctorQuickActions,
  doctorStats,
} from "./doctor.data";
import {
  buttonColors,
  getAppointmentStatusStyle,
  getPatientStatusStyle,
  styles,
  valueColors,
} from "./doctor.styles";
import DoctorStatCard from "./components/DoctorStatCard";
import DoctorTabButton from "./components/DoctorTabButton";
import DoctorAppointmentCard from "./components/DoctorAppointmentCard";
import DoctorPatientTable from "./components/DoctorPatientTable";
import DoctorAlertList from "./components/DoctorAlertList";

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [appointments, setAppointments] = useState(doctorAppointments);
  const [availability, setAvailability] = useState(doctorAvailabilitySlots);

  const stats = useMemo(() => {
    const confirmedAppointments = appointments.filter(
      (appointment) => appointment.status === "confirmed"
    ).length;
    const waitingAppointments = appointments.filter(
      (appointment) => appointment.status === "waiting"
    ).length;
    const totalPatients = doctorPatients.length;
    const availableSlots = availability.filter((slot) => slot.available).length;

    return {
      appointments: String(appointments.length),
      patients: String(totalPatients),
      reports: String(waitingAppointments),
      confirmedAppointments,
      waitingAppointments,
      availableSlots,
    };
  }, [appointments, availability]);

  const statItems = doctorStats(stats);

  const handleAppointmentStatus = (appointmentId, nextStatus) => {
    setAppointments((currentAppointments) =>
      currentAppointments.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, status: nextStatus }
          : appointment
      )
    );
  };

  const toggleAvailability = (slotId) => {
    setAvailability((currentSlots) =>
      currentSlots.map((slot) =>
        slot.id === slotId ? { ...slot, available: !slot.available } : slot
      )
    );
  };

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={styles.heroPanel}>
          <div>
            <span style={styles.badge}>Doctor Panel</span>
            <h1 style={styles.title}>Doctor Dashboard</h1>
            <p style={styles.description}>
              Manage appointments, patients, reports, and availability from one
              clean workspace.
            </p>
          </div>

          <div style={styles.heroMeta}>
            <div style={styles.metaCard}>
              <span style={styles.metaLabel}>Confirmed Today</span>
              <strong style={styles.metaValue}>{stats.confirmedAppointments}</strong>
            </div>
            <div style={styles.metaCard}>
              <span style={styles.metaLabel}>Open Slots</span>
              <strong style={styles.metaValue}>{stats.availableSlots}</strong>
            </div>
          </div>
        </div>

        <div style={styles.statsGrid}>
          {statItems.map((stat) => (
            <DoctorStatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              valueStyle={valueColors[stat.colorKey]}
            />
          ))}
        </div>

        <div style={styles.tabRow}>
          <DoctorTabButton
            label="Overview"
            isActive={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <DoctorTabButton
            label="Appointments"
            isActive={activeTab === "appointments"}
            onClick={() => setActiveTab("appointments")}
          />
          <DoctorTabButton
            label="Patients"
            isActive={activeTab === "patients"}
            onClick={() => setActiveTab("patients")}
          />
          <DoctorTabButton
            label="Availability"
            isActive={activeTab === "availability"}
            onClick={() => setActiveTab("availability")}
          />
        </div>

        {activeTab === "overview" && (
          <div style={styles.contentGrid}>
            <div style={styles.section}>
              <h2 style={styles.subTitle}>Daily Focus</h2>
              <ul style={styles.list}>
                <li>Review waiting appointments before consultation hours</li>
                <li>Check active patient updates from the patient table</li>
                <li>Keep your availability accurate for new bookings</li>
                <li>Track alerts and pending follow-ups from one place</li>
              </ul>
            </div>

            <div style={styles.section}>
              <h2 style={styles.subTitle}>Quick Actions</h2>
              <div style={styles.actionGroup}>
                {doctorQuickActions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    style={{
                      ...styles.actionButton,
                      ...buttonColors[action.colorKey],
                    }}
                    onClick={() => setActiveTab(action.tab)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ ...styles.section, ...styles.fullWidthPanel }}>
              <h2 style={styles.subTitle}>Latest Alerts</h2>
              <DoctorAlertList alerts={doctorAlerts} />
            </div>
          </div>
        )}

        {activeTab === "appointments" && (
          <div style={styles.section}>
            <div style={styles.panelHeader}>
              <h2 style={styles.subTitle}>Appointment Queue</h2>
              <span style={styles.helperText}>
                Confirm, complete, or follow up on today&apos;s bookings.
              </span>
            </div>

            <div style={styles.recordGrid}>
              {appointments.map((appointment) => (
                <DoctorAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  statusStyle={getAppointmentStatusStyle(appointment.status)}
                  approveButtonStyle={{
                    ...styles.smallButton,
                    ...buttonColors.appointments,
                  }}
                  secondaryButtonStyle={{
                    ...styles.smallButton,
                    ...buttonColors.records,
                  }}
                  onConfirm={() =>
                    handleAppointmentStatus(appointment.id, "confirmed")
                  }
                  onComplete={() =>
                    handleAppointmentStatus(appointment.id, "completed")
                  }
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "patients" && (
          <div style={styles.section}>
            <div style={styles.panelHeader}>
              <h2 style={styles.subTitle}>Patient Records</h2>
              <span style={styles.helperText}>
                Review patient status, condition, and next follow-up date.
              </span>
            </div>
            <DoctorPatientTable
              patients={doctorPatients}
              getPatientStatusStyle={getPatientStatusStyle}
            />
          </div>
        )}

        {activeTab === "availability" && (
          <div style={styles.section}>
            <div style={styles.panelHeader}>
              <h2 style={styles.subTitle}>Availability Manager</h2>
              <span style={styles.helperText}>
                Turn consultation slots on or off depending on your schedule.
              </span>
            </div>
            <div style={styles.recordGrid}>
              {availability.map((slot) => (
                <div key={slot.id} style={styles.recordCard}>
                  <div style={styles.recordHeader}>
                    <div>
                      <h3 style={styles.recordTitle}>{slot.day}</h3>
                      <p style={styles.recordText}>{slot.time}</p>
                    </div>
                    <span
                      style={
                        slot.available
                          ? styles.availableBadge
                          : styles.unavailableBadge
                      }
                    >
                      {slot.available ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  <button
                    type="button"
                    style={{
                      ...styles.smallButton,
                      ...(slot.available
                        ? buttonColors.block
                        : buttonColors.availability),
                    }}
                    onClick={() => toggleAvailability(slot.id)}
                  >
                    {slot.available ? "Mark Unavailable" : "Mark Available"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
