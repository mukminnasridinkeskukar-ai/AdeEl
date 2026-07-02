/**
 * ADeEl - Advanced Digital Employee Log
 * Google Apps Script Backend
 * All endpoints return JSON response
 * Uses Google Spreadsheet as database
 */

const SHEETS = {
  PEGAWAI: 'Pegawai',
  AKTIVITAS: 'Aktivitas',
  MASTER_KATEGORI: 'MasterKategori',
  MASTER_UNIT: 'MasterUnit',
  MASTER_PROFESI: 'MasterProfesi',
  SETTING: 'Setting',
  LOG: 'Log'
};

function doGet(e) { return handleRequest(e, 'GET'); }
function doPost(e) { return handleRequest(e, 'POST'); }

function handleRequest(e, method) {
  const action = e.parameter.action;
  const data = method === 'POST' ? JSON.parse(e.postData.contents || '{}') : e.parameter;
  
  try {
    let result;
    switch(action) {
      case 'login': result = handleLogin(data); break;
      case 'getData': result = handleGetData(data); break;
      case 'insert': result = handleInsert(data); break;
      case 'update': result = handleUpdate(data); break;
      case 'delete': result = handleDelete(data); break;
      case 'upload': result = handleUpload(data); break;
      case 'getDashboard': result = handleGetDashboard(data); break;
      case 'getReport': result = handleGetReport(data); break;
      default: result = { success: false, message: 'Action tidak dikenal: ' + action };
    }
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
function getSpreadsheet() { return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID); }
function getSheet(name) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) { sheet = ss.insertSheet(name); }
  return sheet;
}
function getAllData(sheetName) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  const result = [];
  for (let i = 1; i < data.length; i++) {
    const row = {};
    headers.forEach((header, idx) => { row[header] = data[i][idx]; });
    result.push(row);
  }
  return result;
}
function appendRow(sheetName, data) {
  const sheet = getSheet(sheetName);
  const headers = sheet.getDataRange().getValues()[0] || [];
  if (headers.length === 0) { sheet.appendRow(Object.keys(data)); }
  const row = headers.map(h => data[h] || "");
  sheet.appendRow(row);
  return { success: true, message: "Data berhasil ditambahkan" };
}
function updateRow(sheetName, id, data) {
  const sheet = getSheet(sheetName);
  const allData = sheet.getDataRange().getValues();
  if (allData.length < 2) return { success: false, message: "Data tidak ditemukan" };
  const headers = allData[0];
  const idCol = headers.indexOf("id");
  if (idCol === -1) return { success: false, message: "Kolom id tidak ditemukan" };
  for (let i = 1; i < allData.length; i++) {
    if (allData[i][idCol] == id) {
      const row = headers.map(h => data[h] !== undefined ? data[h] : allData[i][headers.indexOf(h)]);
      sheet.getRange(i + 1, 1, 1, headers.length).setValues([row]);
      return { success: true, message: "Data berhasil diupdate" };
    }
  }
  return { success: false, message: "Data dengan id " + id + " tidak ditemukan" };
}
function deleteRow(sheetName, id) {
  const sheet = getSheet(sheetName);
  const allData = sheet.getDataRange().getValues();
  if (allData.length < 2) return { success: false, message: "Data tidak ditemukan" };
  const headers = allData[0];
  const idCol = headers.indexOf("id");
  if (idCol === -1) return { success: false, message: "Kolom id tidak ditemukan" };
  for (let i = allData.length - 1; i >= 1; i--) {
    if (allData[i][idCol] == id) { sheet.deleteRow(i + 1); return { success: true, message: "Data berhasil dihapus" }; }
  }
  return { success: false, message: "Data tidak ditemukan" };
}
function handleLogin(data) {
  const pegawai = getAllData(SHEETS.PEGAWAI);
  const user = pegawai.find(p => (p.nip === data.nip || p.username === data.nip) && p.password === data.password);
  if (user) {
    const session = { ...user };
    delete session.password;
    session.loginTime = new Date().toISOString();
    appendRow(SHEETS.LOG, { id: new Date().getTime(), nip: user.nip, action: "login", timestamp: new Date().toISOString() });
    return { success: true, user: session };
  }
  return { success: false, message: "NIP/Username atau Password salah" };
}
function handleGetData(data) {
  const table = data.table;
  if (!table || !SHEETS[table.toUpperCase()]) { return { success: false, message: "Table tidak dikenal" }; }
  const result = getAllData(SHEETS[table.toUpperCase()]);
  return { success: true, data: result };
}
function handleInsert(data) {
  const table = data.table;
  const record = data.data;
  if (!table || !SHEETS[table.toUpperCase()]) { return { success: false, message: "Table tidak dikenal" }; }
  record.id = new Date().getTime().toString();
  record.createdAt = new Date().toISOString();
  appendRow(SHEETS[table.toUpperCase()], record);
  return { success: true, data: record, message: "Data berhasil ditambahkan" };
}
function handleUpdate(data) {
  const table = data.table;
  const id = data.id;
  const record = data.data;
  if (!table || !SHEETS[table.toUpperCase()]) { return { success: false, message: "Table tidak dikenal" }; }
  record.updatedAt = new Date().toISOString();
  return updateRow(SHEETS[table.toUpperCase()], id, record);
}
function handleDelete(data) {
  const table = data.table;
  const id = data.id;
  if (!table || !SHEETS[table.toUpperCase()]) { return { success: false, message: "Table tidak dikenal" }; }
  return deleteRow(SHEETS[table.toUpperCase()], id);
}
function handleUpload(data) {
  const table = data.table;
  const file = data.file;
  const record = data.data;
  record.id = new Date().getTime().toString();
  record.fileUrl = file ? saveFile(file, table) : "";
  record.createdAt = new Date().toISOString();
  appendRow(SHEETS[table.toUpperCase()], record);
  return { success: true, message: "Data dan file berhasil diupload" };
}
function saveFile(base64Data, folder) {
  const blob = Utilities.newBlob(Utilities.base64Decode(base64Data.split(",")[1]), base64Data.split(";")[0].split(":")[1], folder + "_" + new Date().getTime());
  const file = DriveApp.createFile(blob);
  return file.getUrl();
}
function handleGetDashboard(data) {
  const pegawai = getAllData(SHEETS.PEGAWAI);
  const aktivitas = getAllData(SHEETS.AKTIVITAS);
  const today = new Date().toISOString().split("T")[0];
  const month = today.substring(0, 7);
  const totalPegawai = pegawai.length;
  const aktivitasHariIni = aktivitas.filter(a => a.tanggal === today).length;
  const aktivitasBulanIni = aktivitas.filter(a => a.tanggal && a.tanggal.startsWith(month)).length;
  const byUnit = {};
  const byProfesi = {};
  aktivitas.forEach(a => { byUnit[a.unit] = (byUnit[a.unit] || 0) + 1; byProfesi[a.profesi] = (byProfesi[a.profesi] || 0) + 1; });
  const byUser = {};
  aktivitas.forEach(a => { const key = a.pegawaiNama || a.nip; byUser[key] = (byUser[key] || 0) + 1; });
  const topPerformer = Object.entries(byUser).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([nama, count]) => ({ nama, count }));
  const recent = aktivitas.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 10);
  return { success: true, data: { totalPegawai, aktivitasHariIni, aktivitasBulanIni, byUnit, byProfesi, topPerformer, recent } };
}
function handleGetReport(data) {
  let aktivitas = getAllData(SHEETS.AKTIVITAS);
  if (data.periode === "harian") {
    const today = new Date().toISOString().split("T")[0];
    aktivitas = aktivitas.filter(a => a.tanggal === today);
  } else if (data.periode === "bulanan") {
    const month = new Date().toISOString().substring(0, 7);
    aktivitas = aktivitas.filter(a => a.tanggal && a.tanggal.startsWith(month));
  }
  if (data.unit) aktivitas = aktivitas.filter(a => a.unit === data.unit);
  if (data.profesi) aktivitas = aktivitas.filter(a => a.profesi === data.profesi);
  const report = {};
  aktivitas.forEach(a => {
    const key = a.pegawaiNama || a.nip || "Unknown";
    if (!report[key]) { report[key] = { nama: key, nip: a.nip || "-", unit: a.unit || "-", profesi: a.profesi || "-", count: 0 }; }
    report[key].count++;
  });
  return { success: true, data: Object.values(report) };
}
function setupSheet() {
  const headers = {
    Pegawai: ["id","nip","nik","nama","gelar","gender","profesi","unit","jabatan","status","role","email","hp","password","foto","createdAt","updatedAt"],
    Aktivitas: ["id","tanggal","jamMulai","jamSelesai","durasi","kategori","subKegiatan","deskripsi","lokasi","volume","satuan","target","realisasi","persentase","dokumentasi","lampiran","status","komentar","pegawaiNama","unit","profesi","createdAt","updatedAt"],
    MasterKategori: ["id","nama","keterangan","createdAt"],
    MasterUnit: ["id","nama","alamat","createdAt"],
    MasterProfesi: ["id","nama","keterangan","createdAt"],
    Setting: ["key","value","updatedAt"],
    Log: ["id","nip","action","timestamp"]
  };
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.entries(headers).forEach(([name, cols]) => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) { sheet = ss.insertSheet(name); }
    const existing = sheet.getDataRange().getValues();
    if (existing.length === 0 || existing[0].length === 0) { sheet.appendRow(cols); }
  });
  return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Setup completed" })).setMimeType(ContentService.MimeType.JSON);
}
function createSampleData() {
  const pegawai = [
    { nip: "198501012010011001", nama: "Dr. Andi Pratama", unit: "Dinas Kesehatan", profesi: "Dokter", role: "Pimpinan", password: "123456" },
    { nip: "198702152011012002", nama: "Siti Rahmah", unit: "Puskesmas A", profesi: "Perawat", role: "Pimpinan", password: "123456" },
    { nip: "admin", nama: "Administrator", unit: "Dinas Kesehatan", profesi: "IT", role: "Admin", password: "admin" }
  ];
  pegawai.forEach(p => { p.id = new Date().getTime() + Math.random(); p.createdAt = new Date().toISOString(); appendRow(SHEETS.PEGAWAI, p); });
  return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Sample data created" })).setMimeType(ContentService.MimeType.JSON);
}
