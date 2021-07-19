// Variables y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul')



// Eventos
eventListener()
function eventListener(){
    document.addEventListener('DOMContentLoaded',preguntarPresupuesto)

    formulario.addEventListener('submit',agregarGasto)
}


// Classes
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto]
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total,gasto) =>total + gasto.cantidad, 0)
        this.restante = this.presupuesto - gastado;
        
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI{
    insertarPresupuesto(cantidad){
        // Extrayendo valor
        const {presupuesto, restante} = cantidad;

        // Agregar al HTML500
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje,tipo){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert');
        divMensaje.textContent= mensaje;

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
            
        }

        document.querySelector('.primario').insertBefore(divMensaje,formulario);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);

    }

    mostrarGastos(gastos){
        this.limpiarHTML();
        // iterar sobre los gastos
        gastos.forEach(gasto =>{
            const {nombre, cantidad, id} = gasto

            // Crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;
            
            // Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$${cantidad}</span>`;
            

            //Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn','btn-danger','borrar-gasto');
            btnBorrar.innerHTML = 'borrar &times'
            btnBorrar.onclick = () =>{
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar)

            // Agregar al html

            gastoListado.appendChild(nuevoGasto);

        })

    }

    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante')
        // Comprobar 25%
        if((presupuesto/4)> restante){
            restanteDiv.classList.remove('alert-success','alert-warning')
            restanteDiv.classList.add('alert-danger')
        }else if((presupuesto /2 ) > restante){
            restanteDiv.classList.remove('alert-success','alert-danger')
            restanteDiv.classList.add('alert-warning')
        }else{
            restanteDiv.classList.remove('alert-danger','alert-warning')
            restanteDiv.classList.add('alert-success');
        }


        // si el total es 0 o menor
        if(restante <= 0){
            ui.imprimirAlerta('El presupuesto se ha agotado','error')
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }

}
//Instanciar
const ui = new UI();
let presupuesto;

// Funciones

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('Cual es tu presupuesto?');
    
    if(presupuestoUsuario === '' || presupuestoUsuario === null ||isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestoUsuario)
    ui.insertarPresupuesto(presupuesto)
    // console.log(presupuesto)
}


function agregarGasto(e){
    e.preventDefault();
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios','error');
        return;
    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida','error');
        return;
    }

    // Generar un objeto con el gasto
    const gasto = {nombre, cantidad, id: Date.now()}

    presupuesto.nuevoGasto(gasto);

    ui.imprimirAlerta('Gasto agregado Correctamente');

    // imprimir gasto
    const { gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);


    formulario.reset();
}


function eliminarGasto(id){
    // Elimina del Objeto
   presupuesto.eliminarGasto(id);

   // Eliminar los gastos del HTML
   const {gastos,restante} = presupuesto;
   ui.mostrarGastos(gastos);

   ui.actualizarRestante(restante);

   ui.comprobarPresupuesto(presupuesto);
}