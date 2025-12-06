import React from 'react';
import { Patient, Appointment } from '../types/patient';

interface DashboardProps {
    patients: Patient[];
    onItemClick: (patientId?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ patients, onItemClick }) => {
    const getPatientName = (patient: Patient) => {
        const given = patient.name.given.join(' ');
        return `${given} ${patient.name.family}`.trim();
    };

    // --- Metrics Calculation ---

    const totalPatients = patients.length;

    // Verification Status Counts
    let verifiedCount = 0;
    let inProgressCount = 0;
    let pendingCount = 0;
    let notStartedCount = 0;

    patients.forEach(p => {
        if (!p.verificationStatus) {
            notStartedCount++;
            return;
        }
        const { sendToPMS, eligibilityCheck, benefitsVerification, aiCallVerification } = p.verificationStatus;

        if (sendToPMS === 'completed') {
            verifiedCount++;
        } else if (
            sendToPMS === 'in_progress' ||
            eligibilityCheck === 'in_progress' ||
            benefitsVerification === 'in_progress' ||
            aiCallVerification === 'in_progress'
        ) {
            inProgressCount++;
        } else if (
            eligibilityCheck === 'completed' ||
            benefitsVerification === 'completed' ||
            aiCallVerification === 'completed'
        ) {
            pendingCount++;
        } else {
            notStartedCount++;
        }
    });

    // Appointments Aggregation
    const allAppointments: Array<{
        patient: Patient;
        appointment: Appointment;
        verificationStatus: number; // 0-100
    }> = [];

    patients.forEach(patient => {
        if (patient.appointments) {
            patient.appointments.forEach(apt => {
                // Calculate a rough verification percentage for display
                let progress = 0;
                if (patient.verificationStatus) {
                    if (patient.verificationStatus.sendToPMS === 'completed') progress = 100;
                    else if (patient.verificationStatus.aiCallVerification === 'completed') progress = 75;
                    else if (patient.verificationStatus.benefitsVerification === 'completed') progress = 50;
                    else if (patient.verificationStatus.eligibilityCheck === 'completed') progress = 25;
                }

                allAppointments.push({
                    patient,
                    appointment: apt,
                    verificationStatus: progress
                });
            });
        }
    });

    // Sort appointments by date
    allAppointments.sort((a, b) => {
        const dateA = new Date(`${a.appointment.date}T${a.appointment.time}`);
        const dateB = new Date(`${b.appointment.date}T${b.appointment.time}`);
        return dateA.getTime() - dateB.getTime();
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingAppointments = allAppointments.filter(item => {
        const aptDate = new Date(`${item.appointment.date}T${item.appointment.time}`);
        return aptDate >= today;
    }).slice(0, 5);

    const pastAppointments = allAppointments.filter(item => {
        const aptDate = new Date(`${item.appointment.date}T${item.appointment.time}`);
        return aptDate < today;
    }).sort((a, b) => { // Sort past appointments descending
        const dateA = new Date(`${a.appointment.date}T${a.appointment.time}`);
        const dateB = new Date(`${b.appointment.date}T${b.appointment.time}`);
        return dateB.getTime() - dateA.getTime();
    }).slice(0, 5);

    // Quick Insights Data
    const appointmentsToday = allAppointments.filter(item => {
        const aptDate = new Date(`${item.appointment.date}T${item.appointment.time}`);
        const itemDate = new Date(aptDate);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate.getTime() === today.getTime();
    }).length;

    const appointmentsTomorrow = allAppointments.filter(item => {
        const aptDate = new Date(`${item.appointment.date}T${item.appointment.time}`);
        const itemDate = new Date(aptDate);
        itemDate.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return itemDate.getTime() === tomorrow.getTime();
    }).length;

    const completedAppointments = allAppointments.filter(item => item.appointment.status === 'completed').length;
    const completionRate = allAppointments.length > 0 ? Math.round((completedAppointments / allAppointments.length) * 100) : 0;


    // --- Components ---

    const DonutChart = () => {
        const size = 160;
        const strokeWidth = 20;
        const center = size / 2;
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;

        const data = [
            { label: 'In Progress', value: inProgressCount, color: '#3b82f6' }, // Blue
            { label: 'Pending', value: pendingCount, color: '#f97316' }, // Orange
            { label: 'Verified', value: verifiedCount, color: '#22c55e' }, // Green
            { label: 'Not Started', value: notStartedCount, color: '#e2e8f0' }, // Slate
        ];

        const total = data.reduce((acc, curr) => acc + curr.value, 0);
        let startAngle = -90; // Start at top

        return (
            <div className="relative flex items-center justify-center">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {data.map((item, index) => {
                        if (item.value === 0) return null;
                        const percentage = item.value / total;
                        const dashArray = percentage * circumference;
                        const angle = (percentage * 360);

                        // Calculate rotation
                        const rotate = startAngle;
                        startAngle += angle;

                        return (
                            <circle
                                key={index}
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="none"
                                stroke={item.color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${dashArray} ${circumference}`}
                                transform={`rotate(${rotate} ${center} ${center})`}
                                className="transition-all duration-500 ease-out"
                            />
                        );
                    })}
                    {/* Inner Text */}
                    <text x="50%" y="50%" textAnchor="middle" dy="-5" className="text-3xl font-bold fill-slate-900 dark:fill-white">
                        {total}
                    </text>
                    <text x="50%" y="50%" textAnchor="middle" dy="15" className="text-xs fill-slate-500 dark:fill-slate-400 font-medium uppercase">
                        Total
                    </text>
                </svg>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans">
            {/* Header */}
            <header className="flex-none px-8 py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Insurance Verification Overview</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Select a patient from the list to review their insurance verification status, or add a new patient to begin the verification process.
                    </p>
                </div>
                <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">sync</span>
                    Synchronize Patient Appointment Data
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-[1600px] mx-auto space-y-8">

                    {/* Top Row: 3 Columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Card 1: Overview Statistics */}
                        <div onClick={() => onItemClick()} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <span className="material-symbols-outlined text-lg">analytics</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Overview Statistics</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Appointment metrics</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {/* Total */}
                                <div className="flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 shadow-sm">
                                            <span className="material-symbols-outlined text-sm">group</span>
                                        </div>
                                        <span className="font-medium text-slate-700 dark:text-slate-300">Total</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xl font-bold text-slate-900 dark:text-white">{totalPatients}</span>
                                        <span className="text-xs font-medium text-slate-400">100%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Verification Status (Donut Chart) */}
                        <div onClick={() => onItemClick()} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col cursor-pointer hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600 transition-all">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400">
                                    <span className="material-symbols-outlined text-lg">pie_chart</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Verification Status</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Distribution by status</p>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center">
                                <DonutChart />

                                <div className="w-full mt-8 space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                            <span className="text-slate-600 dark:text-slate-400">In Progress</span>
                                        </div>
                                        <div className="font-medium text-slate-900 dark:text-white">{inProgressCount} ({Math.round((inProgressCount / totalPatients) * 100)}%)</div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                            <span className="text-slate-600 dark:text-slate-400">Pending</span>
                                        </div>
                                        <div className="font-medium text-slate-900 dark:text-white">{pendingCount} ({Math.round((pendingCount / totalPatients) * 100)}%)</div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                                            <span className="text-slate-600 dark:text-slate-400">Not Started</span>
                                        </div>
                                        <div className="font-medium text-slate-900 dark:text-white">{notStartedCount} ({Math.round((notStartedCount / totalPatients) * 100)}%)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Quick Insights */}
                        <div onClick={() => onItemClick()} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:shadow-lg hover:border-green-300 dark:hover:border-green-600 transition-all">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400">
                                    <span className="material-symbols-outlined text-lg">insights</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Quick Insights</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Key metrics</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-slate-400">calendar_today</span>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Today</span>
                                    </div>
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">{appointmentsToday}</span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-slate-400">event_upcoming</span>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tomorrow</span>
                                    </div>
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">{appointmentsTomorrow}</span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-purple-400">task_alt</span>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Completed</span>
                                    </div>
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">{completedAppointments}</span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-orange-400">trending_up</span>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Completion Rate</span>
                                    </div>
                                    <span className="text-lg font-bold text-orange-500">{completionRate}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: 2 Columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Upcoming Appointments */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-[400px]">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <span className="material-symbols-outlined text-lg">event</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">Upcoming Patient Appointments</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{upcomingAppointments.length} scheduled appointments</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">calendar_today</span> Today
                                    </button>
                                    <button className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">event</span> Tomorrow
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date & Time</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Patient</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Appointment Type</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Verification Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                        {upcomingAppointments.length > 0 ? (
                                            upcomingAppointments.map((item, index) => (
                                                <tr key={index} onClick={() => onItemClick()} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer">
                                                    <td className="px-6 py-4">
                                                        <div className="text-xs font-medium text-green-600 dark:text-green-400">Today</div>
                                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{item.appointment.time}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-sm text-slate-900 dark:text-white">{getPatientName(item.patient)}</div>
                                                        <div className="text-xs text-slate-500">Dr. {item.appointment.provider}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                            <span className="material-symbols-outlined text-sm mr-1">dentistry</span>
                                                            {item.appointment.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 w-8">{item.verificationStatus}%</span>
                                                            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden w-24">
                                                                <div
                                                                    className="h-full bg-blue-500 rounded-full"
                                                                    style={{ width: `${item.verificationStatus}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">No upcoming appointments</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Past Appointments */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-[400px]">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400">
                                        <span className="material-symbols-outlined text-lg">history</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">Past Appointments</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{pastAppointments.length} completed appointments</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date & Time</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Patient</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Appointment Type</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Verification Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                        {pastAppointments.length > 0 ? (
                                            pastAppointments.map((item, index) => (
                                                <tr key={index} onClick={() => onItemClick()} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer">
                                                    <td className="px-6 py-4">
                                                        <div className="text-xs font-medium text-slate-900 dark:text-white">{new Date(item.appointment.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                                                        <div className="text-xs text-slate-500">{item.appointment.time}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-sm text-slate-900 dark:text-white">{getPatientName(item.patient)}</div>
                                                        <div className="text-xs text-slate-500">Dr. {item.appointment.provider}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                                                            {item.appointment.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs font-bold text-green-600 dark:text-green-400 w-8">{item.verificationStatus}%</span>
                                                            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden w-24">
                                                                <div
                                                                    className="h-full bg-green-500 rounded-full"
                                                                    style={{ width: `${item.verificationStatus}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">No past appointments</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
