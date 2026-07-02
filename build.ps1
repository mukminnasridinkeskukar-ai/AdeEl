[System.Text.StringBuilder]$sb = [System.Text.StringBuilder]::new()

# Dashboard HTML
[void]$sb.AppendLine('<!DOCTYPE html>')
[void]$sb.AppendLine('<html lang="id">')
[void]$sb.AppendLine('<head>')
[void]$sb.AppendLine('<meta charset="UTF-8">')
[void]$sb.AppendLine('<meta name="viewport" content="width=device-width, initial-scale=1.0">')
[void]$sb.AppendLine('<title>ADeEl - Dashboard</title>')
[void]$sb.AppendLine('<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📋</text></svg>">')
[void]$sb.AppendLine('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">')
[void]$sb.AppendLine('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">')
[void]$sb.AppendLine('<link rel="stylesheet" href="css/style.css">')
[void]$sb.AppendLine('</head>')
[void]$sb.AppendLine('<body>')

# App Layout
[void]$sb.AppendLine('<div class="app-layout" id="appLayout">')

# Sidebar
[void]$sb.AppendLine('<div class="sidebar" id="sidebar">')
[void]$sb.AppendLine('<div class="sidebar-header">')
[void]$sb.AppendLine('<div class="sidebar-logo"><i class="fas fa-clipboard-list"></i></div>')
[void]$sb.AppendLine('<span class="sidebar-brand">ADeEl</span>')
[void]$sb.AppendLine('</div>')
[void]$sb.AppendLine('<div class="sidebar-menu" id="sidebarMenu">')
[void]$sb.AppendLine('<div class="sidebar-group">')
[void]$sb.AppendLine('<div class="sidebar-group-title">Menu</div>')
[void]$sb.AppendLine('<a href="dashboard.html" class="sidebar-item active" data-page="dashboard"><i class="fas fa-th-large"></i><span>Dashboard</span></a>')
[void]$sb.AppendLine('<a href="activity.html" class="sidebar-item" data-page="activity"><i class="fas fa-tasks"></i><span>Aktivitas Harian</span></a>')
[void]$sb.AppendLine('<a href="employee.html" class="sidebar-item" data-page="employee"><i class="fas fa-users"></i><span>Data Pegawai</span></a>')
[void]$sb.AppendLine('<a href="report.html" class="sidebar-item" data-page="report"><i class="fas fa-chart-bar"></i><span>Laporan</span></a>')
[void]$sb.AppendLine('<a href="setting.html" class="sidebar-item" data-page="setting"><i class="fas fa-cog"></i><span>Pengaturan</span></a>')
[void]$sb.AppendLine('</div>')
[void]$sb.AppendLine('</div>')
[void]$sb.AppendLine('<div class="sidebar-footer">')
[void]$sb.AppendLine('<div class="sidebar-user" onclick="window.location.href=' + "'setting.html'" + '">')
[void]$sb.AppendLine('<div class="sidebar-avatar" id="sidebarAvatar">U</div>')
[void]$sb.AppendLine('<div class="sidebar-user-info">')
[void]$sb.AppendLine('<div class="sidebar-user-name" id="sidebarName">User</div>')
[void]$sb.AppendLine('<div class="sidebar-user-role" id="sidebarRole">Pegawai</div>')
[void]$sb.AppendLine('</div></div></div></div>')

# Overlay
[void]$sb.AppendLine('<div class="sidebar-overlay" id="sidebarOverlay"></div>')

# Main Content
[void]$sb.AppendLine('<div class="main-content">')

# Navbar
[void]$sb.AppendLine('<nav class="top-navbar">')
[void]$sb.AppendLine('<div class="navbar-left">')
[void]$sb.AppendLine('<button class="navbar-menu-btn" id="menuBtn"><i class="fas fa-bars"></i></button>')
[void]$sb.AppendLine('<h5 class="navbar-page-title" id="pageTitle">Dashboard</h5>')
[void]$sb.AppendLine('</div>')
[void]$sb.AppendLine('<div class="navbar-search"><i class="fas fa-search"></i><input type="text" placeholder="Cari..." id="globalSearch"></div>')
[void]$sb.AppendLine('<div class="navbar-right">')
[void]$sb.AppendLine('<button class="navbar-btn" id="themeToggle" title="Toggle Theme"><i class="fas fa-moon"></i></button>')
[void]$sb.AppendLine('<button class="navbar-btn" onclick="window.location.href=' + "'setting.html'" + '" title="Pengaturan"><i class="fas fa-cog"></i></button>')
[void]$sb.AppendLine('<button class="navbar-btn" id="logoutBtn" title="Logout"><i class="fas fa-sign-out-alt"></i></button>')
[void]$sb.AppendLine('</div></nav>')

# Page Content
[void]$sb.AppendLine('<div class="page-content" id="pageContent"></div>')
[void]$sb.AppendLine('</div></div>')
[void]$sb.AppendLine('<div class="toast-container" id="toastContainer"></div>')

# Scripts
[void]$sb.AppendLine('<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>')
[void]$sb.AppendLine('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>')
[void]$sb.AppendLine('<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>')
[void]$sb.AppendLine('<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>')
[void]$sb.AppendLine('<script src="js/config.js"></script>')
[void]$sb.AppendLine('<script src="js/app.js"></script>')
[void]$sb.AppendLine('<script src="js/dashboard.js"></script>')
[void]$sb.AppendLine('</body></html>')

$sb.ToString() | Out-File 'd:\APLIKASI\sapa\dashboard.html' -Encoding UTF8
Write-Host 'Dashboard created successfully'
