const respond=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}});
const clean=(value,max=250)=>typeof value==="string"?value.trim().slice(0,max):"";
export async function onRequestPost({request,env}){
  if(!env.GOOGLE_BOOKING_SCRIPT_URL||!env.GOOGLE_BOOKING_SECRET)return respond({ok:false,message:"Online slanje trenutačno nije dostupno. Nazovite ordinaciju na 099 241 1982."},503);
  const origin=request.headers.get("origin");
  if(origin&&new URL(origin).host!==new URL(request.url).host)return respond({ok:false,message:"Neispravan zahtjev."},403);
  if(Number(request.headers.get("content-length")||0)>12000)return respond({ok:false,message:"Prevelik zahtjev."},413);
  let body;try{body=await request.json()}catch{return respond({ok:false,message:"Neispravni podaci."},400)}
  if(clean(body.website))return respond({ok:true,message:"Zahtjev je zaprimljen."});
  const ime=clean(body.ime,120),telefon=clean(body.telefon,40),email=clean(body.email,180),usluga=clean(body.usluga,90),datum=clean(body.datum,10),vrijeme=clean(body.vrijeme,10),poruka=clean(body.poruka,600);
  if(!ime||!telefon||!body.privola||!/^[-+()\d\s]{6,40}$/.test(telefon)||email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!/^\d{4}-\d{2}-\d{2}$/.test(datum)||!/^([01]\d|2[0-3]):[03]0$/.test(vrijeme))return respond({ok:false,message:"Provjerite obavezna polja, suglasnost i odabrani termin."},400);
  try{
    const result=await fetch(env.GOOGLE_BOOKING_SCRIPT_URL,{method:"POST",redirect:"follow",headers:{"content-type":"text/plain;charset=UTF-8"},body:JSON.stringify({secret:env.GOOGLE_BOOKING_SECRET,ime,telefon,email,usluga,datum,vrijeme,poruka})});
    if(!result.ok)return respond({ok:false,message:"Upit nije poslan. Molimo nazovite ordinaciju na 099 241 1982."},502);
    const response=await result.json();
    if(response.ok!==true)return respond({ok:false,message:"Upit nije poslan. Molimo nazovite ordinaciju na 099 241 1982."},502);
    return respond({ok:true,message:"Vaš upit je poslan ordinaciji. Termin će biti potvrđen naknadno."});
  }catch{return respond({ok:false,message:"Upit nije poslan. Molimo nazovite ordinaciju na 099 241 1982."},502)}
}
export async function onRequestGet(){return respond({ok:false,message:"Metoda nije podržana."},405)}
