import { useState, useEffect } from "react"
import axios from "axios"

function App() {

  const [url, setUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copiedId, setCopiedId] = useState(null)

  const API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

  // Shorten URL

  const shortenUrl = async () => {

    setError("")

    // URL validation

    if (
      !url.startsWith("http://") &&
      !url.startsWith("https://")
    ) {

      setError(
        "Please enter a valid URL with http:// or https://"
      )

      return
    }

    try {

      setLoading(true)

      const response = await axios.post(
        `${API_URL}/shorten`,
        {
          original_url: url
        }
      )

      setShortUrl(response.data.short_url)

      setUrl("")

      fetchHistory()

    } catch (error) {

      console.log(error)

      setError("Failed to shorten URL")

    } finally {

      setLoading(false)
    }
  }

  // Copy URL

  const copyToClipboard = async (text, id) => {

    try {

      await navigator.clipboard.writeText(text)

      setCopiedId(id)

      setTimeout(() => {

        setCopiedId(null)

      }, 2000)

    } catch (error) {

      console.log(error)
    }
  }

  // Fetch History

  const fetchHistory = async () => {

    try {

      const response = await axios.get(
        `${API_URL}/history`
      )

      // Safe handling

      const historyData = Array.isArray(response.data)
        ? response.data
        : response.data.history || []

      setHistory(historyData)

    } catch (error) {

      console.log(error)

      setHistory([])
    }
  }

  // Load history

  useEffect(() => {

    fetchHistory()

  }, [])

  // Analytics

  const totalClicks = (
    Array.isArray(history)
      ? history
      : []
  ).reduce(
    (total, item) =>
      total + (item.clicks || 0),
    0
  )

  return (

    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">

      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-lg p-8">

        {/* TITLE */}

        <h1 className="text-4xl font-bold text-center mb-8">
          URL Shortener
        </h1>

        {/* INPUT */}

        <input
          type="text"
          placeholder="Enter URL"
          className="w-full border p-4 rounded-xl mb-4 outline-none"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        {/* ERROR */}

        {error && (

          <p className="text-red-500 mb-4">
            {error}
          </p>
        )}

        {/* BUTTON */}

        <button
          type="button"
          onClick={shortenUrl}
          disabled={loading}
          className="w-full bg-black text-white p-4 rounded-xl hover:opacity-90 transition disabled:opacity-50"
        >
          {loading
            ? "Shortening..."
            : "Shorten URL"}
        </button>

        {/* LATEST SHORT URL */}

        {shortUrl && (

          <div className="mt-8 border rounded-xl p-5">

            <p className="font-semibold mb-3">
              Latest Short URL
            </p>

            <div className="flex flex-col md:flex-row md:items-center gap-3">

              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 break-all"
              >
                {shortUrl}
              </a>

              <button
                onClick={() =>
                  copyToClipboard(shortUrl, "latest")
                }
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                {copiedId === "latest"
                  ? "Copied!"
                  : "Copy"}
              </button>

            </div>

          </div>
        )}

        {/* ANALYTICS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

          <div className="bg-gray-100 p-6 rounded-2xl text-center">

            <h2 className="text-xl font-bold mb-2">
              Total URLs
            </h2>

            <p className="text-4xl font-bold">
              {Array.isArray(history)
                ? history.length
                : 0}
            </p>

          </div>

          <div className="bg-gray-100 p-6 rounded-2xl text-center">

            <h2 className="text-xl font-bold mb-2">
              Total Clicks
            </h2>

            <p className="text-4xl font-bold">
              {totalClicks}
            </p>

          </div>

        </div>

        {/* HISTORY */}

        <div className="mt-12">

          <h2 className="text-3xl font-bold mb-6">
            URL History
          </h2>

          {!Array.isArray(history) ||
          history.length === 0 ? (

            <p className="text-gray-500">
              No URLs created yet
            </p>

          ) : (

            <div className="space-y-4">

              {history.map((item) => (

                <div
                  key={item.id}
                  className="border rounded-2xl p-5"
                >

                  {/* Original URL */}

                  <p className="font-semibold break-all mb-2">
                    {item.original_url}
                  </p>

                  {/* Short URL */}

                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">

                    <a
                      href={item.short_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 break-all"
                    >
                      {item.short_url}
                    </a>

                    <button
                      onClick={() =>
                        copyToClipboard(
                          item.short_url,
                          item.id
                        )
                      }
                      className="bg-black text-white px-3 py-1 rounded-lg"
                    >
                      {copiedId === item.id
                        ? "Copied!"
                        : "Copy"}
                    </button>

                  </div>

                  {/* Clicks */}

                  <p>
                    Clicks:
                    <span className="font-bold ml-2">
                      {item.clicks || 0}
                    </span>
                  </p>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>

    </div>
  )
}

export default App