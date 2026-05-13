// API configuration - single source of truth for all API endpoints

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export const API = {
  // Auth
  login: `${API_BASE}/login`,
  logout: `${API_BASE}/logout`,
  me: `${API_BASE}/me`,

  // Repository
  repository: `${API_BASE}/repository`,
  repositoryMou: `${API_BASE}/repository/mou`,
  repositoryMydata: `${API_BASE}/repository/mydata`,
  repositoryKlaim: `${API_BASE}/repository/klaim`,
  repositoryUpload: `${API_BASE}/repository/upload`,
  repositoryBentukKegiatan: `${API_BASE}/repository/bentuk-kegiatan`,
  repositoryMitra: `${API_BASE}/repository/mitra`,
  repositoryPenggiat: `${API_BASE}/repository/penggiat`,
  repositoryTermin: `${API_BASE}/repository/termin`,

  // Repository detail
  repositoryDetail: (id: string) => `${API_BASE}/repository/${id}`,
  repositoryDetailBentuk: (id: string) => `${API_BASE}/repository/${id}/bentuk-kegiatan`,
  repositoryDetailPenggiat: (id: string) => `${API_BASE}/repository/${id}/penggiat`,
  repositoryDetailTermin: (id: string) => `${API_BASE}/repository/${id}/termin`,

  // Repository sub-resource detail
  bentukKegiatanDetail: (id: string) => `${API_BASE}/repository/bentuk-kegiatan/${id}`,
  repositoryPenggiatDetail: (id: string) => `${API_BASE}/repository/penggiat/${id}`,
  repositoryTerminDetail: (id: string) => `${API_BASE}/repository/termin/${id}`,

  // Pencairan
  pencairan: `${API_BASE}/pencairan`,
  pencairanUpload: `${API_BASE}/pencairan/upload`,
  pencairanDetail: (id: string) => `${API_BASE}/pencairan/${id}`,

  // Target Kerjasama
  targetKerjasama: `${API_BASE}/target-kerjasama`,
  targetKerjasamaDetail: (id: string) => `${API_BASE}/target-kerjasama/${id}`,

  // Realisasi
  realise: `${API_BASE}/realisasi`,
  realiseUpload: `${API_BASE}/realisasi/upload`,
  realiseDetail: (id: string) => `${API_BASE}/realisasi/${id}`,

  // Penggiat
  penggiat: `${API_BASE}/penggiat`,
  penggiatDetail: (id: string) => `${API_BASE}/penggiat/${id}`,

  // Subunit
  subunit: `${API_BASE}/subunit`,

  // Profile
  profile: `${API_BASE}/profile`,
};

export default API;
