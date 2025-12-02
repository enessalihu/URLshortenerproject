import { UrlShortenerForm } from "@/components/url-shortener-form"
import { UrlList } from "@/components/url-list"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 text-white">URL Shortener</h1>
          <p className="text-gray-400 text-lg">Transform long URLs into short, shareable links</p>
        </header>

        <UrlShortenerForm />

        <div className="mt-12">
          <UrlList />
        </div>
      </div>
    </main>
  )
}
