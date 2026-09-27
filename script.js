// REGISTRO SERVICE WORKER
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then(registration => {
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        console.log('Nueva versión detectada, recargando...');
                        window.location.reload();
                    }
                });
            });
        }).catch(err => console.log('Error SW:', err));
    });
}

let isAdmin = false;

// 1. DATOS DEL ORGANIGRAMA
const DEFAULT_ORG_DATA = {
  name: "Jefatura de Carrera: Mtra. Laura Lázaro Felipe",
  children: [
    {
      name: "Apoyo 1. Atención en la planeación académico-curricular",
      children: [
        { name: "Dar seguimiento al desarrollo, revisión y actualización de los componentes académicos de las UCA (áreas Educativa, Clínica, Social y Laboral)" },
        { name: "Planear actividades académicas curriculares y extracurriculares (coloquios y encuentros)" },
        { name: "Apoyar en el desarrollo de coloquios y encuentros académicos de la Licenciatura" },
        {
          name: "Apoyo 1.1 Análisis de información académica",
          children: [
            { name: "Realizar informes trimestrales y anuales requeridos por la Universidad" },
            { name: "Analizar la información estadística de resultados académicos para identificar tendencias y necesidades" },
            { name: "Generar reportes como insumo para la toma de decisiones (cursos de recuperación académica intersemestral)" },
            { name: "Sistematización y análisis para metas cuantitativas (Alineación con Plan Nacional de Desarrollo y Programa Institucional UNRC)" },
            { name: "Revisar y proponer la oferta de UCA y grupos cada semestre para intersemestrales y exámenes extraordinarios" },
            { name: "Revisar y proponer perfiles docentes para proyectos de prácticas profesionales" }
          ]
        },
        { name: "Apoyo en la coordinación y diseño de diplomados de titulación para la Licenciatura en Psicología a Distancia" }
      ]
    },
    {
      name: "Apoyo 2. Acompañamiento docente (Inducción y fortalecimiento del modelo educativo)",
      children: [
        { name: "Colaborar en la proyección docente de cada ciclo escolar con base en la oferta académica" },
        { name: "Identificar, valorar y seleccionar perfiles docentes acordes a los requerimientos y la modalidad a distancia" },
        { name: "Colaborar en la asignación docente de cada semestre (UCA, grupos y perfiles)" },
        { name: "Participar en la inducción a docentes de nuevo ingreso (operación académica, UCA, AVA)" },
        { name: "Brindar apoyo a la Jefatura en la comunicación, seguimiento y acompañamiento de las y los docentes, contribuyendo a la atención oportuna de los procesos" },
        { name: "Mantenerse atento a la Guía docente para realizar retroalimentación académica y realizar sesiones virtuales síncronas" },
        { name: "Analizar, dar seguimiento y canalizar casos de incidencias en el desempeño docente (Supervisor)" }
      ]
    },
    {
      name: "Apoyo 3. Promover las estrategias 3R (Trayectoria académica, permanencia y atención)",
      children: [
        {
          name: "Apoyo 3.1 Responsable de Seguimiento y Prevención del Abandono Académico",
          children: [
            { name: "Brindar atención presencial a estudiantes en sede GAM para dudas sobre UCA" },
            { name: "Canalizar inquietudes sobre procesos de titulación y alternativas de acreditación" },
            { name: "Proponer estrategias de permanencia del estudiante en la UNRC" },
            { name: "Dar seguimiento a la trayectoria académica del estudiante" },
            { name: "Dar seguimiento a través de estrategias de recuperación a estudiantes identificados por el SAME en estatus \"Nunca\" e \"Inactivos\"" },
            { name: "Identificar señales de riesgo de abandono académico mediante el seguimiento en AVA, y brindar orientación para favorecer la permanencia" },
            { name: "Brindar atención y canalización presencial a estudiantes en sede GAM para dudas académicas y administrativas" },
            { name: "Coordinar y desarrollar sesiones de atención estudiantil los días viernes, prioritariamente a estudiantes \"Nunca\" e \"Inactivo\"" },
            { name: "Registrar casos atendidos y dar seguimiento a los acuerdos o acciones establecidas con cada estudiante" },
            { name: "Identificar causas de riesgo académico y canalizar los casos a las áreas pertinentes" },
            { name: "Elaborar reportes periódicos para la Jefatura sobre casos atendidos, seguimiento y resultados" }
          ]
        },
        {
          name: "Apoyo 3.2 Riesgo y Comunicación",
          children: [
            { name: "Realizar mesas de trabajo en coordinación con un responsable docente para la elaboración de materiales" },
            { name: "Dar seguimiento a la aplicación del instrumento de medición para evaluar recursos educativos de Retención, Recuperación y Reforzamiento (3R)" },
            { name: "Analizar resultados, detectar áreas de oportunidad y proponer ajustes o mejoras de recursos" },
            { name: "Generar reportes de seguimiento para brindar información objetiva en la toma de decisiones y mejora continua" }
          ]
        },
        {
          name: "Apoyo 3.3 Reforzamiento en Cursos académicos, Estancias y Titulación",
          children: [
            { name: "Acompañar los procesos de creación de cursos de formación docente y extracurriculares" },
            { name: "Acompañamiento a UCA de estancias laborales y seminarios de titulación (Planes 2020 y 2023)" },
            { name: "Crear mesas de trabajo entre docentes expertos para estandarizar estructura, objetivos y rúbricas de nuevos cursos" },
            { name: "Programar sesiones de unificación de criterios para asesores de titulación (procesos metodológicos acordes)" },
            { name: "Programar sesiones periódicas de seguimiento de prácticas profesionales para acompañar a docentes y garantizar metas" }
          ]
        }
      ]
    },
    {
      name: "Apoyo 4. Apoyo responsable en estrategias de egreso y titulación",
      children: [
        { name: "Diseñar y proponer estrategias de acompañamiento para el egreso y la titulación" },
        { name: "Elaborar y aplicar formularios de diagnóstico para identificar necesidades, avances y dificultades de egreso" },
        { name: "Organizar sesiones informativas con estudiantes para conocer necesidades y brindar orientación sobre titulación" },
        { name: "Dar seguimiento a estudiantes próximos a egresar identificando factores que puedan retrasar el proceso" },
        { name: "Sistematizar información de formularios y sesiones para identificar áreas de oportunidad" },
        { name: "Mantener comunicación con áreas correspondientes para canalizar casos que requieran atención específica" },
        { name: "Elaborar reportes periódicos sobre las acciones realizadas y avances en las estrategias de egreso" }
      ]
    },
    {
      name: "Apoyo 5. Atención de incidencias (identificadas y reportadas por tutores)",
      children: [
        { name: "Revisar y atender de manera continua los correos de la Licenciatura en Psicología a Distancia" },
        { name: "Identificar solicitud y determinar ruta de atención (canalización al apoyo, SAME, Jefatura o área competente)" },
        { name: "Dar respuesta directa a los correos correspondientes a la Licenciatura" },
        { name: "Organizar y sistematizar los correos atendidos para contar con registro" },
        { name: "Canalizar incidencias reportadas por Tutoría a LPSI-LAD y reportar resultados a la Jefatura" }
      ]
    },
    {
      name: "Apoyo 6. Acompañamiento, comunicación y seguimiento",
      children: [
        { name: "Construcción de indicadores y aplicación de formularios para identificar necesidades académicas" },
        { name: "Realizar análisis y triangulación de datos (patrones de comportamiento de estudiantes)" },
        { name: "Integrar y analizar resultados de formularios conforme a indicadores y estatus" },
        { name: "Elaboración de reportes de seguimiento y monitoreo académico para medidas emergentes/remediales" },
        { name: "Implementar campañas y estrategias de alfabetización en nuevas tecnologías en psicología" }
      ]
    },
    {
      name: "SAME (Supervisor de Acompañamiento para la Mejora Educativa)",
      children: [
        { name: "Seguimiento docente mediante revisión de ingreso a plataforma, plan de trabajo, foros y tareas auténticas" },
        { name: "Integrar concentrado (nombre, correo, teléfono, UCA y grupos) para comunicación y seguimiento" },
        { name: "Brindar información inicial sobre el curso, canales de comunicación y acompañamiento" },
        { name: "Revisar que foros, tareas, plan de trabajo y recursos estén disponibles (sin restricciones de tiempo)" },
        { name: "Enviar al inicio de cada módulo información sobre fechas relevantes y procesos académicos" },
        { name: "Monitorear semanalmente el acceso de los docentes a la plataforma y seguimiento a incidencias" },
        { name: "Supervisar acciones de recuperación, retención y regularización (remitir info a Trayectoria y Permanencia)" },
        { name: "Verificar evaluaciones en tiempo y forma y emitir retroalimentación cuando sea necesario" },
        { name: "Integrar y entregar el formato de seguimiento correspondiente a cada unidad" },
        { name: "Descargar los calificadores al cierre del bloque y tomar captura de gráficas de asistencia" },
        { name: "Corroborar las calificaciones registradas una vez cerrada la plataforma" },
        { name: "Dar seguimiento al llenado, entrega y validación de actas, revisando la documentación docente" }
      ]
    }
  ]
};

let orgData = JSON.parse(localStorage.getItem('org_lad_data')) || DEFAULT_ORG_DATA;
const CLOUDFLARE_API_URL = "https://org-lad-api.adrian-camelot32.workers.dev/api/org"; 

async function loadOrgDataFromCloud() {
    try {
        const response = await fetch(CLOUDFLARE_API_URL);
        if (response.ok) {
            const cloudData = await response.json();
            orgData = cloudData;
            localStorage.setItem('org_lad_data', JSON.stringify(cloudData));
        }
    } catch (err) {
        console.log("Modo offline o sin conexión al Worker, usando datos locales.");
    } finally {
        init();
        updateWorkflowSelects();
    }
}

async function saveOrgData() {
    if (!isAdmin) return;
    localStorage.setItem('org_lad_data', JSON.stringify(orgData));
    updateWorkflowSelects();

    try {
        await fetch(CLOUDFLARE_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orgData)
        });
    } catch (err) {
        console.log("Sincronización en nube pendiente (offline).");
    }
}

// 2. CONFIGURACIÓN D3.js
let orientation = "horizontal"; 
let svg, g, root, treeLayout, zoom;
let i = 0;
const duration = 750;
const container = document.getElementById("tree-container");

const nodeWidth = 300; 
const nodeHeight = 120; 

const PRIMARY_COLOR = "#9F2241"; 
const SECONDARY_COLOR = "#BC955C"; 
const TERTIARY_COLOR = "#235B4E"; 

function init() {
    if (!container || container.clientWidth === 0) return;
    d3.select("#tree-container").selectAll("*").remove();
    const width = container.clientWidth;
    const height = container.clientHeight;

    svg = d3.select("#tree-container").append("svg")
        .attr("width", "100%").attr("height", "100%").style("cursor", "grab");

    let defs = svg.append("defs");
    let filter = defs.append("filter").attr("id", "drop-shadow").attr("height", "130%");
    filter.append("feDropShadow").attr("dx", "0").attr("dy", "4").attr("stdDeviation", "4").attr("flood-color", "#000").attr("flood-opacity", "0.2");

    g = svg.append("g");
    zoom = d3.zoom().scaleExtent([0.1, 3]).on("zoom", (event) => g.attr("transform", event.transform));
    svg.call(zoom);
    
    treeLayout = orientation === "horizontal" 
        ? d3.tree().nodeSize([nodeHeight + 15, nodeWidth + 50]) 
        : d3.tree().nodeSize([nodeWidth + 20, nodeHeight + 50]);

    root = d3.hierarchy(orgData, d => d.children);
    root.x0 = height / 2;
    root.y0 = 0;
    
    if (root.children) { root.children.forEach(collapseDeep); }
    update(root);
    
    let initialX = orientation === "horizontal" ? (width < 768 ? width/6 : width/4) : width/2;
    let initialY = orientation === "horizontal" ? height/2 : height/4;
    svg.call(zoom.transform, d3.zoomIdentity.translate(initialX, initialY).scale(0.85));
}

function collapseDeep(d) {
    if (d.children) { d._children = d.children; d._children.forEach(collapseDeep); d.children = null; }
}

function update(source) {
    const treeData = treeLayout(root);
    const nodes = treeData.descendants();
    const links = treeData.descendants().slice(1);

    const node = g.selectAll("g.node").data(nodes, d => d.id || (d.id = ++i));
    
    const nodeEnter = node.enter().append("g").attr("class", "node")
        .attr("transform", d => orientation === "horizontal" ? `translate(${source.y0},${source.x0})` : `translate(${source.x0},${source.y0})`)
        .on("click", clickNode);

    nodeEnter.append("rect")
        .attr("width", nodeWidth).attr("height", nodeHeight)
        .attr("x", -(nodeWidth/2)).attr("y", -(nodeHeight/2))
        .attr("rx", 8).attr("ry", 8)
        .style("fill", d => d._children ? SECONDARY_COLOR : PRIMARY_COLOR)
        .style("stroke", TERTIARY_COLOR).style("stroke-width", "2px").style("filter", "url(#drop-shadow)");

    const foDiv = nodeEnter.append("foreignObject")
        .attr("width", nodeWidth - 10).attr("height", nodeHeight - 10)
        .attr("x", -(nodeWidth/2) + 5).attr("y", -(nodeHeight/2) + 5)
        .append("xhtml:div")
        .style("display", "flex").style("flex-direction", "column").style("height", "100%");

    foDiv.append("div")
        .attr("class", "node-text")
        .style("flex-grow", "1").style("display", "flex").style("align-items", "center")
        .style("justify-content", "center").style("text-align", "center")
        .style("color", "#ffffff").style("font-family", "'Noto Sans', sans-serif")
        .style("font-size", "11px").style("font-weight", "500")
        .style("padding", "6px 10px")
        .style("overflow-y", "auto") 
        .html(d => d.data.name);

    const actions = foDiv.append("div")
        .attr("class", "node-actions")
        .style("display", isAdmin ? "flex" : "none")
        .style("justify-content", "center").style("gap", "15px").style("padding-bottom", "6px");

    actions.append("button").html("✏️").attr("title", "Editar").attr("class", "node-btn")
        .on("click", (event, d) => { event.stopPropagation(); promptEditNode(d); });

    actions.append("button").html("➕").attr("title", "Añadir subnodo").attr("class", "node-btn")
        .on("click", (event, d) => { event.stopPropagation(); promptAddChild(d); });

    actions.append("button").html("❌").attr("title", "Eliminar nodo").attr("class", "node-btn")
        .on("click", (event, d) => { event.stopPropagation(); promptDeleteNode(d); });

    const nodeUpdate = nodeEnter.merge(node);
    nodeUpdate.transition().duration(duration)
        .attr("transform", d => orientation === "horizontal" ? `translate(${d.y},${d.x})` : `translate(${d.x},${d.y})`);
    
    nodeUpdate.select("rect").style("fill", d => d._children ? SECONDARY_COLOR : PRIMARY_COLOR);
    nodeUpdate.select(".node-text").html(d => d.data.name);
    nodeUpdate.select(".node-actions").style("display", isAdmin ? "flex" : "none");

    const nodeExit = node.exit().transition().duration(duration)
        .attr("transform", d => orientation === "horizontal" ? `translate(${source.y},${source.x})` : `translate(${source.x},${source.y})`).remove();
    nodeExit.select("rect").attr("width", 1e-6).attr("height", 1e-6);

    const link = g.selectAll("path.link").data(links, d => d.id);
    const linkEnter = link.enter().insert("path", "g")
        .attr("class", "link").style("fill", "none").style("stroke", SECONDARY_COLOR)
        .style("stroke-width", "2px").style("opacity", 0.7)
        .attr("d", d => { const o = {x: source.x0, y: source.y0}; return diagonal(o, o); });

    linkEnter.merge(link).transition().duration(duration).attr("d", d => diagonal(d, d.parent));
    link.exit().transition().duration(duration)
        .attr("d", d => { const o = {x: source.x, y: source.y}; return diagonal(o, o); }).remove();

    nodes.forEach(d => { d.x0 = d.x; d.y0 = d.y; });
}

function diagonal(s, d) {
    return orientation === "horizontal"
        ? `M ${s.y} ${s.x} C ${(s.y + d.y) / 2} ${s.x}, ${(s.y + d.y) / 2} ${d.x}, ${d.y} ${d.x}`
        : `M ${s.x} ${s.y} C ${s.x} ${(s.y + d.y) / 2}, ${d.x} ${(s.y + d.y) / 2}, ${d.x} ${d.y}`;
}

function clickNode(event, d) {
    if (d.children) { d._children = d.children; d.children = null; } 
    else { d.children = d._children; d._children = null; }
    update(d);
}

// 3. FUNCIONES DE EDICIÓN
function promptEditNode(d) {
    const newName = prompt("Editar nombre:", d.data.name);
    if (newName !== null && newName.trim() !== "") {
        d.data.name = newName.trim(); saveOrgData(); init(); 
    }
}
function promptAddChild(d) {
    const newName = prompt("Escribe el nombre del nuevo subnodo:");
    if (newName !== null && newName.trim() !== "") {
        if (!d.data.children) d.data.children = [];
        d.data.children.push({ name: newName.trim() });
        if (d._children) { d.children = d._children; d._children = null; }
        saveOrgData(); init(); 
    }
}
function promptDeleteNode(d) {
    if (d === root) { alert("La raíz no se puede eliminar."); return; }
    if (confirm(`¿Eliminar "${d.data.name}"?`)) {
        const parent = d.parent;
        if (parent && parent.data.children) {
            parent.data.children = parent.data.children.filter(child => child !== d.data);
            if (parent.data.children.length === 0) delete parent.data.children;
        }
        saveOrgData(); init();
    }
}

// 4. CONTROL DE ACCESO
const authScreen = document.getElementById('auth-screen');
const settingsFab = document.getElementById('settings-fab');

document.getElementById('btn-guest-login').addEventListener('click', () => {
    isAdmin = false; authScreen.classList.add('hidden'); if (settingsFab) settingsFab.classList.add('hidden'); loadOrgDataFromCloud();
});
document.getElementById('btn-admin-login').addEventListener('click', () => {
    const pass = document.getElementById('admin-pass-input').value.trim();
    if (pass === "psique33" || pass === "lulut" || pass === "L0b0l0b0") {
        isAdmin = true; authScreen.classList.add('hidden'); if (settingsFab) settingsFab.classList.remove('hidden'); loadOrgDataFromCloud();
    } else { alert("Contraseña incorrecta."); }
});

// 5. MODAL DE AJUSTES
const settingsModal = document.getElementById('settings-modal');
const closeModalBtn = document.getElementById('close-modal');

if (settingsFab) { settingsFab.addEventListener('click', () => { if (!isAdmin) return; settingsModal.classList.remove('hidden'); }); }
if (closeModalBtn) { closeModalBtn.addEventListener('click', () => { settingsModal.classList.add('hidden'); }); }

const btnExportJson = document.getElementById('btn-export-json');
if (btnExportJson) {
    btnExportJson.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orgData, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr); downloadAnchor.setAttribute("download", "orgData_Respaldo.json");
        document.body.appendChild(downloadAnchor); downloadAnchor.click(); downloadAnchor.remove();
    });
}

const importFileInput = document.getElementById('import-file-input');
const btnImportJson = document.getElementById('btn-import-json');
if (btnImportJson && importFileInput) {
    btnImportJson.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            try { orgData = JSON.parse(evt.target.result); saveOrgData(); init(); settingsModal.classList.add('hidden'); alert("Organigrama restaurado con éxito.");
            } catch (err) { alert("Archivo JSON no válido."); }
        };
        reader.readAsText(file);
    });
}

const btnResetOrg = document.getElementById('btn-reset-org');
if (btnResetOrg) {
    btnResetOrg.addEventListener('click', () => {
        if (confirm("¿Restaurar el organigrama original?")) {
            localStorage.removeItem('org_lad_data'); orgData = JSON.parse(JSON.stringify(DEFAULT_ORG_DATA)); saveOrgData(); init(); settingsModal.classList.add('hidden');
        }
    });
}

// 6. LÓGICA DE INTERFAZ Y NUEVO MÉTODO PARA PLÓTER
const downloadFab = document.getElementById('download-png-fab');

function setActiveTab(evt) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (evt && evt.currentTarget && evt.currentTarget.classList.contains('tab-btn')) { evt.currentTarget.classList.add('active'); }
}
function showTab(tabId, evt) {
    setActiveTab(evt);
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if (downloadFab) downloadFab.classList.add('hidden'); 
}
function showOrgTab(orient, evt) {
    setActiveTab(evt); orientation = orient;
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById('org-tab').classList.add('active');
    if (downloadFab) downloadFab.classList.remove('hidden'); 
    setTimeout(() => init(), 100);
}

// 🚀 NUEVA LÓGICA: IMAGEN GIGANTE DE ALTA RESOLUCIÓN PARA PLOTEO
if (downloadFab) {
    downloadFab.addEventListener('click', (e) => {
        e.preventDefault();
        alert("Generando archivo de imagen en Altísima Resolución para Plóter...\n\nEsto puede tardar entre 10 y 15 segundos. La pantalla podría parpadear. ¡No cierres la página!");

        // 1. Expandir TODO el organigrama
        function expandAll(d) {
            if (d._children) { d.children = d._children; d._children = null; }
            if (d.children) { d.children.forEach(expandAll); }
        }
        expandAll(root);
        update(root);

        // 2. Dar tiempo a la animación para que abra las cajas
        setTimeout(() => {
            const container = document.getElementById('tree-container');
            const svgEl = container.querySelector('svg');
            const gEl = svgEl.querySelector('g');
            
            // Medir el tamaño real del mapa desplegado en pixeles
            const bbox = gEl.getBBox();
            
            // Respaldar estilos para luego restaurarlos
            const oldTransform = gEl.getAttribute('transform');
            const oldWidth = container.style.width;
            const oldHeight = container.style.height;

            // Definir tamaño final exacto + un margen de 100px
            const finalWidth = bbox.width + 100;
            const finalHeight = bbox.height + 100;

            // Ajustar contenedor forzando al navegador a darle espacio infinito
            container.style.width = finalWidth + 'px';
            container.style.height = finalHeight + 'px';
            gEl.setAttribute('transform', `translate(${-bbox.x + 50}, ${-bbox.y + 50})`);

            // 3. Crear imagen con DomToImage, pero multiplicando su resolución x2
            const scale = 2;
            domtoimage.toPng(container, { 
                bgcolor: '#FFFFFF',
                width: finalWidth * scale,
                height: finalHeight * scale,
                style: {
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    width: finalWidth + 'px',
                    height: finalHeight + 'px'
                }
            })
            .then(function (dataUrl) {
                // Forzar descarga de la imagen gigante
                const link = document.createElement('a');
                link.download = 'Organigrama_Ploteo_Gigante.png';
                link.href = dataUrl;
                link.click();

                // 4. Restaurar el mapa a la normalidad en pantalla
                container.style.width = oldWidth || '100%';
                container.style.height = oldHeight || '100%';
                gEl.setAttribute('transform', oldTransform);
                init(); // Lo vuelve a colapsar
            })
            .catch(function (error) {
                console.error('Error al generar:', error);
                alert("Ocurrió un error. Tu navegador podría no tener memoria suficiente para una imagen tan colosal.");
                container.style.width = oldWidth || '100%';
                container.style.height = oldHeight || '100%';
                gEl.setAttribute('transform', oldTransform);
                init();
            });

        }, 850); 
    });
}

// 7. LÓGICA DE RUTAS Y FLUJOS
const selectOrigen = document.getElementById('origen');
const selectDestino = document.getElementById('destino');

function updateWorkflowSelects() {
    if (!selectOrigen || !selectDestino) return;
    selectOrigen.innerHTML = ""; selectDestino.innerHTML = "";
    const allNodesList = d3.hierarchy(orgData).descendants().map(d => d.data.name);

    allNodesList.forEach(name => {
        let opt1 = document.createElement('option'); opt1.value = opt1.innerHTML = name; selectOrigen.appendChild(opt1);
        let opt2 = document.createElement('option'); opt2.value = opt2.innerHTML = name; selectDestino.appendChild(opt2);
    });
}

const calcRutaBtn = document.getElementById('calc-ruta');
if (calcRutaBtn) {
    calcRutaBtn.addEventListener('click', () => {
        const valOrigen = selectOrigen.value; const valDestino = selectDestino.value;
        if(valOrigen === valDestino) { alert("Áreas diferentes."); return; }

        const rootCalc = d3.hierarchy(orgData);
        const nodeOrigen = rootCalc.find(d => d.data.name === valOrigen);
        const nodeDestino = rootCalc.find(d => d.data.name === valDestino);
        
        if (!nodeOrigen || !nodeDestino) return;

        const path = nodeOrigen.path(nodeDestino);
        const intermedios = path.length - 2;
        
        let flowHTML = "";
        path.forEach((nodo, index) => {
            flowHTML += `<span class="step">${nodo.data.name}</span>`;
            if(index < path.length - 1) {
                const currDepth = nodo.depth; const nextDepth = path[index + 1].depth;
                let arrow = "➔"; if (nextDepth < currDepth) arrow = "⬆️"; else if (nextDepth > currDepth) arrow = "⬇️"; 
                flowHTML += `<span class="arrow">${arrow}</span>`;
            }
        });

        document.getElementById('personas-entre').innerText = intermedios === 0 ? "Flujo directo." : `Requiere ${intermedios} instancias intermedias.`;
        document.getElementById('ruta-flujo').innerHTML = flowHTML;
        document.getElementById('resultado-flujo').classList.remove('hidden');
    });
}

// 8. MODO OSCURO
const darkModeToggle = document.getElementById('dark-mode-toggle');
if (localStorage.getItem('theme') === 'dark') { document.body.classList.add('dark-mode'); if (darkModeToggle) darkModeToggle.textContent = '🌙'; } 
else { if (darkModeToggle) darkModeToggle.textContent = '☀️'; }
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', (e) => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) { e.currentTarget.textContent = '🌙'; localStorage.setItem('theme', 'dark'); } 
        else { e.currentTarget.textContent = '☀️'; localStorage.setItem('theme', 'light'); }
    });
}

// 9. PWA
let deferredPrompt; let installAttempts = 0; const installBtn = document.getElementById('install-btn');
window.addEventListener('load', () => { if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) { if (installBtn) installBtn.classList.add('hidden'); } });
window.addEventListener('appinstalled', () => { if (installBtn) installBtn.classList.add('hidden'); });
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; });
if (installBtn) {
    installBtn.addEventListener('click', async () => {
        let installed = false;
        if (deferredPrompt) { deferredPrompt.prompt(); const { outcome } = await deferredPrompt.userChoice; deferredPrompt = null; if (outcome === 'accepted') { installed = true; installBtn.classList.add('hidden'); } else { installAttempts++; } } 
        else { installAttempts++; }
        if (!installed && installAttempts >= 5) { alert("Usa las opciones del navegador para instalar."); installAttempts = 0; }
    });
}

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { d3.select("#tree-container svg").attr("width", "100%").attr("height", "100%"); }, 200);
});
