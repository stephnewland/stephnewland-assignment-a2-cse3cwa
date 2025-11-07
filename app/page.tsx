export const metadata = {
  title: "Home",
  description: "Website CSE3CWA Home Page",
};

export default function Home() {
  return (
    <div className="flex-grow pt-[15vh] px-4 text-center space-y-4">
      <h1 className="big-title">Welcome to the Website.</h1>
      <p className="text-lg max-w-xl mx-auto">
        Use the <strong>Tabs</strong> page to build and export accessible HTML
        tab structures for Moodle.
      </p>
    </div>
  );
}
