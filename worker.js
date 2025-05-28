export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url)
      
      // Add CORS headers
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }

      // Handle OPTIONS request
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: corsHeaders
        })
      }

      // Handle root path
      if (url.pathname === '/' || url.pathname === '') {
        return this.addCorsHeaders(await env.ASSETS.fetch(new Request(`${url.origin}/index.html`, request)), corsHeaders)
      }

      // Handle product detail page
      if (url.pathname.startsWith('/product')) {
        return this.addCorsHeaders(await env.ASSETS.fetch(new Request(`${url.origin}/product.html`, request)), corsHeaders)
      }

      // Try to serve the requested asset
      const response = await env.ASSETS.fetch(request)
      return this.addCorsHeaders(response, corsHeaders)
    } catch (error) {
      console.error('Error:', error)
      return new Response(`Error: ${error.message}`, { status: 500 })
    }
  },

  addCorsHeaders(response, corsHeaders) {
    const newHeaders = new Headers(response.headers)
    Object.keys(corsHeaders).forEach(key => {
      newHeaders.set(key, corsHeaders[key])
    })

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    })
  }
}
