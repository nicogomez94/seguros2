export const productLabels = {
  AUTO: "Seguro Automotor",
  MOTO: "Seguro de Moto",
  SALUD: "Plan de Salud",
  HOGAR: "Seguro de Hogar",
  BICICLETA: "Seguro de Bicicleta",
  AGRO: "Seguro Agro",
  COMERCIO: "Seguro para Comercios",
  RESPONSABILIDAD_CIVIL: "Responsabilidad Civil"
};

export const productDescriptions = {
  AUTO: "Responsabilidad civil, robo, incendio, granizo y asistencia.",
  MOTO: "Cobertura para circular con respaldo ante robo, daños y asistencia.",
  SALUD: "Planes de salud para personas, familias y asalariados.",
  HOGAR: "Protección ante incendio, robo, cristales y daños del hogar.",
  BICICLETA: "Cobertura para bicis urbanas, deportivas y de alto valor.",
  AGRO: "Coberturas para el campo, maquinaria, cultivos y producción agropecuaria.",
  COMERCIO: "Protección comercial para locales, mercadería y empleados.",
  RESPONSABILIDAD_CIVIL: "Cobertura ante reclamos de terceros por tu actividad."
};

export const productFields = {
  AUTO: [
    ["marca", "Marca", "select", ["Toyota", "Ford", "Chevrolet", "Volkswagen", "BMW", "Mercedes-Benz", "Renault", "Peugeot", "Honda", "Otro"]],
    ["modelo", "Modelo", "text"],
    ["anio", "Año", "number"],
    ["patente", "Patente", "text"],
    ["uso", "Uso", "select", ["Particular", "Comercial", "Transporte de pasajeros"]],
    ["kilometraje", "Kilometraje aprox.", "number"]
  ],
  MOTO: [
    ["marca", "Marca", "text"],
    ["modelo", "Modelo", "text"],
    ["anio", "Año", "number"],
    ["patente", "Patente", "text"],
    ["uso", "Uso", "select", ["Particular", "Reparto", "Comercial"]],
    ["kilometraje", "Kilometraje aprox.", "number"]
  ],
  SALUD: [
    ["edad", "Edad", "number"],
    ["grupoFamiliar", "Personas a cubrir", "number"],
    ["condicionLaboral", "Condición laboral", "select", ["Relación de dependencia", "Monotributo", "Autónomo", "Sin empleo formal"]],
    ["coberturaActual", "Cobertura actual", "text"]
  ],
  HOGAR: [
    ["tipoVivienda", "Tipo de vivienda", "select", ["Casa", "Departamento", "PH", "Quinta"]],
    ["localidad", "Localidad", "text"],
    ["metros", "Metros cuadrados", "number"],
    ["tenencia", "Condición", "select", ["Propietario", "Inquilino"]],
    ["sumaAsegurada", "Suma asegurada estimada", "number"]
  ],
  BICICLETA: [
    ["tipo", "Tipo de bicicleta", "select", ["Urbana", "Ruta", "Mountain bike", "Eléctrica"]],
    ["marca", "Marca", "text"],
    ["valorEstimado", "Valor estimado", "number"],
    ["uso", "Uso", "select", ["Diario", "Recreativo", "Deportivo", "Competencia"]],
    ["guardado", "Lugar de guardado", "text"]
  ],
  AGRO: [
    ["actividad", "Actividad agropecuaria", "select", ["Agricultura", "Ganadería", "Mixta", "Contratista rural"]],
    ["hectareas", "Hectáreas aproximadas", "number"],
    ["localidad", "Localidad / zona rural", "text"],
    ["maquinaria", "Maquinaria a asegurar", "text"],
    ["cultivos", "Cultivos o producción principal", "text"]
  ],
  COMERCIO: [
    ["rubro", "Rubro", "text"],
    ["empleados", "Cantidad de empleados", "number"],
    ["facturacion", "Facturación mensual estimada", "number"],
    ["localidad", "Localidad", "text"],
    ["riesgos", "Riesgos principales", "text"]
  ],
  RESPONSABILIDAD_CIVIL: [
    ["actividad", "Actividad", "text"],
    ["alcance", "Alcance", "select", ["Profesional", "Comercial", "Evento", "Obra o servicio"]],
    ["sumaAsegurada", "Suma asegurada", "number"],
    ["frecuencia", "Frecuencia", "select", ["Permanente", "Temporal", "Evento único"]]
  ]
};

export const debugProductData = {
  AUTO: { marca: "Toyota", modelo: "Corolla", anio: "2022", patente: "AB 123 CD", uso: "Particular", kilometraje: "50000" },
  MOTO: { marca: "Honda", modelo: "CB 250", anio: "2021", patente: "A123BCD", uso: "Particular", kilometraje: "18000" },
  SALUD: { edad: "38", grupoFamiliar: "3", condicionLaboral: "Relación de dependencia", coberturaActual: "Obra social" },
  HOGAR: { tipoVivienda: "Casa", localidad: "Timbúes", metros: "95", tenencia: "Propietario", sumaAsegurada: "2500000" },
  BICICLETA: { tipo: "Mountain bike", marca: "Trek", valorEstimado: "650000", uso: "Deportivo", guardado: "Garage cerrado" },
  AGRO: { actividad: "Agricultura", hectareas: "120", localidad: "Timbúes", maquinaria: "Tractor y sembradora", cultivos: "Soja y maíz" },
  COMERCIO: { rubro: "Indumentaria", empleados: "4", facturacion: "1800000", localidad: "Rosario", riesgos: "Robo e incendio" },
  RESPONSABILIDAD_CIVIL: { actividad: "Consultoría técnica", alcance: "Profesional", sumaAsegurada: "3500000", frecuencia: "Permanente" }
};

export const debugPerson = {
  firstName: "Juan",
  lastName: "García",
  email: "juan@email.com",
  phone: "+54 9 3416 02-5391",
  dni: "30123456",
  birthDate: "1989-05-14",
  address: "San Martín 123, Timbúes"
};
