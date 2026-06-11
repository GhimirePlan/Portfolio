export const metadata = {
  title: 'Blog | Plan Ghimire',
  description: 'Read the latest articles from Plan Ghimire on web development, technology, and more.',
};

export const viewport = {
  themeColor: "#16f2b3",
  width: "device-width",
  initialScale: 1,
};

// Revalidate the page every hour
export const revalidate = 3600;

export default function BlogLayout({ children }) {
  return (
    <div className="container mx-auto px-4 pt-4">
      {children}
    </div>
  );
}