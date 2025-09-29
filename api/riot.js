export default async function handler(req, res) {
  try {
    const q = req.query || {};
    const op = q.op;
    const platform = q.platform || "euw1";
    const name = q.name || "";
    const id = q.id || "";

    // Diag rapide : vérifie la présence de la clé côté Vercel
    if (op === "diag") {
      const k = process.env.RIOT_API_KEY || "";
      return res.status(200).json({
        hasKey: !!k,
        keyPrefix: k.slice(0, 6), // devrait être "RGAPI-"
        keyLen: k.length,
        env: process.env.VERCEL_ENV || null,
        node: process.version
      });
    }

    const apiKey = process.env.RIOT_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "RIOT_API_KEY missing on server" });
    }

    const base = `https://${platform}.api.riotgames.com`;
    let url = null;

    if (op === "status") {
      url = `${base}/lol/status/v4/platform-data`;
    } else if (op === "summonerByName") {
      if (!name) return res.status(400).json({ error: "Missing 'name'" });
      url = `${base}/lol/summoner/v4/summoners/by-name/${encodeURIComponent(name)}`;
    } else if (op === "leagueBySummoner") {
      if (!id) return res.status(400).json({ error: "Missing 'id'" });
      url = `${base}/lol/league/v4/entries/by-summoner/${id}`;
    } else {
      return res.status(400).json({ error: "Unsupported 'op'" });
    }

    const r = await fetch(url, {
      headers: {
        "X-Riot-Token": apiKey,
        "Accept": "application/json",
        "User-Agent": "LRB-Proxy/1.1 (+vercel)"
      },
    });

    const text = await r.text();
    res.status(r.status);
    try {
      res.json(JSON.parse(text));
    } catch {
      res.send(text);
    }
  } catch (e) {
    console.error("Proxy error:", e);
    res.status(500).json({ error: "server_error", detail: String(e) });
  }
}
