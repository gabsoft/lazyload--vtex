(function(){
	'use strict';
	var regImg = new RegExp(/<img.*?>/gi);
	var regIframe = new RegExp(/<iframe.*?>/gi);
	var regSrc = new RegExp(/src="(.*?)"/gi);
	var repImg = 'data-src="$1" src="data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs=" class="lazy-loading"';
	var repIframe = 'data-src="$1" src="data:text/plain;charset=UTF-8,Carregando..." class="lazy-loading"';
	var eventsObserver = ['DOMNodeInserted', 'DOMAttrModified'];
	var eventsPolyfill = ['scroll', 'resize', 'transitionend', 'animationend', 'webkitAnimationEnd'].concat(eventsObserver);
	var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
	var windowWidth = (window.innerWidth || document.documentElement.clientWidth);
	var execLoad = null;
	var onloadImg = function(elem) {
		elem.classList.remove('lazy-loading');
		elem.classList.add('lazy-loaded');
		elem.removeEventListener('onload', onloadImg);
	};
	var throttle = function(callback, limit){
		if(execLoad!==null)clearTimeout(execLoad);
		execLoad = setTimeout(function(){
			callback();
		},550);
	}
	var execLazy = function(){
		var haslazyload = document.querySelectorAll('.has--lazyload');
		var lazyloading = document.querySelectorAll('.lazy-loading');
		var elems =  haslazyload.length ? haslazyload : lazyloading ;
		if(!elems.length)return;
		if(elems[0].classList.contains('has--lazyload')){
			for(var z = 0, y = elems.length; z<y; z++){
				var _content = elems[z].querySelector('noscript').textContent;
				if(regImg.test(_content)){
					_content = _content.replace(regImg, function(str){
						return str.replace(regSrc, repImg);
					});
				}
				if(regIframe.test(_content)){
					_content = _content.replace(regIframe, function(str){
						return str.replace(regSrc, repIframe);
					});
				}
				elems[z].innerHTML = _content;
				elems[z].classList.remove('has--lazyload');
			}
		}
		if('IntersectionObserver' in window){
			var observer = new IntersectionObserver(function(entries, observer){
				for(var z = 0, v = entries.length; z<v; z++){
					if(!entries[z].isIntersecting)continue;
					entries[z].target.onload = onloadImg(entries[z].target);
					entries[z].target.src = entries[z].target.dataset.src;
					observer.unobserve(entries[z].target);
				}
			});
			for(var x = 0, c = elems.length; x<c; x++){
				observer.observe(elems[x]);
			}
		}else{
			var loadlazy = function(){
				var imgs = document.querySelectorAll(".lazy-loading");
				if(!imgs.length)return;
				for(var z = 0, v = imgs.length; z<v; z++){
					if(imgs[z].classList.contains("lazy-loaded"))continue;
					var rect = imgs[z].getBoundingClientRect();
					var visible = (rect.top >= 0 && rect.left >= 0 && rect.top <= windowHeight && rect.right <= windowWidth);
					if(visible){
						imgs[z].src = imgs[z].dataset.src;
						imgs[z].onload = onloadImg(imgs[z]);
					}
				}
			};
			window.onload = loadlazy;
			for(var x = 0, c = eventsPolyfill.length; x<c; x++){
				document.addEventListener(eventsPolyfill[x], function(){ loadlazy() }, true);
			}
			document.addEventListener('click', function(){ throttle(function(){ loadlazy() }) }, true);
		}
	};
	execLazy();
	for(var x = 0, c = eventsObserver.length; x<c; x++){
		document.addEventListener(eventsObserver[x], function(){ throttle( function(){ execLazy() });	}, true);
	}
})();