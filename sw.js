// REGISTRO DEL SERVICE WORKER
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW registrado:', reg.scope))
            .catch(err => console.log('Error SW:', err));
    });
}

// 1. DATOS DEL ORGANIGRAMA
const orgData = {
    name: "Jefatura de Carrera: Mtra. Laura Lázaro Felipe",
    children: [
        { name: "Innovación y gestión: Mtra. Vianey Ulloa Cisneros", children: [ { name: "Prácticas Profesionales III y IV" }, { name: "Seminario de Titulación" }, { name: "Actualización de UCAs" }, { name: "Coloquios académicos" } ] },
        { name: "Gestión académica: Mtra. Wendy González Trejo", children: [ { name: "Incidencias en AVA" }, { name: "Atención a estudiantes" }, { name: "Contenidos académicos" }, { name: "Procesos de titulación" } ] },
        { name: "Trayectoria y permanencia: Mtro. Ángel E. Hernández Martínez", children: [ { name: "Atención presencial y a distancia" }, { name: "Seguimiento de ingreso" }, { name: "Plan de trabajo" }, { name: "Evaluación de foros" } ] },
        { name: "Evaluación e inteligencia: Mtra. Lucía X. Pineda Medina", children: [ { name: "Indicadores de titulación" }, { name: "Eficiencia terminal" }, { name: "Satisfacción estudiantil" } ] },
        { name: "Titulación: C. Mayra Castelán Escobar", children: [ { name: "Diagnóstico de modalidades" }, { name: "Formularios 8vo semestre" }, { name: "Bases de datos" } ] },
        { name: "Incidencias académicas: Candidato 1", children: [ { name: "Soporte técnico plataforma" }, { name: "Canalización de casos" }, { name: "Derechos estudiantiles" } ] },
        { name: "Calidad docente: 4 apoyos a la gestión", children: [ { name: "Revisión de ingreso" }, { name: "Evaluación de contenidos" }, { name: "Monitoreo semanal" } ] }
    ]
};

// 2. CONFIGURACIÓN D3.js (Colores UNRC)
let orientation = "horizontal";
let svg, g, root, treeLayout, zoom;
let i = 0;
const duration = 750;
const container = document.getElementById("tree-container");

const nodeWidth = 260;
const nodeHeight = 80;

// Colores Institucionales UNRC
const PRIMARY_COLOR = "#9F2241"; // Guinda
const SECONDARY_COLOR = "#BC955C"; // Dorado
const TERTIARY_COLOR = "#235B4E"; // Verde

function init() {
    d3.select("#tree-container").selectAll("*").remove();
    
    const width = container.clientWidth;
    const height = container.clientHeight;

    svg = d3.select("#tree-container").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .style("cursor", "grab");

    let defs = svg.append("defs");
    let filter = defs.append("filter").attr("id", "drop-shadow").attr("height", "130%");
    filter.append("feDropShadow").attr("dx", "0").attr("dy", "4").attr("stdDeviation", "4").attr("flood-color", "#000000").attr("flood-opacity", "0.2");

    g = svg.append("g");
        
    zoom = d3.zoom().scaleExtent([0.2, 3]).on("zoom", (event) => g.attr("transform", event.transform));
    svg.call(zoom);
    
    treeLayout = orientation === "horizontal" 
        ? d3.tree().nodeSize([nodeHeight + 40, nodeWidth + 80]) 
        : d3.tree().nodeSize([nodeWidth + 20, nodeHeight + 80]);

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
    if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
    }
}

function update(source) {
    const treeData = treeLayout(root);
    const nodes = treeData.descendants();
    const links = treeData.descendants().slice(1);

    const node = g.selectAll("g.node").data(nodes, d => d.id || (d.id = ++i));

    const nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", d => orientation === "horizontal" ? `translate(${source.y0},${source.x0})` : `translate(${source.x0},${source.y0})`)
        .on("click", click);

    nodeEnter.append("rect")
        .attr("width", nodeWidth).attr("height", nodeHeight)
        .attr("x", -(nodeWidth/2)).attr("y", -(nodeHeight/2))
        .attr("rx", 8).attr("ry", 8)
        .style("fill", d => d._children ? SECONDARY_COLOR : PRIMARY_COLOR)
        .style("stroke", TERTIARY_COLOR).style("stroke-width", "2px")
        .style("filter", "url(#drop-shadow)");

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
        .attr("transform", d => orientation === "horizontal" ? `translate(${source.y},${source.x})` : `translate(${source.x},${source.y})`)
        .remove();
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

// 3. LÓGICA DE INTERFAZ (Pestañas, Botones)
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
    
    // Recalcular tamaño del organigrama si volvemos a esa pestaña
    if(tabId === 'org-tab') {
        setTimeout(() => init(), 100);
    }
}

document.getElementById('toggle-orientation').addEventListener('click', (e) => {
    orientation = orientation === "horizontal" ? "vertical" : "horizontal";
    e.target.textContent = orientation === "horizontal" ? "↳ Cambiar Vista" : "↳ Vista Horizontal";
    init();
});

// Descargar como PNG
document.getElementById('download-png').addEventListener('click', () => {
    const svgElement = document.querySelector('#tree-container svg');
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgElement);
    
    // Añadir fondo blanco para el PNG
    svgString = svgString.replace('<svg ', '<svg style="background-color: white;" ');
    
    const blob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = svgElement.clientWidth * 2; // x2 para alta resolución
        canvas.height = svgElement.clientHeight * 2;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = 'Organigrama_LAD_UNRC.png';
        a.click();
        URL.revokeObjectURL(url);
    };
    img.src = url;
});

// Imprimir
document.getElementById('print-btn').addEventListener('click', () => window.print());

// 4. PWA LÓGICA DE INSTALACIÓN
let deferredPrompt;
const installBtn = document.getElementById('install-btn');
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove('hidden');
});
installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        installBtn.classList.add('hidden');
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        if (outcome !== 'accepted') installBtn.classList.remove('hidden');
    }
});

// Inicializar
init();
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        d3.select("#tree-container svg").attr("width", "100%").attr("height", "100%");
    }, 200);
});
