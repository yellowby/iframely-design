// Sample API payloads. The access object is copied from the live docs
// (iframely.com/docs/content-access, read 2026-10-15); the rest is illustrative.

export const accessSample = `"access": {
  "requested": { "modes": ["assist"], "use": "reference" },
  "signals": {
    "license": {
      "url": "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
      "common_name": "CC BY-SA 4.0",
      "type": "CC"
    },
    "robots.txt": {
      "url": "https://en.wikipedia.org/robots.txt",
      "status": 200,
      "updated_at": "2026-09-16T15:33:44.130Z"
    },
    "directives": { "max-image-preview": "standard" }
  },
  "decision": {
    "meta":     { "iframely_default": true,  "supported_by": ["license"], "allowed": true },
    "links":    { "iframely_default": true,  "supported_by": ["max-image-preview", "license"], "allowed": true },
    "entities": { "iframely_default": false, "promoted_by": ["license"], "allowed": true },
    "excerpt":  { "iframely_default": false, "promoted_by": ["license"], "allowed": true },
    "fulltext": { "iframely_default": false, "promoted_by": ["license"], "allowed": true }
  }
}`;

// Homepage overview: content keys collapsed, access shortened from accessSample above,
// so the five content parts line up with the five decisions.
export const dataApiOverview = `{
  "meta":     { "title": "…", "site": "Wikipedia", "author": "…" },
  "links":    { "thumbnail": [ … ] },
  "entities": [ … ],
  "excerpt":  "…",
  "fulltext": "…",
  "access": {
    "requested": { "modes": ["assist"], "use": "reference" },
    "signals": {
      "license":    { "common_name": "CC BY-SA 4.0" },
      "robots.txt": { "status": 200 }
    },
    "decision": {
      "meta":     { "allowed": true },
      "links":    { "allowed": true },
      "entities": { "allowed": true },
      "excerpt":  { "allowed": true },
      "fulltext": { "allowed": true }
    }
  }
}`;

export const blockedSample = `"fulltext": {
  "iframely_default": false,
  "promoted_by": ["license", "markdown"],
  "blocked_by": ["explicit_publisher_permissions"],
  "allowed": false
}`;

export const dataApiCurl = `curl "https://iframe.ly/api/data?url=https://en.wikipedia.org/wiki/Oembed\\
&mode=assist&use=reference&include=excerpt,entities,fulltext,access\\
&api_key=$IFRAMELY_API_KEY"`;

export const dataApiNode = `const res = await fetch(
  "https://iframe.ly/api/data?" + new URLSearchParams({
    url: "https://en.wikipedia.org/wiki/Oembed",
    mode: "assist",          // a person asked your assistant about this URL
    use: "reference",        // you will quote and link, not republish
    include: "excerpt,entities,fulltext,access",
    api_key: process.env.IFRAMELY_API_KEY,
  })
);
const { meta, excerpt, fulltext, access } = await res.json();
if (!access.decision.fulltext.allowed) {
  // fall back to the excerpt and link to the source
}`;

export const dataApiPython = `import os, requests

r = requests.get("https://iframe.ly/api/data", params={
    "url": "https://en.wikipedia.org/wiki/Oembed",
    "mode": "assist",
    "use": "reference",
    "include": "excerpt,entities,fulltext,access",
    "api_key": os.environ["IFRAMELY_API_KEY"],
})
data = r.json()
print(data["access"]["decision"]["fulltext"]["allowed"])`;

export const previewCurl = `curl "https://iframe.ly/api/iframely?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ\\
&api_key=$IFRAMELY_API_KEY"`;

export const previewResponse = `{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "meta": {
    "title": "Sample video title",
    "site": "YouTube",
    "author": "Sample channel",
    "duration": 213,
    "medium": "video"
  },
  "links": {
    "player": [{ "href": "https://www.youtube.com/embed/dQw4w9WgXcQ", "rel": ["player", "html5"],
                 "media": { "aspect-ratio": 1.7778 } }],
    "thumbnail": [{ "href": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg", "media": { "width": 480, "height": 360 } }]
  },
  "rel": ["player", "html5"],
  "html": "<div style=\\"position:relative;padding-bottom:56.25%\\">…</div>"
}`;

export const mcpInstall = {
	claudeCode: `claude mcp add --transport http iframely https://mcp.iframely.com/mcp \\
  --header "Authorization: Bearer $IFRAMELY_API_KEY"`,
	local: `claude mcp add iframely -e IFRAMELY_API_KEY=$IFRAMELY_API_KEY -- npx -y @iframely/mcp`,
	desktop: `{
  "mcpServers": {
    "iframely": {
      "command": "npx",
      "args": ["-y", "@iframely/mcp"],
      "env": { "IFRAMELY_API_KEY": "..." }
    }
  }
}`,
	vscode: `{
  "servers": {
    "iframely": { "type": "http", "url": "https://mcp.iframely.com/mcp" }
  }
}`
};
