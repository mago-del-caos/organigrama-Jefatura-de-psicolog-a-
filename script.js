// REGISTRO SERVICE WORKER (CON DETECCIÓN DE ACTUALIZACIONES AUTOMÁTICAS)
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
        
        let refreshing;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            window.location.reload();
            refreshing = true;
        });
    });
}

// ESTADO DE PERMISOS DE USUARIO
let isAdmin = false;

// 1. DATOS DEL ORGANIGRAMA Y SINCRONIZACIÓN (Cloudflare KV + LocalStorage)
const DEFAULT_ORG_DATA = {
    name: "Jefatura de Carrera: Mtra. Laura Lázaro Felipe",
    children: [
        {
            name: "Apoyo 1. Planeación y seguimiento académico-curricular",
            children: [
                { name: "Desarrollo, revisión y actualización de UCA" },
                { name: "Planear actividades y coloquios académicos" },
                { name: "Proponer la oferta de UCA y grupos" }
            ]
        },
        {
            name: "Apoyo 2. Gestión y acompañamiento docente",
            children: [
                { name: "Proyección, selección y asignación docente" },
                { name: "Inducción y capacitación de nuevo ingreso" },
                { name: "Promover estrategias 3R y uso de guías institucionales" },
                { name: "Canalizar incidencias del desempeño docente" }
            ]
        },
        {
            name: "Apoyo 3. Trayectoria académica, permanencia y atención",
            children: [
                { name: "Atención presencial (Sede GAM) y estrategias de permanencia" },
                { name: "Seguimiento de estrategias de retención y regularización" },
                { name: "Estudiantes en riesgo y vulneración de derechos" }
            ]
        },
        {
            name: "Apoyo 4. Prácticas profesionales, egreso y titulación",
            children: [
                { name: "Canalización en procesos de titulación" },
                { name: "Seguimiento a UCA de prácticas (Plan 2020 y 2023)" },
                { name: "Acompañamiento a egresados y grupos de vinculación" }
            ]
        },
        {
            name: "Apoyo 5. Seguimiento, evaluación y documentación institucional",
            children: [
                { name: "Integrar indicadores (eficiencia terminal y titulación)" },
                { name: "Informes trimestrales y anuales universitarios" },
                { name: "Elaborar notas y documentación institucional" }
            ]
        },
        {
            name: "Apoyo 6. Atención y seguimiento de incidencias",
            children: [
                { name: "Gestión continua de correos de la Licenciatura" },
                { name: "Identificar rutas de canalización o atención directa" },
                { name: "Seguimiento a incidencias reportadas por Tutoría" }
            ]
        },
        {
            name: "Apoyo 7. Acompañamiento, comunicación y seguimiento",
            children: [
                { name: "Canal de avisos para estudiantes de 1er semestre" },
                { name: "Formularios de seguimiento a necesidades emergentes" },
                { name: "Diagnóstico de modalidades de titulación" }
            ]
        },
        {
            name: "Gestores Académicos",
            children: [
                { name: "Seguimiento al ingreso y trabajo docente en AVA" },
                { name: "Validación de foros, tareas auténticas y evaluaciones" },
                { name: "Reporte de incidencias técnicas y de desempeño" },
                { name: "Revisión de entrega de actas y descargables" }
            ]
        }
    ]
};

let orgData = JSON.parse(localStorage.getItem('org_lad_data')) || DEFAULT_ORG_DATA;

// 👇 AQUÍ ESTÁ TU ENDPOINT REAL EN CLOUDFLARE
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
    if (!isAdmin) return; // Seguridad extra
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

    nodeEnter.append("foreignObject")
        .attr("width", nodeWidth - 20).attr("height", nodeHeight - 10)
        .attr("x", -(nodeWidth/2) + 10).attr("y", -(nodeHeight/2) + 5)
        .append("xhtml:div")
        .style("display", "flex").style("align-items", "center").style("justify-content", "center")
        .style("text-align", "center").style("width", "100%").style("height", "100%")
        .style("color", "#ffffff").style("font-family", "'Noto Sans', sans-serif")
        .style("font-size", "13px").style("font-weight", "500").style("pointer-events", "none")
        .html(d => d.data.name);

    const nodeUpdate = nodeEnter.merge(node);
    nodeUpdate.transition().duration(duration)
        .attr("transform", d => orientation === "horizontal" ? `translate(${d.y},${d.x})` : `translate(${d.x},${d.y})`);
    nodeUpdate.select("rect").style("fill", d => d._children ? SECONDARY_COLOR : PRIMARY_COLOR);

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


// 3. LÓGICA DE CONTROL DE ACCESO (GATEKEEPER)
const authScreen = document.getElementById('auth-screen');
const editFab = document.getElementById('edit-mode-fab');

document.getElementById('btn-guest-login').addEventListener('click', () => {
    isAdmin = false;
    authScreen.classList.add('hidden');
    if (editFab) editFab.classList.add('hidden'); // Ocultar botón de edición a invitados
    loadOrgDataFromCloud();
});

document.getElementById('btn-admin-login').addEventListener('click', () => {
    const pass = document.getElementById('admin-pass-input').value.trim();
    if (pass === "psique33") {
        isAdmin = true;
        authScreen.classList.add('hidden');
        if (editFab) editFab.classList.remove('hidden'); // Mostrar botón de edición
        loadOrgDataFromCloud();
    } else {
        alert("Contraseña incorrecta. Intenta de nuevo.");
    }
});

// 4. LÓGICA DE EDICIÓN DIRECTA DE NODOS (MODAL - SOLO ADMIN)
let selectedNodeTarget = null;
const editModal = document.getElementById('edit-modal');
const closeModalBtn = document.getElementById('close-modal');
const nodeNameInput = document.getElementById('node-name-input');
const modalNodeTitle = document.getElementById('modal-node-title');

if (editFab) {
    editFab.addEventListener('click', () => {
        if (!isAdmin) return;
        selectedNodeTarget = root;
        nodeNameInput.value = root.data.name;
        modalNodeTitle.textContent = `Editando Nodo Principal:`;
        editModal.classList.remove('hidden');
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        editModal.classList.add('hidden');
    });
}

// Doble clic para editar (Solo si es Admin)
document.addEventListener('dblclick', (e) => {
    if (!isAdmin) return;
    const targetGroup = e.target.closest('.node');
    if (targetGroup) {
        const d3Node = d3.select(targetGroup).datum();
        if (d3Node) {
            selectedNodeTarget = d3Node;
            nodeNameInput.value = d3Node.data.name;
            modalNodeTitle.textContent = `Gestionando nodo: ${d3Node.data.name}`;
            editModal.classList.remove('hidden');
        }
    }
});

// Botones de acciones del modal
const btnAddChild = document.getElementById('btn-add-child');
if (btnAddChild) {
    btnAddChild.addEventListener('click', () => {
        if (!selectedNodeTarget) return;
        const newName = nodeNameInput.value.trim();
        if (!newName) { alert("Escribe un nombre válido."); return; }
        if (!selectedNodeTarget.data.children) selectedNodeTarget.data.children = [];
        selectedNodeTarget.data.children.push({ name: newName });
        saveOrgData();
        editModal.classList.add('hidden');
        init();
    });
}

const btnEditNode = document.getElementById('btn-edit-node');
if (btnEditNode) {
    btnEditNode.addEventListener('click', () => {
        if (!selectedNodeTarget) return;
        const newName = nodeNameInput.value.trim();
        if (!newName) { alert("El nombre no puede estar vacío."); return; }
        selectedNodeTarget.data.name = newName;
        saveOrgData();
        editModal.classList.add('hidden');
        init();
    });
}

const btnDeleteNode = document.getElementById('btn-delete-node');
if (btnDeleteNode) {
    btnDeleteNode.addEventListener('click', () => {
        if (!selectedNodeTarget) return;
        if (selectedNodeTarget === root) { alert("No puedes eliminar el nodo raíz principal."); return; }
        if (!confirm(`¿Estás seguro de eliminar el nodo "${selectedNodeTarget.data.name}"?`)) return;

        const parent = selectedNodeTarget.parent;
        if (parent && parent.data.children) {
            parent.data.children = parent.data.children.filter(child => child !== selectedNodeTarget.data);
            if (parent.data.children.length === 0) delete parent.data.children;
        }
        saveOrgData();
        editModal.classList.add('hidden');
        init();
    });
}

const btnExportJson = document.getElementById('btn-export-json');
if (btnExportJson) {
    btnExportJson.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orgData, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "orgData.json");
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
                editModal.classList.add('hidden');
                alert("Organigrama importado con éxito.");
            } catch (err) { alert("Archivo JSON no válido."); }
        };
        reader.readAsText(file);
    });
}

const btnResetOrg = document.getElementById('btn-reset-org');
if (btnResetOrg) {
    btnResetOrg.addEventListener('click', () => {
        if (confirm("¿Restaurar el organigrama original?")) {
            localStorage.removeItem('org_lad_data');
            orgData = JSON.parse(JSON.stringify(DEFAULT_ORG_DATA));
            saveOrgData();
            init();
            editModal.classList.add('hidden');
        }
    });
}


// 5. LÓGICA DE INTERFAZ & TABS
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

// DESCARGAR PNG
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

// 6. LÓGICA DE FLUJO DE TRABAJO
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
