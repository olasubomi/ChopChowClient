(this.webpackJsonpchop_chow_sd=this.webpackJsonpchop_chow_sd||[]).push([[0],{33:function(e,t,a){e.exports=a(45)},38:function(e,t,a){},45:function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),r=a(7),o=a.n(r),c=(a(38),a(79)),i=a(80),h=a(78);class l extends n.Component{constructor(e){super(e),this.onTextFieldChange=e=>{if(e.target.value>20)return;this.setState({index:e.target.value});const t=[];t.push(1),t.push(1);for(var a=2;a<e.target.value;a++)t.push(t[a-2]+t[a-1]);const n=[];for(var s=0;s<t.length;s++){const e=[];for(var r=0;r<t[s];r++)e.push(1);n.push(e)}this.setState({data:n})},this.state={data:[]}}render(){return console.log(this.state.data),s.a.createElement("div",{style:{margin:"50px"}},s.a.createElement(i.a,{id:"readTime",className:"mb-2",type:"number",onChange:this.onTextFieldChange}),this.state.data&&this.state.data.map((e,t)=>s.a.createElement(c.a,{container:!0,spacing:1,key:t},e.map((e,t)=>s.a.createElement(c.a,{item:!0,xs:!1,key:t},s.a.createElement(h.a,{style:{background:"red"}},e))))))}}var u=l,d=(a(42),a(28));o.a.render(s.a.createElement(d.a,null,s.a.createElement(u,null)),document.getElementById("root"))}},[[33,1,2]]]);
//# sourceMappingURL=main.d9fa0808.chunk.js.map