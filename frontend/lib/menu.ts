export type MenuItem = {
  label: string;
  path: string;
  children?: MenuItem[];
};

export const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    label: "Kerjasama",
    path: "/kerjasama",
    children: [
      {
        label: "Menunggu Validasi",
        path: "/kerjasama/menunggu-validasi",
      },
      {
        label: "Repository",
        path: "/kerjasama/repository",
      },
      {
        label: "My Data",
        path: "/kerjasama/my-data",
      },
    ],
  },
  {
    label: "Pencairan Dana",
    path: "/dashboard/pencairan-dana",
  },
  {
    label: "Laporan",
    path: "/dashboard/laporan",
  },
];
