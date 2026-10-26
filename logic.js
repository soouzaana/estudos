(function(g){
const iso=d=>new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
const addDias=(s,n)=>{const d=new Date(s+'T12:00:00');d.setDate(d.getDate()+n);return iso(d)};
const inicioSemana=s=>addDias(s,-new Date(s+'T12:00:00').getDay());
const pct=(a,t)=>t>0?a/t*100:0;
const diasEntre=(a,b)=>Math.round((new Date(b+'T12:00:00')-new Date(a+'T12:00:00'))/864e5)+1;
function periodo(modo,ref){if(modo==='semana'){const i=inicioSemana(ref);return[i,addDias(i,6)]}const m=ref.slice(0,7),n=new Date(+m.slice(0,4),+m.slice(5,7),0).getDate();return[m+'-01',m+'-'+String(n).padStart(2,'0')]}
function moverPeriodo(modo,ref,n){if(modo==='dia')return addDias(ref,n);if(modo==='semana')return addDias(ref,7*n);const d=new Date(ref+'T12:00:00');d.setDate(1);d.setMonth(d.getMonth()+n);return iso(d)}
function stats(D,{ini,fim,conc='',disc='',hoje}){
const ok=x=>x.data>=ini&&x.data<=fim&&(!conc||x.conc===conc)&&(!disc||x.disc===disc);
const S=D.sessoes.filter(ok),Q=D.questoes.filter(ok),At=D.atividades.filter(ok);
const seg=S.reduce((a,s)=>a+s.seg,0),T=Q.reduce((a,q)=>a+q.total,0),A=Q.reduce((a,q)=>a+q.acertos,0);
const diasEst=new Set(S.map(s=>s.data)),limite=hoje&&hoje<fim?hoje:fim,decorridos=Math.max(0,diasEntre(ini,limite));
const porDia={};for(let d=ini;d<=fim;d=addDias(d,1))porDia[d]={seg:0,t:0,a:0};
S.forEach(s=>porDia[s.data].seg+=s.seg);Q.forEach(q=>{porDia[q.data].t+=q.total;porDia[q.data].a+=q.acertos});
const porDisc={};S.forEach(s=>(porDisc[s.disc]??={seg:0,t:0,a:0}).seg+=s.seg);Q.forEach(q=>{const x=porDisc[q.disc]??={seg:0,t:0,a:0};x.t+=q.total;x.a+=q.acertos});
return{seg,T,A,erros:T-A,aprov:pct(A,T),dias:diasEst.size,decorridos,consist:pct(diasEst.size,decorridos),
concluidas:At.filter(a=>a.status==='concluida').length,puladas:At.filter(a=>a.status==='pulada').length,pendentes:At.filter(a=>a.status==='pendente'||a.status==='andamento').length,porDia,porDisc}}
function sm2(c,g,hoje){let{ef=2.5,rep=0,iv=0}=c.s||{};if(g<2){rep=0;iv=0;c.prox=hoje}else{rep++;iv=rep===1?1:rep===2?(g===2?3:6):Math.max(1,Math.round(iv*ef*(g===2?0.8:g===4?1.3:1)));if(rep===1&&g===4)iv=3;ef=Math.max(1.3,ef+(g===4?0.15:g===2?-0.15:0));c.prox=addDias(hoje,iv)}c.s={ef,rep,iv};(c.hist=c.hist||[]).push({d:hoje,g});return c}
const validaQuestoes=(t,a)=>!Number.isInteger(t)||t<1?'Total inválido.':!Number.isInteger(a)||a<0?'Acertos inválidos.':a>t?'Acertos não podem superar o total.':null;
function migrar(D){for(const k of['concursos','atividades','sessoes','questoes','erros','cards','disciplinas'])if(!Array.isArray(D[k]))D[k]=[];D.cfg=Object.assign({cor:'#7c3aed',modo:'auto',metaDia:7200,metaQ:30},D.cfg||{});D.atividades.forEach(a=>{a.hist=a.hist||[]});D.cards.forEach(c=>{c.hist=c.hist||[]});D.erros.forEach(e=>{e.revs=e.revs||[]});
const tem=new Set(D.disciplinas.map(d=>d.nome.toLowerCase()));[...D.atividades,...D.sessoes,...D.questoes,...D.cards,...D.erros].forEach(x=>{if(x.disc&&!tem.has(x.disc.toLowerCase())){tem.add(x.disc.toLowerCase());D.disciplinas.push({id:Math.random().toString(36).slice(2,10),nome:x.disc,topicos:[],concs:[]})}});D.v=2;return D}
const api={iso,addDias,inicioSemana,pct,periodo,moverPeriodo,stats,sm2,validaQuestoes,migrar,diasEntre};
g.L=api;if(typeof module!=='undefined')module.exports=api})(typeof window!=='undefined'?window:globalThis);
