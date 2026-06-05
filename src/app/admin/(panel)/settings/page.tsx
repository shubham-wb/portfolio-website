import { SettingsForm } from "@/components/admin/SettingsForm";
import { getAbout, getSettings, getSocialLinks } from "@/lib/data";

export default async function AdminSettingsPage() {
  const [settings, about, socials] = await Promise.all([
    getSettings(),
    getAbout(),
    getSocialLinks(),
  ]);

  return <SettingsForm settings={settings} about={about} socials={socials} />;
}
