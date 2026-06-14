import { SettingsForm } from "@/components/admin/SettingsForm";
import {
  getAbout,
  getContact,
  getSettings,
  getSocialLinks,
} from "@/lib/data";

export default async function AdminSettingsPage() {
  const [settings, about, contact, socials] = await Promise.all([
    getSettings(),
    getAbout(),
    getContact(),
    getSocialLinks(),
  ]);

  return (
    <SettingsForm
      settings={settings}
      about={about}
      contact={contact}
      socials={socials}
    />
  );
}
