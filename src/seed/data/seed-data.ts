interface SeedTipoDocumento {
  nombre: string;
}

interface SeedUsuario {
  nombre: string;
  apellido: string;
  email: string;
  contraseña: string;
  documento: number;
  tipoDocumento: string;
  role: string[];
}

interface SeedTipoSala {
  nombre: string;
}
interface SeedTipoReserva {
  nombre: string;
}

interface SeedData {
  tipoDocumentos: SeedTipoDocumento[];
  superUsuarios: SeedUsuario[];
  tipoSala: SeedTipoSala[]
  tipoReserva: SeedTipoReserva[]
}

export const initialData: SeedData = {
  tipoDocumentos: [
    {
      nombre: 'Cédula de ciudadanía',
    },
    {
      nombre: 'Tarjeta de identidad',
    },
    {
      nombre: 'Pasaporte',
    },
    {
      nombre: 'Licencia de conducción',
    },
    {
      nombre: 'Cédula extranjera',
    },
  ],

  superUsuarios: [
    {
        nombre: 'Esteban',
        apellido: 'Mejia',
        email: 'esteban@sads.com',
        contraseña: "Esteban123",
        documento: 1007134222,
        tipoDocumento: 'Cédula de ciudadanía',
        role: ['super-user']
    }
  ],

  tipoSala: [
    {
      nombre: 'Sala de cómputo'
    },
    {
      nombre: 'Salon de clases'
    },
    {
      nombre: 'Teatro'
    },
    {
      nombre: 'Sala de reuniones'
    },
    {
      nombre: 'Sala de conferencias'
    }
  ],

  tipoReserva: [
    {
      nombre: 'Un puesto'
    },
    {
      nombre: 'Sala Completa'
    },
  ]



};
