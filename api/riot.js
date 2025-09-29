export default async function handler(req, res) {
  const { op, platform = "euw1", name = "", id = "" } = req.query;

  // DIAG: voir si la clé est bien chargée côté Vercel
  if (op === "diag") {
    const k = process.env.RIOT_API_KEY || "";
    return res.status(200).json({
      hasKey: !!k,
      keyPrefix: k.slice(0, 6),   // devrait être "RGAPI-"
      keyLen: k.length,           // ~ 42-48 selon les clés
      vercelEnv: process.env.VERCEL_ENV || null,
      node: process.version
    });
  }
export default async function handler(req, res) {
  const { op, platform = "euw1", name = "", id = "" } = req.query;

  // Require API key set as env var on Vercel
  const apiKey = process.env.RIOT_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "RIOT_API_KEY missing on server" });
  }

  const base = `https://${platform}.api.riotgames.com`;
  let url = null;

  if (op === "status") {
    url = `${base}/lol/status/v4/platform-data`;
  } else if (op === "summonerByName" && name) {
    const enc = encodeURIComponent(name);
    url = `${base}/lol/summoner/v4/summoners/by-name/${enc}`;
  } else if (op === "leagueBySummoner" && id) {
    url = `${base}/lol/league/v4/entries/by-summoner/${id}`;
  } else {
    return res.status(400).json({ error: "Unsupported op or missing params" });
  }

  try {
    const r = await fetch(url, {
      headers: {
        "X-Riot-Token": apiKey,
        "User-Agent": "LRB-Proxy/1.0 (+https://vercel.com)",
        "Accept": "application/json",
      },
    });
    const text = await r.text();
    res.status(r.status);
    // Try JSON, else pass raw text
    try {
      const json = JSON.parse(text);
      res.json(json);
    } catch {
      res.send(text);
    }
  } catch (e) {
    res.status(502).json({ error: "Upstream error", detail: String(e) });
  }
}
