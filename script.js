/* script.js
   Interacciones: menú móvil, tabs, scroll suave, acordeones y mapa simulado
   Vanilla JS, comentarios en español
*/

document.addEventListener('DOMContentLoaded', function () {
  // --- Variables de UI
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const btnExplorar = document.getElementById('explorar-plantas');

  // --- Menú hamburguesa (mobile)
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('open');
  });

  // Cerrar menú al click en enlace (mejor UX móvil)
  navLinks.forEach(a => {
    a.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // --- Smooth scroll para enlaces y botón
  function smoothScrollTo(selector) {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  btnExplorar.addEventListener('click', () => smoothScrollTo('#plantas'));

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        smoothScrollTo(href);
      }
    });
  });

  // --- Tabs funcionales
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabButtons.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      tabPanels.forEach(panel => {
        const show = panel.id === target;
        panel.classList.toggle('active', show);
        if (show) panel.removeAttribute('hidden');
        else panel.setAttribute('hidden', '');
      });
      // mantener focus
      btn.focus();
    });
  });

  // --- IntersectionObserver para animar cards al entrar en viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.card').forEach(card => observer.observe(card));

  // --- Interacción "map pin" en cada tarjeta: scroll al mapa y mostrar info
  const pinButtons = document.querySelectorAll('.pin-btn');
  const mapInfo = document.getElementById('map-info');
  // Datos de plantas y asignación de coordenadas aproximadas (todas las tarjetas del proyecto)
  const plantData = {
    // Medicinales existentes
    manzanilla: { name: 'Manzanilla', sci: 'Matricaria chamomilla', coords: [4.6097, -74.0817], excerpt: 'Infusión calmante, habitual en Bogotá.', family: 'Asteraceae', regions: ['Andes', 'Regiones templadas'], conditions: ['Suelo bien drenado', 'Pleno sol a semisombra', 'Altitud 0-2000 m'], benefits: 'Propiedades digestivas, calmantes y antiinflamatorias. Rica en antioxidantes y compuestos beneficiosos para el sistema digestivo. Alivia el estrés, reduce la inflamación y mejora la calidad del sueño.', planting_steps: '1. Preparar suelo bien drenado y suelto. 2. Sembrar semillas directamente en primavera. 3. Riego moderado y constante. 4. Germinación en 7-15 días. 5. Trasplante a 10 cm cuando tengan 5 cm de alto.', care_tips: 'Riego regular pero sin encharcar. Preferir pleno sol a semisombra. Eliminar malezas regularmente. Cosechar flores en floración (junio-agosto). Propagar por semillas o esquejes. Resistentes a plagas.' },
    achiote: { name: 'Achiote', sci: 'Bixa orellana', coords: [-4.2153, -69.9406], excerpt: 'Usado como colorante; regiones amazónicas.', family: 'Bixaceae', regions: ['Amazonas', 'Regiones tropicales'], conditions: ['Clima cálido', 'Alta humedad', 'Suelos ricos y humedales'], benefits: 'Excelente fuente de beta-caroteno y antioxidantes. Propiedades antiinflamatorias, diuréticas y beneficiosas para la salud cardiovascular. Usado tradicionalmente para mejorar la circulación.', planting_steps: '1. Semillas en germinador con turba húmeda. 2. Temperatura de 25-30°C para germinar. 3. Trasplante a maceta cuando tenga 2 pares de hojas. 4. Siembra definitiva a 2-3 metros de distancia. 5. Luz indirecta inicialmente, luego sol directo.', care_tips: 'Mantener suelo húmedo pero drenado. Riego frecuente en zonas secas. Fertilizar mensualmente. Proteger de heladas (planta tropical). Cosecha de frutos 8-10 meses después. Podar para estimular crecimiento.' },
    romero: { name: 'Romero', sci: 'Rosmarinus officinalis', coords: [4.6097, -74.0817], excerpt: 'Aromática en jardines andinos.', family: 'Lamiaceae', regions: ['Andes', 'Zonas templadas'], conditions: ['Pleno sol', 'Suelos secos a moderados', 'Buena circulación de aire'], benefits: 'Estimula la memoria y la concentración. Propiedades antioxidantes y antiinflamatorias. Mejora la circulación sanguínea y fortalece el sistema inmunológico.', planting_steps: '1. Sembrar semillas en primavera en semillero. 2. Germinar en 20-30 días. 3. Trasplante cuando tenga 8 cm de altura. 4. Plantación definitiva con 30-40 cm de distancia. 5. Suelo muy bien drenado preferentemente arenoso.', care_tips: 'Riego moderado, especialmente en invierno. Prefiere sequedad a humedad excesiva. Poda anual para mantener forma compacta. Cosechar ramas cuando adulto. Muy resistente a plagas y enfermedades. Vive muchos años.' },
    albahaca: { name: 'Albahaca', sci: 'Ocimum basilicum', coords: [6.2442, -75.5748], excerpt: 'Cultivada en huertos y jardines.', family: 'Lamiaceae', regions: ['Regiones cálidas y templadas'], conditions: ['Pleno sol', 'Riego regular', 'Suelos fértiles'], benefits: 'Rica en vitaminas K, A y C. Propiedades antibacterianas, antiinflamatorias y antioxidantes. Favorece la digestión y ayuda a reducir la inflamación intestinal.', planting_steps: '1. Sembrar semillas directamente en surcos en primavera. 2. Germinar en 6-10 días. 3. Distancia entre plantas: 15-25 cm. 4. Suelo fértil y bien preparado. 5. Riego diario en épocas secas.', care_tips: 'Riego regular sin encharcar. Pleno sol (mínimo 6 horas). Pellizcar puntas para estimular crecimiento lateral. Eliminar flores para prolongar producción de hojas. Cosecha desde los 2 meses. Vulnerable a heladas, anual en clima frío.' },
    aloe: { name: 'Sábila (Aloe)', sci: 'Aloe vera', coords: [5.6922, -76.6581], excerpt: 'Planta suculenta, usada para piel.', family: 'Asphodelaceae', regions: ['Zonas secas y jardines urbanos'], conditions: ['Poca agua', 'Suelos arenosos', 'Pleno sol a semisombra'], benefits: 'Regenera y nutre la piel profundamente. Propiedades cicatrizantes, antiinflamatorias e hidratantes. Alivia quemaduras, hidrata la piel y estimula la producción de colágeno.', planting_steps: '1. Usar suelo muy drenado (arena + tierra). 2. Plantación desde rosetas o hojas. 3. Enterrar 2-3 cm en maceta con drenaje. 4. Esperar 3-4 días antes de riego inicial. 5. Multiplicación fácil por vástagos.', care_tips: 'Riego escaso, cada 2-3 semanas. Luz solar directa preferentemente. Suelo arenoso esencial para evitar pudrición. Sin abonos necesarios. Cosecha hojas exteriores mayores de 12 cm. Requiere poco mantenimiento, muy resistente.' },
    uncaria: { name: 'Uña de gato', sci: 'Uncaria tomentosa', coords: [-4.2153, -69.9406], excerpt: 'Planta amazónica con propiedades antiinflamatorias.', family: 'Rubiaceae', regions: ['Amazonas', 'Bosque húmedo tropical'], conditions: ['Sombra parcial', 'Suelos húmedos ricos en materia orgánica'], benefits: 'Potente antiinflamatorio y estimulante inmunológico. Reduce el dolor articular y la inflamación. Beneficiosa para artritis, dolor crónico y fortalecimiento del sistema inmune.', planting_steps: '1. Semillas en sustrato húmedo y cálido (25-30°C). 2. Germinar en vivero con sombra. 3. Trasplante cuando tenga 3-4 hojas. 4. Requiere tutorado temprano (trepadora). 5. Plantación a lado de árbol o estructura.', care_tips: 'Humedad constante pero no encharcada. Sombra parcial importante. Proteger de vientos fuertes. Riego diario en temporada seca. Cosecha de corteza después de 3-5 años. Crecimiento lento pero longevo.' },
    paico: { name: 'Paico', sci: 'Dysphania ambrosioides', coords: [4.6097, -74.0817], excerpt: 'Usada para problemas digestivos y antiparasitaria.', family: 'Amaranthaceae', regions: ['Andes', 'Zonas rurales'], conditions: ['Pleno sol a semisombra', 'Suelos pobres a moderados'], benefits: 'Propiedades antiparasitarias y antihelmínticas. Mejora la digestión y alivia cólicos intestinales. Tradicional contra parásitos y trastornos digestivos.', planting_steps: '1. Semillas muy pequeñas en semillero. 2. Trasplante a 30 cm cuando brote. 3. Suelo no requiere estar muy fértil. 4. Siembra en primavera. 5. Germinación en 10-15 días.', care_tips: 'Riego moderado y regular. Pleno sol a semisombra. Tolera suelos pobres. Maleza debe controlarse inicialmente. Cosechar hojas antes de floración. Planta anual o bienal, se auto siembra fácilmente.' },
    menta: { name: 'Menta', sci: 'Mentha', coords: [6.2442, -75.5748], excerpt: 'Aromática para infusiones y digestiones.', family: 'Lamiaceae', regions: ['Regiones templadas y frías'], conditions: ['Riego frecuente', 'Sombra parcial', 'Suelos húmedos'], benefits: 'Mejora la digestión y alivia los gases. Refrescante y estimulante. Propiedades antiespasmódicas, analgésicas y calmantes para el sistema digestivo.', planting_steps: '1. Propagar por esquejes o división de matas. 2. Enraizamiento en agua (7-10 días). 3. Plantación en maceta o terreno. 4. Espaciado de 30 cm entre plantas. 5. Prefiere soil húmedo y semi sombreado.', care_tips: 'Riego frecuente y abundante. Sombra parcial ideal. Suelo constantemente húmedo. Poda regular estimula crecimiento lateral. Cosecha de hojas antes de florecer. Invasiva: contener en maceta o área delimitada.' },
    boldo: { name: 'Boldo', sci: 'Plectranthus spp.', coords: [3.4516, -76.5320], excerpt: 'Infusiones para problemas hepáticos y digestivos.', family: 'Lamiaceae', regions: ['Pacífico', 'Jardines'], conditions: ['Sombra parcial', 'Suelos bien drenados'], benefits: 'Estimula la función hepática y la producción de bilis. Facilita la digestión de grasas. Desintoxicante hepático y protector del hígado.', planting_steps: '1. Propagar por esquejes de 10-15 cm. 2. Enraizamiento en agua o sustrato húmedo. 3. Plantación cuando raíces aparecen. 4. Maceta o terreno con sombra. 5. Distancia de 40-50 cm entre plantas.', care_tips: 'Riego moderado, suelo siempre ligeramente húmedo. Sombra parcial preferida. Poda regular mantiene forma compacta. Cosechar hojas según necesidad. Temperaturas sobre 10°C. Resiste bien plagas y enfermedades.' },
    tila: { name: 'Tila', sci: 'Tilia', coords: [4.8136, -75.6946], excerpt: 'Infusión para calmar nervios y facilitar el sueño.', family: 'Malvaceae', regions: ['Zonas templadas'], conditions: ['Clima templado', 'Suelos profundos y húmedos'], benefits: 'Sedante natural que calma el sistema nervioso. Facilita el descanso y reduce la ansiedad. Propiedades relajantes y antiespasmódicas para mejor sueño.', planting_steps: '1. Germinar semillas en frío durante invierno. 2. Estratificación recomendada (3 meses en frío). 3. Siembra en primavera directa. 4. Árbol de crecimiento lento. 5. Requiere suelo profundo y bien preparado.', care_tips: 'Riego regular en primeros años. Suelo profundo importante. Sol parcial a sol. Poda mínima, solo ramas muertas. Cosecha de flores en floración (mayo-junio). Árbol muy longevo (50+ años).' },
    valeriana: { name: 'Valeriana', sci: 'Valeriana officinalis', coords: [1.2136, -77.2815], excerpt: 'Tradicional para el insomnio y la ansiedad.', family: 'Caprifoliaceae', regions: ['Andes', 'Zonas templadas'], conditions: ['Sombra parcial', 'Suelos húmedos'], benefits: 'Poderoso sedante natural para el insomnio. Reduce la ansiedad y el estrés. Mejora la calidad del sueño sin efectos secundarios significativos.', planting_steps: '1. Semillas en semillero en primavera. 2. Estratificación en frío mejora germinación. 3. Trasplante cuando tenga 4-6 hojas. 4. Plantación en otoño. 5. Espaciado de 30-40 cm.', care_tips: 'Suelo en humedad constante. Sombra parcial con algo de sol. Florece segundo año. Cosecha de raíces después de 3 años. Flores también útiles. Poda anual antes de primavera.' },
    cola_caballo: { name: 'Cola de caballo', sci: 'Equisetum', coords: [7.1193, -73.1227], excerpt: 'Usada como diurético y en cuidados de la piel.', family: 'Equisetaceae', regions: ['Zonas húmedas', 'Orillas de ríos'], conditions: ['Suelos húmedos', 'Sombra parcial'], benefits: 'Rica en minerales, especialmente sílice. Fortalece uñas, cabello y piel. Propiedades diuréticas, remineralizantes y benéficas para la salud articular.', planting_steps: '1. Propagar por rizomas o divisiones. 2. Semillas difíciles, no recomendadas. 3. Plantación cerca de agua o suelo muy húmedo. 4. Contención importante (muy invasiva). 5. Mejor en maceta grande o zona controlada.', care_tips: 'Suelo permanentemente húmedo. Sombra parcial ideal. Muy invasiva en terreno libre. Crecimiento rápido. Cosechar tallos jóvenes. Resistente al frío. Contenido en macetas o áreas delimitadas.' },
    llanten: { name: 'Llantén', sci: 'Plantago', coords: [4.6097, -74.0817], excerpt: 'Propiedades antiinflamatorias y para la tos.', family: 'Plantaginaceae', regions: ['Regiones diversas', 'Áreas alteradas'], conditions: ['Resistente, suelos variados', 'Pleno sol a semisombra'], benefits: 'Excelente para problemas respiratorios y tos. Propiedades expectorantes y antiinflamatorias. Alivia irritación bronquial y favorece la limpieza de vías respiratorias.', planting_steps: '1. Semillas directas en primavera. 2. Suelo poco exigente, crece en cualquier terreno. 3. Germinación en 10-20 días. 4. Trasplante a 20 cm de distancia. 5. Sin preparación especial de suelo.', care_tips: 'Riego moderado, tolera sequía. Pleno sol a semisombra. Coloniza suelos pobres. Crecimiento rápido. Cosecha de hojas antes de floración. Anual o bienal. Muy resistente, se auto siembra.' },

    // Ornamentales existentes
    cattleya: { name: 'Cattleya trianae', sci: 'Cattleya trianae', coords: [10.85, -73.75], excerpt: 'Orquídea emblemática de la Sierra Nevada.', family: 'Orchidaceae', regions: ['Sierra Nevada de Santa Marta', 'Bosque montano'], conditions: ['Sombra parcial', 'Alta humedad', 'Buena ventilación'], benefits: 'Emblemática flor nacional simboliza la belleza natural. Purifica el aire de espacios interiores. Mejora la salud mental y el bienestar emocional con su presencia estética.', planting_steps: '1. Cultivo epífita en corteza de árbol o sustrato especial. 2. Necesita tutorado vertical. 3. Plantación en primavera. 4. Maceta de orquídea con buen drenaje. 5. Raíces al aire, no enterrar completamente.', care_tips: 'Luz indirecta, nunca sol directo. Humedad del 60-80%. Ventilación constante. Riego 2-3 veces por semana en clima seco. Temperatura 15-25°C. Floración anual octubre-diciembre.' },
    heliconia: { name: 'Heliconia', sci: 'Heliconiaceae', coords: [6.2442, -75.5748], excerpt: 'Planta tropical de selva húmeda.', family: 'Heliconiaceae', regions: ['Regiones húmedas y selváticas'], conditions: ['Sombra parcial a semisombra', 'Suelos ricos y húmedos'], benefits: 'Atrae polinizadores y favorece la biodiversidad. Purifica el aire en espacios interiores. Añade belleza tropical y mejora la calidad del aire del entorno.', planting_steps: '1. Semillas o rizomas plantados en primavera. 2. Suelo rico en materia orgánica. 3. Maceta o terreno con 70% de sombra. 4. Espaciado de 1-2 metros entre plantas. 5. Riego y humedad desde el inicio.', care_tips: 'Humedad constante del 70-80%. Sombra parcial importante. Temperatura mínima 15°C. Abonado mensual. Flores en 18-24 meses. Poda de hojas viejas. Larga vida (20+ años).' },
    anturio: { name: 'Anturio', sci: 'Anthurium andraeanum', coords: [6.2442, -75.5748], excerpt: 'Popular en floristería.', family: 'Araceae', regions: ['Bosques húmedos', 'Cultivo ornamental'], conditions: ['Sombra parcial', 'Suelos húmedos y ricos'], benefits: 'Excelente purificador natural del aire en interiores. Elimina sustancias tóxicas como amoníaco y formaldehído. Mejora la calidad del aire del hogar o la oficina.', planting_steps: '1. División de matas o esquejes con raíz. 2. Sustrato con turba y corteza. 3. Maceta con buen drenaje. 4. Plantación en primavera. 5. Profundidad: corona a nivel del suelo.', care_tips: 'Luz indirecta (1000-2000 lux). Humedad 70-80%. Temperatura 20-28°C. Riego 2-3 veces semana. Sustrato siempre húmedo pero drenado. Flores año redondo en buenas condiciones.' },
    calendula: { name: 'Caléndula', sci: 'Calendula officinalis', coords: [4.6097, -74.0817], excerpt: 'Flor ornamental y medicinal.', family: 'Asteraceae', regions: ['Jardines', 'Regiones templadas'], conditions: ['Pleno sol', 'Suelos bien drenados'], benefits: 'Flores comestibles que realzan platos. Cicatrizantes y antiinflamatorias si se ingieren. Atraen polinizadores y beneficiosos insectos al jardín.', planting_steps: '1. Semillas directas en primavera u otoño. 2. Germinar en 8-12 días. 3. Espaciado de 30-45 cm. 4. Suelo moderadamente fértil. 5. Riego inicial constante.', care_tips: 'Pleno sol es esencial (mínimo 6 horas). Suelo bien drenado. Riego moderado sin encharcar. Deadheading estimula más flores. Cosecha de pétalos. Anual, se auto siembra.' },
    bougainvillea: { name: 'Bougainvillea', sci: 'Bougainvillea spp.', coords: [10.85, -73.75], excerpt: 'Trepadora común en climas cálidos.', family: 'Nyctaginaceae', regions: ['Caribe', 'Zonas cálidas y urbanas'], conditions: ['Pleno sol', 'Suelos secos a moderados'], benefits: 'Transforma espacios urbanos en jardines coloridos. Atrae fauna polinizadora beneficial. Mejora la salud mental y reduce estrés con su belleza exuberante.', planting_steps: '1. Esquejes leñosos de 10-15 cm. 2. Enraizamiento en arena con hormona. 3. Plantación cuando raíces desarrolladas. 4. Suelo con arena y materia orgánica. 5. Soportes o tutorado para trepado.', care_tips: 'Pleno sol obligatorio (8+ horas). Riego escaso a moderado. Suelo bien drenado. Poda fuerte en invierno. Fertilizar mensualmente en floración. Flores todo el año en clima cálido. Espinas presentes.' },
    bromelia: { name: 'Bromelia', sci: 'Bromeliaceae', coords: [6.2442, -75.5748], excerpt: 'Plantas tropicales con brácteas llamativas.', family: 'Bromeliaceae', regions: ['Selva y bosques húmedos'], conditions: ['Sombra parcial', 'Humedad alta'], benefits: 'Acumula agua que nutre el ecosistema del bosque tropical. Belleza exótica que inspira y mejora espacios. Favorece la biodiversidad en jardines.', planting_steps: '1. Plantación de rosetas en turba y corteza. 2. Maceta con excelente drenaje. 3. Puede crecer sobre árbol o rama. 4. Luz indirecta moderada. 5. Plantación primavera.', care_tips: 'Luz indirecta 50-70%. Humedad 70-80%. Sin riego estándar: llenar la copa central. Temperatura 18-27°C. Floración anual. Pup (crías) después de flor. Vida 3-4 años por roseta.' },
    guzmania: { name: 'Guzmania', sci: 'Guzmania spp.', coords: [6.2442, -75.5748], excerpt: 'Ornamental de interior con flores tubulares.', family: 'Bromeliaceae', regions: ['Selvas y viveros'], conditions: ['Sombra', 'Humedad alta'], benefits: 'Mejora la calidad del aire interior de forma natural. Atraes fauna beneficial al jardín. Añade color tropical y bienestar emocional al espacio.', planting_steps: '1. Plantación de rosetas en sustrato especial bromelias. 2. Maceta pequeña con buen drenaje. 3. Epífita: puede crecer en árbol. 4. Luz indirecta filtrada. 5. Humedad desde el inicio.', care_tips: 'Luz indirecta 500-1000 lux. Humedad 60-80%. Riego en taza central. Temperatura 15-25°C. Floración 6-12 semanas. Pups después de floración. Requiere poco cuidado.' },
    ixora: { name: 'Ixora', sci: 'Ixora spp.', coords: [10.9685, -74.7813], excerpt: 'Arbusto con racimos de flores coloridas.', family: 'Rubiaceae', regions: ['Caribe', 'Jardines tropicales'], conditions: ['Pleno sol', 'Suelos fértiles'], benefits: 'Atrae mariposas y colibríes, beneficiosos para el jardín. Flores duraderas que prolongan el color todo el año. Mejora la biodiversidad ambiental.', planting_steps: '1. Esquejes herbáceos en primavera. 2. Enraizamiento en turba húmeda. 3. Plantación cuando raíces aparecen. 4. Espaciado 1-1.5 metros. 5. Suelo rico en materia orgánica.', care_tips: 'Pleno sol es crítico. Riego regular especialmente en floración. Suelo ligeramente ácido. Poda anual en invierno. Floración primavera-otoño. Fertilizar cada 3 semanas. Clima cálido necesario.' },
    plumeria: { name: 'Plumeria', sci: 'Plumeria spp.', coords: [11.2415, -74.1990], excerpt: 'Árbol con flores fragantes y vistosas.', family: 'Apocynaceae', regions: ['Caribe', 'Zonas cálidas'], conditions: ['Pleno sol', 'Suelos secos a moderados'], benefits: 'Flores fragantes que perfuman naturalmente el entorno. Símbolo de renacimiento y prosperidad. Atrae polinizadores beneficial al ecosistema.', planting_steps: '1. Esquejes leñosos de 25-30 cm. 2. Deshidratación 1-2 semanas. 3. Enraizamiento en arena seca. 4. Plantación en recipiente drenado. 5. Riego escaso inicialmente.', care_tips: 'Pleno sol 6-8 horas mínimo. Riego escaso (1-2 semanas). Suelo muy drenado. Caducifolia en invierno (normal). Fertilizar durante crecimiento. Floración primavera-verano. Altura 2-8 metros.' },
    hibiscus: { name: 'Hibiscus', sci: 'Hibiscus spp.', coords: [10.3910, -75.4794], excerpt: 'Flores grandes y coloridas, común en jardines.', family: 'Malvaceae', regions: ['Regiones cálidas y costeras'], conditions: ['Pleno sol', 'Riego regular'], benefits: 'Flores comestibles ricas en vitamina C. Atraers polinizadores naturales. Mejora la estética ambiental y proporciona beneficios nutritivos si se consumen.', planting_steps: '1. Semillas escarificadas o esquejes. 2. Germinación en semillero cálido. 3. Trasplante con 4 hojas. 4. Plantación a 1-2 metros. 5. Suelo bien drenado.', care_tips: 'Pleno sol 6+ horas. Riego regular no tasar riego. Suelo fértil. Poda para forma en invierno. Floración todo el año clima cálido. Plagas comunes: ácaros, mosca blanca.' },
    strelitzia: { name: 'Strelitzia', sci: 'Strelitzia', coords: [3.4516, -76.5320], excerpt: 'Ave del paraíso, efecto escultórico en jardines.', family: 'Strelitziaceae', regions: ['Regiones cálidas'], conditions: ['Pleno sol', 'Suelos bien drenados'], benefits: 'Emblemática flor de belleza única y escultórica. Purifica aire y mejora espacios. Simboliza alegría y libertad en el entorno.', planting_steps: '1. Semillas con escarificación (remojo 24h). 2. Germinación lenta 30-40 días. 3. Trasplante individual. 4. Plantación definitiva a 1-2 metros. 5. Crecimiento lento primeros años.', care_tips: 'Pleno sol obligatorio. Riego moderado anualmente. Suelo profundo bien drenado. Tolerancia a sequía una vez establecida. Floración a partir de 5 año. Vida 20+ años.' },
    philodendron: { name: 'Philodendron', sci: 'Philodendron spp.', coords: [5.6922, -76.6581], excerpt: 'Planta de follaje, popular en interiores.', family: 'Araceae', regions: ['Selvas y jardines sombreados'], conditions: ['Sombra parcial', 'Humedad constante'], benefits: 'Excelente purificador de aire interior, elimina tóxicos. Mejora la calidad del aire del hogar. Bajo mantenimiento y beneficia espacios sombreados.', planting_steps: '1. Esquejes con 2-3 nudos. 2. Enraizamiento en agua (7-10 días). 3. Plantación en turba o tierra. 4. Maceta con drenaje. 5. Tutores si crecimiento vertical.', care_tips: 'Luz indirecta 500-1000 lux. Humedad 50-70%. Riego cuando sustrato seca. Temperatura 15-25°C. Crecimiento lento. Tolerante. Tóxico si se ingiere. Pinzamiento estimula ramificación.' },
    ficus: { name: 'Ficus', sci: 'Ficus spp.', coords: [4.6097, -74.0817], excerpt: 'Árbol usado en espacios urbanos y parques.', family: 'Moraceae', regions: ['Urbano', 'Regiones templadas'], conditions: ['Riego moderado', 'Suelos profundos'], benefits: 'Importante para la sombra y regulación térmica urbana. Mejora la calidad del aire en ciudades. Provee refugio para fauna beneficiosa.', planting_steps: '1. Semillas o esquejes leñosos. 2. Plantación en terreno o maceta grande. 3. Suelo profundo y bien drenado. 4. Espaciado 5-10 metros (árbol grande). 5. Primavera mejor época.', care_tips: 'Sol directo a semisombra. Riego moderado regular. Tolerante suelos diversos. Poda de formación primavera. Crece rápido. Hojas caen con estrés hídrico. Muy longevo (50+ años).' },
    agapanthus: { name: 'Agapanthus', sci: 'Agapanthus spp.', coords: [4.8136, -75.6946], excerpt: 'Planta con flores en umbela para borduras.', family: 'Amaryllidaceae', regions: ['Jardines templados'], conditions: ['Pleno sol a semisombra', 'Suelos bien drenados'], benefits: 'Flores duraderas que amanecen y oscurecen el jardín. Atrae abejas posicionantes. Bajo mantenimiento y resistente a condiciones variables.', planting_steps: '1. División de bulbos/matas en primavera. 2. Plantación a 30-40 cm profundidad. 3. Suelo bien drenado. 4. Espaciado 45 cm entre plantas. 5. Floración a partir de divisiones año siguiente.', care_tips: 'Pleno sol a semisombra tolerado. Riego regular en floración. Tolerancia a sequía. Poco abonado necesario. Flores junio-julio. Larga vida (20+ años). Protección en clima muy frío.' },
    gardenia: { name: 'Gardenia', sci: 'Gardenia spp.', coords: [6.2442, -75.5748], excerpt: 'Arbusto de flores perfumadas.', family: 'Rubiaceae', regions: ['Jardines y viveros'], conditions: ['Sombra parcial', 'Suelos húmedos y ácidos'], benefits: 'Flores intensamente perfumadas que aromatizan naturalmente. Símbolo de gracia y belleza. Mejora el bienestar emocional con su fragancia.', planting_steps: '1. Esquejes semi leñosos en primavera. 2. Enraizamiento con hormona en turba. 3. Plantación en suelo ácido (pH 5.5-6.5). 4. Espaciado 1-1.5 metros. 5. Mulch importante.', care_tips: 'Sombra parcial o mañana sol. Humedad consistente. Suelo ácido esencial. Drenaje perfecto. Floración mayo-julio. Plagas comunes: cochinilla, ácaros. Temperatura mínima 10°C.' },

    // Frutales existentes
    lulo: { name: 'Lulo', sci: 'Solanum quitoense', coords: [4.6097, -74.0817], excerpt: 'Fruta típica andina, usada en jugos.', family: 'Solanaceae', regions: ['Andes', 'Altitudes medias'], conditions: ['Clima templado', 'Riego moderado'], benefits: 'Rica en vitamina C y antioxidantes. Bajo en calorías, favorece la digestión. Excelente para jugos refrescantes y fortalecimiento del sistema inmunológico.', planting_steps: '1. Semillas o esquejes en primavera. 2. Sustrato fértil y suelto. 3. Trasplante a 1-2 metros. 4. Altitud ideal 1200-2200 msnm. 5. Tutores para crecimiento.', care_tips: 'Riego regular sin encharcamiento. Sombra parcial importante. Suelo orgánico y drenado. Poda anual de ramas improductivas. Frutas en 1-2 años. Cosecha manual cuando cambio de color.' },
    uchuva: { name: 'Uchuva', sci: 'Physalis peruviana', coords: [6.2442, -75.5748], excerpt: 'Fruto pequeño cultivado en zonas templadas.', family: 'Solanaceae', regions: ['Andes', 'Cundinamarca'], conditions: ['Clima templado', 'Suelos ricos'], benefits: 'Súper fruta rica en vitaminas A, C y antioxidantes. Favorece la salud ocular y el sistema inmunológico. Propiedades anticancerígenas y antiinflamatorias.', planting_steps: '1. Semillas en semillero con luz. 2. Germinación 20-30 días. 3. Trasplante con 4 hojas verdaderas. 4. Plantación a 1-1.5 metros. 5. Tutores para mantener erguida.', care_tips: 'Riego regular y constante. Sombra media importante. Suelo rico en materia orgánica. Poda de ramas secundarias. Floración y frutos continuos. Cosecha cuando fruta se suelta de cáscara.' },
    gulupa: { name: 'Gulupa', sci: 'Passiflora edulis', coords: [10.85, -73.75], excerpt: 'Fruto de pasión, consumido en jugos.', family: 'Passifloraceae', regions: ['Caribe', 'Zonas tropicales'], conditions: ['Trepadora', 'Riego regular', 'Suelos bien drenados'], benefits: 'Rica en fibra, vitaminas C y A. Mejora la digestión e impulsa el tránsito intestinal. Propiedades calmantes y beneficiosas para el sistema nervioso.', planting_steps: '1. Semillas o esquejes en primavera. 2. Preparar tutorado fuerte (enredadera fuerte). 3. Suelo profundo y rico. 4. Espaciado 3-4 metros entre plantas. 5. Sombreado parcial inicial.', care_tips: 'Riego regular especialmente en crecimiento. Tutorado esencial. Poda de formación anual. Floración en 1-2 años. Cosecha cuando fruto cae o se arruga. Producción 3-5 años.' },
    guanabana: { name: 'Guanábana', sci: 'Annona muricata', coords: [-4.2153, -69.9406], excerpt: 'Fruta tropical de pulpa blanca.', family: 'Annonaceae', regions: ['Amazonas', 'Pacífico'], conditions: ['Clima cálido', 'Suelos profundos y húmedos'], benefits: 'Excelente fuente de vitamina C y fibra. Propiedades antiparasitarias y antitumorales. Favorece la energía y fortalece el sistema inmunológico.', planting_steps: '1. Semillas en germinador con 25-30°C. 2. Germinación 20-30 días. 3. Trasplante a bolsa. 4. Plantación definitiva 6-8 metros. 5. Riego abundante inicial.', care_tips: 'Clima tropical húmedo necesario. Riego abundante sin encharcamiento. Suelo profundo y fértil. Poda mínima. Floración 3-5 años. Producción larga vida (20+ años).' },
    guayaba: { name: 'Guayaba', sci: 'Psidium guajava', coords: [5.6922, -76.6581], excerpt: 'Fruta popular, cultivada ampliamente.', family: 'Myrtaceae', regions: ['Regiones diversas'], conditions: ['Resistente', 'Pleno sol'], benefits: 'Una de las frutas más ricas en vitamina C. Excelente para digestión regulada por su alto contenido de fibra. Fortalece huesos y sistema inmunológico.', planting_steps: '1. Semillas o esquejes en primavera. 2. Suelo poco exigente. 3. Plantación a 6-8 metros. 4. Riego inicial para establecimiento. 5. Sin preparación especial de suelo.', care_tips: 'Muy resistente y rústica. Pleno sol necesario. Riego moderado tolerando sequía. Poda de formación anual. Floración todo el año en clima cálido. Cosecha manual cuando blanda.' },
    // Frutales adicionales
    mango: { name: 'Mango', sci: 'Mangifera indica', coords: [10.9685, -74.7813], excerpt: 'Fruta tropical ampliamente cultivada.', family: 'Anacardiaceae', regions: ['Caribe', 'Regiones cálidas'], conditions: ['Pleno sol', 'Suelos profundos'], benefits: 'Rica en vitaminas A y C, además de antioxidantes. Mejora la digestión y la salud ocular. Propiedades antinflamatorias y beneficiosas para el corazón.', planting_steps: '1. Semilla de hueso o injertos en primavera. 2. Germinación 2-3 semanas. 3. Trasplante a 8-10 metros. 4. Suelo profundo necesario. 5. Sombreado temporal primeros años.', care_tips: 'Clima tropical cálido. Riego en primeros años, toleran sequía adultos. Suelo profundo y bien drenado. Poda de formación. Floración 3-5 años. Cosecha 4-6 meses después floración.' },
    banano: { name: 'Banano', sci: 'Musa spp.', coords: [11.2415, -74.1990], excerpt: 'Cultivo de importancia económica y alimentaria.', family: 'Musaceae', regions: ['Regiones tropicales'], conditions: ['Humedad alta', 'Suelos ricos'], benefits: 'Excelente fuente de potasio, magnesio y vitaminas B. Energizante natural, ideal para deportistas. Mejora la presión arterial y la salud cardiovascular.', planting_steps: '1. Plantones o rizomas desinfectados. 2. Suelo rico en materia orgánica. 3. Plantación a 2-3 metros. 4. Riego abundante inicial. 5. Sombraado parcial beneficioso.', care_tips: 'Humedad alta constante. Riego diario en zonas secas. Fertilización mensual. Deshije de brotes para una planta. Floración 8-10 meses. Cosecha con manos verdes (7-9 días).' },
    naranja: { name: 'Naranjo', sci: 'Citrus sinensis', coords: [10.3910, -75.4794], excerpt: 'Árbol cítrico cultivado para fruta y producción de jugos.', family: 'Rutaceae', regions: ['Caribe', 'Regiones cálidas'], conditions: ['Pleno sol', 'Suelos fértiles y bien drenados'], benefits: 'Extraordinaria fuente de vitamina C. Fortalece el sistema inmunológico contra infecciones. Beneficiosa para la salud cardiovascular y la absorción de hierro.', planting_steps: '1. Injertos en primavera sobre patrón. 2. Plantación a 5-6 metros. 3. Suelo fértil y bien drenado. 4. Plantación preferida en otoño. 5. Tutorado en establecimiento.', care_tips: 'Pleno sol 6+ horas. Riego regular sin encharcamiento. Suelo neu?tral a ligeramente ácido. Poda de limpieza. Floración enero-febrero. Cosecha 7-9 meses después floración.' },
    papaya: { name: 'Papayo', sci: 'Carica papaya', coords: [-4.2153, -69.9406], excerpt: 'Árbol tropical que produce la papaya; cultivado en regiones cálidas.', family: 'Caricaceae', regions: ['Regiones cálidas'], conditions: ['Pleno sol', 'Suelos ricos y bien drenados'], benefits: 'Contiene papaína, que facilita la digestión de proteínas. Rica en vitamina C y antioxidantes. Mejora la inmersión digestiva y la salud intestinal.', planting_steps: '1. Semillas en semillero o directas. 2. Germinación 10-20 días. 3. Plantación a 2.5-3 metros. 4. Suelo rico y drenado. 5. Riego constante desde inicio.', care_tips: 'Clima tropical con lluvia. Pleno sol importante. Riego regular sin encharcamiento. Fertilización cada 2 meses. Floración 3-5 meses. Cosecha pequeña ventana tiempo.' },
    pina: { name: 'Piña', sci: 'Ananas comosus', coords: [3.4516, -76.5320], excerpt: 'Fruta tropical con cultivo comercial.', family: 'Bromeliaceae', regions: ['Pacífico', 'Zonas cálidas'], conditions: ['Pleno sol', 'Suelos ligeramente ácidos'], benefits: 'Rica en bromelina, enzima que ayuda a la digestión. Potente antiinflamatorio natural. Fortalece el sistema inmunológico y favorece la cicatrización.', planting_steps: '1. Plantones de coronas o retoños. 2. Suelo ligeramente ácido (pH 5.5-6.8). 3. Espaciado 30-50 cm. 4. Mulching importante. 5. Riego moderado inicial.', care_tips: 'Pleno sol esencial. Riego moderado con buen drenaje. Suelo con materia orgánica. Floración 16-20 meses. Cosecha cuando amarillece base. Retoños producen 2-3 ciclos.' },
    mora: { name: 'Mora', sci: 'Rubus glaucus', coords: [1.2136, -77.2815], excerpt: 'Fruta andina usada en jugos y postres.', family: 'Rosaceae', regions: ['Andes'], conditions: ['Clima templado', 'Riego moderado'], benefits: 'Rica en antioxidantes y vitamina C. Favorece la salud cardiovascular y reduce la inflamación. Excelente para la piel y la prevención de envejecimiento.', planting_steps: '1. Esquejes leñosos o plantas enraizadas. 2. Plantación a 1.5-2 metros. 3. Tutorado o soporte esencial. 4. Suelo fértil y drenado. 5. Plantación otoño-primavera.', care_tips: 'Clima templado 1500-2700 msnm. Riego regular. Suelo con soporte. Poda anual severa. Floración continua en buenos cuidados. Cosecha manual cuando oscura.' },
    tomate_arbol: { name: 'Tomate de árbol', sci: 'Cyphomandra betacea', coords: [4.8136, -75.6946], excerpt: 'Fruto andino usado en jugos y salsas.', family: 'Solanaceae', regions: ['Andes'], conditions: ['Clima templado', 'Suelos ricos'], benefits: 'Bajo en calorías, rico en fibra y vitamina C. Favorece la digestión y la salud cardiovascular. Propiedades diuréticas y desintoxicantes.', planting_steps: '1. Semillas en semillero. 2. Germinación 15-20 días. 3. Trasplante con 4 hojas. 4. Plantación a 2-3 metros. 5. Altitud 1500-2600 msnm.', care_tips: 'Clima templado frío essential. Riego regular sin encharcamiento. Suelo rico en materia orgánica. Poda de ramas basales. Floración año siguiente. Cosecha cuando cambio color rojo-naranja.' },
    cacao: { name: 'Cacao', sci: 'Theobroma cacao', coords: [5.6922, -76.6581], excerpt: 'Planta productora de cacao, cultivo tropical.', family: 'Malvaceae', regions: ['Pacífico', 'Amazonas'], conditions: ['Sombra parcial', 'Alta humedad', 'Suelos ricos'], benefits: 'Fuente de antioxidantes y flavonoides beneficiosos. Mejora el estado de ánimo y la salud cardiovascular. Propiedades neuroprotectoras y antidepresivas naturales.', planting_steps: '1. Semillas o plantones en envase. 2. Sombra paterna necesaria (50%). 3. Plantación a 4-5 metros. 4. Suelo muy rico en materia orgánica. 5. Drenaje excelente.', care_tips: 'Humedad 80-90% ideal. Sombra de árbol permanentemente. Riego abundante. Fertilización frecuente. Floración 3-4 años. Cosecha 5-6 años. Larga vida (50+ años).' },
    aguacate: { name: 'Aguacate', sci: 'Persea americana', coords: [7.1193, -73.1227], excerpt: 'Fruto ampliamente cultivado y consumido.', family: 'Lauraceae', regions: ['Andes', 'Regiones templadas y subtropicales'], conditions: ['Suelos profundos', 'Buen drenaje', 'Altitud variable'], benefits: 'Rico en grasas saludables monoinsaturadas. Excelente para la salud del corazón y el cerebro. Fuente de potasio, vitaminas E y K, y antioxidantes.', planting_steps: '1. Injertos sobre patrón en primavera. 2. Plantación a 8-10 metros. 3. Suelo profundo esencial. 4. Drenaje perfecto necesario. 5. Altitud variable según variedad.', care_tips: 'Riego regular en establecimiento. Suelo profundo y drenado. Poda de formación. Floración 3-5 años. Cosecha manual cuando fruto flexible. Producción buena 20+ años.' }
  };

  // Inicializar mapa Leaflet centrado en Colombia
  let map;
  const plantMarkers = {};
  try {
    if (document.getElementById('map')) {
      // Límites aproximados de Colombia: [southWest, northEast]
      const colombiaBounds = L.latLngBounds([
        [-4.8, -81.8], // SW
        [12.6, -66.8]  // NE
      ]);

      map = L.map('map', {
        scrollWheelZoom: false,
        maxBounds: colombiaBounds,
        maxBoundsViscosity: 1.0
      }).setView([4.5709, -74.2973], 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 5,
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // ajustar vista para encuadrar Colombia si el contenedor es muy grande
      map.fitBounds(colombiaBounds.pad(0.1));

      // crear marcadores para cada planta (todas las del proyecto)
      Object.keys(plantData).forEach(id => {
        const p = plantData[id];
        // si coordenadas existen, agregar marcador
        if (p.coords && Array.isArray(p.coords)) {
          const marker = L.marker(p.coords).addTo(map);
          marker.bindPopup(`<strong style="color:var(--verde-oscuro)">${p.name}</strong><br><em>${p.sci}</em><br><small>${p.excerpt}</small>`);
          plantMarkers[id] = marker;
        }
      });
    }
  } catch (err) {
    console.warn('Leaflet no se pudo inicializar:', err);
  }

  // Al hacer click en un pin desde la tarjeta: centrar mapa y abrir popup
  pinButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.dataset.plant;
      const info = plantData[id];
      if (!info) return;
      // Scroll al mapa
      smoothScrollTo('#mapa');
      // Mostrar info breve en panel lateral
      mapInfo.hidden = false;
      mapInfo.innerHTML = `
        <strong style="color:var(--verde-oscuro);">${info.name}</strong>
        <div style="font-style:italic;color:#42524a">${info.sci}</div>
        <p style="margin:0.4rem 0 0 0">${info.excerpt}</p>
      `;
      // Si el mapa y el marcador existen, centrar y abrir popup
      const marker = plantMarkers[id];
      if (map && marker) {
        map.setView(marker.getLatLng(), 10, { animate: true });
        marker.openPopup();
      }
    });
  });

  // Nota: anteriormente había overlays estáticos; ahora los popups se manejan con Leaflet.

  // --- Modal: mostrar más características al click en la tarjeta (excepto el pin)
  const modal = document.getElementById('plant-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalSci = document.getElementById('modal-sci');
  const modalFamily = document.getElementById('modal-family');
  const modalDesc = document.getElementById('modal-desc');
  const modalExtra = document.getElementById('modal-extra');

  // Mapa de familias para varias especies (complementario)
  const familiesMap = {
    manzanilla: 'Asteraceae', calendula: 'Asteraceae', romero: 'Lamiaceae', albahaca: 'Lamiaceae',
    guanabana: 'Annonaceae', gulupa: 'Passifloraceae', lulo: 'Solanaceae', uchuva: 'Solanaceae',
    guayaba: 'Myrtaceae', anturio: 'Araceae', cattleya: 'Orchidaceae'
  };

  // abrir modal con datos extraídos de la tarjeta y plantData
  function openPlantModal(plantId, cardEl) {
    const data = plantData[plantId] || {};
    // imagen: preferir la de la tarjeta
    const imgEl = cardEl ? cardEl.querySelector('img') : null;
    const imgSrc = imgEl ? imgEl.src : (data.img || '');
    modalImg.src = imgSrc;
    modalImg.alt = data.name || plantId;
    modalTitle.textContent = data.name || plantId;
    modalSci.textContent = data.sci ? ` ${data.sci}` : '';

    modalFamily.textContent = 'Familia: ' + (data.family || familiesMap[plantId] || 'No disponible');
    modalDesc.textContent = data.excerpt || 'Descripción no disponible.';

    // detalles extra: beneficios/siembra/cuidados/regiones/condiciones/coordenadas
    modalExtra.innerHTML = '';
    const extras = [];
    if (data.benefits) extras.push(`<li class="benefits-item"><strong>✨ Beneficios:</strong> ${data.benefits}</li>`);
    if (data.planting_steps) extras.push(`<li class="planting-item"><strong>🌱 Cómo Sembrar:</strong> ${data.planting_steps}</li>`);
    if (data.care_tips) extras.push(`<li class="care-item"><strong>💧 Cuidados:</strong> ${data.care_tips}</li>`);
    if (data.regions && data.regions.length) extras.push(`<li><strong>Regiones:</strong> ${data.regions.join(', ')}</li>`);
    if (data.habitat) extras.push(`<li><strong>Hábitat:</strong> ${data.habitat}</li>`);
    if (data.conditions && data.conditions.length) extras.push(`<li><strong>Condiciones:</strong> ${data.conditions.join('; ')}</li>`);
    if (data.usos) extras.push(`<li><strong>Usos:</strong> ${data.usos}</li>`);
    if (data.coords) extras.push(`<li><strong>Coordenadas:</strong> ${data.coords.join(', ')}</li>`);
    if (extras.length === 0) extras.push('<li>Información adicional no disponible.</li>');
    modalExtra.innerHTML = extras.join('');

    modal.setAttribute('aria-hidden', 'false');
    // focus trap simple
    modal.querySelector('.modal-close').focus();
  }

  // cerrar modal
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
  }

  // añadir listener a cada card
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', (e) => {
      // si el click fue en el pin o dentro del pin, ignorar (pin tiene su propio handler)
      if (e.target.closest('.pin-btn')) return;
      const plantId = card.dataset.plant;
      if (!plantId) return;
      openPlantModal(plantId, card);
    });
  });

  // cerrar al click en elementos con data-close
  modal.addEventListener('click', (e) => {
    if (e.target.matches('[data-close]') || e.target.closest('[data-close]')) closeModal();
  });
  // cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
  });

  // --- Mejoras: cerrar map-info al hacer click fuera (en document)
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.map-wrapper') && !e.target.closest('.pin-btn')) {
      // no cerrar si el click fue en tarjeta pin o map-wrapper
      if (mapInfo && !mapInfo.hidden) {
        // opcional: mantener abierto hasta que el usuario lo cierre
      }
    }
  });

  // --- Accesibilidad: permitir abrir detalles/accordion con Enter/Space
  document.querySelectorAll('details').forEach(det => {
    det.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        det.open = !det.open;
      }
    });
  });

  // Fin de DOMContentLoaded
});