# Riot Proxy (Vercel)

Proxy minimal pour l'API Riot. Utilise la variable d'environnement `RIOT_API_KEY` côté serveur.
Routes:
- `/api/riot?op=status&platform=euw1`
- `/api/riot?op=summonerByName&platform=euw1&name=NiVueNeekoNue`
- `/api/riot?op=leagueBySummoner&platform=euw1&id=SUMMONER_ID`

## Déploiement
1. Crée un projet sur Vercel.
2. Ajoute la variable d'environnement `RIOT_API_KEY` (ta clé Riot) dans Project Settings → Environment Variables.
3. Déploie.
4. Récupère l'URL (ex: `https://ton-projet.vercel.app/api/riot`).
5. Colle cette URL dans le plugin WordPress (champ "Proxy").
