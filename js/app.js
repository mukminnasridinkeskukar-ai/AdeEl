/**
 * ADeEl - Advanced Digital Employee Log
 * Core Application Module
 */
const ADeEl = {
    user: null, theme: 'light', charts: {},

    init() {
        this.loadTheme(); this.checkSession(); this.initSidebar();
        this.initThemeToggle(); this.initLogout(); this.initGlobalSearch();
    },

    loadTheme() {
        this.theme = localStorage.getItem(CONFIG.THEME_KEY) || 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
    },

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem(CONFIG.THEME_KEY, this.theme);
        const icon = document.querySelector('#themeToggle i');
        if (icon) icon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    },

    checkSession() {
        const session = localStorage.getItem(CONFIG.SESSION_KEY);
        if (!session) return;
        try {
            this.user = JSON.parse(session);
            this.updateUI();
        } catch(e) { this.logout(); }
    },

    updateUI() {
        if (!this.user) return;
        const nameEl = document.getElementById('sidebarName');
        const roleEl = document.getElementById('sidebarRole');
        const avatarEl = document.getElementById('sidebarAvatar');
        if (nameEl) nameEl.textContent = this.user.nama || 'User';
        if (roleEl) roleEl.textContent = this.user.role || 'Pegawai';
        if (avatarEl) avatarEl.textContent = (this.user.nama || 'U')[0].toUpperCase();
    },

    login(nip, password) {
        // Default accounts for demo
        const accounts = {
            'admin': { nip:'ADMIN001', nama:'Administrator', role:'Admin', unit:'Dinas Kesehatan', profesi:'IT' },
            'pimpinan': { nip:'PIM001', nama:'Dr. Andi', role:'Pimpinan', unit:'Dinas Kesehatan', profesi:'Dokter' },
            'pegawai': { nip:'PEG001', nama:'Siti Rahmah', role:'Pegawai', unit:'Puskesmas A', profesi:'Perawat' }
        };
        const user = accounts[nip];
        if (user && password === '123456') {
            localStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(user));
            this.user = user; this.updateUI(); return true;
        }
        return false;
    },

    logout() {
        localStorage.removeItem(CONFIG.SESSION_KEY);
        this.user = null;
        window.location.href = 'index.html';
    },
    initSidebar() {
        const menuBtn = document.getElementById("menuBtn");
        const sidebar = document.getElementById("sidebar");
        const overlay = document.getElementById("sidebarOverlay");
        if (!menuBtn || !sidebar) return;
        menuBtn.addEventListener("click", () => {
            if (window.innerWidth <= 992) {
                sidebar.classList.toggle("mobile-open");
                if (overlay) overlay.classList.toggle("show");
            } else { sidebar.classList.toggle("collapsed"); }
        });
        if (overlay) {
            overlay.addEventListener("click", () => {
                sidebar.classList.remove("mobile-open");
                overlay.classList.remove("show");
            });
        }
        window.addEventListener("resize", () => {
            if (window.innerWidth > 992) {
                sidebar.classList.remove("mobile-open");
                if (overlay) overlay.classList.remove("show");
            }
        });
    },
    initThemeToggle() {
        const btn = document.getElementById("themeToggle");
        if (!btn) return;
        btn.addEventListener("click", () => this.toggleTheme());
        const icon = btn.querySelector("i");
        if (icon) icon.className = this.theme === "dark" ? "fas fa-sun" : "fas fa-moon";
    },
    initLogout() {
        const btn = document.getElementById("logoutBtn");
        if (!btn) return;
        btn.addEventListener("click", () => {
            Swal.fire({
                title: "Konfirmasi Logout", text: "Apakah Anda yakin ingin logout?", icon: "question",
                showCancelButton: true, confirmButtonColor: "#4F46E5", cancelButtonColor: "#EF4444",
                confirmButtonText: "Ya, Logout", cancelButtonText: "Batal"
            }).then(r => { if (r.isConfirmed) this.logout(); });
        });
    },
    initGlobalSearch() {
        const search = document.getElementById("globalSearch");
        if (!search) return;
        search.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                const val = search.value.trim();
                if (val) this.showToast("info", "Pencarian", "Hasil pencarian: " + val);
            }
        });
    },
    showToast(type, title, message) {
        const container = document.getElementById("toastContainer");
        if (!container) return;
        const icons = { success: "fa-check-circle", error: "fa-times-circle", warning: "fa-exclamation-circle", info: "fa-info-circle" };
        const toast = document.createElement("div");
        toast.className = "toast-custom " + type;
        toast.innerHTML = "<div class=\"toast-icon\"><i class=\"fas " + (icons[type] || "fa-info-circle") + "\"></i></div><div class=\"toast-content\"><div class=\"toast-title\">" + title + "</div><div class=\"toast-message\">" + message + "</div></div><button class=\"toast-close\" onclick=\"this.parentElement.remove()\"><i class=\"fas fa-times\"></i></button>";
        container.appendChild(toast);
        setTimeout(() => { if (toast.parentElement) toast.remove(); }, 5000);
    },
    formatDate(date) {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });
    },
    formatDateTime(date) {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    },
    formatNumber(num) {
        return new Intl.NumberFormat("id-ID").format(num || 0);
    },
    getStatusBadge(status) {
        const map = {
            Draft: "<span class=\'badge bg-secondary\'>Draft</span>",
            Submitted: "<span class=\'badge bg-info\'>Submitted</span>",
            Approved: "<span class=\'badge bg-success\'>Approved</span>",
            Rejected: "<span class=\'badge bg-danger\'>Rejected</span>"
        };
        return map[status] || "<span class=\'badge bg-secondary\'>" + status + "</span>";
    },
    getRolePermission() {
        if (!this.user) return [];
        const perms = { Admin: ["all"], Pimpinan: ["view", "approve", "report"], Pegawai: ["create", "edit", "view-self"] };
        return perms[this.user.role] || ["view-self"];
    },
    hasPermission(action) {
        const perms = this.getRolePermission();
        return perms.includes("all") || perms.includes(action);
    },
    async api(action, data = {}, method = "POST") {
        if (!CONFIG.WEB_APP_URL) return this.localApi(action, data);
        try {
            const url = CONFIG.WEB_APP_URL + "?action=" + action;
            const options = { method, headers: { "Content-Type": "application/json" } };
            if (method === "POST") options.body = JSON.stringify(data);
            const response = await fetch(url, options);
            return await response.json();
        } catch (error) {
            console.error("API Error:", error);
            return this.localApi(action, data);
        }
    },
    localApi(action, data) {
        switch(action) {
            case "login": return { success: this.login(data.nip, data.password), user: this.user };
            case "getData": return this.getLocalData(data.table);
            case "insert": return this.insertLocalData(data.table, data.data);
            case "update": return this.updateLocalData(data.table, data.id, data.data);
            case "delete": return this.deleteLocalData(data.table, data.id);
            default: return { success: false, message: "Action not supported" };
        }
    },
    getLocalData(table) {
        try { return JSON.parse(localStorage.getItem("adeel_" + table) || "[]"); }
        catch(e) { return []; }
    },
    insertLocalData(table, data) {
        const items = this.getLocalData(table);
        data.id = Date.now().toString();
        data.createdAt = new Date().toISOString();
        items.push(data);
        localStorage.setItem("adeel_" + table, JSON.stringify(items));
        return { success: true, data, message: "Data berhasil disimpan" };
    },
    updateLocalData(table, id, data) {
        const items = this.getLocalData(table);
        const idx = items.findIndex(i => i.id === id);
        if (idx > -1) {
            data.updatedAt = new Date().toISOString();
            items[idx] = { ...items[idx], ...data };
            localStorage.setItem("adeel_" + table, JSON.stringify(items));
            return { success: true, message: "Data berhasil diupdate" };
        }
        return { success: false, message: "Data tidak ditemukan" };
    },
    deleteLocalData(table, id) {
        let items = this.getLocalData(table);
        items = items.filter(i => i.id !== id);
        localStorage.setItem("adeel_" + table, JSON.stringify(items));
        return { success: true, message: "Data berhasil dihapus" };
    },
    loadPageContent(page) {
        const container = document.getElementById("pageContent");
        if (!container) return;
        const titles = { dashboard: "Dashboard", activity: "Aktivitas Harian", employee: "Data Pegawai", report: "Laporan", setting: "Pengaturan" };
        const titleEl = document.getElementById("pageTitle");
        if (titleEl) titleEl.textContent = titles[page] || "Dashboard";
        document.querySelectorAll(".sidebar-item").forEach(el => el.classList.remove("active"));
        const activeItem = document.querySelector(".sidebar-item[data-page=\"" + page + "\"]");
        if (activeItem) activeItem.classList.add("active");
        switch(page) {
            case "dashboard": this.loadDashboard(container); break;
            case "activity": this.loadActivity(container); break;
            case "employee": this.loadEmployee(container); break;
            case "report": this.loadReport(container); break;
            case "setting": this.loadSetting(container); break;
        }
    },
    initDataTable(selector) {
        if ($.fn.DataTable && $(selector).length) {
            $(selector).DataTable({
                responsive: true,
                language: { url: "//cdn.datatables.net/plug-ins/1.13.7/i18n/id.json" },
                pageLength: 10,
                lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Semua"]]
            });
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    ADeEl.init();
    const page = document.body.getAttribute("data-page") || "dashboard";
    if (document.body.hasAttribute("data-page")) {
        ADeEl.loadPageContent(page);
    }
});
