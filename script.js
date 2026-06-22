//import { CreateMLCEngine, MLCEngine } from "https://esm.run/@mlc-ai/web-llm";
const TransTooloption=document.getElementById("translationOption");
const avaStatus=document.getElementById("avaStatus");
const avaStatusParent=document.getElementById("avaStatusParent");

const MaintainWindow=(function(){
state="Initial";
return function(){
	if(state==="Initial"){
	initwindow();
	state="Opened";
	avaStatus.querySelector("path")?.remove();
	avaStatus.className.baseVal="red";
	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttribute("d","M50 40 90 0Q100 0 100 10L60 50 100 90Q100 100 90 100L50 60 10 100Q0 100 0 90L40 50 0 10Q0 0 10 0")
	avaStatus.appendChild(path);
	translationOption.removeEventListener("pointerenter",firstInit);
	translationOption.addEventListener("pointerenter",(e)=>{
	avaStatusParent.classList.add("hover");
	translationOption.addEventListener("pointerleave",(e)=>{avaStatusParent.classList.remove("hover");},{once:true});
	})
	}else if(state==="Opened"){
	state="Closed";
	document.getElementById("basisDiv").classList.remove("aftertransition");
	document.getElementById("basisDiv").classList.remove("show");
	avaStatus.querySelector("path")?.remove();
	avaStatus.className.baseVal="green";
	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttribute("d","M90 60 20 100Q0 100 10 84L70 50 11 16Q0 0 20 0L90 40C103 53 103 47 90 60")
	avaStatus.appendChild(path);
	}else if(state==="Closed"){
	state="Opened";
	document.getElementById("basisDiv").classList.add("show");
	avaStatus.querySelector("path")?.remove();
	avaStatus.className.baseVal="red";
	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttribute("d","M50 40 90 0Q100 0 100 10L60 50 100 90Q100 100 90 100L50 60 10 100Q0 100 0 90L40 50 0 10Q0 0 10 0")
	avaStatus.appendChild(path);
	}
}
})();
translationOption.addEventListener("pointerenter",firstInit);

function backgroundResize(height){
skysvg.style.scale=`1 ${window.innerHeight*0.4/height}`
}
const skysvg=document.getElementById("skysvg");
const svgheight=skysvg.getBoundingClientRect().height;
backgroundResize(svgheight);
window.addEventListener("resize",(e)=>{backgroundResize(svgheight)});

async function firstInit(){
avaStatusParent.classList.add("hover");
const availability=await LanguageModel.availability({
	expectedOutputs: [
		{ type: "text", languages: ["en"] }
	]
});
	if(availability==='available'){
	avaStatus.querySelector("path")?.remove();
	avaStatus.className.baseVal="green";
	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttribute("d","M90 60 20 100Q0 100 10 84L70 50 11 16Q0 0 20 0L90 40C103 53 103 47 90 60")
	avaStatus.appendChild(path);
	translationOption.addEventListener("pointerleave",(e)=>{avaStatusParent.classList.remove("hover");},{once:true});
	translationOption.addEventListener("click",MaintainWindow);
	}//named function won't stack
	if(availability==='unavailable'){
	avaStatus.querySelector("path")?.remove();
	avaStatus.className.baseVal="red";
	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttribute("d","M50 40 90 0Q100 0 100 10L60 50 100 90Q100 100 90 100L50 60 10 100Q0 100 0 90L40 50 0 10Q0 0 10 0")
	avaStatus.appendChild(path);
	translationOption.addEventListener("pointerleave",(e)=>{avaStatusParent.classList.remove("hover");},{once:true});
	}
	if(availability==='downloading'||availability==='downloadable'){
	avaStatus.querySelector("path")?.remove();
	avaStatus.className.baseVal="orange";
	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttribute("d","M40 0 60 0 60 60 80 40Q90 40 90 50L50 86 10 50Q10 40 20 40L40 60M95 90Q100 95 95 100H5Q0 95 5 90")
	avaStatus.appendChild(path);
	if(document.getElementById("downloadPanel").className!=='show'){translationOption.addEventListener("click",HandleDownload);}
	translationOption.addEventListener("pointerleave",(e)=>{avaStatusParent.classList.remove("hover");},{once:true});
	}
}
const downloadPanel=document.getElementById("downloadPanel");
const downloadbar=document.getElementById("downloadbar");
async function HandleDownload(){
	downloadPanel.classList.add("show");
	const llmSession = await LanguageModel.create({
	 monitor(m) {
	 m.addEventListener('downloadprogress', (e) => {
	 downloadbar.style.width=Math.round(e.loaded*100)+'%'; 
	 }); 
	 }
	 });
llmSession.destroy();
downloadPanel.classList.remove("show");
}
function initwindow(){
const editor=document.getElementById("message");const translatediv=document.getElementById("translation");const tooltip=document.getElementById("tooltip");
const ifseparated=document.getElementById("IfSeparated");
const Translatebtn=document.getElementById("Translatebtn");const inputSentence=document.getElementById("inputSentence");
const translatonList=document.getElementById("translatonList");
const canvasSVG=document.getElementById("canvasSVG");
const polygon1=document.getElementById("pointerSVG1");
const TLcorner=document.getElementById("TLcorner");const RBcorner=document.getElementById("RBcorner");const cornerD=document.getElementById("cornerD");
let previouseSelected={start:0,end:0};
editor.addEventListener("dragstart",e=>{e.preventDefault();})
editor.addEventListener("click",(e)=>{setTimeout(()=>{if(document.activeElement===editor){checkselected(getselectionIndex())};},0);})

class MapwithPrevious extends Map{
keys(){
	const iterator=super.keys();
	let prev = null, curr = null;
	iterator.previous = () => prev;
	const supernext=iterator.next;
	iterator.next=function(){
		const res=supernext.call(this);
		prev=curr;
		if(!res.done){curr=res.value;}
		return res;
	};
	return iterator;
}
}
function getselectionIndex(){
	const selectionRange=window.getSelection().getRangeAt(0);
	const preselectionRange=selectionRange.cloneRange();
	preselectionRange.selectNodeContents(editor);
	preselectionRange.setEnd(selectionRange.startContainer,selectionRange.startOffset);
	const start=preselectionRange.toString().length;
	preselectionRange.setEnd(selectionRange.endContainer,selectionRange.endOffset)
	const end=preselectionRange.toString().length;
	console.log({start,end});
	previouseSelected={start,end};
	return {start,end};
}
function checkselected({start,end}){
if(end-start===1){
	const SelectRect=window.getSelection().getRangeAt(0).getBoundingClientRect()
	//const SepRect=ifseparated.getClientRects()[0];
	//if(end>start){renderSVG(polygon1,{x:SelectRect.left,y:SelectRect.top},{x:SelectRect.right,y:SelectRect.bottom},{x:SepRect.x,y:SepRect.y+SepRect.height})}else{
	//renderSVG(polygon1,{x:0,y:0},{x:0,y:0},{x:0,y:0});
	//}
	const Subedstring=tm_unit.encodedParag.substring(start,end);
	if(/^\$+$/.test(Subedstring)){
		ifseparated.IsSep=true;
		tooltipStatechange("select");
	}else{ifseparated.IsSep=false;
		tooltipStatechange("select");
	}
 }
}
/* function* IfsepstateChange(){
while(1){
	if(ifseparated.IsSep===false){
		ifseparated.IsSep=true;
		tm_unit.encodedParag=tm_unit.encodedParag.slice(0,start)+'$'+tm_unit.encodedParag.slice(end);
	}else{ifseparated.IsSep=false;
		tm_unit.encodedParag=tm_unit.encodedParag.slice(0,start)+editor.textContent.slice(start,end)+tm_unit.encodedParag.slice(end);
	}
	
}
} */
function OnEditorUpdate(records,observer){
	for (const record of records){
	 if(record.target.nodeType===3){
	 const newlength=record.target.length;
	 const newvalue=record.target.textContent;
	 const oldvalue=record.oldValue;
	 localStorage.setItem("EDITORPRAG",newvalue);
	 if(previouseSelected.end>previouseSelected.start){
	  tm_unit.encodedParag=tm_unit.encodedParag.slice(0,previouseSelected.start)+tm_unit.encodedParag.slice(previouseSelected.end);
	  console.log("-".concat(oldvalue.slice(previouseSelected.start,previouseSelected.end),'\n',tm_unit.encodedParag));
	 }
	 if(newlength>=tm_unit.encodedParag.length){
	  const diffvalue=newvalue.slice(previouseSelected.start,previouseSelected.start+newlength-tm_unit.encodedParag.length).replaceAll("$","/").replaceAll("。","$");
	  tm_unit.encodedParag=tm_unit.encodedParag.slice(0,previouseSelected.start).concat(diffvalue,tm_unit.encodedParag.slice(previouseSelected.start));
	  console.log("+".concat(diffvalue,'\n',tm_unit.encodedParag));
	  }else{
	  const diffvalue=oldvalue.slice(previouseSelected.start+newlength-tm_unit.encodedParag.length,previouseSelected.start);
	  tm_unit.encodedParag=tm_unit.encodedParag.slice(0,previouseSelected.start+newlength-tm_unit.encodedParag.length).concat(tm_unit.encodedParag.slice(previouseSelected.start));
	  console.log("-".concat(diffvalue,'\n',tm_unit.encodedParag));
	  }
	 }
	}
	
	const sentList=tm_unit.encodedParag.split("$");
	//if(modelinited)
	localStorage.setItem("ENCODEDPRAG",tm_unit.encodedParag);
	tm_unit.TMapUpd(sentList);
	tm_unit.CMapUpd(sentList);
	if(window.getSelection().anchorNode!==null){getselectionIndex();}
}
function UpdTranslate(translation){
translatediv.textContent=translation;
}
class TranslationMaintain{
	constructor(){
	 this.TMap=new MapwithPrevious();
	 this.CMap=new MapwithPrevious();
	 this.encodedParag='';
	}
	TMapUpd(sentList){
		for (const sentence of sentList){
			if(this.TMap.get(sentence)===undefined){
				let translation="translating...";
				this.TMap.set(sentence,translation);
				new Promise((resolve,reject)=>{
				requestTrans(sentence,resolve);
				}).then((v)=>{this.TMap.set(sentence,v);
				localStorage.setItem("TRANSLATION_OF:"+sentence,v);},e=>{})
			}
		}
	}
	CMapUpd(sentList){
		let Totallength=0;
		this.CMap.clear();
		for(const sentence of sentList){
			Totallength+=sentence.length+1;//Don't mess with it. every sentence requires to have its unique key in CMap, even if it's an empty string
			this.CMap.set(Totallength,sentence);
		} 
	}
	recoverData() {
		let FirstLaunch=true;
	for (let i = 0; i < localStorage.length; i++) {
		if(/^ENCODEDPRAG/.test(localStorage.key(i))===true){
			this.encodedParag=localStorage.getItem(localStorage.key(i));		
		}
		if(/^EDITORPRAG/.test(localStorage.key(i))===true){
			editor.childNodes[0].data=localStorage.getItem(localStorage.key(i));
			FirstLaunch=false;			
		}
		if(/^TRANSLATION_OF:/.test(localStorage.key(i))===true){
			this.TMap.set(localStorage.key(i).slice("TRANSLATION_OF:".length),localStorage.getItem(localStorage.key(i)));
		}
		}
	const sentList=this.encodedParag.split("$");
    this.TMapUpd(sentList);
	this.CMapUpd(sentList);
	return FirstLaunch;
}
	
}
class BasisDiv{
	constructor(){
	this.window=document.getElementById("basisDiv");
	}
	initDrag(dragElement){
	let isDragging = false;
	let startX, startY;
	let initialCanvasX, initialCanvasY;
	let initialSVGX,initialSVGY;
	dragElement.addEventListener("mousedown",(e)=>{
	e.preventDefault();
	isDragging = true;
	startX = e.clientX;
	startY = e.clientY;
	const transformMatrix = new DOMMatrix(getComputedStyle(this.window).transform);
	initialCanvasX = transformMatrix.m41; 
	initialCanvasY = transformMatrix.m42;
	initialSVGX=canvasSVG.viewBox.baseVal.x;
	initialSVGY=canvasSVG.viewBox.baseVal.y;
	document.addEventListener('mousemove', onMouseMove);
	document.addEventListener('mouseup', onMouseUp);
	})
	const onMouseMove=(e)=>{
	if (!isDragging) return;
	const deltaX = e.clientX - startX;
	const deltaY = e.clientY - startY;
	this.window.style.transform = `translate(${initialCanvasX + deltaX}px, ${initialCanvasY + deltaY}px)`;
	canvasSVG.setAttribute('viewBox', `${initialSVGX+deltaX} ${initialSVGY+deltaY} ${canvasSVG.viewBox.baseVal.width} ${canvasSVG.viewBox.baseVal.height}`)
	}
	const onMouseUp=()=>{
		if (!isDragging) return;

		isDragging = false;

		document.removeEventListener('mousemove', onMouseMove);
		document.removeEventListener('mouseup', onMouseUp);
	}
	}
	initScale(scaleelement){
		let isDragging = false;
		let startX, startY;
		let initialHeight, initialWidth;
		scaleelement.addEventListener("mousedown",(e)=>{
		e.preventDefault();
		isDragging = true;
		startX = e.clientX;
		startY = e.clientY;
		initialHeight = parseFloat(getComputedStyle(document.querySelector("#basisDiv")).height.match(/(.*)px/)[1]); 
		initialWidth = parseFloat(getComputedStyle(document.querySelector("#basisDiv")).width.match(/(.*)px/)[1]);
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
		})
		const onMouseMove=(e)=>{
		if (!isDragging) return;
		const deltaX = e.clientX - startX;
		const deltaY = e.clientY - startY;
		this.window.style.height = `${initialHeight + deltaY}px`;
		this.window.style.width = `${initialWidth + deltaX}px`;
		}
		const onMouseUp=()=>{
			if (!isDragging) return;

			isDragging = false;

			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);
		}
	}
}
function CoordstoCaret(e){
	let offset;
	if(document.caretPositionFromPoint){
		const Caret = document.caretPositionFromPoint(e.clientX, e.clientY);
		offset = Caret.offset;
	}else if(document.caretRangeFromPoint){ 
		const Caret = document.caretRangeFromPoint(e.clientX,e.clientY);
		offset = Caret.startOffset;
		}
		const sentenceIter=tm_unit.CMap.keys();
		let Iterobj=sentenceIter.next();let Sentence;
		while(Iterobj.done===false){
			if(Iterobj.value>offset){		
				break;//value will always be found before iter done, even if pointer moved out of last sentence.
			}
			Iterobj=sentenceIter.next();
		}

		Sentence=tm_unit.CMap.get(Iterobj.value);		
			
		if(tm_unit.encodedParag.slice(offset,offset+1)==="$"){renderSVGfromindex(offset,offset+1,"highlightSVG2");tooltipStatechange("hover_sep");}
		else{renderSVGfromindex(sentenceIter.previous(),Iterobj.value,"highlightSVG1");tooltipStatechange("hover");}
		UpdTranslate(tm_unit.TMap.get(Sentence));
		console.log(Sentence);

}
async function updateTransList(INPUTsentence){
 const TListInput=document.createElement('div');
 const TListItem=document.createElement('div');
 TListInput.className='TListInput';
 TListInput.textContent=INPUTsentence
 TListItem.className='TListItem';
 translatonList.appendChild(TListItem);
 TListItem.appendChild(TListInput);
 const textNode=document.createTextNode("Translating...");
 TListItem.appendChild(textNode);
 textNode.textContent=await requestTrans(INPUTsentence);
 
}
async function requestTrans(sentence,resolve_p){
	//const messages=[{role:"user",content:"translate this sentence into English in 3 different phrasing: "+sentence}];
	//const reply=await engine.chat.completions.create({messages,extra_body:{enable_thinking:false},})
	if(sentence===""){
		const reply="";
		resolve_p(reply);
		return reply;
	}else{
	const session = await LanguageModel.create({
	expectedOutputs: [
		{ type: "text", languages: ["en"] }
	]
	});
	const reply= await session.prompt([{role:"user",content:"translate this sentence into English in 3 different phrasing, output translated sentences only: "+sentence}])
	session.destroy();
	if(resolve_p!==undefined){resolve_p(reply);};
	return reply;
	}
}
function renderSVG(polygon,...points){
for (let i=0;i<points.length;i++){
	polygon.points[i].x=points[i].x;
	polygon.points[i].y=points[i].y;
}
}
function clearSVG(){
const previousHighlight=canvasSVG.querySelectorAll(".highlightSVG1");
previousHighlight.forEach(item=>item?.remove());
canvasSVG.querySelector(".highlightSVG2")?.remove();
if(document.activeElement!==editor){
tooltip.classList.remove("show");}
}
function renderSVGfromindex(start,end,svgclass){
const previousHighlight=canvasSVG.querySelectorAll(".highlightSVG1");
previousHighlight.forEach(item=>item?.remove());
canvasSVG.querySelector(".highlightSVG2")?.remove();
const range=document.createRange();
range.setStart(editor.childNodes[0],start);
const normalizedEnd=Math.min(editor.childNodes[0].length,end);
range.setEnd(editor.childNodes[0],normalizedEnd);
const rects=range.getClientRects();
for (const item of rects){
const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
highlight.setAttribute('class',svgclass);
highlight.setAttribute('style',`x: ${item.x};y: ${item.y};`);
//highlight.setAttribute('x',item.x);highlight.setAttribute('y',item.y+window.scrollY);
highlight.setAttribute('width',item.width);highlight.setAttribute('height',item.height);
canvasSVG.appendChild(highlight);
//highlight.addEventListener("mousemove",highlight.remove());
}
}
function swapselected({start,end}){
if(end-start>0){
	if(ifseparated.IsSep===false){
		ifseparated.IsSep=true;
		let i=0;let Sstring='';
		while(i<end-start){Sstring=Sstring.concat("$");i++;}
		tm_unit.encodedParag=tm_unit.encodedParag.slice(0,start)+Sstring+tm_unit.encodedParag.slice(end);
	}else{
		ifseparated.IsSep=false;
		tm_unit.encodedParag=tm_unit.encodedParag.slice(0,start)+editor.textContent.slice(start,end)+tm_unit.encodedParag.slice(end);
	}
	const sentList=tm_unit.encodedParag.split("$");
	localStorage.setItem("ENCODEDPRAG",tm_unit.encodedParag);
	tm_unit.TMapUpd(sentList);
	tm_unit.CMapUpd(sentList);
}
}
const tooltipStatechange= (function(){
let state="";
return function(Operation){
	switch(Operation){
	case "select":
	 state="select";
	 ifseparated.addEventListener("click",(e)=>{
		swapselected(previouseSelected);
				
		state="";
		//tooltip.childNodes[0].textContent="";
		tooltip.classList.remove("show");
		},{once:true});
	 document.body.addEventListener("click",(e)=>{
		state="";
		//tooltip.childNodes[0].textContent="";
		tooltip.classList.remove("show");
	 },{once:true,capture:true});//capture=true to jump over bubbling phase after last click	 
	 tooltip.classList.add("show");
	 ifseparated.style.display="inline flex";
	 tooltip.childNodes[0].textContent="Click this button to swap";
	 break;
	case "hover":
	 if(state==="hover"||state==="select"){break;}
	 if(state!=="hover"){state="hover";tooltip.classList.remove("show");}//tooltip.childNodes[0].textContent="";
	 break;
	case "hover_sep":
	 if(state==="hover_sep"||state==="select"){break;}
	 if(state!=="hover_sep"){state="hover_sep";tooltip.classList.add("show");ifseparated.style.display="none";tooltip.childNodes[0].textContent="It's a separator. Select to swap it.";}
	 break;
	}
}
})();
const initProgressCallback = (progress) => {
	translatediv.textContent="Model loading progress:"+JSON.stringify(progress);
 };
//let modelinited=false;let engine;
//CreateMLCEngine("Qwen3-0.6B-q0f32-MLC", { initProgressCallback }).then((v)=>{
	//engine=v;
	//modelinited=true;
	//const sentList=tm_unit.encodedParag.split("$");
	//tm_unit.TMapUpd(sentList);
	//editor.addEventListener("mousemove",CoordstoCaret)
	//Translatebtn.addEventListener("click",(e)=>{updateTransList(inputSentence.textContent);e.stopPropagation();})
	//});

//editor.addEventListener("mousemove",CoordstoCaret)//remember to comment out
const tm_unit=new TranslationMaintain();
//tm_unit.encodedParag=editor.textContent.replaceAll("$","/").replaceAll("。","$");
const FirstLaunch=tm_unit.recoverData();
//const ifseparateState=IfsepstateChange();
const resizeObserver=new ResizeObserver(entries=>{for(let entry of entries){
	if(editor.getClientRects()[0]!==undefined){
	const{top,left,width,height}=entry.target.getClientRects()[0];
		//const{width,height}=entry.contentRect;
		canvasSVG.setAttribute('viewBox', `${left} ${top} ${width} ${height}`);
		}
	}})
resizeObserver.observe(editor);

const observer=new MutationObserver((records,observer)=>{OnEditorUpdate(records,observer)});
observer.observe(editor, {subtree:true,characterDataOldValue:true,characterData:true});

if(FirstLaunch){
	editor.childNodes[0].data="这是一个以拖拽，点击流程节点图为主要操作形式的大语言模型对话查看器, 由于我之前在使用Google ai studio时发现它的对话分支和查看功能较为麻烦：无论在那一层分支对话，它们都只会一同并列在左侧栏里，难以确定想要的那个对话分支。每次切换对话操作都需要等待服务器的响应并定位到那个节点，思路很容易被打断。因此，我学习并开发了此工程,目的主要是希望在用户在学习复杂知识结构时操作查看大量的大模型对话能够更加方便快捷。"
}

//const sentList=tm_unit.encodedParag.split("$");
//tm_unit.TMapUpd(sentList);

editor.addEventListener("mousemove",CoordstoCaret)
editor.addEventListener("mouseleave",clearSVG)
Translatebtn.addEventListener("click",(e)=>{updateTransList(inputSentence.textContent);e.stopPropagation();})
TLcorner.addEventListener("pointerenter",(e)=>{cornerD.classList.add("hover"); TLcorner.addEventListener("pointerleave",(e)=>{cornerD.classList.remove("hover");},{once:true})})
basisDiv= new BasisDiv();
basisDiv.initDrag(TLcorner);
basisDiv.initScale(RBcorner);
basisDiv.window.addEventListener('transitionend',(e)=>{

	basisDiv.window.classList.add("aftertransition");
	const{top,left,width,height}=editor.getClientRects()[0];
	canvasSVG.setAttribute('viewBox', `${left} ${top} ${width} ${height}`);
})
basisDiv.window.classList.add("show");
}