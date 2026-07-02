/**
 * ADeEl - Report Module
 */
document.addEventListener("DOMContentLoaded", function() {
    ADeEl.init();
    loadReportFilters();
    loadReport();
});

function loadReportFilters() {
    const employees = ADeEl.getLocalData("Pegawai");
    const unitSet = new Set();
    const profesiSet = new Set();
    
    employees.forEach(e => {
        if (e.unit) unitSet.add(e.unit);
        if (e.profesi) profesiSet.add(e.profesi);
    });
    
    const unitSelect = document.getElementById("reportUnit");
    const profesiSelect = document.getElementById("reportProfesi");
    
    if (unitSelect) {
        unitSet.forEach(u => {
            const opt = document.createElement("option");
            opt.value = u; opt.textContent = u;
            unitSelect.appendChild(opt);
        });
    }
    
    if (profesiSelect) {
        profesiSet.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p; opt.textContent = p;
            profesiSelect.appendChild(opt);
        });
    }
}

function loadReport() {
    const periode = document.getElementById("reportPeriode").value;
    const unit = document.getElementById("reportUnit").value;
    const profesi = document.getElementById("reportProfesi").value;
    const status = document.getElementById("reportStatus").value;
    
    const activities = ADeEl.getLocalData("Aktivitas");
    const employees = ADeEl.getLocalData("Pegawai");
    const tbody = document.getElementById("reportTableBody");
    if (!tbody) return;
    
    // Filter activities based on periode
    let filtered = activities;
    const now = new Date();
    
    if (periode === "harian") {
        const today = now.toISOString().split("T")[0];
        filtered = filtered.filter(a => a.tanggal === today);
    } else if (periode === "mingguan") {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(a => new Date(a.tanggal) >= weekAgo);
    } else if (periode === "bulanan") {
        const month = now.toISOString().substring(0, 7);
        filtered = filtered.filter(a => a.tanggal && a.tanggal.startsWith(month));
    } else if (periode === "triwulan") {
        const qStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        filtered = filtered.filter(a => new Date(a.tanggal) >= qStart);
    } else if (periode === "semester") {
        const sStart = new Date(now.getFullYear(), now.getMonth() < 6 ? 0 : 6, 1);
        filtered = filtered.filter(a => new Date(a.tanggal) >= sStart);
    } else if (periode === "tahunan") {
        const year = now.getFullYear().toString();
        filtered = filtered.filter(a => a.tanggal && a.tanggal.startsWith(year));
    }
    
    if (unit) filtered = filtered.filter(a => a.unit === unit);
    if (profesi) filtered = filtered.filter(a => a.profesi === profesi);
    if (status) filtered = filtered.filter(a => a.status === status);
    
    // Group by employee
    const reportMap = {};
    filtered.forEach(a => {
        const key = a.pegawaiNama || a.nip || "Unknown";
        if (!reportMap[key]) {
            reportMap[key] = { nama: key, nip: a.nip || "-", unit: a.unit || "-", count: 0 };
        }
        reportMap[key].count++;
    });
    
    const reportData = Object.values(reportMap);
    
    if (reportData.length === 0) {
        tbody.innerHTML = "<tr><td colspan=\"10\" class=\"text-center text-muted py-4\"><i class=\"fas fa-inbox fa-2x mb-2 d-block\"></i>Tidak ada data laporan</td></tr>";
        return;
    }
    
    tbody.innerHTML = reportData.map((r, i) => {
        const target = 20;
        const realisasi = r.count;
        const persen = Math.min(Math.round((realisasi / target) * 100), 100);
        let skor = 0, kategori = "Kurang";
        if (persen >= 90) { skor = 5; kategori = "Sangat Baik"; }
        else if (persen >= 75) { skor = 4; kategori = "Baik"; }
        else if (persen >= 60) { skor = 3; kategori = "Cukup"; }
        else if (persen >= 40) { skor = 2; kategori = "Kurang"; }
        else { skor = 1; kategori = "Sangat Kurang"; }
        
        const badgeClass = { "Sangat Baik": "success", "Baik": "info", "Cukup": "warning", "Kurang": "danger", "Sangat Kurang": "danger" };
        return "<tr><td>" + (i + 1) + "</td><td>" + r.nip + "</td><td>" + r.nama + "</td><td>" + r.unit + "</td><td>" + r.count + "</td><td>" + target + "</td><td>" + realisasi + "</td><td>" + persen + "%</td><td>" + skor + "</td><td><span class=\"badge bg-" + (badgeClass[kategori] || "secondary") + "\">" + kategori + "</span></td></tr>";
    }).join("");
}

function printReport() {
    window.print();
}

function exportPDF() {
    ADeEl.showToast("success", "Export", "Laporan PDF berhasil diexport (simulasi)");
}

function exportExcel() {
    ADeEl.showToast("success", "Export", "Laporan Excel berhasil diexport (simulasi)");
}
