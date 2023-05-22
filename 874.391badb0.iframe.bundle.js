/*! For license information please see 874.391badb0.iframe.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunkreact_gcolor_picker_2=self.webpackChunkreact_gcolor_picker_2||[]).push([[874],{"./node_modules/css-loader/dist/runtime/api.js":module=>{module.exports=function(cssWithMappingToString){var list=[];return list.toString=function toString(){return this.map((function(item){var content="",needLayer=void 0!==item[5];return item[4]&&(content+="@supports (".concat(item[4],") {")),item[2]&&(content+="@media ".concat(item[2]," {")),needLayer&&(content+="@layer".concat(item[5].length>0?" ".concat(item[5]):""," {")),content+=cssWithMappingToString(item),needLayer&&(content+="}"),item[2]&&(content+="}"),item[4]&&(content+="}"),content})).join("")},list.i=function i(modules,media,dedupe,supports,layer){"string"==typeof modules&&(modules=[[null,modules,void 0]]);var alreadyImportedModules={};if(dedupe)for(var k=0;k<this.length;k++){var id=this[k][0];null!=id&&(alreadyImportedModules[id]=!0)}for(var _k=0;_k<modules.length;_k++){var item=[].concat(modules[_k]);dedupe&&alreadyImportedModules[item[0]]||(void 0!==layer&&(void 0===item[5]||(item[1]="@layer".concat(item[5].length>0?" ".concat(item[5]):""," {").concat(item[1],"}")),item[5]=layer),media&&(item[2]?(item[1]="@media ".concat(item[2]," {").concat(item[1],"}"),item[2]=media):item[2]=media),supports&&(item[4]?(item[1]="@supports (".concat(item[4],") {").concat(item[1],"}"),item[4]=supports):item[4]="".concat(supports)),list.push(item))}},list}},"./node_modules/css-loader/dist/runtime/getUrl.js":module=>{module.exports=function(url,options){return options||(options={}),url?(url=String(url.__esModule?url.default:url),/^['"].*['"]$/.test(url)&&(url=url.slice(1,-1)),options.hash&&(url+=options.hash),/["'() \t\n]|(%20)/.test(url)||options.needQuotes?'"'.concat(url.replace(/"/g,'\\"').replace(/\n/g,"\\n"),'"'):url):url}},"./node_modules/css-loader/dist/runtime/sourceMaps.js":module=>{module.exports=function(item){var content=item[1],cssMapping=item[3];if(!cssMapping)return content;if("function"==typeof btoa){var base64=btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping)))),data="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64),sourceMapping="/*# ".concat(data," */");return[content].concat([sourceMapping]).join("\n")}return[content].join("\n")}},"./node_modules/react/cjs/react-jsx-runtime.production.min.js":(__unused_webpack_module,exports,__webpack_require__)=>{var f=__webpack_require__("./node_modules/react/index.js"),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};function q(c,a,g){var b,d={},e=null,h=null;for(b in void 0!==g&&(e=""+g),void 0!==a.key&&(e=""+a.key),void 0!==a.ref&&(h=a.ref),a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}exports.Fragment=l,exports.jsx=q,exports.jsxs=q},"./node_modules/react/jsx-runtime.js":(module,__unused_webpack_exports,__webpack_require__)=>{module.exports=__webpack_require__("./node_modules/react/cjs/react-jsx-runtime.production.min.js")},"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":module=>{var stylesInDOM=[];function getIndexByIdentifier(identifier){for(var result=-1,i=0;i<stylesInDOM.length;i++)if(stylesInDOM[i].identifier===identifier){result=i;break}return result}function modulesToDom(list,options){for(var idCountMap={},identifiers=[],i=0;i<list.length;i++){var item=list[i],id=options.base?item[0]+options.base:item[0],count=idCountMap[id]||0,identifier="".concat(id," ").concat(count);idCountMap[id]=count+1;var indexByIdentifier=getIndexByIdentifier(identifier),obj={css:item[1],media:item[2],sourceMap:item[3],supports:item[4],layer:item[5]};if(-1!==indexByIdentifier)stylesInDOM[indexByIdentifier].references++,stylesInDOM[indexByIdentifier].updater(obj);else{var updater=addElementStyle(obj,options);options.byIndex=i,stylesInDOM.splice(i,0,{identifier,updater,references:1})}identifiers.push(identifier)}return identifiers}function addElementStyle(obj,options){var api=options.domAPI(options);api.update(obj);return function updater(newObj){if(newObj){if(newObj.css===obj.css&&newObj.media===obj.media&&newObj.sourceMap===obj.sourceMap&&newObj.supports===obj.supports&&newObj.layer===obj.layer)return;api.update(obj=newObj)}else api.remove()}}module.exports=function(list,options){var lastIdentifiers=modulesToDom(list=list||[],options=options||{});return function update(newList){newList=newList||[];for(var i=0;i<lastIdentifiers.length;i++){var index=getIndexByIdentifier(lastIdentifiers[i]);stylesInDOM[index].references--}for(var newLastIdentifiers=modulesToDom(newList,options),_i=0;_i<lastIdentifiers.length;_i++){var _index=getIndexByIdentifier(lastIdentifiers[_i]);0===stylesInDOM[_index].references&&(stylesInDOM[_index].updater(),stylesInDOM.splice(_index,1))}lastIdentifiers=newLastIdentifiers}}},"./node_modules/style-loader/dist/runtime/insertBySelector.js":module=>{var memo={};module.exports=function insertBySelector(insert,style){var target=function getTarget(target){if(void 0===memo[target]){var styleTarget=document.querySelector(target);if(window.HTMLIFrameElement&&styleTarget instanceof window.HTMLIFrameElement)try{styleTarget=styleTarget.contentDocument.head}catch(e){styleTarget=null}memo[target]=styleTarget}return memo[target]}(insert);if(!target)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");target.appendChild(style)}},"./node_modules/style-loader/dist/runtime/insertStyleElement.js":module=>{module.exports=function insertStyleElement(options){var element=document.createElement("style");return options.setAttributes(element,options.attributes),options.insert(element,options.options),element}},"./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":(module,__unused_webpack_exports,__webpack_require__)=>{module.exports=function setAttributesWithoutAttributes(styleElement){var nonce=__webpack_require__.nc;nonce&&styleElement.setAttribute("nonce",nonce)}},"./node_modules/style-loader/dist/runtime/styleDomAPI.js":module=>{module.exports=function domAPI(options){if("undefined"==typeof document)return{update:function update(){},remove:function remove(){}};var styleElement=options.insertStyleElement(options);return{update:function update(obj){!function apply(styleElement,options,obj){var css="";obj.supports&&(css+="@supports (".concat(obj.supports,") {")),obj.media&&(css+="@media ".concat(obj.media," {"));var needLayer=void 0!==obj.layer;needLayer&&(css+="@layer".concat(obj.layer.length>0?" ".concat(obj.layer):""," {")),css+=obj.css,needLayer&&(css+="}"),obj.media&&(css+="}"),obj.supports&&(css+="}");var sourceMap=obj.sourceMap;sourceMap&&"undefined"!=typeof btoa&&(css+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))))," */")),options.styleTagTransform(css,styleElement,options.options)}(styleElement,options,obj)},remove:function remove(){!function removeStyleElement(styleElement){if(null===styleElement.parentNode)return!1;styleElement.parentNode.removeChild(styleElement)}(styleElement)}}}},"./node_modules/style-loader/dist/runtime/styleTagTransform.js":module=>{module.exports=function styleTagTransform(css,styleElement){if(styleElement.styleSheet)styleElement.styleSheet.cssText=css;else{for(;styleElement.firstChild;)styleElement.removeChild(styleElement.firstChild);styleElement.appendChild(document.createTextNode(css))}}},"./node_modules/tinycolor2/esm/tinycolor.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function _typeof(obj){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_typeof(obj)}__webpack_require__.d(__webpack_exports__,{Z:()=>tinycolor});var trimLeft=/^\s+/,trimRight=/\s+$/;function tinycolor(color,opts){if(opts=opts||{},(color=color||"")instanceof tinycolor)return color;if(!(this instanceof tinycolor))return new tinycolor(color,opts);var rgb=function inputToRGB(color){var rgb={r:0,g:0,b:0},a=1,s=null,v=null,l=null,ok=!1,format=!1;"string"==typeof color&&(color=function stringInputToObject(color){color=color.replace(trimLeft,"").replace(trimRight,"").toLowerCase();var match,named=!1;if(names[color])color=names[color],named=!0;else if("transparent"==color)return{r:0,g:0,b:0,a:0,format:"name"};if(match=matchers.rgb.exec(color))return{r:match[1],g:match[2],b:match[3]};if(match=matchers.rgba.exec(color))return{r:match[1],g:match[2],b:match[3],a:match[4]};if(match=matchers.hsl.exec(color))return{h:match[1],s:match[2],l:match[3]};if(match=matchers.hsla.exec(color))return{h:match[1],s:match[2],l:match[3],a:match[4]};if(match=matchers.hsv.exec(color))return{h:match[1],s:match[2],v:match[3]};if(match=matchers.hsva.exec(color))return{h:match[1],s:match[2],v:match[3],a:match[4]};if(match=matchers.hex8.exec(color))return{r:parseIntFromHex(match[1]),g:parseIntFromHex(match[2]),b:parseIntFromHex(match[3]),a:convertHexToDecimal(match[4]),format:named?"name":"hex8"};if(match=matchers.hex6.exec(color))return{r:parseIntFromHex(match[1]),g:parseIntFromHex(match[2]),b:parseIntFromHex(match[3]),format:named?"name":"hex"};if(match=matchers.hex4.exec(color))return{r:parseIntFromHex(match[1]+""+match[1]),g:parseIntFromHex(match[2]+""+match[2]),b:parseIntFromHex(match[3]+""+match[3]),a:convertHexToDecimal(match[4]+""+match[4]),format:named?"name":"hex8"};if(match=matchers.hex3.exec(color))return{r:parseIntFromHex(match[1]+""+match[1]),g:parseIntFromHex(match[2]+""+match[2]),b:parseIntFromHex(match[3]+""+match[3]),format:named?"name":"hex"};return!1}(color));"object"==_typeof(color)&&(isValidCSSUnit(color.r)&&isValidCSSUnit(color.g)&&isValidCSSUnit(color.b)?(rgb=function rgbToRgb(r,g,b){return{r:255*bound01(r,255),g:255*bound01(g,255),b:255*bound01(b,255)}}(color.r,color.g,color.b),ok=!0,format="%"===String(color.r).substr(-1)?"prgb":"rgb"):isValidCSSUnit(color.h)&&isValidCSSUnit(color.s)&&isValidCSSUnit(color.v)?(s=convertToPercentage(color.s),v=convertToPercentage(color.v),rgb=function hsvToRgb(h,s,v){h=6*bound01(h,360),s=bound01(s,100),v=bound01(v,100);var i=Math.floor(h),f=h-i,p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s),mod=i%6,r=[v,q,p,p,t,v][mod],g=[t,v,v,q,p,p][mod],b=[p,p,t,v,v,q][mod];return{r:255*r,g:255*g,b:255*b}}(color.h,s,v),ok=!0,format="hsv"):isValidCSSUnit(color.h)&&isValidCSSUnit(color.s)&&isValidCSSUnit(color.l)&&(s=convertToPercentage(color.s),l=convertToPercentage(color.l),rgb=function hslToRgb(h,s,l){var r,g,b;function hue2rgb(p,q,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?p+6*(q-p)*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p}if(h=bound01(h,360),s=bound01(s,100),l=bound01(l,100),0===s)r=g=b=l;else{var q=l<.5?l*(1+s):l+s-l*s,p=2*l-q;r=hue2rgb(p,q,h+1/3),g=hue2rgb(p,q,h),b=hue2rgb(p,q,h-1/3)}return{r:255*r,g:255*g,b:255*b}}(color.h,s,l),ok=!0,format="hsl"),color.hasOwnProperty("a")&&(a=color.a));return a=boundAlpha(a),{ok,format:color.format||format,r:Math.min(255,Math.max(rgb.r,0)),g:Math.min(255,Math.max(rgb.g,0)),b:Math.min(255,Math.max(rgb.b,0)),a}}(color);this._originalInput=color,this._r=rgb.r,this._g=rgb.g,this._b=rgb.b,this._a=rgb.a,this._roundA=Math.round(100*this._a)/100,this._format=opts.format||rgb.format,this._gradientType=opts.gradientType,this._r<1&&(this._r=Math.round(this._r)),this._g<1&&(this._g=Math.round(this._g)),this._b<1&&(this._b=Math.round(this._b)),this._ok=rgb.ok}function rgbToHsl(r,g,b){r=bound01(r,255),g=bound01(g,255),b=bound01(b,255);var h,s,max=Math.max(r,g,b),min=Math.min(r,g,b),l=(max+min)/2;if(max==min)h=s=0;else{var d=max-min;switch(s=l>.5?d/(2-max-min):d/(max+min),max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4}h/=6}return{h,s,l}}function rgbToHsv(r,g,b){r=bound01(r,255),g=bound01(g,255),b=bound01(b,255);var h,s,max=Math.max(r,g,b),min=Math.min(r,g,b),v=max,d=max-min;if(s=0===max?0:d/max,max==min)h=0;else{switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4}h/=6}return{h,s,v}}function rgbToHex(r,g,b,allow3Char){var hex=[pad2(Math.round(r).toString(16)),pad2(Math.round(g).toString(16)),pad2(Math.round(b).toString(16))];return allow3Char&&hex[0].charAt(0)==hex[0].charAt(1)&&hex[1].charAt(0)==hex[1].charAt(1)&&hex[2].charAt(0)==hex[2].charAt(1)?hex[0].charAt(0)+hex[1].charAt(0)+hex[2].charAt(0):hex.join("")}function rgbaToArgbHex(r,g,b,a){return[pad2(convertDecimalToHex(a)),pad2(Math.round(r).toString(16)),pad2(Math.round(g).toString(16)),pad2(Math.round(b).toString(16))].join("")}function _desaturate(color,amount){amount=0===amount?0:amount||10;var hsl=tinycolor(color).toHsl();return hsl.s-=amount/100,hsl.s=clamp01(hsl.s),tinycolor(hsl)}function _saturate(color,amount){amount=0===amount?0:amount||10;var hsl=tinycolor(color).toHsl();return hsl.s+=amount/100,hsl.s=clamp01(hsl.s),tinycolor(hsl)}function _greyscale(color){return tinycolor(color).desaturate(100)}function _lighten(color,amount){amount=0===amount?0:amount||10;var hsl=tinycolor(color).toHsl();return hsl.l+=amount/100,hsl.l=clamp01(hsl.l),tinycolor(hsl)}function _brighten(color,amount){amount=0===amount?0:amount||10;var rgb=tinycolor(color).toRgb();return rgb.r=Math.max(0,Math.min(255,rgb.r-Math.round(-amount/100*255))),rgb.g=Math.max(0,Math.min(255,rgb.g-Math.round(-amount/100*255))),rgb.b=Math.max(0,Math.min(255,rgb.b-Math.round(-amount/100*255))),tinycolor(rgb)}function _darken(color,amount){amount=0===amount?0:amount||10;var hsl=tinycolor(color).toHsl();return hsl.l-=amount/100,hsl.l=clamp01(hsl.l),tinycolor(hsl)}function _spin(color,amount){var hsl=tinycolor(color).toHsl(),hue=(hsl.h+amount)%360;return hsl.h=hue<0?360+hue:hue,tinycolor(hsl)}function _complement(color){var hsl=tinycolor(color).toHsl();return hsl.h=(hsl.h+180)%360,tinycolor(hsl)}function polyad(color,number){if(isNaN(number)||number<=0)throw new Error("Argument to polyad must be a positive number");for(var hsl=tinycolor(color).toHsl(),result=[tinycolor(color)],step=360/number,i=1;i<number;i++)result.push(tinycolor({h:(hsl.h+i*step)%360,s:hsl.s,l:hsl.l}));return result}function _splitcomplement(color){var hsl=tinycolor(color).toHsl(),h=hsl.h;return[tinycolor(color),tinycolor({h:(h+72)%360,s:hsl.s,l:hsl.l}),tinycolor({h:(h+216)%360,s:hsl.s,l:hsl.l})]}function _analogous(color,results,slices){results=results||6,slices=slices||30;var hsl=tinycolor(color).toHsl(),part=360/slices,ret=[tinycolor(color)];for(hsl.h=(hsl.h-(part*results>>1)+720)%360;--results;)hsl.h=(hsl.h+part)%360,ret.push(tinycolor(hsl));return ret}function _monochromatic(color,results){results=results||6;for(var hsv=tinycolor(color).toHsv(),h=hsv.h,s=hsv.s,v=hsv.v,ret=[],modification=1/results;results--;)ret.push(tinycolor({h,s,v})),v=(v+modification)%1;return ret}tinycolor.prototype={isDark:function isDark(){return this.getBrightness()<128},isLight:function isLight(){return!this.isDark()},isValid:function isValid(){return this._ok},getOriginalInput:function getOriginalInput(){return this._originalInput},getFormat:function getFormat(){return this._format},getAlpha:function getAlpha(){return this._a},getBrightness:function getBrightness(){var rgb=this.toRgb();return(299*rgb.r+587*rgb.g+114*rgb.b)/1e3},getLuminance:function getLuminance(){var RsRGB,GsRGB,BsRGB,rgb=this.toRgb();return RsRGB=rgb.r/255,GsRGB=rgb.g/255,BsRGB=rgb.b/255,.2126*(RsRGB<=.03928?RsRGB/12.92:Math.pow((RsRGB+.055)/1.055,2.4))+.7152*(GsRGB<=.03928?GsRGB/12.92:Math.pow((GsRGB+.055)/1.055,2.4))+.0722*(BsRGB<=.03928?BsRGB/12.92:Math.pow((BsRGB+.055)/1.055,2.4))},setAlpha:function setAlpha(value){return this._a=boundAlpha(value),this._roundA=Math.round(100*this._a)/100,this},toHsv:function toHsv(){var hsv=rgbToHsv(this._r,this._g,this._b);return{h:360*hsv.h,s:hsv.s,v:hsv.v,a:this._a}},toHsvString:function toHsvString(){var hsv=rgbToHsv(this._r,this._g,this._b),h=Math.round(360*hsv.h),s=Math.round(100*hsv.s),v=Math.round(100*hsv.v);return 1==this._a?"hsv("+h+", "+s+"%, "+v+"%)":"hsva("+h+", "+s+"%, "+v+"%, "+this._roundA+")"},toHsl:function toHsl(){var hsl=rgbToHsl(this._r,this._g,this._b);return{h:360*hsl.h,s:hsl.s,l:hsl.l,a:this._a}},toHslString:function toHslString(){var hsl=rgbToHsl(this._r,this._g,this._b),h=Math.round(360*hsl.h),s=Math.round(100*hsl.s),l=Math.round(100*hsl.l);return 1==this._a?"hsl("+h+", "+s+"%, "+l+"%)":"hsla("+h+", "+s+"%, "+l+"%, "+this._roundA+")"},toHex:function toHex(allow3Char){return rgbToHex(this._r,this._g,this._b,allow3Char)},toHexString:function toHexString(allow3Char){return"#"+this.toHex(allow3Char)},toHex8:function toHex8(allow4Char){return function rgbaToHex(r,g,b,a,allow4Char){var hex=[pad2(Math.round(r).toString(16)),pad2(Math.round(g).toString(16)),pad2(Math.round(b).toString(16)),pad2(convertDecimalToHex(a))];if(allow4Char&&hex[0].charAt(0)==hex[0].charAt(1)&&hex[1].charAt(0)==hex[1].charAt(1)&&hex[2].charAt(0)==hex[2].charAt(1)&&hex[3].charAt(0)==hex[3].charAt(1))return hex[0].charAt(0)+hex[1].charAt(0)+hex[2].charAt(0)+hex[3].charAt(0);return hex.join("")}(this._r,this._g,this._b,this._a,allow4Char)},toHex8String:function toHex8String(allow4Char){return"#"+this.toHex8(allow4Char)},toRgb:function toRgb(){return{r:Math.round(this._r),g:Math.round(this._g),b:Math.round(this._b),a:this._a}},toRgbString:function toRgbString(){return 1==this._a?"rgb("+Math.round(this._r)+", "+Math.round(this._g)+", "+Math.round(this._b)+")":"rgba("+Math.round(this._r)+", "+Math.round(this._g)+", "+Math.round(this._b)+", "+this._roundA+")"},toPercentageRgb:function toPercentageRgb(){return{r:Math.round(100*bound01(this._r,255))+"%",g:Math.round(100*bound01(this._g,255))+"%",b:Math.round(100*bound01(this._b,255))+"%",a:this._a}},toPercentageRgbString:function toPercentageRgbString(){return 1==this._a?"rgb("+Math.round(100*bound01(this._r,255))+"%, "+Math.round(100*bound01(this._g,255))+"%, "+Math.round(100*bound01(this._b,255))+"%)":"rgba("+Math.round(100*bound01(this._r,255))+"%, "+Math.round(100*bound01(this._g,255))+"%, "+Math.round(100*bound01(this._b,255))+"%, "+this._roundA+")"},toName:function toName(){return 0===this._a?"transparent":!(this._a<1)&&(hexNames[rgbToHex(this._r,this._g,this._b,!0)]||!1)},toFilter:function toFilter(secondColor){var hex8String="#"+rgbaToArgbHex(this._r,this._g,this._b,this._a),secondHex8String=hex8String,gradientType=this._gradientType?"GradientType = 1, ":"";if(secondColor){var s=tinycolor(secondColor);secondHex8String="#"+rgbaToArgbHex(s._r,s._g,s._b,s._a)}return"progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")"},toString:function toString(format){var formatSet=!!format;format=format||this._format;var formattedString=!1,hasAlpha=this._a<1&&this._a>=0;return formatSet||!hasAlpha||"hex"!==format&&"hex6"!==format&&"hex3"!==format&&"hex4"!==format&&"hex8"!==format&&"name"!==format?("rgb"===format&&(formattedString=this.toRgbString()),"prgb"===format&&(formattedString=this.toPercentageRgbString()),"hex"!==format&&"hex6"!==format||(formattedString=this.toHexString()),"hex3"===format&&(formattedString=this.toHexString(!0)),"hex4"===format&&(formattedString=this.toHex8String(!0)),"hex8"===format&&(formattedString=this.toHex8String()),"name"===format&&(formattedString=this.toName()),"hsl"===format&&(formattedString=this.toHslString()),"hsv"===format&&(formattedString=this.toHsvString()),formattedString||this.toHexString()):"name"===format&&0===this._a?this.toName():this.toRgbString()},clone:function clone(){return tinycolor(this.toString())},_applyModification:function _applyModification(fn,args){var color=fn.apply(null,[this].concat([].slice.call(args)));return this._r=color._r,this._g=color._g,this._b=color._b,this.setAlpha(color._a),this},lighten:function lighten(){return this._applyModification(_lighten,arguments)},brighten:function brighten(){return this._applyModification(_brighten,arguments)},darken:function darken(){return this._applyModification(_darken,arguments)},desaturate:function desaturate(){return this._applyModification(_desaturate,arguments)},saturate:function saturate(){return this._applyModification(_saturate,arguments)},greyscale:function greyscale(){return this._applyModification(_greyscale,arguments)},spin:function spin(){return this._applyModification(_spin,arguments)},_applyCombination:function _applyCombination(fn,args){return fn.apply(null,[this].concat([].slice.call(args)))},analogous:function analogous(){return this._applyCombination(_analogous,arguments)},complement:function complement(){return this._applyCombination(_complement,arguments)},monochromatic:function monochromatic(){return this._applyCombination(_monochromatic,arguments)},splitcomplement:function splitcomplement(){return this._applyCombination(_splitcomplement,arguments)},triad:function triad(){return this._applyCombination(polyad,[3])},tetrad:function tetrad(){return this._applyCombination(polyad,[4])}},tinycolor.fromRatio=function(color,opts){if("object"==_typeof(color)){var newColor={};for(var i in color)color.hasOwnProperty(i)&&(newColor[i]="a"===i?color[i]:convertToPercentage(color[i]));color=newColor}return tinycolor(color,opts)},tinycolor.equals=function(color1,color2){return!(!color1||!color2)&&tinycolor(color1).toRgbString()==tinycolor(color2).toRgbString()},tinycolor.random=function(){return tinycolor.fromRatio({r:Math.random(),g:Math.random(),b:Math.random()})},tinycolor.mix=function(color1,color2,amount){amount=0===amount?0:amount||50;var rgb1=tinycolor(color1).toRgb(),rgb2=tinycolor(color2).toRgb(),p=amount/100;return tinycolor({r:(rgb2.r-rgb1.r)*p+rgb1.r,g:(rgb2.g-rgb1.g)*p+rgb1.g,b:(rgb2.b-rgb1.b)*p+rgb1.b,a:(rgb2.a-rgb1.a)*p+rgb1.a})},tinycolor.readability=function(color1,color2){var c1=tinycolor(color1),c2=tinycolor(color2);return(Math.max(c1.getLuminance(),c2.getLuminance())+.05)/(Math.min(c1.getLuminance(),c2.getLuminance())+.05)},tinycolor.isReadable=function(color1,color2,wcag2){var wcag2Parms,out,readability=tinycolor.readability(color1,color2);switch(out=!1,(wcag2Parms=function validateWCAG2Parms(parms){var level,size;level=((parms=parms||{level:"AA",size:"small"}).level||"AA").toUpperCase(),size=(parms.size||"small").toLowerCase(),"AA"!==level&&"AAA"!==level&&(level="AA");"small"!==size&&"large"!==size&&(size="small");return{level,size}}(wcag2)).level+wcag2Parms.size){case"AAsmall":case"AAAlarge":out=readability>=4.5;break;case"AAlarge":out=readability>=3;break;case"AAAsmall":out=readability>=7}return out},tinycolor.mostReadable=function(baseColor,colorList,args){var readability,includeFallbackColors,level,size,bestColor=null,bestScore=0;includeFallbackColors=(args=args||{}).includeFallbackColors,level=args.level,size=args.size;for(var i=0;i<colorList.length;i++)(readability=tinycolor.readability(baseColor,colorList[i]))>bestScore&&(bestScore=readability,bestColor=tinycolor(colorList[i]));return tinycolor.isReadable(baseColor,bestColor,{level,size})||!includeFallbackColors?bestColor:(args.includeFallbackColors=!1,tinycolor.mostReadable(baseColor,["#fff","#000"],args))};var names=tinycolor.names={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",burntsienna:"ea7e5d",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"663399",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"},hexNames=tinycolor.hexNames=function flip(o){var flipped={};for(var i in o)o.hasOwnProperty(i)&&(flipped[o[i]]=i);return flipped}(names);function boundAlpha(a){return a=parseFloat(a),(isNaN(a)||a<0||a>1)&&(a=1),a}function bound01(n,max){(function isOnePointZero(n){return"string"==typeof n&&-1!=n.indexOf(".")&&1===parseFloat(n)})(n)&&(n="100%");var processPercent=function isPercentage(n){return"string"==typeof n&&-1!=n.indexOf("%")}(n);return n=Math.min(max,Math.max(0,parseFloat(n))),processPercent&&(n=parseInt(n*max,10)/100),Math.abs(n-max)<1e-6?1:n%max/parseFloat(max)}function clamp01(val){return Math.min(1,Math.max(0,val))}function parseIntFromHex(val){return parseInt(val,16)}function pad2(c){return 1==c.length?"0"+c:""+c}function convertToPercentage(n){return n<=1&&(n=100*n+"%"),n}function convertDecimalToHex(d){return Math.round(255*parseFloat(d)).toString(16)}function convertHexToDecimal(h){return parseIntFromHex(h)/255}var CSS_UNIT,PERMISSIVE_MATCH3,PERMISSIVE_MATCH4,matchers=(PERMISSIVE_MATCH3="[\\s|\\(]+("+(CSS_UNIT="(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)")+")[,|\\s]+("+CSS_UNIT+")[,|\\s]+("+CSS_UNIT+")\\s*\\)?",PERMISSIVE_MATCH4="[\\s|\\(]+("+CSS_UNIT+")[,|\\s]+("+CSS_UNIT+")[,|\\s]+("+CSS_UNIT+")[,|\\s]+("+CSS_UNIT+")\\s*\\)?",{CSS_UNIT:new RegExp(CSS_UNIT),rgb:new RegExp("rgb"+PERMISSIVE_MATCH3),rgba:new RegExp("rgba"+PERMISSIVE_MATCH4),hsl:new RegExp("hsl"+PERMISSIVE_MATCH3),hsla:new RegExp("hsla"+PERMISSIVE_MATCH4),hsv:new RegExp("hsv"+PERMISSIVE_MATCH3),hsva:new RegExp("hsva"+PERMISSIVE_MATCH4),hex3:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex4:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex8:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/});function isValidCSSUnit(color){return!!matchers.CSS_UNIT.exec(color)}}}]);