import { reactive, computed } from 'vue';

export const store = reactive({
  gameState: 'welcome', // welcome, setup, show-word, voting, results
  players: [],
  currentPlayerIndex: 0,
  selectedCategory: '',
  selectedWord: '',
  impostorWord: '',
  winner: null, // 'superheroes' or 'villains'
  hint: '',
  eliminatedPlayers: [],
  currentRound: 1,
  lastEliminatedPlayer: null,
  config: {
    showCategory: true,
    impostorHint: true,
    enabledCategories: ['Comidas', 'Animales', 'Objetos', 'Países', 'Deportes', 'Ciudades'],
    villainCount: 1
  },

  // Avatar system
  avatars: [
    { id: 1, path: '/avatars/1.png', color: '#6366f1' },
    { id: 4, path: '/avatars/4.png', color: '#f43f5e' },
    { id: 5, path: '/avatars/5.png', color: '#f59e0b' },
    { id: 6, path: '/avatars/6.png', color: '#06b6d4' },
    { id: 7, path: '/avatars/7.png', color: '#8b5cf6' },
    { id: 11, path: '/avatars/11.png', color: '#a855f7' },
    { id: 8, path: '/avatars/8.png', color: '#ec4899' },
    { id: 9, path: '/avatars/9.png', color: '#14b8a6' },
    { id: 10, path: '/avatars/10.png', color: '#6366f1' },
    { id: 12, path: '/avatars/12.png', color: '#10b981' },
    { id: 13, path: '/avatars/13.png', color: '#f43f5e' },
    { id: 14, path: '/avatars/14.png', color: '#06b6d4' },
    { id: 15, path: '/avatars/15.png', color: '#f97316' },
    { id: 2, path: '/avatars/2.png', color: '#a855f7' },
    { id: 3, path: '/avatars/3.png', color: '#10b981' },

  ],

  customCategories: {},

  categories: {
    // Default categories will be merged with custom ones dynamically

    Comidas: [
      { word: 'Pizza', hint: 'Horno' },
      { word: 'Sushi', hint: 'Frío' },
      { word: 'Hamburguesa', hint: 'Manos' },
      { word: 'Tacos', hint: 'Manos' },
      { word: 'Ensalada', hint: 'Crudo' },
      { word: 'Pasta', hint: 'Caliente' },
      { word: 'Asado', hint: 'Humo' },
      { word: 'Paella', hint: 'Caliente' },
      { word: 'Helado', hint: 'Textura' },
      { word: 'Chocolate', hint: 'Dulce' },
      { word: 'Empanadas', hint: 'Masa' },
      { word: 'Ravioles', hint: 'Masa' },
      { word: 'Milanesa', hint: 'Crujiente' },
      { word: 'Lasagna', hint: 'Capas' },
      { word: 'Ñoquis', hint: 'Masa' },
      { word: 'Risotto', hint: 'Cremoso' },
      { word: 'Pollo', hint: 'Proteína' },
      { word: 'Carne', hint: 'Proteína' },
      { word: 'Pescado', hint: 'Proteína' },
      { word: 'Verduras', hint: 'Verde' },
      { word: 'Sopa', hint: 'Líquido' },
      { word: 'Guiso', hint: 'Lento' },
      { word: 'Tortilla', hint: 'Huevo' },
      { word: 'Omelette', hint: 'Huevo' },
      { word: 'Pan', hint: 'Harina' },
      { word: 'Sandwich', hint: 'Capas' },
      { word: 'Wrap', hint: 'Enrollado' },
      { word: 'Papas fritas', hint: 'Aceite' },
      { word: 'Puré', hint: 'Suave' },
      { word: 'Arroz', hint: 'Grano' },
      { word: 'Curry', hint: 'Especias' },
      { word: 'Ramen', hint: 'Caldo' },
      { word: 'Falafel', hint: 'Frito' },
      { word: 'Humus', hint: 'Pasta' },
      { word: 'Kebab', hint: 'Especias' },
      { word: 'Ceviche', hint: 'Ácido' },
      { word: 'Salmón', hint: 'Rosado' },
      { word: 'Atún', hint: 'Mar' },
      { word: 'Mariscos', hint: 'Mar' },
      { word: 'Pizza fría', hint: 'Sobras' },
      { word: 'Choripán', hint: 'Parrilla' },
      { word: 'Hot dog', hint: 'Pan' },
      { word: 'Tarta', hint: 'Relleno' },
      { word: 'Quiche', hint: 'Horno' },
      { word: 'Brownie', hint: 'Húmedo' },
      { word: 'Galletas', hint: 'Seco' },
      { word: 'Torta', hint: 'Capas' },
      { word: 'Flan', hint: 'Suave' },
      { word: 'Yogur', hint: 'Frío' },
      { word: 'Queso', hint: 'Lácteo' },
      { word: 'Leche', hint: 'Líquido' },
      { word: 'Cereal', hint: 'Mañana' },
      { word: 'Desayuno', hint: 'Mañana' },
      { word: 'Cena', hint: 'Noche' }
    ],

    Animales: [
      { word: 'Perro', hint: 'Social' },
      { word: 'Gato', hint: 'Ágil' },
      { word: 'Elefante', hint: 'Memoria' },
      { word: 'León', hint: 'Grupo' },
      { word: 'Tigre', hint: 'Cazador' },
      { word: 'Jirafa', hint: 'Altura' },
      { word: 'Delfín', hint: 'Sonidos' },
      { word: 'Águila', hint: 'Vista' },
      { word: 'Mono', hint: 'Imitación' },
      { word: 'Cebra', hint: 'Patrón' },
      { word: 'Pingüino', hint: 'Colonia' },
      { word: 'Caballo', hint: 'Velocidad' },
      { word: 'Vaca', hint: 'Herdado' },
      { word: 'Oveja', hint: 'Herdado' },
      { word: 'Lobo', hint: 'Grupo' },
      { word: 'Zorro', hint: 'Astucia' },
      { word: 'Oso', hint: 'Fuerza' },
      { word: 'Panda', hint: 'Lento' },
      { word: 'Koala', hint: 'Sueño' },
      { word: 'Canguro', hint: 'Salto' },
      { word: 'Hipopótamo', hint: 'Agua' },
      { word: 'Rinoceronte', hint: 'Peso' },
      { word: 'Cocodrilo', hint: 'Acecho' },
      { word: 'Serpiente', hint: 'Silencio' },
      { word: 'Tortuga', hint: 'Lento' },
      { word: 'Conejo', hint: 'Salto' },
      { word: 'Ratón', hint: 'Pequeño' },
      { word: 'Murciélago', hint: 'Noche' },
      { word: 'Búho', hint: 'Noche' },
      { word: 'Gallina', hint: 'Granja' },
      { word: 'Gallo', hint: 'Mañana' },
      { word: 'Pato', hint: 'Agua' },
      { word: 'Ganso', hint: 'Grupo' },
      { word: 'Pavo', hint: 'Plumas' },
      { word: 'Tiburón', hint: 'Depredador' },
      { word: 'Ballena', hint: 'Gigante' },
      { word: 'Pulpo', hint: 'Tentáculos' },
      { word: 'Calamar', hint: 'Tentáculos' },
      { word: 'Foca', hint: 'Costas' },
      { word: 'León marino', hint: 'Colonia' },
      { word: 'Hormiga', hint: 'Trabajo' },
      { word: 'Abeja', hint: 'Trabajo' },
      { word: 'Mariposa', hint: 'Cambio' },
      { word: 'Araña', hint: 'Red' },
      { word: 'Escorpión', hint: 'Veneno' },
      { word: 'Mosquito', hint: 'Zumbido' },
      { word: 'Camello', hint: 'Resistencia' },
      { word: 'Burro', hint: 'Carga' },
      { word: 'Ciervo', hint: 'Bosque' },
      { word: 'Alce', hint: 'Bosque' },
      { word: 'Jabalí', hint: 'Bosque' }
    ],

    Objetos: [
      { word: 'Silla', hint: 'Uso' },
      { word: 'Mesa', hint: 'Superficie' },
      { word: 'Lámpara', hint: 'Ambiente' },
      { word: 'Computadora', hint: 'Pantalla' },
      { word: 'Teléfono', hint: 'Señal' },
      { word: 'Reloj', hint: 'Ritmo' },
      { word: 'Cuchara', hint: 'Contacto' },
      { word: 'Libro', hint: 'Contenido' },
      { word: 'Bicicleta', hint: 'Movimiento' },
      { word: 'Guitarra', hint: 'Vibración' },
      { word: 'Espejo', hint: 'Imagen' },
      { word: 'Martillo', hint: 'Impacto' },
      { word: 'Teclado', hint: 'Entrada' },
      { word: 'Mouse', hint: 'Control' },
      { word: 'Monitor', hint: 'Pantalla' },
      { word: 'Auriculares', hint: 'Sonido' },
      { word: 'Parlante', hint: 'Sonido' },
      { word: 'Micrófono', hint: 'Voz' },
      { word: 'Televisor', hint: 'Pantalla' },
      { word: 'Control remoto', hint: 'Distancia' },
      { word: 'Radio', hint: 'Frecuencia' },
      { word: 'Cámara', hint: 'Imagen' },
      { word: 'Mesa de luz', hint: 'Noche' },
      { word: 'Cama', hint: 'Descanso' },
      { word: 'Almohada', hint: 'Sueño' },
      { word: 'Manta', hint: 'Abrigo' },
      { word: 'Ropero', hint: 'Orden' },
      { word: 'Vaso', hint: 'Contenido' },
      { word: 'Plato', hint: 'Superficie' },
      { word: 'Tenedor', hint: 'Contacto' },
      { word: 'Cuchillo', hint: 'Corte' },
      { word: 'Sartén', hint: 'Calor' },
      { word: 'Olla', hint: 'Calor' },
      { word: 'Llave', hint: 'Acceso' },
      { word: 'Cerradura', hint: 'Acceso' },
      { word: 'Puerta', hint: 'Paso' },
      { word: 'Ventana', hint: 'Apertura' },
      { word: 'Bolso', hint: 'Transporte' },
      { word: 'Mochila', hint: 'Carga' },
      { word: 'Valija', hint: 'Viaje' },
      { word: 'Lápiz', hint: 'Trazo' },
      { word: 'Lapicera', hint: 'Tinta' },
      { word: 'Papel', hint: 'Soporte' },
      { word: 'Cuaderno', hint: 'Notas' },
      { word: 'Cepillo', hint: 'Fricción' },
      { word: 'Esponja', hint: 'Absorción' },
      { word: 'Jabón', hint: 'Limpieza' },
      { word: 'Regla', hint: 'Medida' },
      { word: 'Tijeras', hint: 'Corte' },
      { word: 'Cinta', hint: 'Unión' },
      { word: 'Linterna', hint: 'Portátil' },
      { word: 'Batería', hint: 'Energía' },
      { word: 'Cargador', hint: 'Energía' }
    ],

    Países: [
      { word: 'Argentina', hint: 'Sur' },
      { word: 'Brasil', hint: 'Tropical' },
      { word: 'España', hint: 'Historia' },
      { word: 'México', hint: 'Tradición' },
      { word: 'Francia', hint: 'Cultura' },
      { word: 'Italia', hint: 'Arte' },
      { word: 'Japón', hint: 'Isla' },
      { word: 'Canadá', hint: 'Norte' },
      { word: 'Australia', hint: 'Isla' },
      { word: 'Alemania', hint: 'Orden' },
      { word: 'China', hint: 'Antiguo' },
      { word: 'Egipto', hint: 'Desierto' },
      { word: 'Chile', hint: 'Sur' },
      { word: 'Uruguay', hint: 'Costa' },
      { word: 'Paraguay', hint: 'Interior' },
      { word: 'Bolivia', hint: 'Altura' },
      { word: 'Perú', hint: 'Antiguo' },
      { word: 'Colombia', hint: 'Tropical' },
      { word: 'Venezuela', hint: 'Calor' },
      { word: 'Ecuador', hint: 'Línea' },
      { word: 'Estados Unidos', hint: 'Extenso' },
      { word: 'Rusia', hint: 'Extenso' },
      { word: 'India', hint: 'Poblado' },
      { word: 'Indonesia', hint: 'Isla' },
      { word: 'Reino Unido', hint: 'Isla' },
      { word: 'Irlanda', hint: 'Verde' },
      { word: 'Portugal', hint: 'Costa' },
      { word: 'Grecia', hint: 'Antiguo' },
      { word: 'Turquía', hint: 'Puente' },
      { word: 'Suecia', hint: 'Frío' },
      { word: 'Noruega', hint: 'Frío' },
      { word: 'Finlandia', hint: 'Frío' },
      { word: 'Islandia', hint: 'Frío' },
      { word: 'Sudáfrica', hint: 'Diverso' },
      { word: 'Marruecos', hint: 'Desierto' },
      { word: 'Nigeria', hint: 'Poblado' },
      { word: 'Kenia', hint: 'Fauna' },
      { word: 'Arabia Saudita', hint: 'Desierto' },
      { word: 'Israel', hint: 'Conflicto' },
      { word: 'Irán', hint: 'Antiguo' },
      { word: 'Corea del Sur', hint: 'Tecnología' },
      { word: 'Tailandia', hint: 'Tropical' },
      { word: 'Vietnam', hint: 'Historia' },
      { word: 'Nueva Zelanda', hint: 'Isla' },
      { word: 'Filipinas', hint: 'Isla' }
    ],

    Deportes: [
      { word: 'Fútbol', hint: 'Equipo' },
      { word: 'Tenis', hint: 'Ritmo' },
      { word: 'Básquet', hint: 'Altura' },
      { word: 'Vóley', hint: 'Salto' },
      { word: 'Golf', hint: 'Precisión' },
      { word: 'Natación', hint: 'Resistencia' },
      { word: 'Boxeo', hint: 'Impacto' },
      { word: 'Rugby', hint: 'Contacto' },
      { word: 'Hockey', hint: 'Velocidad' },
      { word: 'Ciclismo', hint: 'Resistencia' },
      { word: 'Handball', hint: 'Equipo' },
      { word: 'Futsal', hint: 'Espacio' },
      { word: 'Pádel', hint: 'Pared' },
      { word: 'Squash', hint: 'Pared' },
      { word: 'Bádminton', hint: 'Ligero' },
      { word: 'Béisbol', hint: 'Turnos' },
      { word: 'Softbol', hint: 'Turnos' },
      { word: 'Atletismo', hint: 'Marca' },
      { word: 'Maratón', hint: 'Largo' },
      { word: 'Triatlón', hint: 'Resistencia' },
      { word: 'CrossFit', hint: 'Intenso' },
      { word: 'Gimnasia', hint: 'Control' },
      { word: 'Yoga', hint: 'Equilibrio' },
      { word: 'Pilates', hint: 'Control' },
      { word: 'Escalada', hint: 'Altura' },
      { word: 'Parkour', hint: 'Movimiento' },
      { word: 'Skate', hint: 'Equilibrio' },
      { word: 'Surf', hint: 'Olas' },
      { word: 'Windsurf', hint: 'Viento' },
      { word: 'Kitesurf', hint: 'Viento' },
      { word: 'Snowboard', hint: 'Deslizamiento' },
      { word: 'Esquí', hint: 'Deslizamiento' },
      { word: 'Patinaje', hint: 'Deslizamiento' },
      { word: 'Judo', hint: 'Técnica' },
      { word: 'Karate', hint: 'Técnica' },
      { word: 'Taekwondo', hint: 'Técnica' },
      { word: 'Lucha', hint: 'Agarre' },
      { word: 'Ajedrez', hint: 'Estrategia' },
      { word: 'Esports (deportes electrónicos)', hint: 'Competencia' },
      { word: 'Remo', hint: 'Ritmo' },
      { word: 'Canotaje', hint: 'Agua' },
      { word: 'Tiro con arco', hint: 'Precisión' },
      { word: 'Esgrima', hint: 'Distancia' }
    ],

    Ciudades: [
      // 🇦🇷 Argentina
      { word: 'Buenos Aires', hint: 'Capital' },
      { word: 'Córdoba', hint: 'Sierras' },
      { word: 'Rosario', hint: 'Río' },
      { word: 'Mendoza', hint: 'Vino' },
      { word: 'Bariloche', hint: 'Lagos' },

      // 🇧🇷 Brasil
      { word: 'São Paulo', hint: 'Gigante' },
      { word: 'Río de Janeiro', hint: 'Cristo' },
      { word: 'Salvador', hint: 'Historia' },
      { word: 'Brasilia', hint: 'Capital' },
      { word: 'Fortaleza', hint: 'Playa' },

      // 🇪🇸 España
      { word: 'Madrid', hint: 'Capital' },
      { word: 'Barcelona', hint: 'Gaudí' },
      { word: 'Sevilla', hint: 'Andalucía' },
      { word: 'Valencia', hint: 'Paella' },
      { word: 'Granada', hint: 'Alhambra' },

      // 🇲🇽 México
      { word: 'Ciudad de México', hint: 'Capital' },
      { word: 'Guadalajara', hint: 'Mariachi' },
      { word: 'Monterrey', hint: 'Industria' },
      { word: 'Cancún', hint: 'Playa' },
      { word: 'Puebla', hint: 'Historia' },

      // 🇫🇷 Francia
      { word: 'París', hint: 'Torre' },
      { word: 'Marsella', hint: 'Puerto' },
      { word: 'Lyon', hint: 'Gastronomía' },
      { word: 'Niza', hint: 'Costa' },
      { word: 'Burdeos', hint: 'Vino' },

      // 🇮🇹 Italia
      { word: 'Roma', hint: 'Imperio' },
      { word: 'Milán', hint: 'Moda' },
      { word: 'Venecia', hint: 'Canales' },
      { word: 'Florencia', hint: 'Arte' },
      { word: 'Nápoles', hint: 'Pizza' },

      // 🇯🇵 Japón
      { word: 'Tokio', hint: 'Metrópolis' },
      { word: 'Osaka', hint: 'Comida' },
      { word: 'Kioto', hint: 'Templos' },
      { word: 'Hiroshima', hint: 'Historia' },
      { word: 'Sapporo', hint: 'Frío' },

      // 🇺🇸 Estados Unidos
      { word: 'Nueva York', hint: 'Rascacielos' },
      { word: 'Los Ángeles', hint: 'Cine' },
      { word: 'Chicago', hint: 'Viento' },
      { word: 'Miami', hint: 'Playa' },
      { word: 'San Francisco', hint: 'Puente' },

      // 🇩🇪 Alemania
      { word: 'Berlín', hint: 'Muro' },
      { word: 'Múnich', hint: 'Cerveza' },
      { word: 'Hamburgo', hint: 'Puerto' },
      { word: 'Colonia', hint: 'Catedral' },
      { word: 'Frankfurt', hint: 'Finanzas' },

      // 🇨🇱 Chile
      { word: 'Santiago', hint: 'Capital' },
      { word: 'Valparaíso', hint: 'Cerros' },
      { word: 'Viña del Mar', hint: 'Playa' },
      { word: 'Concepción', hint: 'Sur' },
      { word: 'Antofagasta', hint: 'Desierto' },

      // 🇵🇪 Perú
      { word: 'Lima', hint: 'Capital' },
      { word: 'Cusco', hint: 'Inca' },
      { word: 'Arequipa', hint: 'Volcán' },
      { word: 'Trujillo', hint: 'Historia' },
      { word: 'Iquitos', hint: 'Amazonas' },

      // 🇨🇴 Colombia
      { word: 'Bogotá', hint: 'Capital' },
      { word: 'Medellín', hint: 'Innovación' },
      { word: 'Cali', hint: 'Salsa' },
      { word: 'Cartagena', hint: 'Murallas' },
      { word: 'Barranquilla', hint: 'Carnaval' },

      // 🇬🇧 Reino Unido
      { word: 'Londres', hint: 'Big Ben' },
      { word: 'Manchester', hint: 'Fútbol' },
      { word: 'Liverpool', hint: 'Beatles' },
      { word: 'Birmingham', hint: 'Industrial' },
      { word: 'Oxford', hint: 'Universidad' },

      // 🇨🇦 Canadá
      { word: 'Toronto', hint: 'Rascacielos' },
      { word: 'Vancouver', hint: 'Pacífico' },
      { word: 'Montreal', hint: 'Francés' },
      { word: 'Ottawa', hint: 'Capital' },
      { word: 'Calgary', hint: 'Rodeo' },

      // 🇨🇳 China
      { word: 'Pekín', hint: 'Capital' },
      { word: 'Shanghái', hint: 'Futuro' },
      { word: 'Hong Kong', hint: 'Rascacielos' },
      { word: 'Cantón', hint: 'Comercio' },

      // 🇮🇳 India
      { word: 'Nueva Delhi', hint: 'Capital' },
      { word: 'Bombay', hint: 'Bollywood' },
      { word: 'Bangalore', hint: 'Tecnología' },
      { word: 'Calcuta', hint: 'Historia' },

      // 🇷🇺 Rusia
      { word: 'Moscú', hint: 'Kremlin' },
      { word: 'San Petersburgo', hint: 'Imperial' },
      { word: 'Kazan', hint: 'Cultura' },

      // 🇹🇷 Turquía
      { word: 'Estambul', hint: 'Bósforo' },
      { word: 'Ankara', hint: 'Capital' },
      { word: 'Esmirna', hint: 'Egeo' },

      // 🇬🇷 Grecia
      { word: 'Atenas', hint: 'Acrópolis' },
      { word: 'Salónica', hint: 'Historia' },

      // 🇵🇹 Portugal
      { word: 'Lisboa', hint: 'Tranvías' },
      { word: 'Oporto', hint: 'Vino' },
      { word: 'Faro', hint: 'Algarve' },

      // 🇮🇪 Irlanda
      { word: 'Dublín', hint: 'Pub' },
      { word: 'Cork', hint: 'Puerto' },
      { word: 'Galway', hint: 'Tradición' },

      // 🇸🇪 Suecia
      { word: 'Estocolmo', hint: 'Islas' },
      { word: 'Gotemburgo', hint: 'Puerto' },
      { word: 'Malmö', hint: 'Puente' },

      // 🇳🇴 Noruega
      { word: 'Oslo', hint: 'Fiordos' },
      { word: 'Bergen', hint: 'Fiordos' },
      { word: 'Trondheim', hint: 'Vikingo' },

      // 🇫🇮 Finlandia
      { word: 'Helsinki', hint: 'Báltico' },
      { word: 'Tampere', hint: 'Lagos' },

      // 🇮🇸 Islandia
      { word: 'Reikiavik', hint: 'Geiser' },

      // 🇲🇦 Marruecos
      { word: 'Marrakech', hint: 'Zoco' },
      { word: 'Casablanca', hint: 'Moderna' },
      { word: 'Fez', hint: 'Medina' },

      // 🇿🇦 Sudáfrica
      { word: 'Ciudad del Cabo', hint: 'Montaña' },
      { word: 'Johannesburgo', hint: 'Oro' },
      { word: 'Durban', hint: 'Océano' },

      // 🇪🇬 Egipto
      { word: 'El Cairo', hint: 'Pirámides' },
      { word: 'Alejandría', hint: 'Biblioteca' },

      // 🇯🇴 Jordania
      { word: 'Petra', hint: 'Roca' },
      { word: 'Amán', hint: 'Capital' },

      // 🇦🇪 Emiratos Árabes Unidos
      { word: 'Dubái', hint: 'Lujo' },
      { word: 'Abu Dabi', hint: 'Capital' },

      // 🇹🇭 Tailandia
      { word: 'Bangkok', hint: 'Templos' },
      { word: 'Chiang Mai', hint: 'Norte' },

      // 🇻🇳 Vietnam
      { word: 'Hanói', hint: 'Capital' },
      { word: 'Ciudad Ho Chi Minh', hint: 'Sur' },

      // 🇳🇿 Nueva Zelanda
      { word: 'Auckland', hint: 'Puertos' },
      { word: 'Wellington', hint: 'Capital' },

      // 🇵🇭 Filipinas
      { word: 'Manila', hint: 'Capital' },
      { word: 'Cebú', hint: 'Isla' },

      // 🇰🇷 Corea del Sur
      { word: 'Seúl', hint: 'Tecnología' },
      { word: 'Busan', hint: 'Puerto' },

      // 🇮🇱 Israel
      { word: 'Jerusalén', hint: 'Sagrada' },
      { word: 'Tel Aviv', hint: 'Moderna' },

      // 🇸🇦 Arabia Saudita
      { word: 'Riad', hint: 'Capital' },
      { word: 'Yeda', hint: 'Mar Rojo' },

      // 🇮🇷 Irán
      { word: 'Teherán', hint: 'Capital' },
      { word: 'Isfahán', hint: 'Arquitectura' },

      // 🇳🇬 Nigeria
      { word: 'Lagos', hint: 'Gigante' },
      { word: 'Abuya', hint: 'Capital' },

      // 🇰🇪 Kenia
      { word: 'Nairobi', hint: 'Safari' },
      { word: 'Mombasa', hint: 'Costa' }
    ]

  },

  startGame(playerNames, options = { showCategory: true, impostorHint: true }) {
    store.config.impostorHint = options.impostorHint;
    store.config.showCategory = options.showCategory;
    if (options.enabledCategories) store.config.enabledCategories = options.enabledCategories;
    if (options.villainCount) store.config.villainCount = options.villainCount;

    const allCats = store.getAllCategories();

    // Filter out any categories that don't actually exist in allCats
    const validCategories = (store.config.enabledCategories.length > 0
      ? store.config.enabledCategories
      : Object.keys(allCats)).filter(cat => allCats[cat] && allCats[cat].length > 0);

    // Fallback if no valid categories found
    if (validCategories.length === 0) {
      console.error('No valid categories available!');
      // Fallback to default Comidas
      store.selectedCategory = 'Comidas';
    } else {
      store.selectedCategory = validCategories[Math.floor(Math.random() * validCategories.length)];
    }

    const words = allCats[store.selectedCategory];

    if (!words || words.length === 0) {
      console.error('Selected category has no words', store.selectedCategory);
      return;
    }

    const wordIndex = Math.floor(Math.random() * words.length);
    store.selectedWord = words[wordIndex].word;

    let secondWordIndex;
    do {
      secondWordIndex = Math.floor(Math.random() * words.length);
    } while (secondWordIndex === wordIndex && words.length > 1);

    store.impostorWord = words[secondWordIndex].word;

    store.players = playerNames.map((name, index) => ({
      id: index,
      name: name,
      role: 'superhero',
      word: store.selectedWord,
      hasVoted: false,
      avatar: store.avatars[index] || store.avatars[index % store.avatars.length]
    }));

    // Assign multiple villains
    const availableIndices = Array.from({ length: store.players.length }, (_, i) => i);
    for (let i = 0; i < store.config.villainCount; i++) {
      const randomIndex = Math.floor(Math.random() * availableIndices.length);
      const playerIndex = availableIndices.splice(randomIndex, 1)[0];
      store.players[playerIndex].role = 'villain';
      store.players[playerIndex].word = store.impostorWord;
    }

    store.currentPlayerIndex = 0;
    store.gameState = 'show-word';
    store.votes = {};
    store.hint = words[wordIndex].hint;
  },

  nextPlayer() {
    if (store.currentPlayerIndex < store.players.length - 1) {
      store.currentPlayerIndex++;
    } else {
      store.gameState = 'voting';
    }
  },

  submitVote(voterId, votedId) {
    if (!store.votes[votedId]) {
      store.votes[votedId] = [];
    }
    store.votes[votedId].push(voterId);

    const voter = store.players.find(p => p.id === voterId);
    if (voter) voter.hasVoted = true;

    // Check if all ACTIVE players have voted
    const activePlayers = store.players.filter(p => !store.eliminatedPlayers.includes(p.id));
    if (activePlayers.every(p => p.hasVoted)) {
      store.processElimination();
    }
  },

  processElimination() {
    // Count votes (only from active players)
    let maxVotes = 0;
    let mostVotedId = null;
    let tie = false;

    for (const id in store.votes) {
      const votedPlayerId = parseInt(id);
      // Skip if this player is already eliminated
      if (store.eliminatedPlayers.includes(votedPlayerId)) continue;

      if (store.votes[id].length > maxVotes) {
        maxVotes = store.votes[id].length;
        mostVotedId = votedPlayerId;
        tie = false;
      } else if (store.votes[id].length === maxVotes && maxVotes > 0) {
        tie = true;
      }
    }

    // If tie, nobody is eliminated, villains win
    if (tie || mostVotedId === null) {
      store.winner = 'villains';
      store.gameState = 'results';
      return;
    }

    // Eliminate the most voted player
    const eliminatedPlayer = store.players.find(p => p.id === mostVotedId);
    store.eliminatedPlayers.push(mostVotedId);
    store.lastEliminatedPlayer = eliminatedPlayer;

    // Check win conditions
    const activePlayers = store.players.filter(p => !store.eliminatedPlayers.includes(p.id));
    const activeHeroes = activePlayers.filter(p => p.role === 'superhero');
    const activeVillains = activePlayers.filter(p => p.role === 'villain');

    // Win condition 1: All villains eliminated
    if (activeVillains.length === 0) {
      store.winner = 'superheroes';
      store.gameState = 'results';
      return;
    }

    // Win condition 2: Villains >= Heroes (villains control the vote)
    if (activeVillains.length >= activeHeroes.length) {
      store.winner = 'villains';
      store.gameState = 'results';
      return;
    }

    // Win condition 3: Only 2 players left
    // Note: This is technically unreachable because condition 2 (villains >= heroes)
    // will always trigger first when 2 players remain with at least 1 villain.
    // Kept for safety as a defensive check.
    /* v8 ignore next 4 */
    if (activePlayers.length <= 2) {
      store.winner = 'villains';
      store.gameState = 'results';
      return;
    }

    // Continue to elimination reveal
    store.gameState = 'elimination-reveal';
  },

  startNewVotingRound() {
    store.currentRound++;
    store.votes = {};

    // Reset hasVoted for active players only
    store.players.forEach(p => {
      if (!store.eliminatedPlayers.includes(p.id)) {
        p.hasVoted = false;
      }
    });

    store.gameState = 'voting';
  },

  endGame() {
    // This method is kept for compatibility but now handled by processElimination
    store.processElimination();
  },

  resetGame() {
    store.gameState = 'setup';
    store.players = [];
    store.winner = null;
    store.votes = {};
    store.currentPlayerIndex = 0;
    store.eliminatedPlayers = [];
    store.currentRound = 1;
    store.lastEliminatedPlayer = null;
  },

  loadCustomCategories() {
    const saved = localStorage.getItem('impostor_custom_categories');
    if (saved) {
      try {
        store.customCategories = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load custom categories', e);
      }
    }
  },

  addCustomCategory(name, words) {
    store.customCategories[name] = words;
    localStorage.setItem('impostor_custom_categories', JSON.stringify(store.customCategories));
  },

  removeCustomCategory(name) {
    delete store.customCategories[name];
    localStorage.setItem('impostor_custom_categories', JSON.stringify(store.customCategories));
  },

  getAllCategories() {
    return { ...store.categories, ...store.customCategories };
  }
});

// Initialize custom categories
store.loadCustomCategories();
