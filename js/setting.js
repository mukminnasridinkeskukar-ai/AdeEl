/**
 * ADeEl - Settings Module
 */
document.addEventListener("DOMContentLoaded", function() {
    ADeEl.init();
    const verEl = document.getElementById("appVersion");
    if (verEl) verEl.textContent = CONFIG.VERSION;
    
    if (ADeEl.user) {
        const nameEl = document.getElementById("profileName");
        const roleEl = document.getElementById("profileRole");
        const unitEl = document.getElementById("profileUnit");
        if (nameEl) nameEl.textContent = ADeEl.user.nama || "User";
        if (roleEl) roleEl.textContent = ADeEl.user.role || "Pegawai";
        if (unitEl) unitEl.textContent = ADeEl.user.unit || "-";
    }
    
    const darkSwitch = document.getElementById("darkModeSwitch");
    if (darkSwitch) {
        darkSwitch.checked = ADeEl.theme === "dark";
        darkSwitch.addEventListener("change", function() {
            ADeEl.toggleTheme();
        });
    }
});

function changePassword() {
    Swal.fire({
        title: "Ganti Password",
        html: '<input type="password" id="currentPass" class="form-control mb-3" placeholder="Password Saat Ini"><input type="password" id="newPass" class="form-control mb-3" placeholder="Password Baru"><input type="password" id="confirmPass" class="form-control" placeholder="Konfirmasi">',
        confirmButtonText: "Simpan",
        showCancelButton: true,
        confirmButtonColor: "#4F46E5",
        preConfirm: () => {
            const current = document.getElementById("currentPass").value;
            const newPass = document.getElementById("newPass").value;
            const confirm = document.getElementById("confirmPass").value;
            if (!current || !newPass || !confirm) {
                Swal.showValidationMessage("Semua field harus diisi");
                return false;
            }
            if (newPass !== confirm) {
                Swal.showValidationMessage("Password baru tidak cocok");
                return false;
            }
            return true;
        }
    }).then(r => {
        if (r.isConfirmed) ADeEl.showToast("success", "Berhasil", "Password berhasil diubah");
    });
}

function setThemeColor(color) {
    document.documentElement.style.setProperty("--primary", color);
    document.documentElement.style.setProperty("--primary-dark", color);
    localStorage.setItem("adeel_primary_color", color);
    ADeEl.showToast("success", "Tema", "Warna tema berhasil diubah");
}
function backupData() {
    const data = {
        config: CONFIG,
        users: ADeEl.getLocalData("Pegawai"),
        activities: ADeEl.getLocalData("Aktivitas"),
        backupDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "adeel_backup_" + new Date().toISOString().split("T")[0] + ".json";
    a.click();
    URL.revokeObjectURL(url);
    ADeEl.showToast("success", "Backup", "Data berhasil dibackup");
}

function restoreData() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(ev) {
            try {
                const data = JSON.parse(ev.target.result);
                if (data.users) localStorage.setItem("adeel_Pegawai", JSON.stringify(data.users));
                if (data.activities) localStorage.setItem("adeel_Aktivitas", JSON.stringify(data.activities));
                ADeEl.showToast("success", "Restore", "Data berhasil direstore");
            } catch(err) {
                ADeEl.showToast("error", "Error", "File backup tidak valid");
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function clearData() {
    Swal.fire({
        title: "Hapus Semua Data?",
        text: "Data yang dihapus tidak dapat dikembalikan",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EF4444",
        confirmButtonText: "Ya, Hapus Semua",
        cancelButtonText: "Batal"
    }).then(r => {
        if (r.isConfirmed) {
            localStorage.removeItem("adeel_Pegawai");
            localStorage.removeItem("adeel_Aktivitas");
            localStorage.removeItem("adeel_MasterKategori");
            localStorage.removeItem("adeel_MasterUnit");
            localStorage.removeItem("adeel_MasterProfesi");
            ADeEl.showToast("success", "Berhasil", "Semua data berhasil dihapus");
        }
    });
}
function seedData() {
    const employees = [
        { id: "1", nip: "198501012010011001", nama: "Dr. Andi Pratama", unit: "Dinas Kesehatan", profesi: "Dokter", jabatan: "Kepala Dinas", role: "Pimpinan", status: "ASN" },
        { id: "2", nip: "198702152011012002", nama: "Siti Rahmah, S.Kep", unit: "Puskesmas A", profesi: "Perawat", jabatan: "Kepala Puskesmas", role: "Pimpinan", status: "ASN" },
        { id: "3", nip: "199003202012011003", nama: "Ahmad Fauzi", unit: "Puskesmas B", profesi: "Bidan", jabatan: "Bidan Madya", role: "Pegawai", status: "ASN" },
        { id: "4", nip: "199105252013011004", nama: "Rina Marlina", unit: "Dinas Kesehatan", profesi: "Apoteker", jabatan: "Staff Farmasi", role: "Pegawai", status: "PPPK" },
        { id: "5", nip: "199207302014011005", nama: "Bambang Sutejo", unit: "RSUD", profesi: "Dokter Gigi", jabatan: "Dokter Madya", role: "Pegawai", status: "ASN" },
        { id: "6", nip: "198812102015011006", nama: "Dewi Sartika", unit: "Puskesmas A", profesi: "Perawat", jabatan: "Perawat Pelaksana", role: "Pegawai", status: "Non ASN" },
        { id: "7", nip: "199307052016011007", nama: "Hendra Gunawan", unit: "RSUD", profesi: "Radiografer", jabatan: "Teknisi Radiologi", role: "Pegawai", status: "PPPK" },
        { id: "8", nip: "198909152017011008", nama: "Fitri Handayani", unit: "Dinas Kesehatan", profesi: "Administrasi", jabatan: "Staff TU", role: "Admin", status: "ASN" }
    ];
    localStorage.setItem("adeel_Pegawai", JSON.stringify(employees));
    
    const activities = [];
    const categories = ["Pelayanan", "Administrasi", "Rapat", "Lapangan", "Lainnya"];
    const statuses = ["Approved", "Approved", "Approved", "Submitted", "Draft"];
    const descriptions = [
        "Melakukan pelayanan kesehatan masyarakat",
        "Menyusun laporan bulanan",
        "Mengikuti rapat koordinasi",
        "Melakukan kunjungan lapangan",
        "Menginput data pasien",
        "Melakukan supervisi",
        "Menyiapkan dokumen administrasi",
        "Melakukan evaluasi program"
    ];
    
    for (let i = 0; i < 120; i++) {
        const emp = employees[Math.floor(Math.random() * employees.length)];
        const d = new Date();
        d.setDate(d.getDate() - Math.floor(Math.random() * 30));
        const dateStr = d.toISOString().split("T")[0];
        const startHour = 7 + Math.floor(Math.random() * 8);
        const endHour = startHour + 1 + Math.floor(Math.random() * 7);
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        activities.push({
            id: (i + 1).toString(),
            tanggal: dateStr,
            jamMulai: startHour.toString().padStart(2, "0") + ":00",
            jamSelesai: (endHour > 23 ? 23 : endHour).toString().padStart(2, "0") + ":00",
            kategori: categories[Math.floor(Math.random() * categories.length)],
            subKegiatan: descriptions[Math.floor(Math.random() * descriptions.length)],
            deskripsi: descriptions[Math.floor(Math.random() * descriptions.length)],
            lokasi: emp.unit,
            volume: Math.floor(Math.random() * 10) + 1,
            satuan: "Kegiatan",
            status: status,
            pegawaiNama: emp.nama,
            unit: emp.unit,
            profesi: emp.profesi,
            createdAt: d.toISOString()
        });
    }
    localStorage.setItem("adeel_Aktivitas", JSON.stringify(activities));
    
    ADeEl.showToast("success", "Berhasil", "Data demo: " + employees.length + " pegawai, " + activities.length + " aktivitas");
    if (window.location.pathname.includes("dashboard")) {
        setTimeout(() => location.reload(), 1000);
    }
}
