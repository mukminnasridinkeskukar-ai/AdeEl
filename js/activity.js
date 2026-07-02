/**
 * ADeEl - Activity Module
 */
document.addEventListener("DOMContentLoaded", function() {
    ADeEl.init();
    loadActivities();
    
    document.getElementById("simpanActivity").addEventListener("click", saveActivity);
    document.getElementById("actSelesai").addEventListener("change", calcDuration);
    document.getElementById("actMulai").addEventListener("change", calcDuration);
    document.getElementById("actTanggal").value = new Date().toISOString().split("T")[0];
});

function loadActivities() {
    const activities = ADeEl.getLocalData("Aktivitas");
    const tbody = document.getElementById("activityTableBody");
    if (!tbody) return;
    
    if (activities.length === 0) {
        tbody.innerHTML = "<tr><td colspan=\"8\" class=\"text-center text-muted py-4\"><i class=\"fas fa-inbox fa-2x mb-2 d-block\"></i>Belum ada aktivitas</td></tr>";
        return;
    }
    
    tbody.innerHTML = activities.sort((a,b) => new Date(b.tanggal || 0) - new Date(a.tanggal || 0)).map(a => {
        return "<tr><td>" + (a.tanggal || "-") + "</td><td>" + (a.kategori || "-") + "</td><td>" + (a.subKegiatan || "-") + "</td><td>" + (a.deskripsi || "-").substring(0, 30) + "</td><td>" + (a.jamMulai || "-") + " - " + (a.jamSelesai || "-") + "</td><td>" + (a.durasi || "-") + "</td><td>" + ADeEl.getStatusBadge(a.status || "Draft") + "</td><td><button class=\"btn btn-sm btn-ghost\" onclick=\"editActivity(" + a.id + ")\"><i class=\"fas fa-edit\"></i></button><button class=\"btn btn-sm btn-ghost text-danger\" onclick=\"deleteActivity(" + a.id + ")\"><i class=\"fas fa-trash\"></i></button></td></tr>";
    }).join("");
}

function calcDuration() {
    const mulai = document.getElementById("actMulai").value;
    const selesai = document.getElementById("actSelesai").value;
    if (mulai && selesai) {
        const [h1, m1] = mulai.split(":").map(Number);
        const [h2, m2] = selesai.split(":").map(Number);
        let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
        if (diff < 0) diff += 1440;
    }
}

function saveActivity() {
    const id = document.getElementById("activityId").value;
    const data = {
        tanggal: document.getElementById("actTanggal").value,
        jamMulai: document.getElementById("actMulai").value,
        jamSelesai: document.getElementById("actSelesai").value,
        kategori: document.getElementById("actKategori").value,
        subKegiatan: document.getElementById("actSubKegiatan").value,
        deskripsi: document.getElementById("actDeskripsi").value,
        lokasi: document.getElementById("actLokasi").value,
        volume: document.getElementById("actVolume").value,
        satuan: document.getElementById("actSatuan").value,
        status: document.getElementById("actStatus").value,
        pegawaiNama: ADeEl.user ? ADeEl.user.nama || "User" : "User",
        unit: ADeEl.user ? ADeEl.user.unit || "-" : "-",
        profesi: ADeEl.user ? ADeEl.user.profesi || "-" : "-"
    };
    
    if (!data.tanggal || !data.jamMulai || !data.jamSelesai) {
        ADeEl.showToast("warning", "Validasi", "Tanggal, jam mulai dan selesai harus diisi");
        return;
    }
    
    let result;
    if (id) {
        result = ADeEl.updateLocalData("Aktivitas", id, data);
    } else {
        result = ADeEl.insertLocalData("Aktivitas", data);
    }
    
    if (result.success) {
        ADeEl.showToast("success", "Berhasil", result.message);
        bootstrap.Modal.getInstance(document.getElementById("modalActivity")).hide();
        loadActivities();
        resetActivityForm();
    }
}

function editActivity(id) {
    const activities = ADeEl.getLocalData("Aktivitas");
    const a = activities.find(item => item.id === id);
    if (!a) return;
    
    document.getElementById("activityId").value = a.id;
    document.getElementById("actTanggal").value = a.tanggal;
    document.getElementById("actMulai").value = a.jamMulai;
    document.getElementById("actSelesai").value = a.jamSelesai;
    document.getElementById("actKategori").value = a.kategori;
    document.getElementById("actSubKegiatan").value = a.subKegiatan;
    document.getElementById("actDeskripsi").value = a.deskripsi;
    document.getElementById("actLokasi").value = a.lokasi;
    document.getElementById("actVolume").value = a.volume;
    document.getElementById("actSatuan").value = a.satuan;
    document.getElementById("actStatus").value = a.status;
    document.getElementById("modalActivityTitle").textContent = "Edit Aktivitas";
    new bootstrap.Modal(document.getElementById("modalActivity")).show();
}

function deleteActivity(id) {
    Swal.fire({
        title: "Hapus Aktivitas?",
        text: "Data yang dihapus tidak dapat dikembalikan",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EF4444",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal"
    }).then(r => {
        if (r.isConfirmed) {
            const result = ADeEl.deleteLocalData("Aktivitas", id);
            if (result.success) {
                ADeEl.showToast("success", "Berhasil", result.message);
                loadActivities();
            }
        }
    });
}

function resetActivityForm() {
    document.getElementById("activityId").value = "";
    document.getElementById("formActivity").reset();
    document.getElementById("actTanggal").value = new Date().toISOString().split("T")[0];
    document.getElementById("modalActivityTitle").textContent = "Tambah Aktivitas";
}
