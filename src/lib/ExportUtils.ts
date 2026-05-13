import type { Pengajuan } from "../store/types";
import * as XLSX from 'xlsx';

/**
 * Utility to export guest history data to Excel (.xlsx)
 */
export function exportToExcel(data: Pengajuan[], filename: string) {
  if (data.length === 0) return;

  // Map data to structured format
  const worksheetData = data.map(item => ({
    "Tanggal & Waktu": item.tanggal_waktu,
    "Nama Tamu": item.tamu.nama,
    "No. HP": item.tamu.no_hp,
    "Instansi / Alamat Tamu": item.tamu.alamat,
    "Tujuan": item.alamat_tujuan,
    "Keperluan": item.keperluan,
    "Status": item.status,
    "Penanggung Jawab": item.penanggung_jawab.nama,
    "Unit Kerja PJ": item.penanggung_jawab.unit_kerja,
    "Tipe": item.is_pengantaran ? 'Pengantaran' : 'Tamu Karyawan'
  }));

  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rekapan");

  // Auto-size columns (rough approximation)
  const maxLengths = Object.keys(worksheetData[0]).map(key => {
    let max = key.length;
    worksheetData.forEach(row => {
      const val = row[key as keyof typeof row]?.toString() || "";
      if (val.length > max) max = val.length;
    });
    return { wch: Math.min(max + 2, 50) };
  });
  worksheet["!cols"] = maxLengths;

  // Generate file and trigger download
  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

/**
 * Utility to export guest history data to CSV
 * Added UTF-8 BOM for better Excel compatibility
 */
export function exportToCSV(data: Pengajuan[], filename: string) {
  if (data.length === 0) return;

  // Define headers
  const headers = [
    "Tanggal & Waktu",
    "Nama Tamu",
    "No. HP",
    "Instansi / Alamat Tamu",
    "Tujuan",
    "Keperluan",
    "Status",
    "Penanggung Jawab",
    "Unit Kerja PJ",
    "Tipe"
  ];

  // Map data to rows - use semicolon as default for many Excel locales, 
  // but better to stick to comma and add BOM
  const rows = data.map(item => [
    `"${item.tanggal_waktu}"`,
    `"${item.tamu.nama}"`,
    `"${item.tamu.no_hp}"`,
    `"${item.tamu.alamat}"`,
    `"${item.alamat_tujuan}"`,
    `"${item.keperluan.replace(/"/g, '""')}"`,
    `"${item.status}"`,
    `"${item.penanggung_jawab.nama}"`,
    `"${item.penanggung_jawab.unit_kerja}"`,
    `"${item.is_pengantaran ? 'Pengantaran' : 'Tamu Karyawan'}"`
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  // Add UTF-8 BOM to make Excel open it correctly
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
  
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
