// Višejezičnost: zajedničke funkcije. Hrvatski je zadani jezik (bez prefiksa), ostali su na /en/, /de/, /it/, /sl/.
export const LANGS=['hr','en','de','it','sl'];
export const OTHER_LANGS=['en','de','it','sl'];
export const LANG_NAMES={hr:'Hrvatski',en:'English',de:'Deutsch',it:'Italiano',sl:'Slovenščina'};
export const OG_LOCALE={hr:'hr_HR',en:'en_GB',de:'de_DE',it:'it_IT',sl:'sl_SI'};
export const esc=(s)=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

// Jezik i "osnovna" putanja (bez jezičnog prefiksa) iz putanje stranice.
export function splitPath(pathname){
  const m=String(pathname).match(/^\/(en|de|it|sl)(\/.*)?$/);
  return m?{lang:m[1],base:m[2]||'/'}:{lang:'hr',base:pathname||'/'};
}
export const localPath=(lang,base)=>lang==='hr'?base:`/${lang}${base}`;

// Diskretni izbornik jezika: vidljiva je samo oznaka trenutačnog jezika (npr. "HR ▾").
export function langSwitcher(lang,base){
  const label={hr:'Jezik',en:'Language',de:'Sprache',it:'Lingua',sl:'Jezik'}[lang]||'Jezik';
  const items=LANGS.filter(l=>l!==lang).map(l=>`<a href="${localPath(l,base)}" hreflang="${l}" lang="${l}"><b>${l.toUpperCase()}</b> ${LANG_NAMES[l]}</a>`).join('');
  return `<details class="dropdown lang-switch"><summary aria-label="${label}: ${LANG_NAMES[lang]}">${lang.toUpperCase()} ▾</summary><div class="dropdown-items">${items}</div></details>`;
}

const norm=(s)=>s.replace(/\s+/g,' ').trim();
// Prevodi tekstualne čvorove i atribute alt/aria-label prema rječniku { "hrvatski tekst": "prijevod" }
// te interne poveznice usmjerava na jezičnu verziju. Tekst bez prijevoda ostaje hrvatski i vraća se u "missing".
export function translateHtml(html,dict,lang){
  const missing=[];
  const tr=(text)=>{const k=norm(text);if(!k||!/\p{L}/u.test(k))return null;if(k in dict)return dict[k];missing.push(k);return null};
  let inScript=false;
  const out=html.split(/(<[^>]+>)/).map(part=>{
    if(part.startsWith('<')){
      if(/^<(script|style)\b/i.test(part))inScript=true;
      if(/^<\/(script|style)>/i.test(part))inScript=false;
      if(part.startsWith('<!--'))return part;
      let tag=part.replace(/\b(alt|aria-label)="([^"]*)"/g,(m,a,v)=>{const t=tr(v.replace(/&amp;/g,'&'));return t==null?m:`${a}="${esc(t)}"`});
      tag=tag.replace(/\bhref="(\/[^"]*)"/g,(m,h)=>/^\/(images|api)\//.test(h)||/\.[a-z0-9]{2,5}$/i.test(h)?m:`href="/${lang}${h}"`);
      return tag;
    }
    if(inScript)return part;
    const t=tr(part.replace(/&amp;/g,'&'));
    if(t==null)return part;
    const lead=part.match(/^\s*/)[0],trail=part.match(/\s*$/)[0];
    return lead+esc(t).replace(/&quot;/g,'"')+trail;
  }).join('');
  return {html:out,missing:[...new Set(missing)]};
}
// Popis svih prevodivih tekstova (za izradu i provjeru rječnika).
export function extractStrings(html){return translateHtml(html,{},'xx').missing}
