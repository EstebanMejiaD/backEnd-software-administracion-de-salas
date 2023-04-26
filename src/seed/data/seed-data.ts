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
}

interface SeedData {
  tipoDocumentos: SeedTipoDocumento[];
  superUsuarios: SeedUsuario[];
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
    }
  ]

};
