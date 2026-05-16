import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  ["AUTO", "Seguro Automotor", 150, 200, 360],
  ["MOTO", "Seguro de Moto", 90, 145, 240],
  ["SALUD", "Plan de Salud", 200, 360, 520],
  ["HOGAR", "Seguro de Hogar", 180, 280, 430],
  ["BICICLETA", "Seguro de Bicicleta", 65, 110, 180],
  ["AGRO", "Seguro Agro", 320, 480, 720],
  ["COMERCIO", "Seguro para Comercios", 420, 650, 950],
  ["RESPONSABILIDAD_CIVIL", "Responsabilidad Civil", 260, 390, 580]
];

const extras = {
  AUTO: [
    ["asistencia", "Asistencia en ruta", 15],
    ["lesiones", "Lesiones personales", 20],
    ["reemplazo", "Auto de reemplazo", 25],
    ["bonus", "Bonus por buen manejo", 10],
    ["modificaciones", "Modificaciones", 30],
    ["llave", "Llave perdida", 8]
  ],
  MOTO: [
    ["asistencia", "Asistencia en ruta", 12],
    ["casco", "Reposición de casco", 10],
    ["robo_accesorios", "Robo de accesorios", 18]
  ],
  SALUD: [
    ["odontologia", "Odontología", 45],
    ["farmacia", "Descuento farmacia", 35],
    ["guardia", "Guardia prioritaria", 55]
  ],
  HOGAR: [
    ["electro", "Electrodomésticos", 35],
    ["cristales", "Cristales", 22],
    ["mascotas", "Responsabilidad mascotas", 18]
  ],
  BICICLETA: [
    ["robo_total", "Robo total", 18],
    ["danio", "Daños accidentales", 16],
    ["competencia", "Uso deportivo", 25]
  ],
  AGRO: [
    ["granizo", "Granizo para cultivos", 90],
    ["maquinaria", "Maquinaria agrícola", 120],
    ["incendio_campo", "Incendio rural", 75]
  ],
  COMERCIO: [
    ["incendio", "Incendio ampliado", 80],
    ["robo", "Robo mercadería", 95],
    ["art", "Accidentes personales", 70]
  ],
  RESPONSABILIDAD_CIVIL: [
    ["profesional", "Actividad profesional", 60],
    ["eventos", "Eventos temporales", 75],
    ["terceros", "Daños a terceros", 50]
  ]
};

async function main() {
  const passwordHash = await bcrypt.hash("Admin123!", 10);

  await prisma.adminUser.upsert({
    where: { email: "admin@segurostimbues.com.ar" },
    update: { name: "Admin Principal", passwordHash, role: "SUPER_ADMIN", active: true },
    create: {
      email: "admin@segurostimbues.com.ar",
      name: "Admin Principal",
      passwordHash,
      role: "SUPER_ADMIN"
    }
  });

  await prisma.adminUser.upsert({
    where: { email: "editor@segurostimbues.com.ar" },
    update: {},
    create: {
      email: "editor@segurostimbues.com.ar",
      name: "Marcos Gómez",
      passwordHash,
      role: "EDITOR"
    }
  });

  await prisma.companySettings.upsert({
    where: { id: 1 },
    update: {
      phone: "+54 9 3416 02-5391"
    },
    create: {
      id: 1,
      name: "Seguros Timbúes",
      email: "info@segurostimbues.com.ar",
      phone: "+54 9 3416 02-5391",
      address: "Timbúes, Santa Fe, Argentina",
      instagram: "https://instagram.com/segurostimbues",
      facebook: "https://www.facebook.com/profile.php?id=100069758515302"
    }
  });

  for (const [productType, productName, basic, middle, full] of products) {
    const plans = [
      ["basica", "Básica", basic, `${productName} esencial para empezar protegido.`],
      ["intermedia", "Intermedia", middle, `${productName} con coberturas ampliadas.`],
      ["completa", "Completa", full, `${productName} con protección integral.`]
    ];

    for (const [planCode, planName, basePrice, description] of plans) {
      await prisma.pricingPlan.upsert({
        where: { productType_planCode: { productType, planCode } },
        update: { planName, basePrice, description, active: true },
        create: { productType, planCode, planName, basePrice, description }
      });
    }

    for (const [code, name, price] of extras[productType]) {
      await prisma.pricingExtra.upsert({
        where: { productType_code: { productType, code } },
        update: { name, price, active: true },
        create: { productType, code, name, price }
      });
    }
  }

  const existingQuotes = await prisma.quote.count();
  if (existingQuotes === 0) {
    await prisma.quote.create({
      data: {
        code: "1042",
        productType: "AUTO",
        planCode: "basica",
        planName: "Básica",
        estimatedTotal: 165,
        status: "PENDING",
        person: {
          create: {
            firstName: "Juan",
            lastName: "García",
            email: "juan@email.com",
            phone: "+54 9 3416 02-5391",
            dni: "30123456",
            birthDate: new Date("1989-05-14"),
            address: "San Martín 123, Timbúes"
          }
        },
        productData: {
          create: {
            data: {
              marca: "Toyota",
              modelo: "Corolla",
              anio: "2022",
              patente: "AB 123 CD",
              uso: "Particular",
              kilometraje: "50000"
            }
          }
        },
        extras: { create: [{ code: "asistencia", name: "Asistencia en ruta", price: 15 }] }
      }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
