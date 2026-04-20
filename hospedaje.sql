-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-04-2026 a las 23:30:31
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `hospedaje`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `NroDocumento` varchar(50) NOT NULL,
  `Nombre` varchar(50) DEFAULT NULL,
  `Apellido` varchar(50) DEFAULT NULL,
  `Direccion` varchar(50) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `Telefono` varchar(50) DEFAULT NULL,
  `Estado` tinyint(1) DEFAULT NULL,
  `IDRol` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detallereservapaquetes`
--

CREATE TABLE `detallereservapaquetes` (
  `IDDetalleReservaPaquetes` int(11) NOT NULL,
  `IDReserva` int(11) DEFAULT NULL,
  `Cantidad` int(11) DEFAULT NULL,
  `Precio` float DEFAULT NULL,
  `Estado` tinyint(1) DEFAULT NULL,
  `IDPaquete` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detallereservaservicio`
--

CREATE TABLE `detallereservaservicio` (
  `IDDetalleReservaServicio` int(11) NOT NULL,
  `IDReserva` int(11) DEFAULT NULL,
  `Cantidad` int(11) DEFAULT NULL,
  `Precio` float DEFAULT NULL,
  `Estado` tinyint(1) DEFAULT NULL,
  `IDServicio` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadosreserva`
--

CREATE TABLE `estadosreserva` (
  `IdEstadoReserva` int(11) NOT NULL,
  `NombreEstadoReserva` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitacion`
--

CREATE TABLE `habitacion` (
  `IDHabitacion` int(11) NOT NULL,
  `NombreHabitacion` varchar(30) NOT NULL,
  `ImagenHabitacion` blob DEFAULT NULL,
  `Descripcion` varchar(50) NOT NULL,
  `Costo` float NOT NULL,
  `Estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `habitacion`
--

INSERT INTO `habitacion` (`IDHabitacion`, `NombreHabitacion`, `ImagenHabitacion`, `Descripcion`, `Costo`, `Estado`) VALUES
(1, 'Suite Presidencial', NULL, 'Vista al mar y jacuzzi', 250.5, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodopago`
--

CREATE TABLE `metodopago` (
  `IdMetodoPago` int(11) NOT NULL,
  `NomMetodoPago` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paquetes`
--

CREATE TABLE `paquetes` (
  `IDPaquete` int(11) NOT NULL,
  `NombrePaquete` varchar(30) NOT NULL,
  `ImagenPaquete` blob DEFAULT NULL,
  `Descripcion` text NOT NULL,
  `IDHabitacion` int(11) NOT NULL,
  `IDServicio` int(11) NOT NULL,
  `Precio` float DEFAULT NULL,
  `Estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE `permisos` (
  `IDPermiso` int(11) NOT NULL,
  `NombrePermisos` varchar(255) DEFAULT NULL,
  `EstadoPermisos` varchar(50) DEFAULT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva`
--

CREATE TABLE `reserva` (
  `IdReserva` int(11) NOT NULL,
  `NroDocumentoCliente` varchar(50) DEFAULT NULL,
  `FechaReserva` datetime DEFAULT NULL,
  `FechaInicio` date DEFAULT NULL,
  `FechaFinalizacion` date DEFAULT NULL,
  `SubTotal` float DEFAULT NULL,
  `Descuento` float DEFAULT NULL,
  `IVA` float DEFAULT NULL,
  `MontoTotal` float DEFAULT NULL,
  `MetodoPago` int(11) DEFAULT NULL,
  `IdEstadoReserva` int(11) DEFAULT NULL,
  `UsuarioIdusuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `IDRol` int(11) NOT NULL,
  `Nombre` varchar(255) DEFAULT NULL,
  `Estado` varchar(50) DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `Permisos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Permisos`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`IDRol`, `Nombre`, `Estado`, `IsActive`, `Permisos`) VALUES
(1, 'Administrador', 'Activo', 1, '[\"dashboard\",\"usuarios\",\"roles\",\"habitaciones\",\"servicios\",\"reservas\"]'),
(2, 'Clientes', 'Activo', 1, '[\"habitaciones\",\"servicios\",\"reservas\"]'),
(9, 'Empleado', '1', 0, '[\"usuarios\",\"roles\"]'),
(16, 'Recepcionista', '1', 1, '[\"reservas\"]');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rolespermisos`
--

CREATE TABLE `rolespermisos` (
  `IDRolPermiso` int(11) NOT NULL,
  `IDRol` int(11) DEFAULT NULL,
  `IDPermiso` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `IDServicio` int(11) NOT NULL,
  `NombreServicio` varchar(30) NOT NULL,
  `Descripcion` varchar(50) NOT NULL,
  `Duracion` varchar(50) DEFAULT NULL,
  `CantidadMaximaPersonas` int(11) NOT NULL,
  `Costo` float NOT NULL,
  `Estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `IDUsuario` int(11) NOT NULL,
  `NombreUsuario` varchar(255) DEFAULT NULL,
  `Contrasena` varchar(255) DEFAULT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  `Apellido` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `TipoDocumento` varchar(50) DEFAULT NULL,
  `NumeroDocumento` int(11) DEFAULT NULL,
  `Telefono` varchar(50) DEFAULT NULL,
  `Pais` varchar(100) DEFAULT NULL,
  `Direccion` varchar(255) DEFAULT NULL,
  `IDRol` int(11) DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`IDUsuario`, `NombreUsuario`, `Contrasena`, `Nombre`, `Apellido`, `Email`, `TipoDocumento`, `NumeroDocumento`, `Telefono`, `Pais`, `Direccion`, `IDRol`, `IsActive`) VALUES
(1, 'admin_juanito', '123456', 'Juan', 'Perez', 'juan@correo.com', 'CC', 1011213, '123', 'Colombia', '#Mi casa 01', 1, 1),
(23, 'usuarioregistrado', '1234', 'Usuario', 'Apellido', 'user@correo.com', 'CC', 123, '111', 'Colombia', 'tierra', 9, 1),
(24, 'admin', '123456', 'admin', 'admin', 'admin@gmail.com', 'CC', 34567890, '345678', 'Colombia', 'NA', 1, 0),
(30, 'aaa', 'aaaa', 'aaa', 'aaa', 'user@correo.coma', 'CC', 11, 'aa', 'aa', 'aa', 17, 0),
(32, 'pepitouser', '1234', 'Pepito', 'Gonzales', 'userpepito@correo.com', 'CC', 111222333, '123', 'Colombia', 'tierra', 2, 1),
(33, 'pepitouser', '1234', 'Pepito', 'Gonzales', 'userpepito2@correo.com', 'CC', 123, '11', 'Colombia', 'tierra', 2, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`NroDocumento`),
  ADD KEY `IDRol` (`IDRol`);

--
-- Indices de la tabla `detallereservapaquetes`
--
ALTER TABLE `detallereservapaquetes`
  ADD PRIMARY KEY (`IDDetalleReservaPaquetes`),
  ADD KEY `IDPaquete` (`IDPaquete`),
  ADD KEY `IDReserva` (`IDReserva`);

--
-- Indices de la tabla `detallereservaservicio`
--
ALTER TABLE `detallereservaservicio`
  ADD PRIMARY KEY (`IDDetalleReservaServicio`),
  ADD KEY `IDReserva` (`IDReserva`),
  ADD KEY `IDServicio` (`IDServicio`);

--
-- Indices de la tabla `estadosreserva`
--
ALTER TABLE `estadosreserva`
  ADD PRIMARY KEY (`IdEstadoReserva`);

--
-- Indices de la tabla `habitacion`
--
ALTER TABLE `habitacion`
  ADD PRIMARY KEY (`IDHabitacion`);

--
-- Indices de la tabla `metodopago`
--
ALTER TABLE `metodopago`
  ADD PRIMARY KEY (`IdMetodoPago`);

--
-- Indices de la tabla `paquetes`
--
ALTER TABLE `paquetes`
  ADD PRIMARY KEY (`IDPaquete`);

--
-- Indices de la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD PRIMARY KEY (`IDPermiso`);

--
-- Indices de la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD PRIMARY KEY (`IdReserva`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`IDRol`);

--
-- Indices de la tabla `rolespermisos`
--
ALTER TABLE `rolespermisos`
  ADD PRIMARY KEY (`IDRolPermiso`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`IDServicio`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`IDUsuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `detallereservapaquetes`
--
ALTER TABLE `detallereservapaquetes`
  MODIFY `IDDetalleReservaPaquetes` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detallereservaservicio`
--
ALTER TABLE `detallereservaservicio`
  MODIFY `IDDetalleReservaServicio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estadosreserva`
--
ALTER TABLE `estadosreserva`
  MODIFY `IdEstadoReserva` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `habitacion`
--
ALTER TABLE `habitacion`
  MODIFY `IDHabitacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `metodopago`
--
ALTER TABLE `metodopago`
  MODIFY `IdMetodoPago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `paquetes`
--
ALTER TABLE `paquetes`
  MODIFY `IDPaquete` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `permisos`
--
ALTER TABLE `permisos`
  MODIFY `IDPermiso` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reserva`
--
ALTER TABLE `reserva`
  MODIFY `IdReserva` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `IDRol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `rolespermisos`
--
ALTER TABLE `rolespermisos`
  MODIFY `IDRolPermiso` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `IDServicio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `IDUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`IDRol`) REFERENCES `roles` (`IDRol`);

--
-- Filtros para la tabla `detallereservapaquetes`
--
ALTER TABLE `detallereservapaquetes`
  ADD CONSTRAINT `detallereservapaquetes_ibfk_1` FOREIGN KEY (`IDPaquete`) REFERENCES `paquetes` (`IDPaquete`),
  ADD CONSTRAINT `detallereservapaquetes_ibfk_2` FOREIGN KEY (`IDReserva`) REFERENCES `reserva` (`IdReserva`);

--
-- Filtros para la tabla `detallereservaservicio`
--
ALTER TABLE `detallereservaservicio`
  ADD CONSTRAINT `detallereservaservicio_ibfk_1` FOREIGN KEY (`IDReserva`) REFERENCES `reserva` (`IdReserva`),
  ADD CONSTRAINT `detallereservaservicio_ibfk_2` FOREIGN KEY (`IDServicio`) REFERENCES `servicios` (`IDServicio`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
