//c: country: 0:Euro, 1:USA, 2:Japan, 3:other - no tax
//v: volume: any number in lit
//o: original price
var cars = [{n:'Benz G65', o:217900, c:0, v:6}, {n:'Honda Jazz', o:19490, c:2, v:1.5}, {n:'Jeep wrangler', o:36995, c:1, v:3.6}, {n:'Chery QQ', o:6000, c:3, v:1}];

// id: 0: Benz G65, 1: Honda Jazz, 2: Jeep wrangler, 3: Chery QQ
function getCarPrice(id)
{	
	var country = cars[id].c, volume = cars[id].v, org = cars[id].o;
	var r = [[1, 1.2, 2], [0.75, 0.9, 1.5], [0.7, 0.8, 1.35], [0, 0, 0]][country][(volume>5&&2)||(volume>2&&1)||0];
	return (org + org*r + (org + org*r)*0.12)*47;
}

function main(){
	for (var i = 0; i < 4; i++) 
	{
		document.write(cars[i].n + ": " + getCarPrice(i));
		document.write('<br/>');
	}
}

main();
