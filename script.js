// Objeto para almacenar datos
const data = {
    carrera: "",
    plan: "",
    historial: "",
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
    progressContainer: document.getElementById('progress-container'),
    strategyContainer: document.getElementById('strategy-container'),
    materiasContainer: document.getElementById('materias-container'),
    availableSubjects: document.getElementById('available-subjects'),
    savedStrategies: document.getElementById('saved-strategies'),
    carreraSelect: document.getElementById('carrera'),
    planSelect: document.getElementById('plan'),
    historialText: document.getElementById('historial'),
    procesarBtn: document.getElementById('procesar-btn'),
    addPlanBtn: document.getElementById('add-plan-btn'),
    planificarBtn: document.getElementById('planificar-btn'),
    addPeriodBtn: document.getElementById('add-period-btn'),
    saveStrategyBtn: document.getElementById('save-strategy-btn'),
    exportStrategyBtn: document.getElementById('export-strategy-btn'),
    addMateriaBtn: document.getElementById('add-materia-btn'),
    saveNewPlanBtn: document.getElementById('save-new-plan-btn'),
    strategyName: document.getElementById('strategy-name'),
    newCarrera: document.getElementById('new-carrera'),
    newPlan: document.getElementById('new-plan'),
    newPlanHistorial: document.getElementById('new-plan-historial'),
    importPlansBtn: document.getElementById('import-plans-btn'),
    exportPlansBtn: document.getElementById('export-plans-btn')
};

// Planes de estudio de ejemplo
const samplePlans = {
    "ing-computacion": {
        "2013": {
            carrera: "Ingeniería en Computación",
            plan: "2013",
            materias: [
                {
                    nombre: "Algoritmos y Programación I",
                    codigo: "1235",
                    anio: 1,
                    periodos_dictado: ["1C", "2C"],
                    carga_horaria: 6,
                    correlativas: {
                        cursada: [],
                        aprobadas: []
                    }
                },
                {
                    nombre: "Algoritmos y Programación II",
                    codigo: "1236",
                    anio: 1,
                    periodos_dictado: ["2C"],
                    carga_horaria: 6,
                    correlativas: {
                        cursada: ["Algoritmos y Programación I"],
                        aprobadas: []
                    }
                },
                {
                    nombre: "Análisis Matemático I",
                    codigo: "1265",
                    anio: 1,
                    periodos_dictado: ["1C", "2C"],
                    carga_horaria: 8,
                    correlativas: {
                        cursada: [],
                        aprobadas: []
                    }
                },
                {
                    nombre: "Análisis Matemático II",
                    codigo: "941",
                    anio: 2,
                    periodos_dictado: ["1C"],
                    carga_horaria: 8,
                    correlativas: {
                        cursada: ["Análisis Matemático I"],
                        aprobadas: []
                    }
                },
                {
                    nombre: "Estructura de Datos",
                    codigo: "1237",
                    anio: 2,
                    periodos_dictado: ["1C"],
                    carga_horaria: 6,
                    correlativas: {
                        cursada: ["Algoritmos y Programación II"],
                        aprobadas: ["Análisis Matemático I"]
                    }
                },
                {
                    nombre: "Diseño Lógico",
                    codigo: "1238",
                    anio: 2,
                    periodos_dictado: ["1C"],
                    carga_horaria: 6,
                    correlativas: {
                        cursada: ["Algoritmos y Programación I"],
                        aprobadas: []
                    }
                }
            ]
        }
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Event Listeners
    elements.procesarBtn.addEventListener('click', procesarHistorial);
    elements.addPlanBtn.addEventListener('click', mostrarNuevoPlan);
    elements.planificarBtn.addEventListener('click', mostrarPlanificador);
    elements.addPeriodBtn.addEventListener('click', agregarCuatrimestre);
    elements.saveStrategyBtn.addEventListener('click', guardarEstrategia);
    elements.exportStrategyBtn.addEventListener('click', exportarEstrategia);
    elements.addMateriaBtn.addEventListener('click', agregarMateriaNuevoPlan);
    elements.saveNewPlanBtn.addEventListener('click', guardarNuevoPlan);
    
    // Tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
        });
    });
    
    // Cargar datos guardados
    cargarDatosGuardados();
});

// Ruta del archivo JSON local de planes
const PLANES_JSON_PATH = 'planes.json';

// Función para cargar planes desde el archivo JSON local
async function cargarPlanesDesdeArchivo() {
    try {
        const res = await fetch(PLANES_JSON_PATH);
        if (!res.ok) throw new Error('No se pudo cargar planes.json');
        const planes = await res.json();
        return planes;
    } catch (e) {
        console.error('Error cargando planes.json:', e);
        return [];
    }
}

// Función para guardar planes en el archivo JSON local (descarga el archivo)
function guardarPlanesEnArchivo(planes) {
    const dataStr = JSON.stringify(planes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'planes.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Función para procesar el historial académico
function procesarHistorial() {
    data.carrera = elements.carreraSelect.value;
    data.plan = elements.planSelect.value;
    data.historial = elements.historialText.value;
    
    if (!data.carrera || !data.plan) {
        alert("Por favor, selecciona una carrera y un plan de estudios");
        return;
    }
    
    if (!data.historial) {
        alert("Por favor, pega tu historial académico");
        return;
    }
    
    // Verificar si el plan existe
    if (!samplePlans[data.carrera] || !samplePlans[data.carrera][data.plan]) {
        elements.planWarning.classList.remove('hidden');
        return;
    }
    
    elements.planWarning.classList.add('hidden');
    
    // Obtener datos del plan
    data.planData = samplePlans[data.carrera][data.plan];
    
    // Procesar historial
    procesarTextoHistorial();
    
    // Mostrar progreso
    mostrarProgreso();
    
    // Mostrar sección de progreso
    elements.progressSection.classList.remove('hidden');
}

// Función para procesar el texto del historial
function procesarTextoHistorial() {
    // Simulamos el procesamiento del texto
    const lineas = data.historial.split('\n');
    data.materiasAprobadas = [];
    
    lineas.forEach(linea => {
        if (linea.includes('(Aprobado)')) {
            const partes = linea.split('\t');
            if (partes.length > 4) {
                const nombre = partes[0].trim();
                const anio = parseInt(partes[2]);
                const periodo = partes[3].trim();
                const notaMatch = partes[4].match(/\d+/);
                const nota = notaMatch ? parseInt(notaMatch[0]) : null;
                
                // Buscar código si está disponible
                let codigo = "";
                const codigoMatch = nombre.match(/\((\d+)\)/);
                if (codigoMatch) {
                    codigo = codigoMatch[1];
                }
                
                // Extraer nombre limpio
                const nombreLimpio = nombre.replace(/\(\d+\)/g, '').trim();
                
                data.materiasAprobadas.push({
                    nombre: nombreLimpio,
                    codigo,
                    anio,
                    periodo,
                    nota
                });
            }
        }
    });
    
    console.log("Materias aprobadas detectadas:", data.materiasAprobadas);
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
            materiaNombre.textContent = materia.nombre;
            
            const materiaCodigo = document.createElement('div');
            materiaCodigo.className = 'subject-code';
            materiaCodigo.textContent = `Código: ${materia.codigo} | Carga: ${materia.carga_horaria}hs`;
            
            materiaInfo.appendChild(materiaNombre);
            materiaInfo.appendChild(materiaCodigo);
            
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
            materiaElement.style.marginBottom = '10px';
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
            materiaNombre.textContent = materia.nombre;
            
            const materiaCodigo = document.createElement('div');
            materiaCodigo.className = 'subject-code';
            materiaCodigo.textContent = `Código: ${materia.codigo} | Carga: ${materia.carga_horaria}hs`;
            
            materiaInfo.appendChild(materiaNombre);
            materiaInfo.appendChild(materiaCodigo);
            
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
                    style="min-height: 100px; padding: 10px; background: rgba(255,255,255,0.5); border-radius: 4px;">
                <p style="text-align: center; color: #777; font-size: 0.9rem;">Arrastra materias aquí</p>
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
        estrategiaElement.style.marginBottom = '15px';
        
        estrategiaElement.innerHTML = `
            <h3>${estrategia.nombre}</h3>
            <div class="strategy-container" style="margin-top: 15px;">
                ${estrategia.cuatrimestres.map(cuat => `
                    <div class="strategy-card">
                        <div class="strategy-header">
                            <div>${cuat.periodo}</div>
                        </div>
                        <div class="strategy-period">
                            <ul style="padding: 15px;">
                                ${cuat.materias.map(mat => `<li>${mat}</li>`).join('')}
                            </ul>
                            <div class="period-total">Carga total: ${cuat.carga_total}hs</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 15px; display: flex; gap: 10px;">
                <button class="btn btn-danger btn-sm delete-strategy" data-index="${index}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
                <button class="btn btn-success btn-sm load-strategy" data-index="${index}">
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

// Función para cargar una estrategia
function cargarEstrategia(index) {
    const estrategias = JSON.parse(localStorage.getItem('estrategias')) || [];
    if (index >= 0 && index < estrategias.length) {
        data.currentStrategy = estrategias[index];
        elements.strategyName.value = data.currentStrategy.nombre;
        
        // Limpiar contenedor
        elements.strategyContainer.innerHTML = '';
        
        // Crear cuatrimestres
        data.currentStrategy.cuatrimestres.forEach(cuat => {
            const periodoElement = document.createElement('div');
            periodoElement.className = 'strategy-card';
            
            // Determinar color basado en el nombre del periodo
            let colorClass = 'period-blue';
            if (cuat.periodo.includes('Mar–Jul')) colorClass = 'period-pink';
            if (cuat.periodo.includes('Ago–Dic') && cuat.periodo.includes('2026')) colorClass = 'period-green';
            
            periodoElement.innerHTML = `
                <div class="strategy-header">
                    <div>Cuatrimestre</div>
                    <button class="btn btn-danger btn-sm remove-period"><i class="fas fa-trash"></i></button>
                </div>
                <div class="strategy-period ${colorClass}">
                    <div class="period-title">
                        <div>${cuat.periodo}</div>
                        <div>Materias</div>
                    </div>
                    <div class="period-subjects" 
                            data-periodo="${cuat.periodo}"
                            ondrop="dropMateria(event)" 
                            ondragover="allowDrop(event)"
                            style="min-height: 100px; padding: 10px; background: rgba(255,255,255,0.5); border-radius: 4px;">
                        ${cuat.materias.map(mat => `
                            <div class="period-subject">
                                <div>${mat}</div>
                                <div>${data.planData.materias.find(m => m.nombre === mat)?.carga_horaria || 0}hs</div>
                                <button class="btn btn-danger btn-sm"><i class="fas fa-times"></i></button>
                            </div>
                        `).join('')}
                    </div>
                    <div class="period-total">Carga total: <span class="total-carga">${cuat.carga_total}</span>hs</div>
                </div>
            `;
            
            elements.strategyContainer.appendChild(periodoElement);
            
            // Agregar evento para eliminar cuatrimestre
            periodoElement.querySelector('.remove-period').addEventListener('click', () => {
                periodoElement.remove();
                actualizarTotales();
            });
            
            // Agregar eventos para eliminar materias
            periodoElement.querySelectorAll('.period-subject button').forEach(btn => {
                btn.addEventListener('click', () => {
                    btn.closest('.period-subject').remove();
                    actualizarTotales();
                });
            });
        });
        
        // Cambiar a la pestaña de simulador
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelector('.tab[data-tab="simulador"]').classList.add('active');
        document.getElementById('simulador-tab').classList.add('active');
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
    // Agregar textarea para historial
    if (!document.getElementById('new-plan-historial')) {
        const historialDiv = document.createElement('div');
        historialDiv.className = 'form-group';
        historialDiv.innerHTML = `
            <label for="new-plan-historial">Pega tu historial académico para autocompletar materias:</label>
            <textarea id="new-plan-historial" placeholder="Copia y pega aquí tu historial académico..."></textarea>
            <button class="btn" id="procesar-historial-plan-btn" style="margin-top:10px;">Procesar Historial</button>
        `;
        elements.newPlanSection.insertBefore(historialDiv, elements.materiasContainer);
        document.getElementById('procesar-historial-plan-btn').onclick = procesarHistorialNuevoPlan;
    }
    // Agregar botones de import/export
    if (!document.getElementById('import-plans-btn')) {
        const btnDiv = document.createElement('div');
        btnDiv.style.margin = '10px 0';
        btnDiv.innerHTML = `
            <button class="btn" id="import-plans-btn"><i class="fas fa-upload"></i> Importar Planes JSON</button>
            <button class="btn" id="export-plans-btn"><i class="fas fa-download"></i> Exportar Planes JSON</button>
        `;
        elements.newPlanSection.insertBefore(btnDiv, elements.newPlanSection.firstChild);
        document.getElementById('import-plans-btn').onclick = importarPlanesJSON;
        document.getElementById('export-plans-btn').onclick = exportarPlanesJSON;
    }
    // Agregar materias del historial
    data.materiasAprobadas.forEach(materia => {
        agregarFilaMateria(materia.nombre, materia.codigo, materia.anio);
    });
}

// Procesar historial para autocompletar materias en nuevo plan
function procesarHistorialNuevoPlan() {
    const texto = document.getElementById('new-plan-historial').value;
    if (!texto) {
        alert('Pega tu historial académico.');
        return;
    }
    const lineas = texto.split('\n');
    elements.materiasContainer.innerHTML = '';
    lineas.forEach(linea => {
        if (linea.includes('(Aprobado)')) {
            const partes = linea.split('\t');
            if (partes.length > 4) {
                let nombre = partes[0].trim();
                let codigo = '';
                const codigoMatch = nombre.match(/\((\d+)\)/);
                if (codigoMatch) codigo = codigoMatch[1];
                nombre = nombre.replace(/\(\d+\)/g, '').trim();
                const anio = parseInt(partes[2]);
                agregarFilaMateria(nombre, codigo, anio);
            }
        }
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
async function guardarNuevoPlan() {
    const carrera = elements.newCarrera.value.trim();
    const plan = elements.newPlan.value.trim();
    
    if (!carrera || !plan) {
        alert("Por favor, ingresa el nombre de la carrera y el plan");
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
    
    let planes = await cargarPlanesDesdeArchivo();
    planes.push(nuevoPlan);
    guardarPlanesEnArchivo(planes);
    
    alert(`Plan de estudios "${carrera} - ${plan}" guardado exitosamente`);
    
    // Volver a la página principal
    elements.newPlanSection.classList.add('hidden');
    elements.mainSection.classList.remove('hidden');
}

// Función para exportar planes como JSON
function exportarPlanesJSON() {
    const planes = JSON.parse(localStorage.getItem('planes')) || [];
    const dataStr = JSON.stringify(planes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'planes.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Función para importar planes desde JSON
function importarPlanesJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = evt => {
            try {
                const planes = JSON.parse(evt.target.result);
                if (Array.isArray(planes)) {
                    localStorage.setItem('planes', JSON.stringify(planes));
                    alert('Planes importados correctamente.');
                    location.reload();
                } else {
                    alert('El archivo no tiene el formato correcto.');
                }
            } catch {
                alert('Error al leer el archivo JSON.');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Función para cargar datos guardados
async function cargarDatosGuardados() {
    const planes = await cargarPlanesDesdeArchivo();
    // Agregar planes a los selectores
    planes.forEach(plan => {
        if (![...elements.carreraSelect.options].some(opt => opt.value === plan.carrera)) {
            const option = document.createElement('option');
            option.value = plan.carrera;
            option.textContent = plan.carrera;
            elements.carreraSelect.appendChild(option);
        }
    });
    elements.carreraSelect.addEventListener('change', () => {
        const carrera = elements.carreraSelect.value;
        elements.planSelect.innerHTML = '<option value="">Selecciona tu plan</option>';
        planes.filter(p => p.carrera === carrera).forEach(plan => {
            const option = document.createElement('option');
            option.value = plan.plan;
            option.textContent = plan.plan;
            elements.planSelect.appendChild(option);
        });
    });
}

// Hacer funciones accesibles globalmente para el drag and drop
window.allowDrop = allowDrop;
window.dropMateria = dropMateria;