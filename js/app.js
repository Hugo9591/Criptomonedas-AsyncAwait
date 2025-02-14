const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

//Crear un obj para llenar conforme el usuario vaya seleccionando los select
const objBusqueda ={
    moneda: '', 
    criptomoneda: ''
}

document.addEventListener('DOMContentLoaded', () =>{
    consultarCriptomendas();

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);

    monedaSelect.addEventListener('change', leerValor);
})

// //Creaar promise
// const obtenerCriptomedas = criptomonedas => new Promise( resolve => {
//     resolve(criptomonedas);
// })

async function consultarCriptomendas(){
    //const url = 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,JPY,EUR';
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        // const criptomonedas = await obtenerCriptomedas(resultado.Data)

        selectCriptomonedas(resultado.Data); 
    } catch (error) {
        console.log(error);
    }
}

//Rellenar el select con options
function selectCriptomonedas(criptomonedas){//[{},{}....]
    // console.log(criptomonedas)
    criptomonedas.forEach( cripto => {
        //console.log(cripto);//Muestra la monedas
        const { FullName, Name} = cripto.CoinInfo;

        //Crear las opciones del select
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;//Obtener el valor de los object para llenar el obj
    console.log(objBusqueda);
}

function submitFormulario(e){
    e.preventDefault();

    //Validar Select
    const {moneda, criptomoneda} = objBusqueda;

    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    // consultar la API con los resultados
    consultarAPI();
}

function mostrarAlerta(mensaje){

    const existeError = document.querySelector('.error');

    if(!existeError){

        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('error');

        divMensaje.textContent = mensaje;

        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
    
}

async function consultarAPI(){
    const {moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    //MOstrar spinner
    mostrarSpinner();

    try {
        const respuesta = await fetch(url);
        const cotizacion = await respuesta.json();

        mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);

    } catch (error) {
        console.log(error);
    }
}

function mostrarCotizacionHTML(cotizacion){

    //Antes de imprimir limpipar el HTML previo
    limpiarHTML();

    console.log(cotizacion);//Aparece mucha informacion pero no se va a utilizar toda

    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    const precio = document.createElement('P');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es:<span> ${PRICE} </span>`;

    const precioAlto = document.createElement('P');
    precioAlto.innerHTML = `<p>Precio mas alto del dia <span>${HIGHDAY}</span></p>`;

    const precioBajo = document.createElement('P');
    precioBajo.innerHTML = `<p>Precio mas bajo del dia <span>${LOWDAY}</span></p>`;

    const ultimasHoras = document.createElement('P');
    ultimasHoras.innerHTML = `<p>Precio ultimas 24 horas <span>${CHANGEPCT24HOUR}%</span></p>`;

    const ultimaActualizacion = document.createElement('P');
    ultimaActualizacion.innerHTML = `<p>Ultima actualizacion <span>${LASTUPDATE}</span></p>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHTML();

    const spinner = document.createElement('DIV');

    spinner.classList.add('spinner');
    spinner.innerHTML = `
                            <div class="bounce1"></div>
                            <div class="bounce2"></div>
                            <div class="bounce3"></div>`;

    resultado.appendChild(spinner);
}