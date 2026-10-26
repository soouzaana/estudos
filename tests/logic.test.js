const t=require('node:test'),a=require('node:assert'),L=require('../logic.js'),fs=require('fs');
t('validação de questões',()=>{a.ok(L.validaQuestoes(10,11));a.ok(L.validaQuestoes(0,0));a.ok(L.validaQuestoes(5,-1));a.equal(L.validaQuestoes(10,7),null)});
t('estatísticas: aproveitamento, sem divisão por zero e isolamento por concurso',()=>{const D={sessoes:[{data:'2026-10-26',conc:'a',disc:'X',seg:3600},{data:'2026-10-27',conc:'b',disc:'X',seg:1800}],questoes:[{data:'2026-10-26',conc:'a',disc:'X',total:10,acertos:7}],atividades:[{data:'2026-10-26',conc:'a',status:'pulada'}]};
let s=L.stats(D,{ini:'2026-10-25',fim:'2026-10-31',conc:'a',hoje:'2026-10-28'});a.equal(s.seg,3600);a.equal(s.aprov,70);a.equal(s.erros,3);a.equal(s.puladas,1);a.equal(s.dias,1);
s=L.stats(D,{ini:'2026-10-25',fim:'2026-10-31',conc:'b',hoje:'2026-10-28'});a.equal(s.T,0);a.equal(s.aprov,0)});
t('períodos semana/mês',()=>{a.deepEqual(L.periodo('semana','2026-10-26'),['2026-10-25','2026-10-31']);a.deepEqual(L.periodo('mes','2026-02-10'),['2026-02-01','2026-02-28']);a.equal(L.moverPeriodo('mes','2026-01-31',1).slice(0,7),'2026-02')});
t('repetição espaçada',()=>{const c=L.sm2({},3,'2026-10-26');a.equal(c.prox,'2026-10-27');L.sm2(c,3,'2026-10-27');a.equal(c.prox,'2026-11-02');L.sm2(c,1,'2026-11-02');a.equal(c.prox,'2026-11-02');a.equal(c.hist.length,3)});
t('migração preserva dados e registra disciplinas',()=>{const D=L.migrar({concursos:[{id:'1'}],sessoes:[{disc:'Português',seg:5}],atividades:[{disc:'português',status:'pulada'}]});a.equal(D.disciplinas.length,1);a.equal(D.atividades[0].status,'pulada');a.deepEqual(D.atividades[0].hist,[])});
t('script do index.html tem sintaxe válida',()=>{const h=fs.readFileSync('index.html','utf8');new Function(h.match(/<script>([\s\S]*)<\/script>/)[1])});
