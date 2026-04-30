import type { Pengajuan } from '@/store/types'

export function printFormulir(pengajuan: Pengajuan) {
  const dateStr = new Date(pengajuan.tanggal_waktu).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const html = `
    <html>
      <head>
        <title>Print Formulir Kedatangan Tamu</title>
        <style>
          @page { size: A4 portrait; margin: 20mm; }
          body {
            font-family: "Times New Roman", Times, serif;
            font-size: 14px;
            line-height: 1.5;
            padding: 0;
            max-width: 800px;
            margin: auto;
          }
          .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .header-table td {
            border: 1px solid #000;
            padding: 10px;
            text-align: center;
            font-weight: bold;
          }
          .col-logo { width: 25%; }
          .col-title { width: 50%; font-size: 15px; }
          .col-terbatas { width: 25%; font-size: 15px; }
          
          .section-title {
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 10px;
          }
          
          .data-table {
            width: 100%;
            border: none;
            border-collapse: collapse;
          }
          .data-table td {
            padding: 8px 4px;
            vertical-align: top;
          }
          .col-num { width: 3%; }
          .col-label { width: 32%; }
          .col-colon { width: 2%; text-align: center; }
          .col-value { width: 63%; position: relative; }
          
          .dotted-bg {
            display: inline-block;
            width: 100%;
            border-bottom: 1px dotted #000;
            min-height: 1.2em;
          }
          .dotted-bg-multi {
            display: block;
            width: 100%;
            border-bottom: 1px dotted #000;
            min-height: 1.2em;
            margin-top: 1.2em;
          }
          

          
          .signature-section {
            margin-top: 40px;
            width: 100%;
            font-family: Arial, sans-serif;
          }
          .signature-left {
            float: left;
            width: 50%;
          }
          .signature-space {
            height: 80px;
          }
          .dotted-line-sig {
            border-bottom: 1px dotted #000;
            width: 200px;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td class="col-logo">
              <div style="display:flex; align-items:center; justify-content:center; gap: 8px;">
                <img src="/images.png" style="width:45px; height:auto; object-fit:contain;" alt="Logo PT Pusri" />
                <div style="text-align:left; font-size: 11px;">
                  <strong>PUPUK SRIWIDJAJA<br/>PALEMBANG</strong>
                </div>
              </div>
            </td>
            <td class="col-title">
              FORMULIR KEDATANGAN TAMU<br/>
              KOMPLEK PT PUSRI PALEMBANG
            </td>
            <td class="col-terbatas">
              TERBATAS
            </td>
          </tr>
        </table>

        <div class="section-title">Identitas Tamu :</div>
        <table class="data-table">
          <tr>
            <td class="col-num">1</td>
            <td class="col-label">Nama</td>
            <td class="col-colon">:</td>
            <td class="col-value"><span class="dotted-bg">${pengajuan.tamu.nama}</span></td>
          </tr>
          <tr>
            <td class="col-num">2</td>
            <td class="col-label">Alamat</td>
            <td class="col-colon">:</td>
            <td class="col-value">
              <span class="dotted-bg">${pengajuan.tamu.alamat}</span>
              <span class="dotted-bg-multi"></span>
            </td>
          </tr>
          <tr>
            <td class="col-num">3</td>
            <td class="col-label">No.HP</td>
            <td class="col-colon">:</td>
            <td class="col-value"><span class="dotted-bg">${pengajuan.tamu.no_hp}</span></td>
          </tr>
          <tr>
            <td class="col-num">4</td>
            <td class="col-label">Alamat Tujuan</td>
            <td class="col-colon">:</td>
            <td class="col-value"><span class="dotted-bg">${pengajuan.alamat_tujuan}</span></td>
          </tr>
          <tr>
            <td class="col-num">5</td>
            <td class="col-label">Keperluan</td>
            <td class="col-colon">:</td>
            <td class="col-value"><span class="dotted-bg">${pengajuan.keperluan}</span></td>
          </tr>
          <tr>
            <td class="col-num">6</td>
            <td class="col-label">No. Polisi Kendaraan<br/><span style="font-size:11px; font-weight:normal;">(Jika Menggunakan Kendaraan)</span></td>
            <td class="col-colon">:</td>
            <td class="col-value"><span class="dotted-bg"></span></td>
          </tr>
          <tr>
            <td class="col-num">7</td>
            <td class="col-label">Tanggal / Waktu</td>
            <td class="col-colon">:</td>
            <td class="col-value"><span class="dotted-bg">${dateStr}</span></td>
          </tr>
        </table>

        <div class="section-title">Penanggung jawab :</div>
        <table class="data-table">
          <tr>
            <td class="col-num">1</td>
            <td class="col-label">Nama Karyawan</td>
            <td class="col-colon">:</td>
            <td class="col-value"><span class="dotted-bg">${pengajuan.penanggung_jawab.nama}</span></td>
          </tr>
          <tr>
            <td class="col-num">2</td>
            <td class="col-label">No. Badge</td>
            <td class="col-colon">:</td>
            <td class="col-value"><span class="dotted-bg">${pengajuan.penanggung_jawab.no_badge}</span></td>
          </tr>
          <tr>
            <td class="col-num">3</td>
            <td class="col-label">Unit Kerja</td>
            <td class="col-colon">:</td>
            <td class="col-value"><span class="dotted-bg">${pengajuan.penanggung_jawab.unit_kerja}</span></td>
          </tr>
          <tr>
            <td class="col-num">4</td>
            <td class="col-label">Alamat Rumah</td>
            <td class="col-colon">:</td>
            <td class="col-value">
              <span class="dotted-bg"></span>
              <span class="dotted-bg-multi"></span>
            </td>
          </tr>
          <tr>
            <td class="col-num">5</td>
            <td class="col-label">No.HP</td>
            <td class="col-colon">:</td>
            <td class="col-value"><span class="dotted-bg"></span></td>
          </tr>
        </table>



        <div class="signature-section">
          <div class="signature-left">
            Palembang, ${dateStr.split(' ').slice(0, 3).join(' ')}<br/>
            Penanggung Jawab
            <div class="signature-space" style="display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:bold; color:#999; width:200px;">
              DTO
            </div>
            <span class="dotted-line-sig" style="display:block; margin-bottom:4px;"></span>
            Badge No. ${pengajuan.penanggung_jawab.no_badge}
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() { window.close(); };
          };
        </script>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  } else {
    alert("Tolong izinkan popup untuk mencetak dokumen.");
  }
}
