# Mill&Smile Dental — web projekt

Astro + Pages CMS + Cloudflare Pages. Postojeći vizualni dizajn i stvarne fotografije.

## Objavljivanje

1. Izvorni projekt već je u GitHubu na radnoj grani `fix/restore-astro-layouts`. Provjeriti GitHub Actions izgradnju i izgled stranice prije spajanja u `main`.
2. Cloudflare Pages → Connect to Git → odabrati ovaj repozitorij. Framework preset: **Astro**; build command: `npm run build`; output directory: `dist`.
3. Na https://pagescms.org/ prijaviti se putem GitHuba, odabrati repozitorij i odobriti potrebne dozvole.
4. Tek nakon testiranja povezati vlastitu domenu, uz oprez da se ne mijenjaju MX/SPF/DKIM zapisi poslovne e-pošte.

## Važno

- Poveznice za online upit vode na Tally obrazac: https://tally.so/r/kbd5K6. Prije objave provjeriti da obrazac radi i kamo stižu upiti.
- Objavljivanje fotografija pacijenata zahtijeva odgovarajuće privole.
- Blog članak je skica i nije javno objavljen.
- CMS uređuje blog i usluge, fotografije te dio naslovnice. **Za potpuno vizualno uređivanje svakog dijela naslovnice** treba dodatno prebaciti preostali statički tekst u CMS polja.
- Na javni GitHub nikad ne stavljati lozinke, podatke pacijenata ni osjetljive dokumente.
- SEO i GEO ne jamče rangiranje niti pojavljivanje u AI odgovorima.
