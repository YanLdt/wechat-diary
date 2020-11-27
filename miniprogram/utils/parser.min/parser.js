// 小程序富文本插件 https://github.com/jin-yufeng/Parser
function hash(t){for(var e=t.length,i=5381;e--;)i+=(i<<5)+t.charCodeAt(e);return i}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},cache={},Parser=require("./libs/MpHtmlParser.js"),fs=wx.getFileSystemManager&&wx.getFileSystemManager(),dom;Component({options:{pureDataPattern:/^[acdgtu]|W/},properties:{html:{type:null,observer:function(t){this._refresh?this._refresh=!1:this.setContent(t,!1,!0)}},autopause:{type:Boolean,value:!0},autoscroll:Boolean,autosetTitle:{type:Boolean,value:!0},compress:Number,domain:String,lazyLoad:Boolean,selectable:Boolean,tagStyle:Object,showWithAnimation:Boolean,useAnchor:Boolean,useCache:Boolean},relations:{"../parser-group/parser-group":{type:"ancestor"}},created:function(){this.imgList=[],this.imgList.setItem=function(t,e){var i=this;if(t&&e){if(0==e.indexOf("http")&&this.includes(e)){for(var r,n="",a=0;(r=e[a])&&("/"!=r||"/"==e[a-1]||"/"==e[a+1]);a++)n+=Math.random()>.5?r.toUpperCase():r;return n+=e.substr(a),this[t]=n}if(this[t]=e,e.includes("data:image")){var o=e.match(/data:image\/(\S+?);(\S+?),(.+)/);if(!o)return;var s=wx.env.USER_DATA_PATH+"/"+Date.now()+"."+o[1];fs&&fs.writeFile({filePath:s,data:o[3],encoding:o[2],success:function(){return i[t]=s}})}}},this.imgList.each=function(t){for(var e=0,i=this.length;e<i;e++)this.setItem(e,t(this[e],e,this))},dom&&(this.document=new dom(this))},detached:function(){this.imgList.each(function(t){t&&t.includes(wx.env.USER_DATA_PATH)&&fs&&fs.unlink({filePath:t})}),clearInterval(this._timer)},methods:{navigateTo:function(t){var e=this;if(!this.data.useAnchor)return t.fail&&t.fail({errMsg:"Anchor is disabled"});this.createSelectorQuery().select(".top"+(t.id?">>>#"+t.id:"")).boundingClientRect().selectViewport().scrollOffset().exec(function(i){if(!i[0])return e.group?e.group.navigateTo(e.i,t):t.fail&&t.fail({errMsg:"Label not found"});t.scrollTop=i[1].scrollTop+i[0].top+(t.offset||0),wx.pageScrollTo(t)})},getText:function(){for(var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.data.html,i="",r=0;t=e[r++];)if("text"==t.type)i+=t.text.replace(/&nbsp;/g," ").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&");else if("br"==t.type)i+="\n";else{var n="p"==t.name||"div"==t.name||"tr"==t.name||"li"==t.name||"h"==t.name[0]&&t.name[1]>"0"&&t.name[1]<"7";n&&i&&"\n"!=i[i.length-1]&&(i+="\n"),t.children&&(i+=this.getText(t.children)),n&&"\n"!=i[i.length-1]?i+="\n":"td"!=t.name&&"th"!=t.name||(i+="\t")}return i},getVideoContext:function(t){if(!t)return this.videoContexts;for(var e=this.videoContexts.length;e--;)if(this.videoContexts[e].id==t)return this.videoContexts[e]},setContent:function(t,e,i){var r=this,n={};if(t)if("string"==typeof t){var a=new Parser(t,this.data);if(this.data.useCache){var o=hash(t);cache[o]?n.html=cache[o]:(n.html=a.parse(),cache[o]=n.html)}else n.html=a.parse();this._refresh=!0,this.triggerEvent("parse",n.html)}else if(t.constructor==Array){if(t.length&&"Parser"!=t[0].PoweredBy){var s=new Parser("",this.data);!function t(e){for(var i,r=0;i=e[r];r++)if("text"!=i.type){i.attrs=i.attrs||{};for(var n in i.attrs)"string"!=typeof i.attrs[n]&&(i.attrs[n]=i.attrs[n].toString());s.matchAttr(i),i.children&&(s.STACK.push(i),t(i.children),s.popNode(s.STACK.pop()))}}(t),n.html=t}i||(n.html=t)}else{if("object"!=(void 0===t?"undefined":_typeof(t))||!t.nodes)return console.warn("错误的 html 类型："+(void 0===t?"undefined":_typeof(t)));n.html=t.nodes,console.warn("错误的 html 类型：object 类型已废弃")}else{if(i||e)return;n.html=""}e?(this._refresh=!0,n.html=(this.data.html||[]).concat(n.html)):this.data.showWithAnimation&&(n.showAm="animation: show .5s"),(n.html||n.showAm)&&this.setData(n),this.data.html.length&&this.data.html[0].title&&this.data.autosetTitle&&wx.setNavigationBarTitle({title:this.data.html[0].title}),this.imgList.length=0,this.videoContexts=[];for(var h,l=this.selectAllComponents(".top,.top>>>._node"),c=0;h=l[c++];){h.top=this;for(var f,m=0;f=h.data.nodes[m++];)if(!f.c)if("img"==f.name)this.imgList.setItem(f.attrs.i,f.attrs.src);else if("video"==f.name||"audio"==f.name){var d;d="video"==f.name?wx.createVideoContext(f.attrs.id,h):h.selectComponent("#"+f.attrs.id),d&&(d.id=f.attrs.id,this.videoContexts.push(d))}}(wx.nextTick||setTimeout)(function(){return r.triggerEvent("load")},50);var u;clearInterval(this._timer),this._timer=setInterval(function(){r.createSelectorQuery().select(".top").boundingClientRect(function(t){r.rect=t,t.height==u&&(r.triggerEvent("ready",t),clearInterval(r._timer)),u=t.height}).exec()},350)}}});