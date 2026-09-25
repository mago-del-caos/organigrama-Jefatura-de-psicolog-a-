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

// 1. DATOS DEL ORGANIGRAMA Y SINCRONIZACIÓN (LICENCIATURA EN PSICOLOGÍA A DISTANCIA)
const DEFAULT_ORG_DATA = {
    name: "Jefatura de Carrera: Mtra. Laura Lázaro Felipe",
    children: [
        {
            name: "Apoyo 1. Planeación y seguimiento académico-curricular",
            children: [
                {
                    name: "Desarrollo, revisión y actualización de UCA",
                    children: [
                        { name: "Verificar congruencia con Modelo Educativo y normativa" },
                        { name: "Análisis de perfiles y integración de equipos especialistas (Educativa, Clínica, Social y Laboral)" },
                        { name: "Desarrollo de contenidos, problemas prototípicos, incidentes críticos, tareas y foros" },
                        { name: "Reactivos para extraordinarios, exámenes finales y recuperación" }
                    ]
                },
                {
                    name: "Planear actividades y coloquios académicos",
                    children: [
                        { name: "Coloquios, encuentros académicos y talleres curriculares/extracurriculares" },
                        { name: "Espacios de presentación, intercambio y reflexión de proyectos de investigación" }
                    ]
                },
                {
                    name: "Proponer la oferta de UCA y grupos",
                    children: [
                        { name: "Revisión y propuesta de oferta de UCA por semestre" },
                        { name: "Elaboración de cronogramas por módulos y unidades" }
                    ]
                },
                {
                    name: "Apoyo 1.1 Análisis de datos",
                    children: [
                        { name: "Informes trimestrales y anuales requeridos por la Universidad" },
                        { name: "Análisis estadístico de resultados académicos (tendencias y áreas de atención)" },
                        { name: "Reportes para toma de decisiones y cursos de recuperación intersemestral" },
                        { name: "Metas cuantitativas y alineación (Plan Nac. Desarrollo, P.S. Ciencia y P.I. Rosario Castellanos)" }
                    ]
                }
            ]
        },
        {
            name: "Apoyo 2. Gestión y acompañamiento docente",
            children: [
                {
                    name: "Proyección, selección y asignación docente",
                    children: [
                        { name: "Proyección por ciclo escolar según oferta académica y grupos" },
                        { name: "Identificación, valoración y selección de perfiles profesiográficos en modalidad a distancia" },
                        { name: "Asignación docente semestral de UCA y grupos" }
                    ]
                },
                {
                    name: "Inducción y capacitación de nuevo ingreso",
                    children: [
                        { name: "Inducción sobre operación académica, características de UCA y trabajo en el AVA" },
                        { name: "Coordinación de canales de comunicación y seguimiento institucional" }
                    ]
                },
                {
                    name: "Promover estrategias 3R y uso de guías institucionales",
                    children: [
                        { name: "Necesidades de fortalecimiento de la práctica docente" },
                        { name: "Uso de la guía institucional para retroalimentación académica y sesiones virtuales" },
                        { name: "Revisión de perfiles para prácticas profesionales y cursos de recuperación" }
                    ]
                },
                {
                    name: "Canalizar incidencias del desempeño docente",
                    children: [
                        { name: "Análisis, seguimiento y canalización de casos con incidencias en funciones docentes" }
                    ]
                }
            ]
        },
        {
            name: "Apoyo 3. Trayectoria académica, permanencia y atención",
            children: [
                {
                    name: "Atención presencial (Sede GAM) y estrategias de permanencia",
                    children: [
                        { name: "Atención presencial a estudiantes para resolución de dudas sobre UCA" },
                        { name: "Canalización sobre procesos de titulación y alternativas de acreditación" },
                        { name: "Propuesta de estrategias de permanencia y seguimiento a trayectoria académica" }
                    ]
                },
                {
                    name: "Seguimiento de estrategias de retención y regularización",
                    children: [
                        { name: "Seguimiento a estudiantes en riesgo a partir de información del SAME" },
                        { name: "Promoción de estrategias 3R y elaboración de materiales de apoyo docente" },
                        { name: "Creación y seguimiento de canal exclusivo para estudiantes de primer semestre" }
                    ]
                },
                {
                    name: "Estudiantes en riesgo y formación especializada",
                    children: [
                        { name: "Acompañamiento en creación de cursos de formación docente y extracurriculares" },
                        { name: "Seguimiento a UCA de estancias laborales y seminarios de titulación (Planes 2020 y 2023)" }
                    ]
                }
            ]
        },
        {
            name: "Apoyo 4. Prácticas profesionales, egreso y titulación",
            children: [
                { name: "Canalización en procesos de titulación a las áreas correspondientes" },
                { name: "Aplicación y seguimiento de formularios para estudiantes de 8° semestre" },
                { name: "Seguimiento a estrategias de egreso, servicio social, idiomas y grupos de WhatsApp" }
            ]
        },
        {
            name: "Apoyo 5. Atención y seguimiento de incidencias",
            children: [
                { name: "Revisión y gestión continua de correos electrónicos de la Licenciatura" },
                { name: "Identificación de solicitudes, determinación de rutas de atención y respuesta directa" },
                { name: "Organización y sistematización del registro de atención brindada" },
                { name: "Seguimiento a incidencias de estudiantes reportadas por Tutoría (LPSI-LAD)" }
            ]
        },
        {
            name: "Apoyo 6. Acompañamiento, comunicación y seguimiento",
            children: [
                { name: "Construcción de indicadores y aplicación de formularios de seguimiento a grupos" },
                { name: "Análisis y triangulación de datos para identificar patrones de comportamiento" },
                { name: "Elaboración de reportes de monitoreo para medidas emergentes o remediales" },
                { name: "Implementación de campañas de alfabetización en nuevas tecnologías en psicología" }
            ]
        },
        {
            name: "Gestores Académicos / SAME (Supervisor de Acompañamiento)",
            children: [
                { name: "Seguimiento docente: ingreso a plataforma, plan de trabajo, foros y tareas auténticas" },
                { name: "Integración de concentrado actualizado (nombre, correo, teléfono, UCA y grupos)" },
                { name: "Brindar información inicial del curso, canales de comunicación y acompañamiento" },
                { name: "Revisar disponibilidad de recursos, foros sin restricciones y envío de fechas clave por módulo" },
                { name: "Monitoreo semanal de acceso docente e incidencias técnicas y operativas" },
                { name: "Supervisión de recuperación, retención y regularización de alumnos en riesgo (reportado al área 3R)" },
                { name: "Verificación de evaluaciones en tiempo y forma, retroalimentación y entrega de formatos por unidad" },
                { name: "Descarga de calificadores al cierre del bloque, gráficas de asistencia y corroboración de calificaciones" },
                { name: "Dar seguimiento al llenado, entrega, validación de actas y revisión de documentación docente" }
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

// 2. CONFIGURACIÓN D3.js (BOTONES INTEGRADOS)
let orientation = "horizontal"; 
let svg, g, root, treeLayout, zoom;
let i = 0;
const duration = 750;
const container = document.getElementById("tree-container");
const nodeWidth = 340; 
const nodeHeight = 100; 

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
    zoom = d3.zoom().scaleExtent([0.2, 3]).on("zoom", (event) => g.attr("transform", event.transform));
    svg.call(zoom);
    
    treeLayout = orientation === "horizontal" ? d3.tree().nodeSize([nodeHeight + 40, nodeWidth + 80]) : d3.tree().nodeSize([nodeWidth + 20, nodeHeight + 80]);

    root = d3.hierarchy(orgData, d => d.children);
    root.x0 = height / 2;
    root.y0 = 0;
    
    if (root.children) {
        root.children.forEach(d => {
            if (d.children) d.children.forEach(collapseDeep);
        });
    }
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

    // CONTENEDOR HTML DEL NODO (FLEXBOX)
    const foDiv = nodeEnter.append("foreignObject")
        .attr("width", nodeWidth - 20).attr("height", nodeHeight - 10)
        .attr("x", -(nodeWidth/2) + 10).attr("y", -(nodeHeight/2) + 5)
        .append("xhtml:div")
        .style("display", "flex").style("flex-direction", "column").style("height", "100%");

    // TEXTO DEL NODO
    foDiv.append("div")
        .attr("class", "node-text")
        .style("flex-grow", "1").style("display", "flex").style("align-items", "center")
        .style("justify-content", "center").style("text-align", "center")
        .style("color", "#ffffff").style("font-family", "'Noto Sans', sans-serif")
        .style("font-size", "13px").style("font-weight", "500")
        .html(d => d.data.name);

    // BOTONES DE ACCIÓN (Aparecen solo si isAdmin === true)
    const actions = foDiv.append("div")
        .attr("class", "node-actions")
        .style("display", isAdmin ? "flex" : "none")
        .style("justify-content", "center").style("gap", "15px").style("padding-bottom", "5px");

    actions.append("button").html("✏️").attr("title", "Editar").attr("class", "node-btn")
        .on("click", (event, d) => { event.stopPropagation(); promptEditNode(d); });

    actions.append("button").html("➕").attr("title", "Añadir subnodo").attr("class", "node-btn")
        .on("click", (event, d) => { event.stopPropagation(); promptAddChild(d); });

    actions.append("button").html("❌").attr("title", "Eliminar nodo").attr("class", "node-btn")
        .on("click", (event, d) => { event.stopPropagation(); promptDeleteNode(d); });

    // ACTUALIZAR NODOS
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

// 3. FUNCIONES DIRECTAS DE EDICIÓN
function promptEditNode(d) {
    const newName = prompt("Editar nombre del cargo o área:", d.data.name);
    if (newName !== null && newName.trim() !== "") {
        d.data.name = newName.trim();
        saveOrgData();
        init(); 
    }
}

function promptAddChild(d) {
    const newName = prompt("Escribe el nombre del nuevo subnodo:");
    if (newName !== null && newName.trim() !== "") {
        if (!d.data.children) d.data.children = [];
        d.data.children.push({ name: newName.trim() });
        if (d._children) { d.children = d._children; d._children = null; }
        saveOrgData();
        init(); 
    }
}

function promptDeleteNode(d) {
    if (d === root) {
        alert("El nodo principal (raíz) no se puede eliminar.");
        return;
    }
    if (confirm(`¿Estás seguro de eliminar "${d.data.name}" y todos sus subniveles?`)) {
        const parent = d.parent;
        if (parent && parent.data.children) {
            parent.data.children = parent.data.children.filter(child => child !== d.data);
            if (parent.data.children.length === 0) delete parent.data.children;
        }
        saveOrgData();
        init();
    }
}

// 4. LÓGICA DE CONTROL DE ACCESO (GATEKEEPER)
const authScreen = document.getElementById('auth-screen');
const settingsFab = document.getElementById('settings-fab');

document.getElementById('btn-guest-login').addEventListener('click', () => {
    isAdmin = false;
    authScreen.classList.add('hidden');
    if (settingsFab) settingsFab.classList.add('hidden'); 
    loadOrgDataFromCloud();
});

document.getElementById('btn-admin-login').addEventListener('click', () => {
    const pass = document.getElementById('admin-pass-input').value.trim();
    if (pass === "psique33" || pass === "lulut" || pass === "L0b0l0b0") {
        isAdmin = true;
        authScreen.classList.add('hidden');
        if (settingsFab) settingsFab.classList.remove('hidden'); 
        loadOrgDataFromCloud();
    } else {
        alert("Contraseña incorrecta. Intenta de nuevo.");
    }
});

// 5. MODAL DE AJUSTES
const settingsModal = document.getElementById('settings-modal');
const closeModalBtn = document.getElementById('close-modal');

if (settingsFab) {
    settingsFab.addEventListener('click', () => {
        if (!isAdmin) return;
        settingsModal.classList.remove('hidden');
    });
}
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });
}

const btnExportJson = document.getElementById('btn-export-json');
if (btnExportJson) {
    btnExportJson.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orgData, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "orgData_Respaldo.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });
}

const importFileInput = document.getElementById('import-file-input');
const btnImportJson = document.getElementById('btn-import-json');
if (btnImportJson && importFileInput) {
    btnImportJson.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                orgData = JSON.parse(evt.target.result);
                saveOrgData();
                init();
                settingsModal.classList.add('hidden');
                alert("Organigrama restaurado con éxito.");
            } catch (err) { alert("Archivo JSON no válido."); }
        };
        reader.readAsText(file);
    });
}

const btnResetOrg = document.getElementById('btn-reset-org');
if (btnResetOrg) {
    btnResetOrg.addEventListener('click', () => {
        if (confirm("¿Estás seguro de restaurar el organigrama original de la Jefatura? Se perderán los cambios en la nube.")) {
            localStorage.removeItem('org_lad_data');
            orgData = JSON.parse(JSON.stringify(DEFAULT_ORG_DATA));
            saveOrgData();
            init();
            settingsModal.classList.add('hidden');
        }
    });
}

// 6. LÓGICA DE INTERFAZ, TABS Y FLUJO
const downloadFab = document.getElementById('download-png-fab');

function setActiveTab(evt) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (evt && evt.currentTarget && evt.currentTarget.classList.contains('tab-btn')) {
        evt.currentTarget.classList.add('active');
    }
}
function showTab(tabId, evt) {
    setActiveTab(evt);
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if (downloadFab) downloadFab.classList.add('hidden'); 
}
function showOrgTab(orient, evt) {
    setActiveTab(evt);
    orientation = orient;
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById('org-tab').classList.add('active');
    if (downloadFab) downloadFab.classList.remove('hidden'); 
    setTimeout(() => init(), 100);
}

if (downloadFab) {
    downloadFab.addEventListener('click', (e) => {
        e.preventDefault();
        const node = document.getElementById('tree-container');
        domtoimage.toPng(node, { bgcolor: getComputedStyle(document.body).getPropertyValue('--bg-color') })
            .then(function (dataUrl) {
                const link = document.createElement('a');
                link.download = 'Organigrama_LAD_UNRC.png';
                link.href = dataUrl;
                link.click();
            })
            .catch(function (error) { console.error('Error al descargar:', error); });
    });
}

const selectOrigen = document.getElementById('origen');
const selectDestino = document.getElementById('destino');

function updateWorkflowSelects() {
    if (!selectOrigen || !selectDestino) return;
    selectOrigen.innerHTML = "";
    selectDestino.innerHTML = "";
    const allNodesList = d3.hierarchy(orgData).descendants().map(d => d.data.name);

    allNodesList.forEach(name => {
        let opt1 = document.createElement('option');
        opt1.value = opt1.innerHTML = name;
        selectOrigen.appendChild(opt1);
        
        let opt2 = document.createElement('option');
        opt2.value = opt2.innerHTML = name;
        selectDestino.appendChild(opt2);
    });
}

const calcRutaBtn = document.getElementById('calc-ruta');
if (calcRutaBtn) {
    calcRutaBtn.addEventListener('click', () => {
        const valOrigen = selectOrigen.value;
        const valDestino = selectDestino.value;
        
        if(valOrigen === valDestino) {
            alert("El origen y el destino deben ser áreas diferentes.");
            return;
        }

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
                const currDepth = nodo.depth;
                const nextDepth = path[index + 1].depth;
                let arrow = "➔"; 
                if (nextDepth < currDepth) arrow = "⬆️"; 
                else if (nextDepth > currDepth) arrow = "⬇️"; 
                flowHTML += `<span class="arrow">${arrow}</span>`;
            }
        });

        let textoResultado = intermedios === 0 ? "Canalización y comunicación directa (sin áreas intermedias)." : `La canalización requiere pasar por ${intermedios} instancia(s) intermedias.`;
        document.getElementById('personas-entre').innerText = textoResultado;
        document.getElementById('ruta-flujo').innerHTML = flowHTML;
        document.getElementById('resultado-flujo').classList.remove('hidden');
    });
}

// 7. MODO OSCURO
const darkModeToggle = document.getElementById('dark-mode-toggle');
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    if (darkModeToggle) darkModeToggle.textContent = '🌙'; 
} else {
    if (darkModeToggle) darkModeToggle.textContent = '☀️'; 
}
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', (e) => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            e.currentTarget.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
        } else {
            e.currentTarget.textContent = '☀️';
            localStorage.setItem('theme', 'light');
        }
    });
}

// 8. PWA LÓGICA 
let deferredPrompt;
let installAttempts = 0; 
const installBtn = document.getElementById('install-btn');

window.addEventListener('load', () => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
        if (installBtn) installBtn.classList.add('hidden');
    }
});

window.addEventListener('appinstalled', () => {
    if (installBtn) installBtn.classList.add('hidden');
});

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); 
    deferredPrompt = e; 
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        let installed = false;
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            deferredPrompt = null;
            if (outcome === 'accepted') { installed = true; installBtn.classList.add('hidden'); }
            else { installAttempts++; }
        } else { installAttempts++; }

        if (!installed && installAttempts >= 5) {
            alert("Para instalar la app en este dispositivo:\n\nEn PC: Haz clic en el ícono de 'Instalar' en la barra de direcciones.\n\nEn Móvil: Selecciona 'Agregar a pantalla de inicio' o 'Instalar app'.");
            installAttempts = 0; 
        }
    });
}

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        d3.select("#tree-container svg").attr("width", "100%").attr("height", "100%");
    }, 200);
});
