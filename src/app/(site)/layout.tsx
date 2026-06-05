import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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
