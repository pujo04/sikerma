/**
 * Seed Repository Data - Teknik Informatika
 * Membuat 5 data repository: 2 MOU, 2 MOA, 1 IA
 *
 * Usage: node prisma/seed-repository.js
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('📦 Membuat data repository untuk Teknik Informatika...\n')

  const unitId = 1
  const subUnitIdTI = 1 // Teknik Informatika
  const subUnitIdEL = 2 // Teknik Elektro

  // ================= DATA REPOSITORY =================

  const repositories = [
    // --- MOU (2 data) ---
    {
      jenisDokumen: 'MOU',
      nomorDokumen: 'MOU/FT/001/2024',
      judulKerjasama: 'Kerjasama Pengembangan Sistem Informasi Industri 4.0',
      deskripsi: 'Kesepakatan bersama antara Fakultas Teknik dan PT Teknologi Nusantara untuk pengembangan sistem informasi berbasis industri 4.0 di lingkungan akademik.',
      statusDokumen: 'Aktif',
      skalaKerjasama: 'Nasional',
      sumberPendanaan: 'Internal',
      jumlahAnggaran: 150000000,
      unitPenanggungJawab: 'Fakultas Teknik',
      namaPenanggungJawab: 'Dr. Ir. Budi Santoso, M.T.',
      tanggalMulai: new Date('2024-01-15'),
      tanggalBerakhir: new Date('2027-01-14'),
      mitra: {
        klasifikasiMitra: 'Perusahaan',
        namaMitra: 'PT Teknologi Nusantara',
        bidangUsaha: 'Teknologi Informasi',
        negara: 'Indonesia',
        provinsi: 'DKI Jakarta',
        alamat: 'Jl. Sudirman No. 123, Jakarta Selatan',
        npwp: '01.234.567.8-012.000',
        noTelp: '021-12345678',
        email: 'info@teknologinusantara.co.id',
        website: 'https://www.teknologinusantara.co.id'
      },
      penggiat: {
        instansi: 'PT Teknologi Nusantara',
        namaPenandatangan: 'Dr. Hendra Wijaya, M.Eng.',
        jabatanPenandatangan: 'Direktur Utama',
        emailPenandatangan: 'hendra@teknologinusantara.co.id',
        nipPenandatangan: '198012152003011001',
        namaPenanggungJawab: 'Dr. Hendra Wijaya, M.Eng.',
        jabatanPenanggungJawab: 'Direktur Utama',
        emailPenanggungJawab: 'hendra@teknologinusantara.co.id'
      },
      bentukKegiatan: [
        { bentuk: 'Workshop', penerimaan: 25000000, volume: '50', satuan: 'orang', sasaran: 'Mahasiswa & Dosen' },
        { bentuk: 'Pelatihan', penerimaan: 30000000, volume: '30', satuan: 'orang', sasaran: 'Mahasiswa' }
      ],
      termin: [
        { terminKe: 1, bulan: 'April', tahun: '2024', jumlah: 50000000, status: 'Cair' },
        { terminKe: 2, bulan: 'Juli', tahun: '2024', jumlah: 50000000, status: 'Cair' },
        { terminKe: 3, bulan: 'Oktober', tahun: '2024', jumlah: 50000000, status: 'Proses' }
      ]
    },
    {
      jenisDokumen: 'MOU',
      nomorDokumen: 'MOU/FT/002/2024',
      judulKerjasama: 'Kerjasama Riset Bersama pada Bidang Kecerdasan Buatan dan Analitik Data',
      deskripsi: 'Mou antara Fakultas Teknik dan Institut Teknologi Bandung untuk melakukan riset bersama di bidang AI dan Data Analytics untuk mendukung tridharma perguruan tinggi.',
      statusDokumen: 'Aktif',
      skalaKerjasama: 'Nasional',
      sumberPendanaan: 'Hibah',
      jumlahAnggaran: 200000000,
      unitPenanggungJawab: 'Fakultas Teknik',
      namaPenanggungJawab: 'Prof. Dr. Sri Wahyuni, M.Sc.',
      tanggalMulai: new Date('2024-03-01'),
      tanggalBerakhir: new Date('2027-02-28'),
      mitra: {
        klasifikasiMitra: 'Perguruan Tinggi',
        namaMitra: 'Institut Teknologi Bandung',
        bidangUsaha: 'Pendidikan Tinggi',
        negara: 'Indonesia',
        provinsi: 'Jawa Barat',
        alamat: 'Jl. Ganesha No. 10, Bandung',
        npwp: '02.345.678.9-012.000',
        noTelp: '022-2500938',
        email: 'riset@itb.ac.id',
        website: 'https://www.itb.ac.id'
      },
      penggiat: {
        instansi: 'Institut Teknologi Bandung',
        namaPenandatangan: 'Prof. Dr. Ir. M. Salman, M.T.',
        jabatanPenandatangan: 'Rektor',
        emailPenandatangan: 'rektor@itb.ac.id',
        nipPenandatangan: '196501011990011001',
        namaPenanggungJawab: 'Prof. Dr. Ir. M. Salman, M.T.',
        jabatanPenanggungJawab: 'Rektor',
        emailPenanggungJawab: 'rektor@itb.ac.id'
      },
      bentukKegiatan: [
        { bentuk: 'Seminar', penerimaan: 20000000, volume: '100', satuan: 'orang', sasaran: 'Akademisi & Peneliti' },
        { bentuk: 'Penelitian', penerimaan: 60000000, volume: '1', satuan: 'kegiatan', sasaran: 'Dosen' }
      ],
      termin: [
        { terminKe: 1, bulan: 'Mei', tahun: '2024', jumlah: 100000000, status: 'Cair' },
        { terminKe: 2, bulan: 'November', tahun: '2024', jumlah: 100000000, status: 'Proses' }
      ]
    },

    // --- MOA (2 data) ---
    {
      jenisDokumen: 'MOA',
      nomorDokumen: 'MOA/FT/001/2024',
      judulKerjasama: 'Program Magang Bersama untuk Mahasiswa Teknik Informatika',
      deskripsi: 'Perjanjian operasional antara Program Studi Teknik Informatika dan PT Digital Solusi Indonesia untuk program magang mahasiswa guna peningkatan kompetensi vokasi.',
      statusDokumen: 'Aktif',
      skalaKerjasama: 'Nasional',
      sumberPendanaan: 'Mitra',
      jumlahAnggaran: 50000000,
      unitPenanggungJawab: 'Fakultas Teknik',
      namaPenanggungJawab: 'Andi Saputra, S.T., M.T.',
      tanggalMulai: new Date('2024-02-01'),
      tanggalBerakhir: new Date('2025-01-31'),
      mitra: {
        klasifikasiMitra: 'Perusahaan',
        namaMitra: 'PT Digital Solusi Indonesia',
        bidangUsaha: 'Pengembangan Software',
        negara: 'Indonesia',
        provinsi: 'Jawa Barat',
        alamat: 'Jl. Braga No. 88, Bandung',
        npwp: '03.456.789.0-012.000',
        noTelp: '022-9876543',
        email: 'hrd@digitalsolusi.id',
        website: 'https://www.digitalsolusi.id'
      },
      penggiat: {
        instansi: 'PT Digital Solusi Indonesia',
        namaPenandatangan: 'Rina Marlina, S.Kom.',
        jabatanPenandatangan: 'VP Human Capital',
        emailPenandatangan: 'rina@digitalsolusi.id',
        nipPenandatangan: '198807152022011001',
        namaPenanggungJawab: 'Rina Marlina, S.Kom.',
        jabatanPenanggungJawab: 'VP Human Capital',
        emailPenanggungJawab: 'rina@digitalsolusi.id'
      },
      bentukKegiatan: [
        { bentuk: 'Magang', penerimaan: 15000000, volume: '20', satuan: 'mahasiswa', sasaran: 'Mahasiswa' },
        { bentuk: 'Pelatihan', penerimaan: 20000000, volume: '20', satuan: 'orang', sasaran: 'Mahasiswa' }
      ],
      termin: [
        { terminKe: 1, bulan: 'Maret', tahun: '2024', jumlah: 25000000, status: 'Cair' },
        { terminKe: 2, bulan: 'September', tahun: '2024', jumlah: 25000000, status: 'Cair' }
      ]
    },
    {
      jenisDokumen: 'MOA',
      nomorDokumen: 'MOA/FT/002/2025',
      judulKerjasama: 'Pengembangan Kurikulum Berbasis Kompetensi Industri',
      deskripsi: 'Perjanjian untuk mengembangkan kurikulum yang disusun bersama antara Program Studi Teknik Informatika dan PT Global Edukasi untuk menyesuaikan dengan kebutuhan industri saat ini.',
      statusDokumen: 'Aktif',
      skalaKerjasama: 'Internasional',
      sumberPendanaan: 'Internal',
      jumlahAnggaran: 75000000,
      unitPenanggungJawab: 'Fakultas Teknik',
      namaPenanggungJawab: 'Dr. Wati Handayani, M.Kom.',
      tanggalMulai: new Date('2025-01-10'),
      tanggalBerakhir: new Date('2026-01-09'),
      mitra: {
        klasifikasiMitra: 'Perusahaan',
        namaMitra: 'PT Global Edukasi',
        bidangUsaha: 'Pendidikan & Pelatihan',
        negara: 'Indonesia',
        provinsi: 'Jawa Timur',
        alamat: 'Jl. Basuki Rahmat No. 45, Surabaya',
        npwp: '04.567.890.1-012.000',
        noTelp: '031-5678901',
        email: 'info@globaledukasi.co.id',
        website: 'https://www.globaledukasi.co.id'
      },
      penggiat: {
        instansi: 'PT Global Edukasi',
        namaPenandatangan: 'Ahmad Fauzi, S.Pd., M.Ed.',
        jabatanPenandatangan: 'Direktur Akademik',
        emailPenandatangan: 'fauzi@globaledukasi.co.id',
        nipPenandatangan: '197903102015011001',
        namaPenanggungJawab: 'Ahmad Fauzi, S.Pd., M.Ed.',
        jabatanPenanggungJawab: 'Direktorat Akademik',
        emailPenanggungJawab: 'fauzi@globaledukasi.co.id'
      },
      bentukKegiatan: [
        { bentuk: 'FGD', penerimaan: 20000000, volume: '15', satuan: 'orang', sasaran: 'Dosen & Kurikulum' },
        { bentuk: 'Workshop', penerimaan: 25000000, volume: '40', satuan: 'orang', sasaran: 'Mahasiswa' }
      ],
      termin: [
        { terminKe: 1, bulan: 'Februari', tahun: '2025', jumlah: 37500000, status: 'Cair' },
        { terminKe: 2, bulan: 'Agustus', tahun: '2025', jumlah: 37500000, status: 'Proses' }
      ]
    },

    // --- IA (1 data) ---
    {
      jenisDokumen: 'IA',
      nomorDokumen: 'IA/FT/001/2025',
      judulKerjasama: 'Implementasi Sistem E-Learning untuk Mata Kuliah Pemrograman',
      deskripsi: 'Implementasi sistem e-learning berbasis platform untuk mata kuliah pemrograman sebagai pendukung proses pembelajaran jarak jauh dan hybrid di Program Studi Teknik Informatika.',
      statusDokumen: 'Aktif',
      skalaKerjasama: 'Nasional',
      sumberPendanaan: 'Internal',
      jumlahAnggaran: 30000000,
      unitPenanggungJawab: 'Fakultas Teknik',
      namaPenanggungJawab: 'Dewi Ratna Sari, S.Kom., M.T.',
      tanggalMulai: new Date('2025-02-15'),
      tanggalBerakhir: new Date('2025-08-14'),
      mitra: {
        klasifikasiMitra: 'Startup',
        namaMitra: 'CV Belajar Online Indonesia',
        bidangUsaha: 'Teknologi Pendidikan',
        negara: 'Indonesia',
        provinsi: 'Lampung',
        alamat: 'Jl. Ahmad Yani No. 22, Bandar Lampung',
        npwp: '05.678.901.2-012.000',
        noTelp: '0721-123456',
        email: 'kontak@belajaronline.id',
        website: 'https://www.belajaronline.id'
      },
      penggiat: {
        instansi: 'CV Belajar Online Indonesia',
        namaPenandatangan: 'Joko Widodo, S.Kom.',
        jabatanPenandatangan: 'CEO',
        emailPenandatangan: 'joko@belajaronline.id',
        nipPenandatangan: '199005202023011001',
        namaPenanggungJawab: 'Joko Widodo, S.Kom.',
        jabatanPenanggungJawab: 'CEO',
        emailPenanggungJawab: 'joko@belajaronline.id'
      },
      bentukKegiatan: [
        { bentuk: 'Pelatihan', penerimaan: 15000000, volume: '25', satuan: 'dosen', sasaran: 'Dosen' },
        { bentuk: 'Workshop', penerimaan: 10000000, volume: '50', satuan: 'mahasiswa', sasaran: 'Mahasiswa' }
      ],
      termin: [
        { terminKe: 1, bulan: 'Maret', tahun: '2025', jumlah: 15000000, status: 'Cair' },
        { terminKe: 2, bulan: 'Juni', tahun: '2025', jumlah: 15000000, status: 'Proses' }
      ]
    }
  ]

  // ================= CREATE REPOSITORIES =================
  for (const repoData of repositories) {
    const { mitra, penggiat, bentukKegiatan, termin, ...repoFields } = repoData

    const repo = await prisma.repository.create({
      data: {
        ...repoFields,
        createdByUnitId: unitId,
        createdBySubUnitId: subUnitIdTI
      }
    })
    console.log(`✅ Repository dibuat: [${repo.jenisDokumen}] ${repo.judulKerjasama}`)

    // --- Mitra ---
    await prisma.repositoryMitra.create({
      data: {
        repositoryId: repo.id,
        ...mitra
      }
    })
    console.log(`   + Mitra: ${mitra.namaMitra}`)

    // --- Penggiat ---
    await prisma.repositoryPenggiat.create({
      data: {
        repositoryId: repo.id,
        ...penggiat
      }
    })
    console.log(`   + Penggiat: ${penggiat.instansi}`)

    // --- Bentuk Kegiatan ---
    for (const bentuk of bentukKegiatan) {
      await prisma.repositoryBentukKegiatan.create({
        data: {
          repositoryId: repo.id,
          ...bentuk
        }
      })
      console.log(`   + Bentuk Kegiatan: ${bentuk.bentuk}`)
    }

    // --- Termin ---
    for (const t of termin) {
      await prisma.repositoryTermin.create({
        data: {
          repositoryId: repo.id,
          ...t
        }
      })
      console.log(`   + Termin ${t.terminKe}: Rp ${t.jumlah.toLocaleString('id-ID')} (${t.status})`)
    }

    // --- Dokumen (placeholder) ---
    await prisma.repositoryDokumen.create({
      data: {
        repositoryId: repo.id,
        jenisDokumen: repoFields.jenisDokumen,
        namaFile: `${repoFields.nomorDokumen}_dokumen.pdf`,
        filePath: `/files/${repoFields.nomorDokumen}_dokumen.pdf`,
        fileSize: 1024000
      }
    })

    console.log('')
  }

  console.log('━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ 5 DATA REPOSITORY BERHASIL DIBUAT!')
  console.log('━━━━━━━━━━━━━━━━━━━━')
  console.log('\nRingkasan:')
  console.log('  MOU : 2 data')
  console.log('  MOA : 2 data')
  console.log('  IA  : 1 data')
  console.log('  SubUnit: Teknik Informatika (id: 1)')
  console.log('━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => {
    console.error('\n❌ Error:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })