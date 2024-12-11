import YoutubeEmbed from "./YoutubeEmbed";

export async function generateMetadata() {
  return {
    title: "YouTube Embed Generator - Lightweight and Fast YouTube Video Embeds",
    description:
      "Create lightweight and fast-loading YouTube video embeds for your website. Our generator uses react-lite-youtube-embed for optimal performance and user experience.",
    keywords:
      "youtube embed, youtube embed generator, lite youtube embed, fast youtube embed, youtube video embed, responsive youtube embed",
  };
}

export default function YouTubePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            YouTube Embed Generator
          </h1>
          <p className="text-lg text-gray-600">
            Create lightweight and performant YouTube video embeds using our generator.
            Powered by react-lite-youtube-embed for optimal loading speed and user experience.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <YoutubeEmbed />
        </div>

        <div className="mt-8 prose max-w-none">
          <h2>Features and Benefits</h2>
          <ul>
            <li>Lightweight and fast-loading embeds</li>
            <li>Customizable thumbnail quality</li>
            <li>Privacy-focused with no-cookie option</li>
            <li>Support for custom parameters</li>
            <li>Responsive design out of the box</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
