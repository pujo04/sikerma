-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Draft', 'Diajukan', 'Disetujui', 'Ditolak');

-- CreateTable
CREATE TABLE "PencairanDana" (
    "id" BIGSERIAL NOT NULL,
    "dasarDokumen" TEXT NOT NULL,
    "danaMitra" TEXT NOT NULL,
    "jumlah" DECIMAL(15,2) NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "catatan" TEXT,
    "status" "Status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PencairanDana_pkey" PRIMARY KEY ("id")
);
