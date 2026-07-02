/**
 * ADeEl - Employee Module
 */
document.addEventListener("DOMContentLoaded", function() {
    ADeEl.init();
    loadEmployees();
    document.getElementById("simpanEmployee").addEventListener("click", saveEmployee);
});

function loadEmployees() {
    const employees = ADeEl.getLocalData("Pegawai");
    const tbody = document.getElementById("employeeTableBody");
    if (!tbody) return;
    
    if (employees.length === 0) {
        tbody.innerHTML = "<tr><td colspan=\"7\" class=\"text-center text-muted py-4\"><i class=\"fas fa-users fa-2x mb-2 d-block\"></i>Belum ada data pegawai</td></tr>";
        return;
    }
    
    tbody.innerHTML = employees.map(e => {
        return "<tr><td>" + (e.nip || "-") + "</td><td>" + (e.nama || "-") + "</td><td>" + (e.unit || "-") + "</td><td>" + (e.profesi || "-") + "</td><td>" + (e.jabatan || "-") + "</td><td><span class=\"badge bg-primary\">" + (e.role || "Pegawai") + "</span></td><td><button class=\"btn btn-sm btn-ghost\" onclick=\"editEmployee(" + e.id + ")\"><i class=\"fas fa-edit\"></i></button><button class=\"btn btn-sm btn-ghost text-danger\" onclick=\"deleteEmployee(" + e.id + ")\"><i class=\"fas fa-trash\"></i></button></td></tr>";
    }).join("");
}

function saveEmployee() {
    const id = document.getElementById("employeeId").value;
    const data = {
        nip: document.getElementById("empNip").value,
        nik: document.getElementById("empNik").value,
        nama: document.getElementById("empNama").value,
        gelar: document.getElementById("empGelar").value,
        gender: document.getElementById("empGender").value,
        profesi: document.getElementById("empProfesi").value,
        unit: document.getElementById("empUnit").value,
        jabatan: document.getElementById("empJabatan").value,
        status: document.getElementById("empStatus").value,
        role: document.getElementById("empRole").value,
        email: document.getElementById("empEmail").value,
        hp: document.getElementById("empHp").value,
        password: document.getElementById("empPassword").value || "123456"
    };
    
    if (!data.nip || !data.nama) {
        ADeEl.showToast("warning", "Validasi", "NIP dan Nama harus diisi");
        return;
    }
    
    let result;
    if (id) {
        result = ADeEl.updateLocalData("Pegawai", id, data);
    } else {
        result = ADeEl.insertLocalData("Pegawai", data);
    }
    
    if (result.success) {
        ADeEl.showToast("success", "Berhasil", result.message);
        bootstrap.Modal.getInstance(document.getElementById("modalEmployee")).hide();
        loadEmployees();
        resetEmployeeForm();
    }
}

function editEmployee(id) {
    const employees = ADeEl.getLocalData("Pegawai");
    const e = employees.find(item => item.id === id);
    if (!e) return;
    
    document.getElementById("employeeId").value = e.id;
    document.getElementById("empNip").value = e.nip;
    document.getElementById("empNik").value = e.nik;
    document.getElementById("empNama").value = e.nama;
    document.getElementById("empGelar").value = e.gelar;
    document.getElementById("empGender").value = e.gender;
    document.getElementById("empProfesi").value = e.profesi;
    document.getElementById("empUnit").value = e.unit;
    document.getElementById("empJabatan").value = e.jabatan;
    document.getElementById("empStatus").value = e.status;
    document.getElementById("empRole").value = e.role;
    document.getElementById("empEmail").value = e.email;
    document.getElementById("empHp").value = e.hp;
    document.getElementById("modalEmployeeTitle").textContent = "Edit Pegawai";
    new bootstrap.Modal(document.getElementById("modalEmployee")).show();
}

function deleteEmployee(id) {
    Swal.fire({
        title: "Hapus Pegawai?",
        text: "Data yang dihapus tidak dapat dikembalikan",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EF4444",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal"
    }).then(r => {
        if (r.isConfirmed) {
            const result = ADeEl.deleteLocalData("Pegawai", id);
            if (result.success) {
                ADeEl.showToast("success", "Berhasil", result.message);
                loadEmployees();
            }
        }
    });
}

function resetEmployeeForm() {
    document.getElementById("employeeId").value = "";
    document.getElementById("formEmployee").reset();
    document.getElementById("modalEmployeeTitle").textContent = "Tambah Pegawai";
}

function exportExcel() {
    const employees = ADeEl.getLocalData("Pegawai");
    if (employees.length === 0) {
        ADeEl.showToast("warning", "Info", "Tidak ada data untuk diexport");
        return;
    }
    ADeEl.showToast("success", "Export", "Data berhasil diexport (simulasi)");
}
