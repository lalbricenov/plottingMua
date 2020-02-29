let solveCuadratica = function(a, b, c)
{
    // función que recibe los coeficientes a, b y c de una ecuación cuadrática y devuelve las soluciones reales en un array. Si el array es vacío
    // quiere decir que no hay soluciones reales.

    let sols = [];
    if(a != 0)
    {
        let D = b * b - 4 * a * c;
        if(D >= 0)
        {
            let x1 = (-b + Math.sqrt(D))/(2 * a);
            let x2 = (-b - Math.sqrt(D))/(2 * a);
            sols.push(x1);
            sols.push(x2);
        }
    }
    else
    {
        // Si es una ecuación de la forma bx + c = 0
        let x = -c/b;
        sols.push(x);
    }
    
    return sols;
}