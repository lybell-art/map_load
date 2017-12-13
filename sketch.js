var broadcast;
var field;
function setup()
{
	createCanvas(windowWidth,windowHeight);
	broadcast=new BROADCAST();
	field=new FIELD();
	field.loadMap(1,1);
}
function draw()
{
	var i,j;
	background(255);
	broadcast.renew();
	field.draw();
}
function mousePressed()
{
	broadcast.isMousePress=true;
}

function CELL(i,j,kind,who)
{
	/**
	 *
	 * @var {object} index	각 셀의 인덱스 no.
 	 * @var {float} x	셀 중심의 x좌표
	 * @var {float} y	셀 중심의 y좌표
	 * @var {float} r	셀의 반지름
	 * @var {int} kind	셀의 타입
				0:빈 공간
				1:이동 가능 셀
				2:이동 불가 셀
				3:베이스
				4:서브베이스
				5:벽
	 * @var {int} who	셀의 진영
				1:플레이어/1P
				2:상대/2P
				0:중립
				-1:칠할 수 없음
	 *
	 */
	this.index={i:i,j:j};
	this.x=45*(1.5*this.index.j+1);
	this.y=45*cos(PI/6)*(2*this.index.i+2-this.index.j%2);
	this.kind=kind;
	this.who=who;
	this.r=30;
	if(this.kind==3) this.r=40;
	this.switch=false;
}
CELL.prototype.draw=function()
{
	var pos=createVector(this.x,this.y);
	var edge=createVector(this.r,0);
	var p=createVector();
	if(this.switch) fill("#ffff00");
	else fill("#555555");
	beginShape();
	for(var i=0;i<6;i++)
	{
		p=p5.Vector.add(edge,pos);
		vertex(p.x,p.y);
		edge.rotate(PI/3);
	}
	endShape(CLOSE);
}
CELL.prototype.isMouseOn=function()
{
	var mousePos=createVector(mouseX-this.x,mouseY-this.y);
	var edge=createVector(this.r,0);
	var theta=0;
	for(var i=0;i<6;i++)
	{
		var v1=p5.Vector.sub(edge,mousePos);
		edge.rotate(PI/3);
		var v2=p5.Vector.sub(edge,mousePos);
		theta+=v1.angleBetween(v2);
	}
	return abs(theta-TWO_PI)<0.00001;
}
CELL.prototype.clicked=function()
{
	if(this.isMouseOn())
	{
		var res;
		const NO_MOVE=0;
		const MOVEABLE=1;
		const FILLER=2;
		switch(this.kind)
		{
			case 1:res=MOVEABLE; break;
			case 3:
			case 4:res=FILLER; break;
			default:res=NO_MOVE;
		}
		return {index:this.index, code:res};
	}
}

function FIELD()
{
	this.cells=[];
	this.width=0;
	this.height=0;
}
FIELD.prototype.loadMap=function(world, stage)
{
	var location="map/"+world+"-"+stage+".csv";
	var rawData=loadTable(location, "csv");
	var cellData;
	var kind,who;
	this.width=rawData.column.length;
	this.height=rawData.row.length);
	console.log(location);
	console.log(rawData);
	console.log(this.width,this.height);
	for(var i=0;i<this.height;i++)
	{
		this.cells[i]=[];
		for(var j=0;j<this.width;j++)
		{
			cellData=this.parse(rawData.getString(i,j));
			this.cells[i][j]=new CELL(i,j,cellData.kind,cellData.who);
		}
	}
}
FIELD.prototype.draw=function()
{
	for(var i=0;i<this.width;i++)
	{
		for(var j=0;j<this.height;j++)
		{
			this.cells[i][j].draw();
		}
	}
}
FIELD.prototype.parse=function(rawStr)
{
	var res={kind:null, who:null};
	res.kind=int(rawStr);
	res.who=rawStr.charAt(strData.length-1);
	switch(res.who)
	{
		case 'p':res.who=1; break;
		case 'e':res.who=2; break;
		case 'o':res.who=0; break;
		case 'x':res.who=-1; break;
	}
	return res;
}


function BROADCAST()
{
	this.isMousePress=false;
	this.wasMousePress=false;
}
BROADCAST.prototype.renew=function()
{
	if(this.wasMousePress)
	{
		this.isMousePress=false;
		this.wasMousePress=false;
	}
	else if(this.isMousePress) this.wasMousePress=true;
}
