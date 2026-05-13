/**
 * Initial Data Script
 * Membuat data awal: Unit, SubUnit, dan User
 *
 * Usage: node prisma/init-data.js
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Membuat data awal...\n')

  // ================= UNIT =================
  const unit = await prisma.unit.create({
    data: {
      kode: 'FT',
      nama: 'Fakultas Teknik'
    }
  })
  console.log(`✅ Unit dibuat: ${unit.nama} (id: ${unit.id})`)

  // ================= SUB UNIT =================
  const subTeknikInformatika = await prisma.subUnit.create({
    data: {
      kode: 'TI',
      nama: 'Teknik Informatika',
      unitId: unit.id
    }
  })
  console.log(`✅ SubUnit dibuat: ${subTeknikInformatika.nama} (id: ${subTeknikInformatika.id})`)

  const subElektro = await prisma.subUnit.create({
    data: {
      kode: 'EL',
      nama: 'Teknik Elektro',
      unitId: unit.id
    }
  })
  console.log(`✅ SubUnit dibuat: ${subElektro.nama} (id: ${subElektro.id})`)

  // ================= USER ADMIN =================
  const hashedPw = await bcrypt.hash('admin123', 10)

  await prisma.user.create({
    data: {
      email: 'admin-ti@unila.ac.id',
      password: hashedPw,
      nama: 'Admin Teknik Informatika',
      role: 'UNIT_KERJA',
      unitId: unit.id,
      subUnitId: subTeknikInformatika.id,
      isActive: true
    }
  })
  console.log(`\n✅ User Teknik Informatika dibuat`)
  console.log(`   Email: admin-ti@unila.ac.id`)
  console.log(`   Password: admin123`)

  await prisma.user.create({
    data: {
      email: 'admin-el@unila.ac.id',
      password: hashedPw,
      nama: 'Admin Teknik Elektro',
      role: 'UNIT_KERJA',
      unitId: unit.id,
      subUnitId: subElektro.id,
      isActive: true
    }
  })
  console.log(`\n✅ User Teknik Elektro dibuat`)
  console.log(`   Email: admin-el@unila.ac.id`)
  console.log(`   Password: admin123`)

  console.log('\n━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ DATA AWAL BERHASIL DIBUAT!')
  console.log('━━━━━━━━━━━━━━━━━━━━')
  console.log('\nLogin Info:')
  console.log('  Teknik Informatika:')
  console.log('    Email: admin-ti@unila.ac.id')
  console.log('    Password: admin123')
  console.log('\n  Teknik Elektro:')
  console.log('    Email: admin-el@unila.ac.id')
  console.log('    Password: admin123')
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