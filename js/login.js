/**
 * ADeEl - Login Module
 */
document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const nip = document.getElementById("nip").value.trim();
        const password = document.getElementById("password").value;
        const btn = loginForm.querySelector('button[type="submit"]');

        if (!nip || !password) {
            if (typeof ADeEl !== "undefined") {
                ADeEl.showToast("warning", "Validasi", "NIP/Username dan Password harus diisi");
            }
            return;
        }

        btn.disabled = true;
        btn.innerHTML = "<i class=\"fas fa-spinner fa-spin\"></i> Memproses...";

        try {
            let success = false;
            if (typeof ADeEl !== "undefined") {
                success = ADeEl.login(nip, password);
            }
            if (success) {
                if (typeof ADeEl !== "undefined") ADeEl.showToast("success", "Berhasil", "Selamat datang kembali!");
                setTimeout(function() { window.location.href = "dashboard.html"; }, 500);
            } else {
                if (typeof ADeEl !== "undefined") ADeEl.showToast("error", "Gagal", "NIP/Username atau Password salah");
                btn.disabled = false;
                btn.innerHTML = "<i class=\"fas fa-sign-in-alt\"></i> Masuk";
            }
        } catch(err) {
            if (typeof ADeEl !== "undefined") ADeEl.showToast("error", "Error", "Terjadi kesalahan. Silakan coba lagi");
            btn.disabled = false;
            btn.innerHTML = "<i class=\"fas fa-sign-in-alt\"></i> Masuk";
        }
    });

    // Toggle password visibility
    const toggleBtn = document.querySelector(".password-toggle");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", function() {
            const input = document.getElementById("password");
            const icon = toggleBtn.querySelector("i");
            if (input.type === "password") {
                input.type = "text";
                icon.className = "fas fa-eye-slash";
            } else {
                input.type = "password";
                icon.className = "fas fa-eye";
            }
        });
    }
});
