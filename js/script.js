import { patrones } from './regexes.js';

// Objeto para almacenar datos
const data = {
    carrera: "", 
    plan: "",
    historial: "",
    materiasDetectadas: [],
    materiasAprobadas: [],
    planData: null,
    estrategias: [],
    currentStrategy: {
        nombre: "",
        cuatrimestres: []
    }
};

// Referencias a elementos del DOM
const elements = {
    mainSection: document.getElementById('main-section'),
    progressSection: document.getElementById('progress-section'),
    strategySection: document.getElementById('strategy-section'),
    newPlanSection: document.getElementById('new-plan-section'),
    planWarning: document.getElementById('plan-warning'),
    detectedInfo: document.getElementById('detected-info'),
    detectedCarrera: document.getElementById('detected-carrera'),
    detectedPlan: document.getElementById('detected-plan'),
    detectedMaterias: document.getElementById('detected-materias'),
    newCarreraName: document.getElementById('new-carrera-name'),
    newPlanName: document.getElementById('new-plan-name'),
    newMateriasCount: document.getElementById('new-materias-count'),
    progressContainer: document.getElementById('progress-container'),
    strategyContainer: document.getElementById('strategy-container'),
    materiasContainer: document.getElementById('materias-container'),
    availableSubjects: document.getElementById('available-subjects'),
    savedStrategies: document.getElementById('saved-strategies'),
    historialText: document.getElementById('historial'),
    procesarBtn: document.getElementById('procesar-btn'),
    addPlanBtn: document.getElementById('add-plan-btn'),
    planificarBtn: document.getElementById('planificar-btn'),
    newPlanBtn: document.getElementById('new-plan-btn'),
    addPeriodBtn: document.getElementById('add-period-btn'),
    saveStrategyBtn: document.getElementById('save-strategy-btn'),
    exportStrategyBtn: document.getElementById('export-strategy-btn'),
    addMateriaBtn: document.getElementById('add-materia-btn'),
    saveNewPlanBtn: document.getElementById('save-new-plan-btn'),
    cancelPlanBtn: document.getElementById('cancel-plan-btn'),
    strategyName: document.getElementById('strategy-name')
};

// Planes de estudio (simulando planes.json)
let planesData = {
    "planes": [
        {
            "carrera": "Ingeniería en Computación",
            "plan": "2013",
            "materias": [
                {
                    "nombre": "Algoritmos y Programación I",
                    "codigo": "1235",
                    "anio": 1,
                    "periodos_dictado": ["1C", "2C"],
                    "carga_horaria": 6,
                    "correlativas": {
                        "cursada": [],
                        "aprobadas": []
                    }
                },
                {
                    "nombre": "Algoritmos y Programación II",
                    "codigo": "1236",
                    "anio": 1,
                    "periodos_dictado": ["2C"],
                    "carga_horaria": 6,
                    "correlativas": {
                        "cursada": ["Algoritmos y Programación I"],
                        "aprobadas": []
                    }
                },
                {
                    "nombre": "Análisis Matemático I",
                    "codigo": "1265",
                    "anio": 1,
                    "periodos_dictado": ["1C", "2C"],
                    "carga_horaria": 8,
                    "correlativas": {
                        "cursada": [],
                        "aprobadas": []
                    }
                },
                {
                    "nombre": "Análisis Matemático II",
                    "codigo": "941",
                    "anio": 2,
                    "periodos_dictado": ["1C"],
                    "carga_horaria": 8,
                    "correlativas": {
                        "cursada": ["Análisis Matemático I"],
                        "aprobadas": []
                    }
                },
                {
                    "nombre": "Estructura de Datos",
                    "codigo": "1237",
                    "anio": 2,
                    "periodos_dictado": ["1C"],
                    "carga_horaria": 6,
                    "correlativas": {
                        "cursada": ["Algoritmos y Programación II"],
                        "aprobadas": ["Análisis Matemático I"]
                    }
                }
            ]
        }
    ]
};

// Cargar planes desde localStorage si existen
function cargarPlanes() {
    const planesGuardados = localStorage.getItem('planesData');
    if (planesGuardados) {
        planesData = JSON.parse(planesGuardados);
    }
}

// Guardar planes en localStorage
function guardarPlanes() {
    localStorage.setItem('planesData', JSON.stringify(planesData));
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Cargar planes
    cargarPlanes();
    
    // Event Listeners
    elements.procesarBtn.addEventListener('click', procesarHistorial);
    elements.addPlanBtn.addEventListener('click', mostrarNuevoPlan);
    elements.planificarBtn.addEventListener('click', mostrarPlanificador);
    elements.newPlanBtn.addEventListener('click', () => {
        elements.progressSection.classList.add('hidden');
        elements.mainSection.classList.remove('hidden');
        elements.historialText.value = "";
        elements.detectedInfo.classList.add('hidden');
    });
    elements.addPeriodBtn.addEventListener('click', agregarCuatrimestre);
    elements.saveStrategyBtn.addEventListener('click', guardarEstrategia);
    elements.exportStrategyBtn.addEventListener('click', exportarEstrategia);
    elements.addMateriaBtn.addEventListener('click', agregarMateriaNuevoPlan);
    elements.saveNewPlanBtn.addEventListener('click', guardarNuevoPlan);
    elements.cancelPlanBtn.addEventListener('click', () => {
        elements.newPlanSection.classList.add('hidden');
        elements.mainSection.classList.remove('hidden');
    });
    
    // Tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
            
            if (tab.dataset.tab === 'guardadas') {
                mostrarEstrategiasGuardadas();
            }
        });
    });
});

// Función para procesar el historial académico
function procesarHistorial() {
    data.historial = elements.historialText.value;
    
    if (!data.historial) {
        alert("Por favor, pega tu historial académico");
        return;
    }
    
    // Extraer carrera y plan del historial
    extraerCarreraYPlan();

    // Extraer campos
    extraerCamposHistorial();
    
    // Procesar materias
    procesarMateriasHistorial();
    
    // Mostrar información detectada
    elements.detectedCarrera.textContent = data.carrera;
    elements.detectedPlan.textContent = data.plan;
    elements.detectedMaterias.textContent = data.materiasDetectadas.length;
    elements.detectedInfo.classList.remove('hidden');
    
    // Buscar plan en los datos
    const planEncontrado = planesData.planes.find(p => 
        p.carrera === data.carrera && p.plan === data.plan
    );
    
    if (planEncontrado) {
        elements.planWarning.classList.add('hidden');
        data.planData = planEncontrado;
        mostrarProgreso();
        elements.progressSection.classList.remove('hidden');
    } else {
        elements.planWarning.classList.remove('hidden');
    }
}

// Función para extraer carrera y plan del historial
function extraerCarreraYPlan() {
    //carrera
    const carreraMatch = data.historial.match(patrones.carrera);
    if (carreraMatch) {
        data.carrera = carreraMatch[1];
        console.log("carrera detectada:\n" + data.carrera);
    }else {
        console.log("No se pudo detectar la carrera");
        data.carrera = "Carrera no detectada";
    }
    
    //plan
    const planMatch = data.historial.match(patrones.plan); // Queda por testear nuevamente el plan viejo, a ver si lo detecta
    if (planMatch) {
        data.plan = planMatch[1];
        console.log("plan detectado:\n" + data.plan);
    }else {
        console.log("No se pudo detectar el plan de estudios");
        data.plan = "Plan no detectado";            
    }
}

function extraerCamposHistorial() {
    const camposMatch = data.historial.match(patrones.campos);
    if (camposMatch) {
        const campos = camposMatch[0].trim().split('\t').map(c => c.trim());
        data.campos = campos;
        console.log("Campos extraídos:", data.campos);
    } else {
        console.warn("No se encontraron campos en el historial");
        data.campos = [];
    }
}

// Función para procesar las materias del historial
function procesarMateriasHistorial() {
    const materiasMatches = data.historial.matchAll(patrones.materias);
    console.log("Materias detectadas:", Array.from(materiasMatches));
    //longitud
    if (materiasMatches) { // /Materia\s+(\d+)/gm regex por agregar para detectar año de materia
        data.materiasDetectadas = Array.from(materiasMatches).map(match => {
            const nombre = match[1].trim();
            const codigo = match[2]
            console.log()
            console.log("Materias detectadas:", match[4]);
            return {
                nombre: nombre,
                codigo: codigo,
                anio: materiasMatches[3], //data.campos[2], 
                periodos_dictado: ["1C"], 
                carga_horaria: 6, 
                correlativas: {
                    cursada: [],
                    aprobadas: []
                }
            };
        });
        console.log("Materias detectadas:", data.materiasDetectadas);
    }
}

// Función para mostrar el progreso académico
function mostrarProgreso() {
    elements.progressContainer.innerHTML = '';
    
    // Agrupar materias por año
    const materiasPorAnio = {};
    data.planData.materias.forEach(materia => {
        if (!materiasPorAnio[materia.anio]) {
            materiasPorAnio[materia.anio] = [];
        }
        materiasPorAnio[materia.anio].push(materia);
    });
    
    // Crear secciones por año
    Object.keys(materiasPorAnio).sort().forEach(anio => {
        const yearSection = document.createElement('div');
        yearSection.className = 'year-section';
        
        const yearTitle = document.createElement('div');
        yearTitle.className = 'year-title';
        yearTitle.textContent = `Año ${anio}`;
        yearSection.appendChild(yearTitle);
        
        materiasPorAnio[anio].forEach(materia => {
            const materiaElement = document.createElement('div');
            materiaElement.className = 'subject';
            
            // Determinar estado de la materia
            const aprobada = data.materiasAprobadas.some(m => m.nombre === materia.nombre);
            const cumpleCorrelativas = verificarCorrelativas(materia);
            
            if (aprobada) {
                materiaElement.classList.add('aprobada');
            } else if (cumpleCorrelativas) {
                materiaElement.classList.add('habilitada');
            } else {
                materiaElement.classList.add('no-disponible');
            }
            
            const materiaInfo = document.createElement('div');
            materiaInfo.className = 'subject-info';
            
            const materiaNombre = document.createElement('div');
            materiaNombre.className = 'subject-name';
            materiaNombre.textContent = materia.nombre;
            
            const materiaDetalles = document.createElement('div');
            materiaDetalles.className = 'subject-details';
            materiaDetalles.innerHTML = `
                <span>Código: ${materia.codigo}</span>
                <span>Carga: ${materia.carga_horaria}hs</span>
                <span>Período: ${materia.periodos_dictado.join(', ')}</span>
            `;
            
            materiaInfo.appendChild(materiaNombre);
            materiaInfo.appendChild(materiaDetalles);
            
            const materiaStatus = document.createElement('div');
            materiaStatus.className = 'subject-status';
            
            if (aprobada) {
                materiaStatus.textContent = 'Aprobada';
                materiaStatus.classList.add('status-aprobada');
                
                // Buscar nota
                const materiaAprobada = data.materiasAprobadas.find(m => m.nombre === materia.nombre);
                if (materiaAprobada && materiaAprobada.nota) {
                    materiaStatus.textContent = `Aprobada: ${materiaAprobada.nota}`;
                }
            } else if (cumpleCorrelativas) {
                materiaStatus.textContent = 'Habilitada';
                materiaStatus.classList.add('status-habilitada');
            } else {
                materiaStatus.textContent = 'No disponible';
                materiaStatus.classList.add('status-no-disponible');
            }
            
            materiaElement.appendChild(materiaInfo);
            materiaElement.appendChild(materiaStatus);
            
            // Tooltip para correlativas
            materiaElement.title = generarTooltipCorrelativas(materia);
            
            yearSection.appendChild(materiaElement);
        });
        
        elements.progressContainer.appendChild(yearSection);
    });
}

// Función para verificar correlativas
function verificarCorrelativas(materia) {
    // Verificar correlativas de cursada
    const cursadaCumplida = materia.correlativas.cursada.every(corr => 
        data.materiasAprobadas.some(m => m.nombre === corr)
    );
    
    // Verificar correlativas de aprobadas
    const aprobadasCumplida = materia.correlativas.aprobadas.every(corr => 
        data.materiasAprobadas.some(m => m.nombre === corr)
    );
    
    return cursadaCumplida && aprobadasCumplida;
}

// Función para generar tooltip de correlativas
function generarTooltipCorrelativas(materia) {
    let tooltip = `Código: ${materia.codigo}\nCarga horaria: ${materia.carga_horaria}hs\n\n`;
    
    if (materia.correlativas.cursada.length > 0) {
        tooltip += "Correlativas de cursada:\n";
        materia.correlativas.cursada.forEach((corr, index) => {
            const aprobada = data.materiasAprobadas.some(m => m.nombre === corr);
            tooltip += `- ${corr} ${aprobada ? '✓' : '✗'}\n`;
        });
    }
    
    if (materia.correlativas.aprobadas.length > 0) {
        tooltip += "\nCorrelativas de aprobación:\n";
        materia.correlativas.aprobadas.forEach((corr, index) => {
            const aprobada = data.materiasAprobadas.some(m => m.nombre === corr);
            tooltip += `- ${corr} ${aprobada ? '✓' : '✗'}\n`;
        });
    }
    
    return tooltip;
}

// Función para mostrar el planificador de estrategias
function mostrarPlanificador() {
    elements.strategySection.classList.remove('hidden');
    elements.strategyName.value = "";
    data.currentStrategy = {
        nombre: "",
        cuatrimestres: []
    };
    elements.strategyContainer.innerHTML = '';
    
    // Generar materias disponibles
    mostrarMateriasDisponibles();
    
    // Agregar primer cuatrimestre
    agregarCuatrimestre();
}

// Función para mostrar materias disponibles para cursar
function mostrarMateriasDisponibles() {
    elements.availableSubjects.innerHTML = '<h3>Materias Disponibles para Cursar</h3>';
    
    data.planData.materias.forEach(materia => {
        const aprobada = data.materiasAprobadas.some(m => m.nombre === materia.nombre);
        const cumpleCorrelativas = verificarCorrelativas(materia);
        
        if (!aprobada && cumpleCorrelativas) {
            const materiaElement = document.createElement('div');
            materiaElement.className = 'subject habilitada';
            materiaElement.style.marginBottom = '12px';
            materiaElement.style.cursor = 'move';
            materiaElement.draggable = true;
            materiaElement.dataset.nombre = materia.nombre;
            materiaElement.dataset.carga = materia.carga_horaria;
            
            materiaElement.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    nombre: materia.nombre,
                    carga: materia.carga_horaria
                }));
            });
            
            const materiaInfo = document.createElement('div');
            materiaInfo.className = 'subject-info';
            
            const materiaNombre = document.createElement('div');
            materiaNombre.className = 'subject-name';
            materiaNombre.textContent = materia.nombre;
            
            const materiaDetalles = document.createElement('div');
            materiaDetalles.className = 'subject-details';
            materiaDetalles.innerHTML = `
                <span>Código: ${materia.codigo}</span>
                <span>Carga: ${materia.carga_horaria}hs</span>
                <span>Período: ${materia.periodos_dictado.join(', ')}</span>
            `;
            
            materiaInfo.appendChild(materiaNombre);
            materiaInfo.appendChild(materiaDetalles);
            
            materiaElement.appendChild(materiaInfo);
            elements.availableSubjects.appendChild(materiaElement);
        }
    });
}

// Función para agregar un cuatrimestre al planificador
function agregarCuatrimestre() {
    const periodos = [
        { nombre: "Ago–Dic 2025", color: "blue" },
        { nombre: "Mar–Jul 2026", color: "pink" },
        { nombre: "Ago–Dic 2026", color: "green" }
    ];
    
    const periodo = periodos[data.currentStrategy.cuatrimestres.length % periodos.length];
    
    const periodoElement = document.createElement('div');
    periodoElement.className = 'strategy-card';
    
    periodoElement.innerHTML = `
        <div class="strategy-header">
            <div>Cuatrimestre</div>
            <button class="btn btn-danger btn-sm remove-period"><i class="fas fa-trash"></i></button>
        </div>
        <div class="strategy-period period-${periodo.color}">
            <div class="period-title">
                <div>${periodo.nombre}</div>
                <div>Materias</div>
            </div>
            <div class="period-subjects" 
                    data-periodo="${periodo.nombre}"
                    ondrop="dropMateria(event)" 
                    ondragover="allowDrop(event)"
                    style="min-height: 150px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                <p style="text-align: center; color: #a0b3d6; font-size: 0.95rem;">Arrastra materias aquí</p>
            </div>
            <div class="period-total">Carga total: <span class="total-carga">0</span>hs</div>
        </div>
    `;
    
    elements.strategyContainer.appendChild(periodoElement);
    
    // Agregar evento para eliminar cuatrimestre
    periodoElement.querySelector('.remove-period').addEventListener('click', () => {
        periodoElement.remove();
        actualizarTotales();
    });
    
    // Agregar a currentStrategy
    data.currentStrategy.cuatrimestres.push({
        periodo: periodo.nombre,
        materias: [],
        carga_total: 0
    });
}

// Funciones para el drag and drop
function allowDrop(ev) {
    ev.preventDefault();
}

function dropMateria(ev) {
    ev.preventDefault();
    const dataMateria = JSON.parse(ev.dataTransfer.getData('text'));
    
    // Buscar el contenedor de materias
    const materiasContainer = ev.target.closest('.period-subjects');
    
    // Crear elemento de materia
    const materiaElement = document.createElement('div');
    materiaElement.className = 'period-subject';
    materiaElement.innerHTML = `
        <div>${dataMateria.nombre}</div>
        <div>${dataMateria.carga}hs</div>
        <button class="btn btn-danger btn-sm"><i class="fas fa-times"></i></button>
    `;
    
    // Agregar evento para eliminar materia
    materiaElement.querySelector('button').addEventListener('click', () => {
        materiaElement.remove();
        actualizarTotales();
    });
    
    // Agregar al contenedor
    materiasContainer.appendChild(materiaElement);
    
    // Actualizar totales
    actualizarTotales();
}

// Función para actualizar los totales de carga horaria
function actualizarTotales() {
    document.querySelectorAll('.strategy-period').forEach(periodo => {
        const materiasContainer = periodo.querySelector('.period-subjects');
        const totalSpan = periodo.querySelector('.total-carga');
        
        let total = 0;
        materiasContainer.querySelectorAll('.period-subject').forEach(materia => {
            const cargaText = materia.querySelector('div:nth-child(2)').textContent;
            const carga = parseInt(cargaText);
            total += carga;
        });
        
        totalSpan.textContent = total;
    });
}

// Función para guardar la estrategia
function guardarEstrategia() {
    const nombre = elements.strategyName.value.trim();
    if (!nombre) {
        alert("Por favor, ingresa un nombre para la estrategia");
        return;
    }
    
    // Recolectar datos de los cuatrimestres
    const cuatrimestres = [];
    document.querySelectorAll('.strategy-period').forEach(periodo => {
        const periodoNombre = periodo.querySelector('.period-title div:first-child').textContent;
        const materias = [];
        let carga_total = 0;
        
        periodo.querySelectorAll('.period-subject').forEach(materia => {
            const nombre = materia.querySelector('div:first-child').textContent;
            const carga = parseInt(materia.querySelector('div:nth-child(2)').textContent);
            materias.push(nombre);
            carga_total += carga;
        });
        
        cuatrimestres.push({
            periodo: periodoNombre,
            materias,
            carga_total
        });
    });
    
    // Guardar en localStorage
    const estrategia = {
        nombre,
        cuatrimestres
    };
    
    // Guardar en data y localStorage
    let estrategias = JSON.parse(localStorage.getItem('estrategias')) || [];
    estrategias.push(estrategia);
    localStorage.setItem('estrategias', JSON.stringify(estrategias));
    
    alert(`Estrategia "${nombre}" guardada exitosamente`);
    
    // Actualizar pestaña de estrategias guardadas
    mostrarEstrategiasGuardadas();
}

// Función para mostrar las estrategias guardadas
function mostrarEstrategiasGuardadas() {
    elements.savedStrategies.innerHTML = '<h3>Estrategias Guardadas</h3>';
    
    const estrategias = JSON.parse(localStorage.getItem('estrategias')) || [];
    
    if (estrategias.length === 0) {
        elements.savedStrategies.innerHTML += '<p>No hay estrategias guardadas aún.</p>';
        return;
    }
    
    estrategias.forEach((estrategia, index) => {
        const estrategiaElement = document.createElement('div');
        estrategiaElement.className = 'card';
        estrategiaElement.style.marginBottom = '20px';
        
        estrategiaElement.innerHTML = `
            <h3 style="margin-bottom: 15px;">${estrategia.nombre}</h3>
            <div class="strategy-container" style="margin-top: 10px;">
                ${estrategia.cuatrimestres.map(cuat => `
                    <div class="strategy-card">
                        <div class="strategy-header">
                            <div>${cuat.periodo}</div>
                        </div>
                        <div class="strategy-period">
                            <ul style="padding: 15px; list-style-type: none;">
                                ${cuat.materias.map(mat => `<li style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">${mat}</li>`).join('')}
                            </ul>
                            <div class="period-total">Carga total: ${cuat.carga_total}hs</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <button class="btn btn-danger delete-strategy" data-index="${index}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
                <button class="btn btn-success load-strategy" data-index="${index}">
                    <i class="fas fa-upload"></i> Cargar
                </button>
            </div>
        `;
        
        elements.savedStrategies.appendChild(estrategiaElement);
    });
    
    // Agregar eventos para los botones
    document.querySelectorAll('.delete-strategy').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            eliminarEstrategia(index);
        });
    });
    
    document.querySelectorAll('.load-strategy').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            cargarEstrategia(index);
        });
    });
}

// Función para eliminar una estrategia
function eliminarEstrategia(index) {
    let estrategias = JSON.parse(localStorage.getItem('estrategias')) || [];
    if (index >= 0 && index < estrategias.length) {
        const nombre = estrategias[index].nombre;
        if (confirm(`¿Estás seguro de eliminar la estrategia "${nombre}"?`)) {
            estrategias.splice(index, 1);
            localStorage.setItem('estrategias', JSON.stringify(estrategias));
            mostrarEstrategiasGuardadas();
        }
    }
}

// Función para exportar la estrategia como JSON
function exportarEstrategia() {
    const nombre = elements.strategyName.value.trim() || "estrategia";
    
    // Recolectar datos de los cuatrimestres
    const cuatrimestres = [];
    document.querySelectorAll('.strategy-period').forEach(periodo => {
        const periodoNombre = periodo.querySelector('.period-title div:first-child').textContent;
        const materias = [];
        let carga_total = 0;
        
        periodo.querySelectorAll('.period-subject').forEach(materia => {
            const nombre = materia.querySelector('div:first-child').textContent;
            const carga = parseInt(materia.querySelector('div:nth-child(2)').textContent);
            materias.push(nombre);
            carga_total += carga;
        });
        
        cuatrimestres.push({
            periodo: periodoNombre,
            materias,
            carga_total
        });
    });
    
    const estrategia = {
        nombre,
        cuatrimestres
    };
    
    const dataStr = JSON.stringify(estrategia, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${nombre.replace(/\s+/g, '_')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Función para mostrar la sección de nuevo plan
function mostrarNuevoPlan() {
    elements.newPlanSection.classList.remove('hidden');
    elements.mainSection.classList.add('hidden');
    elements.materiasContainer.innerHTML = '';
    
    // Establecer valores detectados
    elements.newCarreraName.textContent = data.carrera;
    elements.newPlanName.textContent = data.plan;
    elements.newMateriasCount.textContent = data.materiasAprobadas.length;
    
    // Agregar materias del historial
    data.materiasAprobadas.forEach(materia => {
        agregarFilaMateria(materia.nombre, materia.codigo, materia.anio);
    });
}

// Función para agregar una fila de materia en el nuevo plan
function agregarFilaMateria(nombre = "", codigo = "", anio = 1) {
    const materiaRow = document.createElement('div');
    materiaRow.className = 'materia-row';
    
    materiaRow.innerHTML = `
        <div><input type="text" value="${nombre}" placeholder="Nombre de la materia"></div>
        <div><input type="text" value="${codigo}" placeholder="Código"></div>
        <div><input type="number" value="${anio}" min="1" placeholder="Año"></div>
        <div>
            <select>
                <option value="1C">1er Cuatrimestre</option>
                <option value="2C">2do Cuatrimestre</option>
                <option value="Anual">Anual</option>
            </select>
        </div>
        <div><input type="number" value="6" min="1" placeholder="Carga horaria"></div>
        <div><input type="text" placeholder="Separadas por coma"></div>
        <div><input type="text" placeholder="Separadas por coma"></div>
    `;
    
    elements.materiasContainer.appendChild(materiaRow);
}

// Función para agregar una materia vacía
function agregarMateriaNuevoPlan() {
    agregarFilaMateria();
}

// Función para guardar el nuevo plan de estudios
function guardarNuevoPlan() {
    const carrera = data.carrera;
    const plan = data.plan;
    
    if (!carrera || !plan) {
        alert("No se ha detectado carrera o plan válido");
        return;
    }
    
    const materias = [];
    const materiasRows = elements.materiasContainer.querySelectorAll('.materia-row');
    
    if (materiasRows.length === 0) {
        alert("Debes agregar al menos una materia");
        return;
    }
    
    materiasRows.forEach(row => {
        const inputs = row.querySelectorAll('input, select');
        
        const materia = {
            nombre: inputs[0].value.trim(),
            codigo: inputs[1].value.trim(),
            anio: parseInt(inputs[2].value),
            periodos_dictado: [inputs[3].value],
            carga_horaria: parseInt(inputs[4].value),
            correlativas: {
                cursada: inputs[5].value.split(',').map(c => c.trim()).filter(c => c),
                aprobadas: inputs[6].value.split(',').map(c => c.trim()).filter(c => c)
            }
        };
        
        if (materia.nombre) {
            materias.push(materia);
        }
    });
    
    if (materias.length === 0) {
        alert("Debes agregar al menos una materia válida");
        return;
    }
    
    // Crear el objeto del plan
    const nuevoPlan = {
        carrera,
        plan,
        materias
    };
    
    // Agregar a planesData
    planesData.planes.push(nuevoPlan);
    
    // Guardar planes
    guardarPlanes();
    
    alert(`Plan de estudios "${carrera} - ${plan}" guardado exitosamente`);
    
    // Volver a la página principal
    elements.newPlanSection.classList.add('hidden');
    elements.mainSection.classList.remove('hidden');
    
    // Procesar el historial nuevamente para usar el nuevo plan
    data.planData = nuevoPlan;
    mostrarProgreso();
    elements.progressSection.classList.remove('hidden');
}

// Hacer funciones accesibles globalmente para el drag and drop
window.allowDrop = allowDrop;
window.dropMateria = dropMateria;