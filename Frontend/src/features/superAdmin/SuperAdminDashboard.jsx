import { useMemo, useState } from "react";
import {
  initialAlerts,
  initialDoctors,
  initialPatients,
} from "./superAdmin.data";
import {
  buttonColors,
  getPatientStatusStyle,
  getStatusBadgeStyle,
  styles,
  summaryColors,
} from "./superAdmin.styles";
import SummaryCard from "./components/SummaryCard";
import TabButton from "./components/TabButton";
import DoctorRecordCard from "./components/DoctorRecordCard";
import PatientTable from "./components/PatientTable";
import AlertList from "./components/AlertList";

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [doctors, setDoctors] = useState(initialDoctors);
  const [patients] = useState(initialPatients);
  const [alerts, setAlerts] = useState(initialAlerts);

  const stats = useMemo(() => {
    const totalDoctors = doctors.length;
    const activeDoctors = doctors.filter((doctor) => doctor.status === "active").length;
    const pendingDoctors = doctors.filter((doctor) => doctor.status === "pending").length;
    const blockedDoctors = doctors.filter((doctor) => doctor.status === "blocked").length;
    const totalPatients = patients.length;

    return {
      totalDoctors,
      activeDoctors,
      pendingDoctors,
      blockedDoctors,
      totalPatients,
      systemHealth: totalDoctors === 0 ? 0 : Math.round((activeDoctors / totalDoctors) * 100),
    };
  }, [doctors, patients]);

  const handleDoctorStatus = (doctorId, nextStatus) => {
    const doctor = doctors.find((item) => item.id === doctorId);
    if (!doctor) return;

    setDoctors((currentDoctors) =>
      currentDoctors.map((item) =>
        item.id === doctorId ? { ...item, status: nextStatus } : item
      )
    );

    const actionLabel =
      nextStatus === "active"
        ? `${doctor.name} has been approved`
        : `${doctor.name} has been blocked`;

    setAlerts((currentAlerts) => [actionLabel, ...currentAlerts].slice(0, 5));
  };

  const pendingDoctors = doctors.filter((doctor) => doctor.status === "pending");

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={styles.heroPanel}>
          <div>
            <span style={styles.badge}>Super Admin Panel</span>
            <h1 style={styles.title}>Super Admin Dashboard</h1>
            <p style={styles.description}>
              Manage doctors, patients, and approval flow from one place.
            </p>
          </div>

          <div style={styles.heroMeta}>
            <div style={styles.metaCard}>
              <span style={styles.metaLabel}>System Health</span>
              <strong style={styles.metaValue}>{stats.systemHealth}%</strong>
            </div>
            <div style={styles.metaCard}>
              <span style={styles.metaLabel}>Pending Approvals</span>
              <strong style={styles.metaValue}>{stats.pendingDoctors}</strong>
            </div>
          </div>
        </div>

        <div style={styles.summaryGrid}>
          <SummaryCard
            value={stats.totalDoctors}
            label="Total Doctors"
            valueStyle={summaryColors.doctors}
          />
          <SummaryCard
            value={stats.totalPatients}
            label="Total Patients"
            valueStyle={summaryColors.users}
          />
          <SummaryCard
            value={stats.pendingDoctors}
            label="Pending Doctors"
            valueStyle={summaryColors.pending}
          />
          <SummaryCard
            value={stats.blockedDoctors}
            label="Blocked Doctors"
            valueStyle={summaryColors.blocked}
          />
        </div>

        <div style={styles.tabRow}>
          <TabButton
            label="Overview"
            isActive={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <TabButton
            label="Doctors"
            isActive={activeTab === "doctors"}
            onClick={() => setActiveTab("doctors")}
          />
          <TabButton
            label="Patients"
            isActive={activeTab === "patients"}
            onClick={() => setActiveTab("patients")}
          />
          <TabButton
            label="Approvals"
            isActive={activeTab === "approvals"}
            onClick={() => setActiveTab("approvals")}
          />
        </div>

        {activeTab === "overview" && (
          <div style={styles.contentGrid}>
            <div style={styles.panel}>
              <h2 style={styles.subTitle}>Admin Controls</h2>
              <ul style={styles.list}>
                <li>Approve or block doctor accounts</li>
                <li>Track the current patient load</li>
                <li>Review pending requests from the same screen</li>
                <li>Monitor system health with live counters</li>
              </ul>
            </div>

            <div style={styles.panel}>
              <h2 style={styles.subTitle}>Quick Actions</h2>
              <div style={styles.actionGroup}>
                <button
                  type="button"
                  style={{ ...styles.actionButton, ...buttonColors.doctors }}
                  onClick={() => setActiveTab("doctors")}
                >
                  Manage Doctors
                </button>
                <button
                  type="button"
                  style={{ ...styles.actionButton, ...buttonColors.users }}
                  onClick={() => setActiveTab("patients")}
                >
                  Review Patients
                </button>
                <button
                  type="button"
                  style={{ ...styles.actionButton, ...buttonColors.reports }}
                  onClick={() => setActiveTab("approvals")}
                >
                  Open Approvals
                </button>
              </div>
            </div>

            <div style={{ ...styles.panel, ...styles.fullWidthPanel }}>
              <h2 style={styles.subTitle}>Recent Alerts</h2>
              <AlertList alerts={alerts} />
            </div>
          </div>
        )}

        {activeTab === "doctors" && (
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.subTitle}>Doctor Management</h2>
              <span style={styles.helperText}>
                Review which doctors are active, pending, or blocked.
              </span>
            </div>
            <div style={styles.recordGrid}>
              {doctors.map((doctor) => (
                <DoctorRecordCard
                  key={doctor.id}
                  doctor={doctor}
                  statusStyle={getStatusBadgeStyle(doctor.status)}
                  allowButtonStyle={{ ...styles.smallButton, ...buttonColors.users }}
                  blockButtonStyle={{ ...styles.smallButton, ...buttonColors.block }}
                  onAllow={() => handleDoctorStatus(doctor.id, "active")}
                  onBlock={() => handleDoctorStatus(doctor.id, "blocked")}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "patients" && (
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.subTitle}>Patient Overview</h2>
              <span style={styles.helperText}>
                View all patients and their assigned doctors here.
              </span>
            </div>
            <PatientTable
              patients={patients}
              getPatientStatusStyle={getPatientStatusStyle}
            />
          </div>
        )}

        {activeTab === "approvals" && (
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.subTitle}>Approval Queue</h2>
              <span style={styles.helperText}>
                Quickly approve or reject doctors waiting for access.
              </span>
            </div>
            <div style={styles.recordGrid}>
              {pendingDoctors.map((doctor) => (
                <DoctorRecordCard
                  key={doctor.id}
                  doctor={doctor}
                  compact
                  approveLabel="Approve Now"
                  rejectLabel="Reject"
                  allowButtonStyle={{ ...styles.smallButton, ...buttonColors.doctors }}
                  blockButtonStyle={{ ...styles.smallButton, ...buttonColors.block }}
                  onAllow={() => handleDoctorStatus(doctor.id, "active")}
                  onBlock={() => handleDoctorStatus(doctor.id, "blocked")}
                />
              ))}
              {stats.pendingDoctors === 0 && (
                <div style={styles.emptyState}>
                  There are no pending approvals right now.
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
