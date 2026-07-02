/**
 * ADeEl - Dashboard Module
 */
document.addEventListener("DOMContentLoaded", function() {
    ADeEl.init();
    loadDashboardData();
    initCharts();
});

function loadDashboardData() {
    const employees = ADeEl.getLocalData("Pegawai");
    const activities = ADeEl.getLocalData("Aktivitas");
    const today = new Date().toISOString().split("T")[0];
    const month = today.substring(0, 7);
    
    document.getElementById("statPegawai").textContent = employees.length || 0;
    
    const todayActivities = activities.filter(a => a.tanggal === today);
    document.getElementById("statHariIni").textContent = todayActivities.length;
    
    const monthActivities = activities.filter(a => a.tanggal && a.tanggal.startsWith(month));
    document.getElementById("statBulanIni").textContent = monthActivities.length;
    
    if (activities.length > 0) {
        const counts = {};
        activities.forEach(a => {
            counts[a.pegawaiNama || a.nip] = (counts[a.pegawaiNama || a.nip] || 0) + 1;
        });
        const top = Object.entries(counts).sort((a,b) => b[1] - a[1]);
        if (top.length > 0) {
            document.getElementById("statTeraktif").textContent = top[0][0] + " (" + top[0][1] + ")";
        }
    }
    
    loadRecentActivities(activities);
    loadTopPerformer(activities, employees);
}

function loadRecentActivities(activities) {
    const container = document.getElementById("recentActivity");
    if (!container || activities.length === 0) return;
    
    const recent = activities.sort((a,b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5);
    container.innerHTML = recent.map(a => {
        const statusClass = {Draft:"secondary", Submitted:"info", Approved:"success", Rejected:"danger"};
        return "<div class=\"activity-item\"><div class=\"activity-dot " + (statusClass[a.status] || "secondary") + "\"></div><div class=\"activity-content\"><div class=\"activity-text\">" + (a.deskripsi || "-") + "</div><div class=\"activity-time\">" + (a.pegawaiNama || "-") + " - " + ADeEl.formatDateTime(a.createdAt) + "</div></div></div>";
    }).join("");
}

function loadTopPerformer(activities, employees) {
    const container = document.getElementById("topPerformer");
    if (!container) return;
    if (activities.length === 0) {
        container.innerHTML = "<div class=\"text-center text-muted py-3\"><i class=\"fas fa-medal fa-2x mb-2\"></i><p>Belum ada data</p></div>";
        return;
    }
    const counts = {};
    activities.forEach(a => {
        const name = a.pegawaiNama || a.nip || "Unknown";
        counts[name] = (counts[name] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 5);
    container.innerHTML = sorted.map(([name, count], i) => {
        const medal = ["??", "??", "??"][i] || "";
        return "<div class=\"d-flex align-items-center justify-content-between py-2 border-bottom\"><span>" + medal + " " + name + "</span><span class=\"badge bg-primary\">" + count + " aktivitas</span></div>";
    }).join("");
}


function initCharts() {
    const activities = ADeEl.getLocalData("Aktivitas");
    
    // Chart Harian (last 7 days)
    const ctx1 = document.getElementById("chartHarian");
    if (ctx1) {
        const days = [];
        const counts = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split("T")[0];
            const dayName = d.toLocaleDateString("id-ID", { weekday: "short" });
            days.push(dayName);
            counts.push(activities.filter(a => a.tanggal === dateStr).length);
        }
        new Chart(ctx1, {
            type: "line",
            data: {
                labels: days,
                datasets: [{
                    label: "Aktivitas",
                    data: counts,
                    borderColor: "#4F46E5",
                    backgroundColor: "rgba(79,70,229,0.1)",
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: "#4F46E5",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.06)" } },
                    x: { grid: { display: false } }
                }
            }
        });
    }
    
    // Chart Unit
    const ctx3 = document.getElementById("chartUnit");
    if (ctx3) {
        const units = {};
        activities.forEach(a => {
            const u = a.unit || "Unknown";
            units[u] = (units[u] || 0) + 1;
        });
        const labels = Object.keys(units);
        const data = Object.values(units);
        new Chart(ctx3, {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6", "#EC4899"],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom", labels: { padding: 12, usePointStyle: true, font: { size: 11 } } } },
                cutout: "70%"
            }
        });
    }
    
    // Chart Profesi
    const ctx4 = document.getElementById("chartProfesi");
    if (ctx4) {
        const profs = {};
        activities.forEach(a => {
            const p = a.profesi || "Unknown";
            profs[p] = (profs[p] || 0) + 1;
        });
        const labels = Object.keys(profs);
        const data = Object.values(profs);
        new Chart(ctx4, {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ["#10B981", "#3B82F6", "#F59E0B", "#EC4899", "#8B5CF6", "#EF4444"],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom", labels: { padding: 12, usePointStyle: true, font: { size: 11 } } } },
                cutout: "70%"
            }
        });
    }
}

