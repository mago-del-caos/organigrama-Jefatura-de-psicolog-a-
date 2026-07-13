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

// Dimensiones de las "tarjetas" (nodos)
const nodeWidth = 240;
const nodeHeight = 65;

function init() {
    // Limpiar contenedor previo
    d3.select("#tree-container").selectAll("*").remove();
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Márgenes para evitar que se corte el diagrama
    const margin = {top: 60, right: 120, bottom: 60, left: 120};

    // Crear SVG principal
    svg = d3.select("#tree-container").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("cursor", "grab");

    // Grupo contenedor para pan y zoom
    g = svg.append("g");
        
    // Lógica de Zoom y Paneo
    zoom = d3.zoom()
        .scaleExtent([0.2, 3]) // Zoom de 20% hasta 300%
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });
    svg.call(zoom);
    
    // Lógica de espaciado según la orientación
    if (orientation === "horizontal") {
        treeLayout = d3.tree().nodeSize([nodeHeight + 30, nodeWidth + 100]);
    } else {
        treeLayout = d3.tree().nodeSize([nodeWidth + 20, nodeHeight + 80]);
    }

    // Convertir datos planos a jerarquía D3
    root = d3.hierarchy(orgData, d => d.children);
    root.x0 = height / 2;
    root.y0 = 0;

    // Colapsar todos los nodos secundarios al iniciar la app para no saturar la pantalla
    root.children.forEach(collapse);
    
    // Renderizar
    update(root);
    
    // Centrar la vista inicial de forma elegante (responsive)
    let initialX, initialY;
    if (orientation === "horizontal") {
        initialX = width < 768 ? width / 8 : width / 4; 
        initialY = height / 2;
    } else {
        initialX = width / 2;
        initialY = height / 4;
    }
    
    const initialTransform = d3.zoomIdentity.translate(initialX, initialY).scale(0.85);
    svg.call(zoom.transform, initialTransform);
}

// Función recursiva para colapsar hijos
function collapse(d) {
    if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
    }
}

// Función principal de actualización y dibujo
function update(source) {
    const treeData = treeLayout(root);
    const nodes = treeData.descendants();
    const links = treeData.descendants().slice(1);

    // ================== NODOS ==================
    const node = g.selectAll("g.node")
        .data(nodes, d => d.id || (d.id = ++i));

    // Entrada de nuevos nodos
    const nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", d => orientation === "horizontal" 
            ? `translate(${source.y0},${source.x0})` 
            : `translate(${source.x0},${source.y0})`)
        .on("click", click);

    // Dibujar rectángulo del nodo
    nodeEnter.append("rect")
        .attr("width", nodeWidth)
        .attr("height", nodeHeight)
        .attr("x", -(nodeWidth/2))
        .attr("y", -(nodeHeight/2))
        .attr("rx", 12) // Bordes muy redondeados (Alta Gama)
        .attr("ry", 12)
        .style("fill", d => d._children ? "var(--hover-color)" : "var(--primary-color)")
        .style("stroke", "#4a0000")
        .style("stroke-width", "2px")
        .style("box-shadow", "0 4px 6px rgba(0,0,0,0.1)");

    // Usar foreignObject para texto Multilinea nativo HTML (Evita texto sobrepuesto o cortado)
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
        .style("font-family", "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif")
        .style("font-size", "12px")
        .style("font-weight", "500")
        .style("pointer-events", "none") // Deja que el click pase al nodo
        .html(d => d.data.name);

    // Actualizar nodos
    const nodeUpdate = nodeEnter.merge(node);

    nodeUpdate.transition()
        .duration(duration)
        .attr("transform", d => orientation === "horizontal" 
            ? `translate(${d.y},${d.x})` 
            : `translate(${d.x},${d.y})`);

    nodeUpdate.select("rect")
        .style("fill", d => d._children ? "var(--hover-color)" : "var(--primary-color)")
        .style("cursor", "pointer");

    // Salida de nodos colapsados
    const nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", d => orientation === "horizontal" 
            ? `translate(${source.y},${source.x})` 
            : `translate(${source.x},${source.y})`)
        .remove();

    nodeExit.select("rect").attr("width", 1e-6).attr("height", 1e-6);
    nodeExit.select("foreignObject").style("opacity", 1e-6);

    // ================== ENLACES (Líneas) ==================
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

    // Guardar posiciones anteriores para transiciones suaves
    nodes.forEach(d => {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

// Dibujar las curvas de conexión entre nodos
function diagonal(s, d) {
    if (orientation === "horizontal") {
        return `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`;
    } else {
        return `M ${s.x} ${s.y}
                C ${s.x} ${(s.y + d.y) / 2},
                  ${d.x} ${(s.y + d.y) / 2},
                  ${d.x} ${d.y}`;
    }
}

// Clic: Alternar expansión/colapso
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

// ==========================================
// 3. CONTROLES Y RESPONSIVIDAD
// ==========================================
const toggleBtn = document.getElementById('toggle-orientation');
toggleBtn.addEventListener('click', () => {
    orientation = orientation === "horizontal" ? "vertical" : "horizontal";
    toggleBtn.textContent = orientation === "horizontal" ? "Cambiar a Vista Vertical" : "Cambiar a Vista Horizontal";
    init(); // Redibujar con nueva orientación
});

// Inicializar el árbol al cargar
init();

// Redibujar si cambia el tamaño de la ventana/pantalla (cambio de rotación de iPhone/Android)
window.addEventListener('resize', init);


// ==========================================
// 4. PWA: LÓGICA DE INSTALACIÓN (Botón FAB)
// ==========================================
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    // Evitar el prompt automático
    e.preventDefault();
    // Guardar evento para dispararlo al hacer clic
    deferredPrompt = e;
    // Mostrar el botón de descarga
    installBtn.classList.remove('hidden');
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        // Ocultar botón durante el prompt
        installBtn.classList.add('hidden');
        // Mostrar el prompt nativo
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`PWA Setup: Elección del usuario - ${outcome}`);
        
        // Limpiar
        deferredPrompt = null;
        
        // Si el usuario cancela, volvemos a mostrar el botón
        if (outcome !== 'accepted') {
            installBtn.classList.remove('hidden');
        }
    }
});
