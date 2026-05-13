/**
 * Reset Database Script
 * Menghapus semua data dari SEMUA tabel di PostgreSQL
 * tanpa menghapus schema / migrations.
 *
 * Usage: node prisma/reset-db.js
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('⚠️  Menghapus semua data dari database...')

  // Urutan penghapusan dimulai dari tabel yang punya relasi
  // Child tables dulu, baru parent tables
  const tables = [
    'RealisasiDokumen',
    'Realisasi',
    'PencairanDanaDokumen',
    'PencairanDana',
    'RepositoryBentukKegiatan',
    'RepositoryTermin',
    'RepositoryPenggiat',
    'RepositoryMitra',
    'RepositoryDokumen',
    'Repository',
    'Penggiat',
    'SubUnit',
    'Unit',
    'TargetKerjasama',
    'User',
  ]

  for (const model of tables) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM "${model}"`)
      console.log(`  ✅ Deleted all records from "${model}"`)
    } catch (err) {
      console.error(`  ❌ Failed to delete from "${model}":`, err.message)
    }
  }

  // Reset auto-increment counters
  const sequences = [
    'User_id_seq',
    'Unit_id_seq',
    'SubUnit_id_seq',
    'Repository_id_seq',
    'RepositoryDokumen_id_seq',
    'RepositoryMitra_id_seq',
    'RepositoryPenggiat_id_seq',
    'Penggiat_id_seq',
    'RepositoryBentukKegiatan_id_seq',
    'RepositoryTermin_id_seq',
    'PencairanDana_id_seq',
    'PencairanDanaDokumen_id_seq',
    'TargetKerjasama_id_seq',
    'Realisasi_id_seq',
    'RealisasiDokumen_id_seq',
  ]

  for (const seq of sequences) {
    try {
      await prisma.$executeRawUnsafe(
        `ALTER SEQUENCE "${seq}" RESTART WITH 1`
      )
      console.log(`  🔄 Reset sequence "${seq}"`)
    } catch (err) {
      // Sequence mungkin tidak ada (misalnya belum pernah insert), lewati
      console.log(`  ⚠️  Sequence "${seq}" tidak ditemukan, dilewati`)
    }
  }

  console.log('\n✅ Semua data berhasil dihapus dari database.')
  console.log('   Database sekarang kosong. Silakan input data Anda sendiri.')
}

main()
  .catch((e) => {
    console.error('\n❌ Error:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
