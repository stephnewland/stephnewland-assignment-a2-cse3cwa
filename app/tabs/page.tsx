import TabGenerator from "@/components/TabGenerator";

export const metadata = {
  title: "Tabs",
  description: "Build and export accessible HTML.",
};

export default function TabsPage() {
  return (
    // Do not add your styling back in here; it will affect the background colour//
    <main className="transition-colors duration-300">
      <div className="container mx-auto p-0">
        <TabGenerator />
      </div>
    </main>
  );
}
