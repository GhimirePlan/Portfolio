export default function TestPage() {
  return (
    <div className="py-20">
      <h1 className="text-4xl font-bold text-center text-white">Test Page</h1>
      <p className="text-center text-gray-400 mt-4 mb-8">
        This is a test page to verify that the navbar is working correctly.
      </p>
      
      <div className="bg-[#1E293B] p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Navbar Visibility Test</h2>
        <p className="text-gray-300 mb-4">
          This page is designed to test if the navbar is visible on all pages of the website.
          The navbar should be fixed at the top of the page and should not overlap with the content.
        </p>
        <div className="flex flex-col space-y-4">
          <div className="bg-[#141b2d] p-4 rounded">
            <h3 className="text-xl font-semibold text-[#16f2b3]">Fixed Position</h3>
            <p className="text-gray-400">The navbar should have a fixed position at the top of the page.</p>
          </div>
          <div className="bg-[#141b2d] p-4 rounded">
            <h3 className="text-xl font-semibold text-[#16f2b3]">Z-Index</h3>
            <p className="text-gray-400">The navbar should have a high z-index to ensure it appears above other elements.</p>
          </div>
          <div className="bg-[#141b2d] p-4 rounded">
            <h3 className="text-xl font-semibold text-[#16f2b3]">Padding</h3>
            <p className="text-gray-400">The content should have enough padding at the top to account for the fixed navbar.</p>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <a href="/" className="inline-block bg-gradient-to-r from-[#60A5FA] to-[#34D399] px-6 py-3 rounded-lg text-white font-medium tracking-wide hover:shadow-lg hover:shadow-[#60A5FA]/20 transition-all duration-300">
          Back to Home
        </a>
      </div>
    </div>
  );
} 