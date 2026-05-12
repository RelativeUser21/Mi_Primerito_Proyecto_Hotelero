/**
 * Función de inicialización de datos por defecto
 * Verifica y crea usuarios y roles necesarios al iniciar la aplicación
 */

const db = require('./connection');
const bcrypt = require('bcryptjs');

// Datos por defecto
const usuariosPorDefecto = [
    {
        IDUsuario: 1,
        NombreUsuario: null,
        Contrasena: "123456",
        Nombre: "admin",
        Apellido: "Admin",
        Email: "admin@hotel.com",
        TipoDocumento: "CC",
        NumeroDocumento: null,
        Telefono: null,
        Pais: "Colombia",
        Direccion: null,
        IDRol: 1,
        IsActive: 1
    },
    {
        IDUsuario: 2,
        NombreUsuario: null,
        Contrasena: "123456",
        Nombre: "cliente",
        Apellido: "Cliente Prueba",
        Email: "cliente@hotel.com",
        TipoDocumento: "CC",
        NumeroDocumento: "123",
        Telefono: "123",
        Pais: "Colombia",
        Direccion: "Calle #1",
        IDRol: 2,
        IsActive: 1
    }
];

const rolesPorDefecto = [
    {
        IDRol: 1,
        Nombre: "Administrador",
        Estado: "activo",
        IsActive: 1,
        Permisos: [
            "dashboard",
            "usuarios",
            "roles",
            "habitaciones",
            "servicios",
            "reservas",
            "clientes"
        ]
    },
    {
        IDRol: 2,
        Nombre: "Cliente",
        Estado: "activo",
        IsActive: 1,
        Permisos: [
            "clientview"
        ]
    }
];

/**
 * Inicializa los datos por defecto en la base de datos
 */
const initializeDefaultData = async () => {
    try {
        console.log('🔍 Verificando datos por defecto...');
        
        // 1. Verificar y crear roles primero (necesarios para los usuarios)
        await initializeRoles();
        
        // 2. Verificar y crear usuarios
        await initializeUsuarios();
        
        console.log('✅ Datos por defecto verificados/creados exitosamente');
    } catch (error) {
        console.error('❌ Error al inicializar datos por defecto:', error.message);
        throw error;
    }
};

/**
 * Inicializa los roles por defecto
 */
const initializeRoles = async () => {
    for (const rol of rolesPorDefecto) {
        try {
            // Verificar si el rol existe
            const [existingRol] = await db.query(
                'SELECT IDRol, Permisos FROM roles WHERE IDRol = ?',
                [rol.IDRol]
            );
            
            if (existingRol.length === 0) {
                // Crear rol si no existe
                console.log(`📝 Creando rol ID=${rol.IDRol}: ${rol.Nombre}`);
                await db.query(
                    `INSERT INTO roles (IDRol, Nombre, Estado, IsActive, Permisos) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [
                        rol.IDRol,
                        rol.Nombre,
                        rol.Estado,
                        rol.IsActive,
                        JSON.stringify(rol.Permisos)
                    ]
                );
            } else {
                // Verificar si necesita actualización
                const currentPermisos = existingRol[0].Permisos;
                const expectedPermisos = JSON.stringify(rol.Permisos);
                
                if (currentPermisos !== expectedPermisos) {
                    console.log(`🔄 Actualizando permisos del rol ID=${rol.IDRol}: ${rol.Nombre}`);
                    await db.query(
                        `UPDATE roles SET 
                         Nombre = ?, Estado = ?, IsActive = ?, Permisos = ?
                         WHERE IDRol = ?`,
                        [
                            rol.Nombre,
                            rol.Estado,
                            rol.IsActive,
                            JSON.stringify(rol.Permisos),
                            rol.IDRol
                        ]
                    );
                } else {
                    console.log(`✅ Rol ID=${rol.IDRol} ya existe con datos correctos`);
                }
            }
        } catch (error) {
            console.error(`Error procesando rol ID=${rol.IDRol}:`, error.message);
            throw error;
        }
    }
};

/**
 * Inicializa los usuarios por defecto
 */
const initializeUsuarios = async () => {
    for (const usuario of usuariosPorDefecto) {
        try {
            // Verificar si el usuario existe
            const [existingUser] = await db.query(
                'SELECT IDUsuario, IDRol FROM usuarios WHERE IDUsuario = ?',
                [usuario.IDUsuario]
            );
            
            // Encriptar contraseña
            const hashedPassword = await bcrypt.hash(usuario.Contrasena, 10);
            
            if (existingUser.length === 0) {
                // Crear usuario si no existe
                console.log(`📝 Creando usuario ID=${usuario.IDUsuario}: ${usuario.Nombre}`);
                await db.query(
                    `INSERT INTO usuarios 
                     (IDUsuario, NombreUsuario, Contrasena, Nombre, Apellido, Email, 
                      TipoDocumento, NumeroDocumento, Telefono, Pais, Direccion, IDRol) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        usuario.IDUsuario,
                        usuario.NombreUsuario,
                        hashedPassword,
                        usuario.Nombre,
                        usuario.Apellido,
                        usuario.Email,
                        usuario.TipoDocumento,
                        usuario.NumeroDocumento,
                        usuario.Telefono,
                        usuario.Pais,
                        usuario.Direccion,
                        usuario.IDRol
                    ]
                );
            } else {
                // Verificar si tiene el rol correcto
                if (existingUser[0].IDRol !== usuario.IDRol) {
                    console.log(`🔄 Actualizando rol del usuario ID=${usuario.IDUsuario}: ${usuario.Nombre}`);
                    await db.query(
                        `UPDATE usuarios SET 
                         NombreUsuario = ?, Contrasena = ?, Nombre = ?, Apellido = ?, Email = ?,
                         TipoDocumento = ?, NumeroDocumento = ?, Telefono = ?, Pais = ?, Direccion = ?, IDRol = ?
                         WHERE IDUsuario = ?`,
                        [
                            usuario.NombreUsuario,
                            hashedPassword,
                            usuario.Nombre,
                            usuario.Apellido,
                            usuario.Email,
                            usuario.TipoDocumento,
                            usuario.NumeroDocumento,
                            usuario.Telefono,
                            usuario.Pais,
                            usuario.Direccion,
                            usuario.IDRol,
                            usuario.IDUsuario
                        ]
                    );
                } else {
                    console.log(`✅ Usuario ID=${usuario.IDUsuario} ya existe con rol correcto`);
                }
            }
        } catch (error) {
            console.error(`Error procesando usuario ID=${usuario.IDUsuario}:`, error.message);
            throw error;
        }
    }
};

module.exports = {
    initializeDefaultData
};
