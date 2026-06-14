import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Content comes from Firestore at request time, so render dynamically and
// always reflect the latest admin edits.
export const dynamic = "force-dynamic";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="content">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
