(()=>{"use strict";var t={721:(t,e,i)=>{i(90);var r,n,o,s,u,a,d,c,l,h,p,g,f,y,v,k=i(358),b=i(486);n=document.querySelector(".cursor"),o=document.querySelectorAll("[data-hover]"),s=document.querySelector(".taskcard__container"),u=!1,a=!1,d=!1,c={cursorHeight:25,cursorWidth:25,cursorOpacity:.15,cursorRadius:"50%",cursorTransition:.2},l={linkWidth:0,linkHeight:0,linkTop:0,linkLeft:0,borderRadius:0},h=function(t){var e=t.getBoundingClientRect(),i=window.getComputedStyle(t);l.linkWidth=e.width,l.linkHeight=e.height,l.linkTop=e.top,l.linkLeft=e.left,l.borderRadius=i.borderTopLeftRadius},p=function(t){r=t.target,h(t.target),"INPUT"==t.target.nodeName?(a=!0,u=!1):y()||(u=!0),g(l)},g=function(t){if(u){var e=t.linkTop+t.linkHeight/2,i=t.linkLeft+t.linkWidth/2;k.ZP.to(n,{duration:.25,x:i,y:e,height:t.linkHeight,width:t.linkWidth,borderRadius:t.borderRadius,opacity:.05,ease:"power4.out"})}else c.cursorHeight=a?23:25,c.cursorWidth=a?2:25,c.cursorOpacity=a?.25:.15,c.cursorRadius=a?"0":"50%",n.style.visibility="visible",k.ZP.to(n,{duration:c.cursorTransition,height:c.cursorHeight,width:c.cursorWidth,opacity:c.cursorOpacity,borderRadius:c.cursorRadius})},f=function(){u=!1,a=!1,d=!1,g()},y=function(){var t=s.getBoundingClientRect(),e=t.y,i=t.y+t.height;return!!(s.contains(r)&&l.linkTop<e||s.contains(r)&&l.linkTop+l.linkHeight>i)},v=(0,b.throttle)((function(t){c.cursorTransition="hidden"==n.style.visibility?0:.2,n.style.visibility="visible",(!u||u&&d)&&k.ZP.to(n,{duration:c.cursorTransition,x:t.pageX,y:t.pageY,height:c.cursorHeight,width:c.cursorWidth,opacity:c.cursorOpacity,borderRadius:c.cursorRadius})}),10),document.addEventListener("mousemove",v),o.forEach((function(t){t.addEventListener("mouseenter",p)})),o.forEach((function(t){t.addEventListener("mouseleave",f)})),document.addEventListener("mouseleave",(function(t){(t.pageY<=0||t.pageX<=0||t.pageX>=window.innerWidth||t.pageY>=window.innerHeight)&&(n.style.visibility="hidden",console.log("hidden"))})),s.addEventListener("scroll",(function(t){y()&&(d=!0,u=!1),h(r);var e=l.linkTop+l.linkHeight/2;d?f():k.ZP.to(n,{duration:0,y:e})}))}},e={};function i(r){if(e[r])return e[r].exports;var n=e[r]={id:r,loaded:!1,exports:{}};return t[r].call(n.exports,n,n.exports,i),n.loaded=!0,n.exports}i.m=t,i.d=(t,e)=>{for(var r in e)i.o(e,r)&&!i.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),i.nmd=t=>(t.paths=[],t.children||(t.children=[]),t),(()=>{var t={179:0},e=[[721,968]],r=()=>{};function n(){for(var r,n=0;n<e.length;n++){for(var o=e[n],s=!0,u=1;u<o.length;u++){var a=o[u];0!==t[a]&&(s=!1)}s&&(e.splice(n--,1),r=i(i.s=o[0]))}return 0===e.length&&(i.x(),i.x=()=>{}),r}i.x=()=>{i.x=()=>{},s=s.slice();for(var t=0;t<s.length;t++)o(s[t]);return(r=n)()};var o=n=>{for(var o,s,[a,d,c,l]=n,h=0,p=[];h<a.length;h++)s=a[h],i.o(t,s)&&t[s]&&p.push(t[s][0]),t[s]=0;for(o in d)i.o(d,o)&&(i.m[o]=d[o]);for(c&&c(i),u(n);p.length;)p.shift()();return l&&e.push.apply(e,l),r()},s=self.webpackChunksite=self.webpackChunksite||[],u=s.push.bind(s);s.push=o})(),i.x()})();