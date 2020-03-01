'use strict'
let ecMovimiento = function(s0, v0, a, t0)
{
    let s = function(t)
    {
        return s0 + v0 * (t-t0) + a * Math.pow(t-t0, 2) / 2;
    }
    return s;
}

let createObject= function(f, xmin, xmax, step)
{
    let x = [];
    let y = [];
    for(let xVal = xmin; xVal <= xmax; xVal = xVal + step)
    {
        x.push(xVal);
        y.push(f(xVal));
    }
    return {x, y, type:'scatter'}
}

let isAtLeastOneNaN = function(vals)
{
    let ans = false;
    for(let val of vals)
    {
        ans = ans || isNaN(val);
    }
    return ans;
}
function Particle(s0, v0, t0, a){
    
    this.s0=s0;
    // console.log("en particle this", this);
    this.v0=v0;
    this.t0=t0;
    this.a=a;
    this.s=function(t)
    {
        // console.log("Hello")
        // console.log("En la función dentro de Particle: ", this)
        return this.s0 + this.v0 * (t-this.t0) + this.a * Math.pow(t-this.t0, 2) / 2;
    };
}
let plotPosicion = function()
{
    let s0 = parseFloat(document.getElementById("s0").value);
    let v0 = parseFloat(document.getElementById("v0").value);
    let t0 = parseFloat(document.getElementById("t0").value);
    let a = parseFloat(document.getElementById("acc").value);
    let s02 = parseFloat(document.getElementById("s02").value);
    let v02 = parseFloat(document.getElementById("v02").value);
    let t02 = parseFloat(document.getElementById("t02").value);
    let a2 = parseFloat(document.getElementById("acc2").value);
    let tMin = parseFloat(document.getElementById("tMin").value);
    let tMax = parseFloat(document.getElementById("tMax").value);
    // console.log("en plotPosicion",s0)
    
    if(isAtLeastOneNaN([s0,v0,t0,a,s02,v02,t02,a2]))
        alert("Ingrese valores numéricos válidos");
    else if(tMin >= tMax)
        alert("El tiempo mínimo debe ser menor al máximo");
    else{
        let particle1 = new Particle(s0, v0, t0, a);
        let particle2 = new Particle(s02, v02, t02, a2);
        let tiemposEncuentros = findEncuentros(particle1, particle2);
        let encuentros = [];
        for(let t of tiemposEncuentros)
        {
            // console.log("Tiempo", t);
            encuentros.push({t:t, s:particle1.s(t)});
        }
        fillTable(encuentros);
        // console.log(encuentros);
        // console.log(particle1)
        // console.log(particle2)
        let contenedor = document.getElementById('contenedorPlot');
        let step = (tMax -tMin)/100;
        // console.log(step);
        let layout = {
            title: 'Posición vs tiempo',
            xaxis: {
                title: 't(s)'
            },
            yaxis: {
                title: 'Posición(m)'
            },

            showlegend: false
        };
        // se debe ser cuidadoso con la palabra this, dado que depende del contexto. Si en global this se refiere a la ventana(window).
        // si es dentro de una función se refiere a lo que sea que haya llamado la función, por ejemplo si un objeto llamado gato tiene el método
        // meow se puede llamar así: gato.meow
        // en este caso si existe una palabra this dentro de meow, esta va a hacer referencia al gato.
        // Si esta función se usa por aparte, es decir, se crea una nueva variable y se le asigna el valor gato.meow:
        // let myFunction = gato.meow
        // en este caso la palabra this dentro de la función meow va a hacer referencia a la ventana (global)
        
        // la palabra bind liga la función al entorno deseado, en este caso se desea ligarla al objeto mismo al que pertenece. De esa manera cuando se use
        // la palabra this dentro de la función pos esta va a hacer referencia al objeto particle1.
        Plotly.newPlot(contenedor, [createObject(particle1.s.bind(particle1), tMin, tMax, step), createObject(particle2.s.bind(particle2), tMin, tMax, step)], layout, {scrollZoom:true});
        window.scrollTo(0, 0);
        // Plotly.newPlot( TESTER, [createObject(f, -4, 4, 0.1), {
        // x: [1, 2, 3, 4, 5],
        // y: [1, 2, 4, 8, 16] }], {
        // margin: { t: 0 } } );
    }
}

let findEncuentros = function(p1, p2)
{
    let c = p1.s0 - p2.s0 + p1.v0 * p1.t0 - p2.v0 * p2.t0 + p1.a * Math.pow(p1.t0, 2) / 2 - p2.a * Math.pow(p2.t0, 2) / 2;
    let b = p1.v0 - p2.v0 - p1.t0 * p1.a + p2.t0 * p2.a;
    let a = (p1.a - p2.a) / 2;
    return solveCuadratica(a, b, c);
}
let fillTable = function(points)
{
    
    // empty table
    let table = document.querySelector("#contenedorRes table");
    var tableRows = table.getElementsByTagName('tr');
    var rowCount = tableRows.length;

    for (let i = rowCount - 1; i > 0; i--) {
        table.querySelector("tbody").removeChild(tableRows[i]);
    }    
    // console.log(points)
    // Create an empty <tr> element and add it to the 1st position of the table:
    for(let i = 0; i < points.length; i++)
    {
        let row = table.insertRow(i+1);
        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        if(points.length == 0)
        {
            cell1.innerHTML = "Los cuerpos no se encuentran";
            break;
        }else if(isNaN(points[i].t))// el resultado es NaN cuando son exactamente iguales
        {
            cell1.innerHTML = "Tienen infinitos puntos en común";
            break;
        }else if(!isFinite(points[i].t))
        {
            cell1.innerHTML = "Los cuerpos no se encuentran";
            break;
        }else{

            cell1.innerHTML = points[i].t;
            cell2.innerHTML = points[i].s;
        }
    }
    document.getElementById("contenedorRes").style.display="block";
    document.getElementById("contenedorPlot").style.display="block";
    
}