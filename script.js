// REGISTRO SERVICE WORKER
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log('Error SW:', err));
    });
}

// 1. DATOS DEL ORGANIGRAMA (Actualizados según el Informe LAD Psicología)
const orgData = {
    name: "Jefatura de Carrera: Mtra. Laura Lázaro Felipe",
    children: [
        {
            name: "Innovación y gestión del modelo educativo: Mtra. Vianey Ulloa Cisneros",
            children: [
                { name: "Calidad educativa, consolidación y contenidos académicos" },
                { name: "Innovación curricular, didáctica y modelo educativo" },
                { name: "Seguimiento Prácticas Profesionales III y IV" },
                { name: "Seminarios de Titulación Teórico y Práctico" },
                { name: "Actualización de UCAs y Coloquios académicos" },
                { name: "Creación de perfiles de tutores y docentes" }
            ]
        },
        {
            name: "Gestión académica y atención estudiantil: Mtra. Wendy González Trejo",
            children: [
                { name: "Atención de incidencias académicas en AVA" },
                { name: "Acompañamiento a estudiantes y docentes" },
                { name: "Gestión y seguimiento de procesos de titulación" },
                { name: "Sesiones informativas de titulación e idioma" },
                { name: "Procesos administrativos emergentes" }
            ]
        },
        {
            name: "Trayectoria y permanencia estudiantil: Mtro. Ángel E. Hernández Martínez",
            children: [
                { name: "Atención presencial y a distancia" },
                { name: "Seguimiento de trayectoria y casos particulares" },
                { name: "Estrategias de retención, recuperación y regularización" },
                { name: "Seguimiento docente (ingreso a plataforma y plan de trabajo)" }
            ]
        },
        {
            name: "Evaluación e inteligencia institucional: Mtra. Lucía X. Estrada Medina",
            children: [
                { name: "Informes de titulación, eficiencia terminal y satisfacción" },
                { name: "Sistematización de información y resultados" },
                { name: "Incorporación académico-administrativa" }
            ]
        },
        {
            name: "Ecosistemas digitales y nuevas tecnologías: Mtro. Pablo A. Rivera Juvenal",
            children: [
                { name: "Generación de ecosistema digital y app (Android/iOS/PC)" },
                { name: "Tutoriales de plataforma y herramientas digitales" },
                { name: "Alfabetización digital y consultoría TIC" }
            ]
        },
        {
            name: "Trayectoria, permanencia y titulación: C. vacante abierta",
            children: [
                { name: "Diagnóstico de modalidades de titulación (8vo semestre)" },
                { name: "Triangulación de información y análisis" },
                { name: "Desarrollo de bases de datos y macros" }
            ]
        },
        {
            name: "Seguimiento y atención a incidencias: Vacante abierta (Derecho/Psicología)",
            children: [
                { name: "Incidencias académicas y técnicas en plataforma" },
                { name: "Atención presencial, virtual y canalización de casos" },
                { name: "Análisis de incidencias docentes" },
                { name: "Promoción de normas de convivencia y derechos" }
            ]
        },
        {
            name: "Gestores académicos: cuatro vacantes abierta. Apoyos a la gestión de calidad docente",
            children: [
                { name: "Seguimiento a 50 docentes cada uno (Ingreso, plan de trabajo)" },
                { name: "Revisión de foros, tareas auténticas y recursos" },
                { name: "Descarga de calificadores y revisión de actas" }
            ]
        }
    ]
};

// 2. CONFIGURACIÓN D3.js
let orientation = "horizontal"; 
let svg, g, root, treeLayout, zoom;
let i = 0;
const duration = 750;
const container = document.getElementById("tree-container");
const nodeWidth = 320; // Ancho un poco mayor para que quepa el texto detallado
const nodeHeight = 90;

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
    root.children.forEach(collapse);
    update(root);
    
    let initialX = orientation === "horizontal" ? (width < 768 ? width/6 : width/4) : width/2;
    let initialY = orientation === "horizontal" ? height/2 : height/4;
    svg.call(zoom.transform, d3.zoomIdentity.translate(initialX, initialY).scale(0.85));
}

function collapse(d) {
    if (d.children) { d._children = d.children; d._children.forEach(collapse); d.children = null; }
}

function update(source) {
    const treeData = treeLayout(root);
    const nodes = treeData.descendants();
    const links = treeData.descendants().slice(1);

    const node = g.selectAll("g.node").data(nodes, d => d.id || (d.id = ++i));
    const nodeEnter = node.enter().append("g").attr("class", "node")
        .attr("transform", d => orientation === "horizontal" ? `translate(${source.y0},${source.x0})` : `translate(${source.x0},${source.y0})`)
        .on("click", click);

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

function click(event, d) {
    if (d.children) { d._children = d.children; d.children = null; } 
    else { d.children = d._children; d._children = null; }
    update(d);
}

// 3. LÓGICA DE INTERFAZ
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
    downloadFab.classList.add('hidden'); 
}
function showOrgTab(orient, evt) {
    setActiveTab(evt);
    orientation = orient;
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById('org-tab').classList.add('active');
    downloadFab.classList.remove('hidden'); 
    setTimeout(() => init(), 100);
}

// DESCARGAR PNG
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
        .catch(function (error) {
            console.error('Error al descargar:', error);
        });
});

// 4. LÓGICA DE FLUJO DE TRABAJO
const allNodes = d3.hierarchy(orgData).descendants().map(d => d.data.name);
const selectOrigen = document.getElementById('origen');
const selectDestino = document.getElementById('destino');

allNodes.forEach(name => {
    let opt1 = document.createElement('option');
    opt1.value = opt1.innerHTML = name;
    selectOrigen.appendChild(opt1);
    
    let opt2 = document.createElement('option');
    opt2.value = opt2.innerHTML = name;
    selectDestino.appendChild(opt2);
});

document.getElementById('calc-ruta').addEventListener('click', () => {
    const valOrigen = selectOrigen.value;
    const valDestino = selectDestino.value;
    
    if(valOrigen === valDestino) {
        alert("El origen y el fin deben ser diferentes.");
        return;
    }

    const rootCalc = d3.hierarchy(orgData);
    const nodeOrigen = rootCalc.find(d => d.data.name === valOrigen);
    const nodeDestino = rootCalc.find(d => d.data.name === valDestino);
    
    const path = nodeOrigen.path(nodeDestino);
    const intermedios = path.length - 2;
    
    let flowHTML = "";
    path.forEach((nodo, index) => {
        flowHTML += `<span class="step">${nodo.data.name}</span>`;
        if(index < path.length - 1) {
            const currDepth = nodo.depth;
            const nextDepth = path[index + 1].depth;
            let arrow = "➔"; 
            if (nextDepth < currDepth) {
                arrow = "⬆️"; 
            } else if (nextDepth > currDepth) {
                arrow = "⬇️"; 
            }
            flowHTML += `<span class="arrow">${arrow}</span>`;
        }
    });

    let textoResultado = `Hay ${intermedios} persona(s) en la ruta media.`;
    if (intermedios === 0) {
        textoResultado = "Comunicación directa (no hay intermediarios).";
    }

    document.getElementById('personas-entre').innerText = textoResultado;
    document.getElementById('ruta-flujo').innerHTML = flowHTML;
    document.getElementById('resultado-flujo').classList.remove('hidden');
});

// 5. MODO OSCURO
const darkModeToggle = document.getElementById('dark-mode-toggle');
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    darkModeToggle.textContent = '🌙'; 
} else {
    darkModeToggle.textContent = '☀️'; 
}
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

// 6. PWA LÓGICA 
let deferredPrompt;
let installAttempts = 0; 
const installBtn = document.getElementById('install-btn');

window.addEventListener('load', () => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
        installBtn.classList.add('hidden');
    }
});

window.addEventListener('appinstalled', () => {
    installBtn.classList.add('hidden');
});

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); 
    deferredPrompt = e; 
});

installBtn.addEventListener('click', async () => {
    let installed = false;
    
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        
        if (outcome === 'accepted') {
            installed = true;
            installAttempts = 0; 
            installBtn.classList.add('hidden');
        } else {
            installAttempts++; 
        }
    } else {
        installAttempts++; 
    }

    if (!installed && installAttempts >= 5) {
        alert("Para instalar la app en este dispositivo:\n\nEn PC (Chrome/Edge): Haz clic en el ícono de 'Instalar' (parece un monitor con una flecha hacia abajo) en el lado derecho de la barra de direcciones, o desde el menú (tres puntos) selecciona 'Instalar esta aplicación'.\n\nEn Móvil: Abre el menú del navegador y selecciona 'Agregar a pantalla de inicio' o 'Instalar app'.");
        installAttempts = 0; 
    }
});

// Inicializar
window.addEventListener('load', () => { init(); });
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        d3.select("#tree-container svg").attr("width", "100%").attr("height", "100%");
    }, 200);
});
