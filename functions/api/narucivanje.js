const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}});
export async function onRequestPost({request,env}){
  if(!env.RESEND_API_KEY||!env.BOOKING_FROM_EMAIL)return reply({ok:false,message:"Online slanje trenutačno nije dostupno. Nazovite ordinaciju na 099 241 1982."},503);
  const origin=request.headers.get("origin");if(origin&&new URL(origin).host!==new URL(request.url).host)return reply({ok:false,message:"Neispravan zahtjev."},403);
  if(Number(request.headers.get("content-length")||0)>12000)return reply({ok:false,message:"Prevelik zahtjev."},413);
  let body;try{body=await request.json()}catch{return reply({ok:false,message:"Neispravni podaci."},400)}
  const clean=(v,n=250)=>typeof v==="string"?v.trim().slice(0,n):"";
  if(clean(body.website))return reply({ok:true,message:"Zahtjev je zaprimljen."});
  const ime=clean(body.ime,120),telefon=clean(body.telefon,40),email=clean(body.email,180),usluga=clean(body.usluga,90),datum=clean(body.datum,10),vrijeme=clean(body.vrijeme,10),poruka=clean(body.poruka,600);
  if(!ime||!telefon||!datum||!vrijeme||!/^\d{4}-\d{2}-\d{2}$/.test(datum)||!/^([01]\d|2[0-3]):[03]0$/.test(vrijeme)||!body.privola||!/^[-+()\d\s]{6,40}$/.test(telefon)||email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return reply({ok:false,message:"Provjerite obavezna polja i kontaktne podatke."},400);
  const escape=(s)=>s.replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const rows=[["Ime i prezime",ime],["Telefon",telefon],["E-mail",email||"Nije naveden"],["Usluga",usluga||"Nije odabrana"],["Željeni datum",datum],["Željeno vrijeme",vrijeme],["Poruka",poruka||"Nije navedena"]];
  const html="<h2>Novi upit za termin — Mill&Smile Dental</h2>"+rows.map(([k,v])=>"<p><strong>"+escape(k)+":</strong> "+escape(v)+"</p>").join("")+"<p>Termin nije automatski potvrđen.</p>";
  try{
    const res=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":"Bearer "+env.RESEND_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({from:env.BOOKING_FROM_EMAIL,to:["ordinacija@info-millsmiledental.com"],subject:"Novi upit za termin — "+ime,html,reply_to:email||undefined})});
    if(!res.ok){console.error("Booking email provider error",res.status);return reply({ok:false,message:"Upit nije poslan. Molimo nazovite ordinaciju na 099 241 1982."},502)}
    return reply({ok:true,message:"Vaš upit je poslan ordinaciji. Termin će biti potvrđen naknadno."});
  }catch{return reply({ok:false,message:"Upit nije poslan. Molimo nazovite ordinaciju na 099 241 1982."},502)}
}
export async function onRequestGet(){return reply({ok:false,message:"Metoda nije podržana."},405)}
