document.getElementById('open').onclick=function(){var c=document.getElementById('cover');c.style.opacity=0;setTimeout(function(){c.remove()},600)};
var T=new Date('2026-10-23T12:00:00Z');
function tick(){var e=document.getElementById('cd');if(!e)return;var s=Math.max(0,Math.floor((T-new Date())/1000));
e.textContent=Math.floor(s/86400)+' days '+Math.floor(s%86400/3600)+' hours '+Math.floor(s%3600/60)+' min '+s%60+' sec'}
tick();setInterval(tick,1000);
// warm up the rest of the images while the cover is showing
window.addEventListener('load',function(){['90fa7ee353','a780744ffb','484ad0097b','425734e826','128239dc52','372df3461c','9973f8dc0e','4ec9092d1d'].forEach(function(n){new Image().src='assets/images/'+n+'.webp'})});
