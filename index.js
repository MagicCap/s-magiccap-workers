// Adds a listener.
addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

// Creates the link ID.
const createId = () => {
    let res = ""
    while (res.length !== 5) {
        res = Math.random().toString(36).substring(8)
    }
    return res
}

// Handles the request.
async function handleRequest(request) {
  const u = new URL(request.url)
  if (u.pathname === "/") {
    return Response.redirect("https://magiccap.me")
  } else if (u.pathname === "/add") {
    const url = u.searchParams.get("url")
    if (!url) {
      return new Response("Link not found.", { status: 400, headers: {"Access-Control-Allow-Origin": "*"}, })
    }
    const id = createId()
    await LINKS.put(id, url)
    return new Response(`https://s.magiccap.me/${id}`, { status: 200, headers: {"Access-Control-Allow-Origin": "*"}, })
  }
  const url = await LINKS.get(u.pathname.substr(1))
  if (url) {
    return Response.redirect(url)
  } else {
    return new Response("Link not found.", { status: 404, headers: {"Access-Control-Allow-Origin": "*"}, })
  }
}
