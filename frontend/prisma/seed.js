const { PrismaClient } = require('@prisma/client')
const { faker } = require('@faker-js/faker')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// Helper random
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

async function main() {
  console.log("🌱 Start seeding...")

  // ================= USER ADMIN =================
  const adminHash = await bcrypt.hash('admin123', 10)
  const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@unila.ac.id' } })

  if (existingAdmin) {
    await prisma.user.update({
      where: { email: 'admin@unila.ac.id' },
      data: { password: adminHash, nama: 'Administrator' }
    })
    console.log('✅ Admin updated:', existingAdmin.email)
  } else {
    await prisma.user.create({
      data: {
        email: 'admin@unila.ac.id',
        password: adminHash,
        nama: 'Administrator',
        role: 'UNIT_KERJA',
        isActive: true
      }
    })
    console.log('✅ Admin created:', 'admin@unila.ac.id')
  }

  // ================= UNIT =================
  const units = []
  for (let i = 1; i <= 5; i++) {
    const unit = await prisma.unit.create({
      data: {
        kode: `U00${i}`,
        nama: `Fakultas ${faker.word.noun()}`
      }
    })
    units.push(unit)
  }
  console.log(`✅ Created ${units.length} units`)

  // ================= SUB UNIT =================
  const subUnits = []
  for (const unit of units) {
    for (let i = 1; i <= 3; i++) {
      const su = await prisma.subUnit.create({
        data: {
          kode: `SU-${unit.id}-${i}`,
          nama: faker.company.name(),
          unitId: unit.id
        }
      })
      subUnits.push(su)
    }
  }
  console.log(`✅ Created ${subUnits.length} sub units`)

  // ================= USER (hash semua password) =================
  for (let i = 0; i < 20; i++) {
    const unit = pick(units)
    const sub = pick(subUnits)
    const hashedPw = await bcrypt.hash('password123', 10)

    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: hashedPw,
        nama: faker.person.fullName(),
        role: "UNIT_KERJA",
        unitId: unit.id,
        subUnitId: sub.id,
        phone: faker.phone.number("08##########"),
        image: faker.image.avatar()
      }
    })
  }
  console.log('✅ Created 20 users (all passwords: password123)')

  // ================= PENGGIAT =================
  const penggiats = []
  for (let i = 0; i < 15; i++) {
    const p = await prisma.penggiat.create({
      data: {
        namaInstansi: faker.company.name(),
        email: faker.internet.email(),
        negara: "Indonesia",
        provinsi: faker.location.state(),
        alamat: faker.location.streetAddress()
      }
    })
    penggiats.push(p)
  }
  console.log(`✅ Created ${penggiats.length} penggiats`)

  // ================= REPOSITORY =================
  const repos = []
  for (let i = 0; i < 30; i++) {
    const unit = pick(units)
    const sub = pick(subUnits)

    const repo = await prisma.repository.create({
      data: {
        statusDokumen: pick(["Aktif", "Kadaluarsa"]),
        tanggalMulai: faker.date.past(),
        tanggalBerakhir: faker.date.future(),
        jenisDokumen: pick(["MOU", "MOA", "IA"]),
        nomorDokumen: `DOC-${faker.number.int(1000)}`,
        judulKerjasama: faker.company.catchPhrase(),
        deskripsi: faker.lorem.sentence(),
        skalaKerjasama: pick(["Nasional", "Internasional"]),
        sumberPendanaan: "Internal",
        jumlahAnggaran: faker.number.int({ min: 1000000, max: 100000000 }),
        unitPenanggungJawab: unit.nama,
        namaPenanggungJawab: faker.person.fullName(),
        createdByUnitId: unit.id,
        createdBySubUnitId: sub.id
      }
    })

    repos.push(repo)
  }
  console.log(`✅ Created ${repos.length} repositories`)

  // ================= RELASI REPOSITORY =================
  for (const repo of repos) {
    // MITRA
    await prisma.repositoryMitra.create({
      data: {
        repositoryId: repo.id,
        klasifikasiMitra: "Perusahaan",
        namaMitra: faker.company.name(),
        bidangUsaha: faker.company.buzzPhrase(),
        negara: "Indonesia",
        provinsi: faker.location.state(),
        alamat: faker.location.streetAddress(),
        email: faker.internet.email()
      }
    })

    // DOKUMEN
    await prisma.repositoryDokumen.create({
      data: {
        repositoryId: repo.id,
        jenisDokumen: repo.jenisDokumen || "MOU",
        namaFile: faker.system.fileName(),
        filePath: "/files/" + faker.system.fileName(),
        fileSize: faker.number.int({ min: 1000, max: 5000 })
      }
    })

    // PENGGIAT
    const penggiat = pick(penggiats)
    await prisma.repositoryPenggiat.create({
      data: {
        repositoryId: repo.id,
        penggiatId: penggiat.id,
        instansi: penggiat.namaInstansi,
        namaPenandatangan: faker.person.fullName(),
        jabatanPenandatangan: "Directeur",
        emailPenandatangan: faker.internet.email(),
        namaPenanggungJawab: faker.person.fullName(),
        jabatanPenanggungJawab: "Manager",
        emailPenanggungJawab: faker.internet.email()
      }
    })

    // BENTUK KEGIATAN
    await prisma.repositoryBentukKegiatan.create({
      data: {
        repositoryId: repo.id,
        bentuk: faker.helpers.arrayElement(["Workshop", "Seminar", "Pelatihan"]),
        penerimaan: faker.number.int({ min: 1000000, max: 50000000 }),
        sasaran: "Mahasiswa"
      }
    })

    // TERMIN
    await prisma.repositoryTermin.create({
      data: {
        repositoryId: repo.id,
        terminKe: 1,
        bulan: "Januari",
        tahun: "2024",
        jumlah: faker.number.int({ min: 1000000, max: 50000000 }),
        status: "Cair"
      }
    })

    // REALISASI
    await prisma.realisasi.create({
      data: {
        repositoryId: repo.id,
        bentukKegiatan: "Workshop",
        judulKegiatan: faker.lorem.words(3),
        tanggalKegiatan: faker.date.recent(),
        jumlahDosen: faker.number.int({ min: 1, max: 10 }),
        jumlahMahasiswa: faker.number.int({ min: 10, max: 100 }),
        hasilKegiatan: "Berhasil",
        anggaran: faker.number.int({ min: 1000000, max: 50000000 })
      }
    })
  }
  console.log('✅ Created repository relations')

  // ================= PENCAIRAN =================
  for (let i = 0; i < 10; i++) {
    const p = await prisma.pencairanDana.create({
      data: {
        dasarDokumen: "SPK",
        danaMitra: faker.company.name(),
        jumlah: faker.number.int({ min: 1000000, max: 50000000 }),
        tanggal: faker.date.recent(),
        status: pick(["Draft", "Disetujui", "Ditolak"])
      }
    })

    await prisma.pencairanDanaDokumen.create({
      data: {
        pencairanDanaId: p.id,
        jenisDokumen: "Invoice",
        namaFile: faker.system.fileName(),
        filePath: "/files/" + faker.system.fileName(),
        fileSize: faker.number.int({ min: 1000, max: 5000 })
      }
    })
  }
  console.log('✅ Created 10 pencairan entries')

  // ================= TARGET =================
  for (let tahun = 2023; tahun <= 2026; tahun++) {
    await prisma.targetKerjasama.create({
      data: {
        tahun,
        mou: faker.number.int(20),
        moa: faker.number.int(10),
        ia: faker.number.int(5),
        aktif: faker.number.int(15),
        status: "Open"
      }
    })
  }
  console.log('✅ Created 4 target entries')

  console.log("✅ SEED BESAR BERHASIL!")
  console.log("━━━━━━━━━━━━━━━━━━━━")
  console.log("Admin Login:")
  console.log("  Email: admin@unila.ac.id")
  console.log("  Password: admin123")
  console.log("━━━━━━━━━━━━━━━━━━━━")
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())