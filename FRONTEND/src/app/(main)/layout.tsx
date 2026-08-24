import { MainShell } from "@/components/Layout/MainShell";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <MainShell>{children}</MainShell>;
}
