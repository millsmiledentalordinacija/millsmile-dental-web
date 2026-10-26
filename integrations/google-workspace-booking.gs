/**
 * Mill&Smile Dental — Google Workspace booking inbox.
 * Deploy as Web App: execute as Me; access Anyone.
 * In Project Settings > Script properties, set BOOKING_SHARED_SECRET
 * to the same long random secret as Cloudflare GOOGLE_BOOKING_SECRET.
 * Do not paste the secret into source code.
 */
function doPost(e) {
  const response = (ok,code) => ContentService.createTextOutput(JSON.stringify({ok:ok,code:code||undefined}))
    .setMimeType(ContentService.MimeType.JSON);
  try {
    const body=JSON.parse(e.postData.contents);
    const secret=PropertiesService.getScriptProperties().getProperty('BOOKING_SHARED_SECRET');
    if(!secret||body.secret!==secret)return response(false,'AUTH');
    const value=(key,max)=>String(body[key]||'').trim().slice(0,max);
    const ime=value('ime',120),telefon=value('telefon',40),email=value('email',180),
      usluga=value('usluga',90),datum=value('datum',10),vrijeme=value('vrijeme',10),poruka=value('poruka',600);
    if(!ime||!/^[-+()\d\s]{6,40}$/.test(telefon)||!/^\d{4}-\d{2}-\d{2}$/.test(datum)||!/^([01]\d|2[0-3]):[03]0$/.test(vrijeme))return response(false,'VALIDATION');
    const plain=[
      'Novi upit za termin — Mill&Smile Dental','',
      'Ime i prezime: '+ime,'Telefon: '+telefon,
      'E-mail: '+(email||'Nije naveden'),
      'Usluga: '+(usluga||'Nije odabrana'),
      'Željeni datum: '+datum,
      'Željeno vrijeme: '+vrijeme,
      'Napomena: '+(poruka||'Nije navedena'),
      '', 'Termin nije automatski potvrđen.'
    ].join('\n');
    const options={name:'Mill&Smile Dental'};
    if(email&&/^[^\s@]+@[^\s@]+\\.[^\s@]+$/.test(email))options.replyTo=email;
    MailApp.sendEmail('ordinacija@info-millsmiledental.com','Novi upit za termin — '+ime,plain,options);
    return response(true);
  } catch(err) {
    console.error('Booking script failed: '+err.message);
    return response(false,'MAIL');
  }
}
