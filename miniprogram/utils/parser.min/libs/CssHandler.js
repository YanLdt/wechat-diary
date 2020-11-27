function _classCallCheck(t,s){if(!(t instanceof s))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function t(t,s){for(var i=0;i<s.length;i++){var e=s[i];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(t,e.key,e)}}return function(s,i,e){return i&&t(s.prototype,i),e&&t(s,e),s}}(),cfg=require("./config.js"),isLetter=function(t){return t>="a"&&t<="z"||t>="A"&&t<="Z"},CssHandler=function(){function t(s){_classCallCheck(this,t);var i=Object.assign({},cfg.userAgentStyles);for(var e in s)i[e]=(i[e]?i[e]+";":"")+s[e];this.styles=i}return _createClass(t,[{key:"getStyle",value:function(t){this.styles=new CssParser(t,this.styles).parse()}},{key:"match",value:function(t,s){var i,e=(i=this.styles[t])?i+";":"";if(s.class)for(var a,h=s.class.split(" "),n=0;a=h[n];n++)(i=this.styles["."+a])&&(e+=i+";");return(i=this.styles["#"+s.id])&&(e+=i+";"),e}}]),t}();module.exports=CssHandler;var CssParser=function(){function t(s,i){_classCallCheck(this,t),this.data=s,this.floor=0,this.i=0,this.list=[],this.res=i,this.state=this.Space}return _createClass(t,[{key:"parse",value:function(){for(var t;t=this.data[this.i];this.i++)this.state(t);return this.res}},{key:"section",value:function(){return this.data.substring(this.start,this.i)}},{key:"Space",value:function(t){"."==t||"#"==t||isLetter(t)?(this.start=this.i,this.state=this.Name):"/"==t&&"*"==this.data[this.i+1]?this.Comment():cfg.blankChar[t]||";"==t||(this.state=this.Ignore)}},{key:"Comment",value:function(){this.i=this.data.indexOf("*/",this.i)+1,this.i||(this.i=this.data.length),this.state=this.Space}},{key:"Ignore",value:function(t){"{"==t?this.floor++:"}"!=t||--this.floor||(this.state=this.Space)}},{key:"Name",value:function(t){cfg.blankChar[t]?(this.list.push(this.section()),this.state=this.NameSpace):"{"==t?(this.list.push(this.section()),this.Content()):","==t?(this.list.push(this.section()),this.Comma()):!isLetter(t)&&(t<"0"||t>"9")&&"-"!=t&&"_"!=t&&(this.state=this.Ignore)}},{key:"NameSpace",value:function(t){"{"==t?this.Content():","==t?this.Comma():cfg.blankChar[t]||(this.state=this.Ignore)}},{key:"Comma",value:function(){for(;cfg.blankChar[this.data[++this.i]];);"{"==this.data[this.i]?this.Content():(this.start=this.i--,this.state=this.Name)}},{key:"Content",value:function(){this.start=++this.i,-1==(this.i=this.data.indexOf("}",this.i))&&(this.i=this.data.length);for(var t,s=this.section(),i=0;t=this.list[i++];)this.res[t]?this.res[t]+=";"+s:this.res[t]=s;this.list=[],this.state=this.Space}}]),t}();