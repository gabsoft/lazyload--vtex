# LazyLoad for VTEX non-reactJS
A lazyload for be use with VTEX websites.

## Instalation
```html
<script defer="defer" src="/arquivos/lazyload-for-vtex-min.js"></script>
```

## Usage
After import/call files on page, its initialize automatically.  

```html
<!-- Vitrine -->
<div class="your-class has--lazyload">
	<noscript>$product.GetImageTag(2)</noscript>
</div>
```

```html
<!-- Placeholder -->
<div class="your-class has--lazyload">
	<noscript><vtex:contentPlaceHolder id="Main-Banner" /></noscript>
</div>
```

```html
<!-- Images -->
<img data-src="IMAGE_URL" src="data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs=" class="lazy-loading">
```
You can use the following classes on image tag &#60;img&#62; and iframe tag &#60;iframe&#62; to custom style:

```css
.lazy-loading{ /* Uses when element is loading */ }
.lazy-loaded{ /* Uses when element is loaded */ }
```

## License
LazyLoad for VTEX is open-sourced software licensed under [MIT license](https://opensource.org/licenses/MIT).