"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import API from "@/lib/api-config";

type Profile = {
  nama: string;
  email: string;
  unitNama: string;
  phone: string;
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
  image?: string | null;
};

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [profile, setProfile] = useState<Profile>({
    nama: "",
    email: "",
    unitNama: "",
    phone: "",
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: "",
    image: null,
  });

  /* TITLE */
  useEffect(() => {
    document.title = "SIKERMA – Profile";
  }, []);

  /* FETCH PROFILE */
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(API.me);
        const data = await res.json();

        setProfile({
          nama: data.nama,
          email: data.email,
          unitNama: data.unit.nama,
          phone: data.phone ?? "",
          facebook: data.facebook ?? "",
          twitter: data.twitter ?? "",
          instagram: data.instagram ?? "",
          youtube: data.youtube ?? "",
          image: data.image ?? null,
        });

        if (data.image) {
          setPhotoPreview(data.image);
        }
      } catch (err) {
        console.error("Gagal memuat profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  /* UPLOAD PHOTO */
  const handlePhotoChange = async (file: File | null) => {
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Format tidak valid",
        text: "Hanya file JPG atau PNG",
        confirmButtonColor: "#0079C4",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "Ukuran terlalu besar",
        text: "Ukuran foto maksimal 2 MB",
        confirmButtonColor: "#0079C4",
      });
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(API.profile, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      setPhotoPreview(result.imageUrl);
      setProfile({ ...profile, image: result.imageUrl });

      window.dispatchEvent(new Event("profile-updated"));

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Foto profile berhasil diperbarui",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });

    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Upload gagal",
        text: err.message || "Upload foto gagal",
      });
    } finally {
      setUploading(false);
    }
  };

  /* UPDATE PROFILE */
  const handleUpdateProfile = async () => {
    try {
      setSaving(true);

      const res = await fetch(API.profile, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      window.dispatchEvent(new Event("profile-updated"));

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Profile berhasil diperbarui",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });

    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal memperbarui",
        text: err.message || "Terjadi kesalahan",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Memuat profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        onExpandChange={setSidebarExpanded}
      />

      <div
        className={cn(
          "relative transition-all duration-300",
          sidebarExpanded ? "md:ml-64" : "md:ml-[72px]"
        )}
      >
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-xl md:text-2xl font-bold">Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* LEFT CARD */}
              <div className="rounded-lg border bg-card p-6 text-center space-y-4">
                <div className="mx-auto w-32 h-32 rounded-full border overflow-hidden bg-muted flex items-center justify-center">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      PHOTO NOT AVAILABLE
                    </span>
                  )}
                </div>

                <div>
                  <p className="font-semibold">{profile.nama}</p>
                  <p className="text-sm text-muted-foreground">
                    Login sebagai {profile.unitNama}
                  </p>
                </div>

                <label>
                  <Button size="sm" variant="outline" disabled={uploading} asChild>
                    <span>{uploading ? "Uploading…" : "Change Photo"}</span>
                  </Button>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    onChange={(e) =>
                      handlePhotoChange(e.target.files?.[0] || null)
                    }
                  />
                </label>
              </div>

              {/* RIGHT CARD */}
              <div className="md:col-span-2 rounded-lg border bg-card p-6">
                <h2 className="font-semibold mb-4">Detail Profile</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <Input
                    label="Nama Pengguna"
                    icon={<User className="w-4 h-4" />}
                    value={profile.nama}
                    onChange={(v) =>
                      setProfile({ ...profile, nama: v })
                    }
                  />

                  <Input
                    label="No. Telp"
                    icon={<Phone className="w-4 h-4" />}
                    value={profile.phone}
                    onChange={(v) =>
                      setProfile({ ...profile, phone: v })
                    }
                  />

                  <Input
                    label="Email / Username"
                    icon={<Mail className="w-4 h-4" />}
                    value={profile.email}
                    disabled
                  />

                  <Input
                    label="Facebook ID"
                    icon={<Facebook className="w-4 h-4 text-blue-600" />}
                    value={profile.facebook}
                    onChange={(v) =>
                      setProfile({ ...profile, facebook: v })
                    }
                  />

                  <Input
                    label="Twitter / X ID"
                    icon={<Twitter className="w-4 h-4" />}
                    value={profile.twitter}
                    onChange={(v) =>
                      setProfile({ ...profile, twitter: v })
                    }
                  />

                  <Input
                    label="Instagram ID"
                    icon={<Instagram className="w-4 h-4 text-pink-500" />}
                    value={profile.instagram}
                    onChange={(v) =>
                      setProfile({ ...profile, instagram: v })
                    }
                  />

                  <Input
                    label="Youtube ID"
                    icon={<Youtube className="w-4 h-4 text-red-500" />}
                    value={profile.youtube}
                    onChange={(v) =>
                      setProfile({ ...profile, youtube: v })
                    }
                  />
                </div>

                <div className="mt-6">
                  <Button onClick={handleUpdateProfile} disabled={saving}>
                    {saving ? "Saving…" : "Update Profile"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ================= INPUT ================= */

function Input({
  label,
  icon,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  icon?: React.ReactNode;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center border rounded-md px-3 py-2 gap-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <input
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full text-sm focus:outline-none disabled:bg-muted"
        />
      </div>
    </div>
  );
}
