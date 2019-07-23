(function(){
	'use strict';
	var elems = document.querySelectorAll('.has--lazyload');
	var elemsInd = elems.length;
	var regImg = new RegExp(/<img.*?>/gi);
	var regIframe = new RegExp(/<iframe.*?>/gi);
	var regSrc = new RegExp(/src="(.*?)"/gi);
	var repImg = 'data-src="$1" src="data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs=" class="lazy-loading"';
	var repIframe = 'data-src="$1" src="data:text/plain;charset=UTF-8,Carregando..." class="lazy-loading"';
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
	var execLazy = function(elems, elemsInd){
		var elems = elems;
		for(var z = 0; z<elemsInd; z++){
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
		if('IntersectionObserver' in window){
			var elems = document.querySelectorAll(".lazy-loading");
			var observer = new IntersectionObserver(function(entries, observer){
				for(var z = 0, v = entries.length; z<v; z++){
					if(!entries[z].isIntersecting)continue;
					observer.unobserve(entries[z].target);
					entries[z].target.onload = onloadImg(entries[z].target);
					entries[z].target.src = entries[z].target.dataset.src;
				}
			});
			for(var x = 0, c = elems.length; x<c; x++){
				observer.observe(elems[x]);
			}
			return;
		}else{
			var imgs = document.querySelectorAll(".lazy-loading");
			var loadlazy = function(){
				if(!imgs.length)return;
				imgs = document.querySelectorAll(".lazy-loading");
				for(var z = 0, v = imgs.length; z<v; z++){
					if(imgs[z].classList.contains("lazy-loaded"))continue;
					var rect = imgs[z].getBoundingClientRect();
					var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
					var windowWidth = (window.innerWidth || document.documentElement.clientWidth);
					var visible = (rect.top >= 0 && rect.left >= 0 && rect.top <= windowHeight && rect.right <= windowWidth);
					if(visible){
						imgs[z].src = imgs[z].dataset.src;
						imgs[z].onload = onloadImg(imgs[z]);
					}
				}
			};
			window.onload = loadlazy;
			var events = ['transitionend', 'animationend', 'webkitAnimationEnd', 'scroll', 'resize'];
			for(var x = 0, c = events.length; x<c; x++){
				document.addEventListener(events[x], function(){ loadlazy() }, true);
			}
			document.addEventListener('click', function(){ throttle(function(){ loadlazy() }) }, true);
			return;
		}
	};
	execLazy(elems,elemsInd);
	document.addEventListener('DOMNodeInserted', function(){
		elems = document.querySelectorAll('.has--lazyload') || document.querySelectorAll(".lazy-loading");
		elemsInd = elems.length;
		if(!elemsInd)return;
		throttle(function(){ execLazy(elems, elemsInd) });
	}, true);
	document.addEventListener('DOMAttrModified', function(){
		elems = document.querySelectorAll('.has--lazyload') || document.querySelectorAll(".lazy-loading");
		elemsInd = elems.length;
		if(!elemsInd)return;
		throttle(function(){ execLazy(elems, elemsInd) });
	}, true);
})();