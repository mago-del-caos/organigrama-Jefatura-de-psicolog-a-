/ ==========================================
// REGISTRO DEL SERVICE WORKER (REQUISITO PARA DESCARGAR COMO APP)
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registrado:', reg.scope))
            .catch(err => console.log('Error en Service Worker:', err));
    });
}

// ==========================================
// 1. DATOS DEL ORGANIGRAMA (Corregidos)
// ==========================================
const orgData = {
    name: "Jefatura de Carrera: Mtra. Laura Lázaro Felipe",
    children: [
        {
            name: "Innovación y gestión del modelo: Mtra. Vianey Ulloa Cisneros",
            children: [
                { name: "Prácticas Profesionales Laborales III y IV" },
                { name: "Seminario de Titulación Teórico-Práctico" },
                { name: "Actualización de UCAs" },
                { name: "Organización de coloquios académicos" }
            ]
        },
        {
            name: "Gestión académica y atención: Mtra. Wendy González Trejo",
            children: [
                { name: "Incidencias académicas en AVA" },
                { name: "Atención directa a estudiantes" },
                { name: "Desarrollo de contenidos académicos" },
                { name: "Gestión de procesos de titulación" },
                { name: "Informes e indicadores" }
            ]
        },
        {
            name: "Trayectoria y permanencia: Mtro. Ángel Emanuel Hernández Martínez",
            children: [
                { name: "Espacio permanente presencial y a distancia" },
                { name: "Seguimiento de ingreso a plataforma" },
                { name: "Publicación oportuna del plan de trabajo" },
                { name: "Evaluación de foros y tareas auténticas" }
            ]
        },
        {
            name: "Evaluación e inteligencia: Mtra. Lucía Xóchitl Pineda Medina",
            children: [
                { name: "Indicadores de titulación" },
                { name: "Eficiencia terminal" },
                { name: "Satisfacción estudiantil" },
                { name: "Monitoreo y sistematización de información" }
            ]
        },
        {
            name: "Trayectoria, permanencia y titulación: C. Mayra Castelán Escobar",
            children: [
                { name: "Diagnóstico de modalidades de titulación" },
                { name: "Formularios para estudiantes de octavo semestre" },
                { name: "Bases de datos y macros para titulación" },
                { name: "Seguimiento de procesos estudiantiles" }
            ]
        },
        {
            name: "Incidencias académicas: Candidato 1 (Psicólogo-Abogado)",
            children: [
                { name: "Incidencias técnicas de plataforma" },
                { name: "Atención presencial y virtual" },
                { name: "Canalización de casos y derechos estudiantiles" },
                { name: "Promoción de normas de convivencia" }
            ]
        },
        {
            name: "Calidad docente: 4 apoyos a la gestión",
            children: [
                { name: "Revisión de ingreso y plan de trabajo" },
                { name: "Evaluación de foros, tareas y contenidos" },
                { name: "Monitoreo semanal de plataforma" },
                { name: "Seguimiento de actas y documentación" }
            ]
        }
    ]
};

// ==========================================
// 2. CONFIGURACIÓN D3.js (Árbol Interactivo)
// ==========================================
let orientation = "horizontal";
let svg, g, root, treeLayout, zoom;
let i = 0;
const duration = 750;
const container = document.getElementById("tree-container");

// Dimensiones de los nodos
const nodeWidth = 240;
const nodeHeight = 70;

function init() {
    d3.select("#tree-container").selectAll("*").remove();
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    const margin = {top: 60, right: 120, bottom: 60, left: 120};

    svg = d3.select("#tree-container").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("cursor", "grab");

    g = svg.append("g");
        
    zoom = d3.zoom()
        .scaleExtent([0.2, 3])
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });
    svg.call(zoom);
    
    if (orientation === "horizontal") {
        treeLayout = d3.tree().nodeSize([nodeHeight + 40, nodeWidth + 80]);
    } else {
        treeLayout = d3.tree().nodeSize([nodeWidth + 20, nodeHeight + 80]);
    }

    root = d3.hierarchy(orgData, d => d.children);
    root.x0 = height / 2;
    root.y0 = 0;

    // Colapsar todo menos la raíz
    root.children.forEach(collapse);
    update(root);
    
    // Centrar
    let initialX = orientation === "horizontal" ? (width < 768 ? width/6 : width/4) : width/2;
    let initialY = orientation === "horizontal" ? height/2 : height/4;
    const initialTransform = d3.zoomIdentity.translate(initialX, initialY).scale(0.85);
    svg.call(zoom.transform, initialTransform);
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

    const node = g.selectAll("g.node")
        .data(nodes, d => d.id || (d.id = ++i));

    const nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", d => orientation === "horizontal" 
            ? `translate(${source.y0},${source.x0})` 
            : `translate(${source.x0},${source.y0})`)
        .on("click", click);

    nodeEnter.append("rect")
        .attr("width", nodeWidth)
        .attr("height", nodeHeight)
        .attr("x", -(nodeWidth/2))
        .attr("y", -(nodeHeight/2))
        .attr("rx", 10)
        .attr("ry", 10)
        .style("fill", d => d._children ? "var(--hover-color)" : "var(--primary-color)")
        .style("stroke", "#4a0000")
        .style("stroke-width", "2px")
        .style("box-shadow", "0 4px 6px rgba(0,0,0,0.1)");

    /* Uso de foreignObject para texto de ALTA GAMA (Natívo y responsivo) */
    nodeEnter.append("foreignObject")
        .attr("width", nodeWidth - 20)
        .attr("height", nodeHeight - 10)
        .attr("x", -(nodeWidth/2) + 10)
        .attr("y", -(nodeHeight/2) + 5)
        .append("xhtml:div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("justify-content", "center")
        .style("text-align", "center")
        .style("width", "100%")
        .style("height", "100%")
        .style("color", "#ffffff")
        .style("font-family", "'Segoe UI', sans-serif")
        .style("font-size", "13px")
        .style("font-weight", "500")
        .style("pointer-events", "none")
        .html(d => d.data.name);

    const nodeUpdate = nodeEnter.merge(node);

    nodeUpdate.transition()
        .duration(duration)
        .attr("transform", d => orientation === "horizontal" 
            ? `translate(${d.y},${d.x})` 
            : `translate(${d.x},${d.y})`);

    nodeUpdate.select("rect")
        .style("fill", d => d._children ? "var(--hover-color)" : "var(--primary-color)")
        .style("cursor", "pointer");

    const nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", d => orientation === "horizontal" 
            ? `translate(${source.y},${source.x})` 
            : `translate(${source.x},${source.y})`)
        .remove();

    nodeExit.select("rect").attr("width", 1e-6).attr("height", 1e-6);
    nodeExit.select("foreignObject").style("opacity", 1e-6);

    const link = g.selectAll("path.link")
        .data(links, d => d.id);

    const linkEnter = link.enter().insert("path", "g")
        .attr("class", "link")
        .style("fill", "none")
        .style("stroke", "var(--hover-color)")
        .style("stroke-width", "2.5px")
        .style("opacity", 0.6)
        .attr("d", d => {
            const o = {x: source.x0, y: source.y0};
            return diagonal(o, o);
        });

    const linkUpdate = linkEnter.merge(link);

    linkUpdate.transition()
        .duration(duration)
        .attr("d", d => diagonal(d, d.parent));

    link.exit().transition()
        .duration(duration)
        .attr("d", d => {
            const o = {x: source.x, y: source.y};
            return diagonal(o, o);
        })
        .remove();

    nodes.forEach(d => {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

function diagonal(s, d) {
    if (orientation === "horizontal") {
        return `M ${s.y} ${s.x} C ${(s.y + d.y) / 2} ${s.x}, ${(s.y + d.y) / 2} ${d.x}, ${d.y} ${d.x}`;
    } else {
        return `M ${s.x} ${s.y} C ${s.x} ${(s.y + d.y) / 2}, ${d.x} ${(s.y + d.y) / 2}, ${d.x} ${d.y}`;
    }
}

function click(event, d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);
}

const toggleBtn = document.getElementById('toggle-orientation');
toggleBtn.addEventListener('click', () => {
    orientation = orientation === "horizontal" ? "vertical" : "horizontal";
    toggleBtn.textContent = orientation === "horizontal" ? "Cambiar a Vista Vertical" : "Cambiar a Vista Horizontal";
    init();
});

init();
window.addEventListener('resize', init);

// ==========================================
// 4. PWA: LÓGICA DE INSTALACIÓN (Botón FAB)
// ==========================================
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove('hidden'); // Muestra el botón cuando el navegador permite descargar
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        installBtn.classList.add('hidden');
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Resultado de instalación: ${outcome}`);
        deferredPrompt = null;
        
        if (outcome !== 'accepted') {
            installBtn.classList.remove('hidden');
        }
    }
});
