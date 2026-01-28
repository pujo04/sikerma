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
} from "lucide-react";
import { useState, useEffect } from "react";

export default function ProfilePage() {
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

    const [profile, setProfile] = useState({
        name: "Andreas Pujo Santoso",
        email: "andreaspju88@gmail.com",
        phone: "",
        facebook: "",
        twitter: "",
        instagram: "",
        youtube: "",
    });

useEffect(() => {
  document.title = "SIKERMA - Profile";
}, []);

    const handlePhotoChange = (file: File | null) => {
        if (!file) return;

        // validasi tipe file
        if (!["image/jpeg", "image/png"].includes(file.type)) {
            alert("Hanya file JPG atau PNG yang diperbolehkan");
            return;
        }

        // validasi ukuran (maks 2 MB)
        const MAX_SIZE = 2 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            alert("Ukuran foto maksimal 2 MB");
            return;
        }

        // simpan file
        setPhotoFile(file);

        // buat preview
        const previewUrl = URL.createObjectURL(file);
        setPhotoPreview(previewUrl);
    };

    useEffect(() => {
        return () => {
            if (photoPreview) {
                URL.revokeObjectURL(photoPreview);
            }
        };
    }, [photoPreview]);

    return (
        <div className="min-h-screen bg-background">
            {/* SIDEBAR */}
            <Sidebar
                open={sidebarOpen}
                onOpenChange={setSidebarOpen}
                onExpandChange={setSidebarExpanded}
            />

            {/* CONTENT */}
            <div
                className={cn(
                    "relative transition-all duration-300",
                    sidebarExpanded ? "md:ml-64" : "md:ml-[72px]"
                )}
            >
                <Header onMenuClick={() => setSidebarOpen(true)} />

                <main className="p-4 md:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* TITLE */}
                        <h1 className="text-xl md:text-2xl font-bold">Profile</h1>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* ================= LEFT CARD ================= */}
                            <div className="rounded-lg border bg-card p-6 text-center space-y-4">
                                <div className="mx-auto w-32 h-32 rounded-full border overflow-hidden bg-muted flex items-center justify-center">
                                    {photoPreview ? (
                                        <img
                                            src={photoPreview}
                                            alt="Profile Photo"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xs text-muted-foreground text-center px-2">
                                            PHOTO NOT AVAILABLE
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <p className="font-semibold">{profile.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Login as Unit
                                    </p>
                                </div>

                                <label className="inline-block">
                                    <Button size="sm" variant="outline" asChild>
                                        <span>Change Photo</span>
                                    </Button>

                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        className="hidden"
                                        onChange={(e) => handlePhotoChange(e.target.files?.[0] || null)}
                                    />
                                </label>
                            </div>

                            {/* ================= RIGHT CARD ================= */}
                            <div className="md:col-span-2 rounded-lg border bg-card p-6">
                                <h2 className="font-semibold mb-4">Detail Profile</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <Input
                                        label="Nama Pengguna"
                                        icon={<User className="w-4 h-4" />}
                                        value={profile.name}
                                        onChange={(v) =>
                                            setProfile({ ...profile, name: v })
                                        }
                                    />

                                    <Input
                                        label="No. Telp"
                                        icon={<Phone className="w-4 h-4" />}
                                        placeholder="Enter your phone number"
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
                                    <Button>
                                        Update Profile
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

/* ================= INPUT COMPONENT ================= */

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
