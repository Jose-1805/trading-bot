-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 15-01-2020 a las 21:19:48
-- Versión del servidor: 10.3.16-MariaDB
-- Versión de PHP: 7.2.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `iq_option`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alerts`
--

CREATE TABLE `alerts` (
  `id` int(11) NOT NULL,
  `value` double NOT NULL,
  `direction_alert` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `probability` double NOT NULL,
  `dispatcher` enum('hammer','star','level_touch','wick_level_touch') NOT NULL DEFAULT 'level_touch',
  `result` int(11) DEFAULT NULL,
  `currency_pair_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `currency_pairs`
--

CREATE TABLE `currency_pairs` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `big` double NOT NULL,
  `avg_candles_size` double NOT NULL DEFAULT 0,
  `candles_direction` int(11) NOT NULL DEFAULT 0,
  `candles_count` int(11) NOT NULL DEFAULT 0,
  `next_bullish_entry` double DEFAULT NULL,
  `next_bear_entry` double DEFAULT NULL,
  `probability_bullish_entry` double DEFAULT NULL,
  `probability_bear_entry` double DEFAULT NULL,
  `launch_alerts` int(11) NOT NULL DEFAULT 1,
  `next_level_upper` double DEFAULT NULL,
  `next_level_lowwer` double DEFAULT NULL,
  `state` enum('active','inactive') NOT NULL DEFAULT 'inactive'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `currency_pairs`
--

INSERT INTO `currency_pairs` (`id`, `name`, `big`, `avg_candles_size`, `candles_direction`, `candles_count`, `next_bullish_entry`, `next_bear_entry`, `probability_bullish_entry`, `probability_bear_entry`, `launch_alerts`, `next_level_upper`, `next_level_lowwer`, `state`) VALUES
(4, 'AUD-USD', 0.001, 4.863636363636363, 1, 4, NULL, NULL, NULL, NULL, 1, 0.693, 0.6925, 'active'),
(5, 'EUR-USD', 0.001, 2.3636363636363638, 1, 3, NULL, NULL, NULL, NULL, 1, 1.115, 1.1145, 'active');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `iq_values`
--

CREATE TABLE `iq_values` (
  `id` int(10) UNSIGNED NOT NULL,
  `open` double NOT NULL,
  `close` double NOT NULL,
  `min` double NOT NULL,
  `max` double NOT NULL,
  `direction` int(11) NOT NULL,
  `candle_size` double NOT NULL,
  `volume` double NOT NULL,
  `date` datetime NOT NULL,
  `time` bigint(20) NOT NULL,
  `broke_level` int(11) NOT NULL DEFAULT -1,
  `speed` double NOT NULL,
  `id_martingala` bigint(20) DEFAULT NULL,
  `alert_martingala` int(11) DEFAULT NULL,
  `reasons_martingala` varchar(50) DEFAULT NULL,
  `martingala_mandatory_shipping` int(11) DEFAULT NULL,
  `level_martingala` double DEFAULT NULL,
  `martingala_send` int(11) DEFAULT NULL,
  `martingala_alert_value` double DEFAULT NULL,
  `result_alert_martingala` int(11) DEFAULT NULL,
  `currency_pair_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `iq_values`
--

INSERT INTO `iq_values` (`id`, `open`, `close`, `min`, `max`, `direction`, `candle_size`, `volume`, `date`, `time`, `broke_level`, `speed`, `id_martingala`, `alert_martingala`, `reasons_martingala`, `martingala_mandatory_shipping`, `level_martingala`, `martingala_send`, `martingala_alert_value`, `result_alert_martingala`, `currency_pair_id`, `created_at`, `updated_at`) VALUES
(104765, 1.115075, 1.115095, 1.11507, 1.11511, 1, 2, 102, '2020-01-15 15:02:00', 1579118580004, -1, 17.21, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, '2020-01-15 20:03:04', '2020-01-15 20:03:04'),
(104766, 1.11509, 1.115095, 1.115075, 1.115115, 1, 0.5, 114, '2020-01-15 15:03:00', 1579118640004, -1, 36.11, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, '2020-01-15 20:04:03', '2020-01-15 20:04:03'),
(104767, 1.1151, 1.11511, 1.115085, 1.115115, 1, 1, 109, '2020-01-15 15:04:00', 1579118700000, -1, 35.56, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, '2020-01-15 20:05:03', '2020-01-15 20:05:03'),
(104768, 1.115115, 1.115095, 1.11508, 1.115115, -1, 2, 119, '2020-01-15 15:05:00', 1579118760007, -1, 33.33, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, '2020-01-15 20:06:03', '2020-01-15 20:06:03'),
(104769, 1.11509, 1.114995, 1.114985, 1.115105, -1, 9.5, 119, '2020-01-15 15:06:00', 1579118820005, -1, 16.16, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, '2020-01-15 20:07:03', '2020-01-15 20:07:03'),
(104770, 1.115, 1.11499, 1.114975, 1.115015, -1, 1, 110, '2020-01-15 15:07:00', 1579118880007, -1, 12.96, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, '2020-01-15 20:08:03', '2020-01-15 20:08:03'),
(104771, 1.11498, 1.115005, 1.114955, 1.11501, 1, 2.5, 119, '2020-01-15 15:08:00', 1579118940007, -1, 18.75, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, '2020-01-15 20:09:03', '2020-01-15 20:09:03'),
(104772, 1.115, 1.115045, 1.114975, 1.11511, 1, 4.5, 183, '2020-01-15 15:09:00', 1579119000007, -1, 39.94, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, '2020-01-15 20:10:03', '2020-01-15 20:10:03'),
(104773, 1.11504, 1.11503, 1.11503, 1.11508, -1, 1, 117, '2020-01-15 15:10:00', 1579119060007, -1, 15.46, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, '2020-01-15 20:11:03', '2020-01-15 20:11:03'),
(104774, 1.115035, 1.11501, 1.114985, 1.11504, -1, 2.5, 113, '2020-01-15 15:11:00', 1579119120007, -1, 22.92, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, '2020-01-15 20:12:03', '2020-01-15 20:12:03'),
(104775, 1.115015, 1.11497, 1.11496, 1.115025, -1, 4.5, 124, '2020-01-15 15:12:00', 1579119180007, -1, 25.16, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, '2020-01-15 20:13:03', '2020-01-15 20:13:03'),
(104776, 1.114975, 1.114985, 1.114935, 1.114985, 1, 1, 116, '2020-01-15 15:13:00', 1579119240008, -1, 17.74, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, '2020-01-15 20:14:03', '2020-01-15 20:14:03'),
(104777, 1.114985, 1.11495, 1.11494, 1.11499, -1, 3.5, 119, '2020-01-15 15:14:00', 1579119300007, -1, 26.48, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, '2020-01-15 20:15:03', '2020-01-15 20:15:03'),
(104778, 1.114955, 1.114985, 1.11495, 1.115, 1, 3, 124, '2020-01-15 15:15:00', 1579119360007, -1, 16.67, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, '2020-01-15 20:16:03', '2020-01-15 20:16:03'),
(104779, 1.11498, 1.114955, 1.114945, 1.11499, -1, 2.5, 100, '2020-01-15 15:16:00', 1579119420007, -1, 10.48, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, '2020-01-15 20:17:03', '2020-01-15 20:17:03'),
(104780, 1.11495, 1.11494, 1.114935, 1.11496, -1, 1, 124, '2020-01-15 15:17:00', 1579119480001, -1, 18.94, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, '2020-01-15 20:18:03', '2020-01-15 20:18:03'),
(104781, 1.114935, 1.114935, 1.114915, 1.114955, 0, 0, 101, '2020-01-15 15:18:00', 1579119540007, -1, 18.11, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, '2020-01-15 20:19:03', '2020-01-15 20:19:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `levels`
--

CREATE TABLE `levels` (
  `id` int(11) NOT NULL,
  `value` double NOT NULL,
  `fundamental` int(11) NOT NULL,
  `last_date` datetime DEFAULT NULL,
  `bounces_below` int(11) NOT NULL DEFAULT 0,
  `bounces_up` int(11) NOT NULL DEFAULT 0,
  `broke_below` int(11) NOT NULL DEFAULT 0,
  `broke_up` int(11) NOT NULL DEFAULT 0,
  `currency_pair_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `supports_resistors`
--

CREATE TABLE `supports_resistors` (
  `id` int(11) NOT NULL,
  `value` double NOT NULL,
  `type` enum('valleys_hills','candle_level','candle_levels_big') NOT NULL,
  `date` datetime NOT NULL,
  `last_date` datetime NOT NULL,
  `appearances` int(11) NOT NULL,
  `bounces_below` int(11) NOT NULL DEFAULT 0,
  `bounces_up` int(11) NOT NULL DEFAULT 0,
  `broke_below` int(11) NOT NULL DEFAULT 0,
  `broke_up` int(11) NOT NULL DEFAULT 0,
  `currency_pair_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alerts`
--
ALTER TABLE `alerts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`),
  ADD KEY `currency_pair_id` (`currency_pair_id`);

--
-- Indices de la tabla `currency_pairs`
--
ALTER TABLE `currency_pairs`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `iq_values`
--
ALTER TABLE `iq_values`
  ADD PRIMARY KEY (`id`),
  ADD KEY `currency_pair_id` (`currency_pair_id`);

--
-- Indices de la tabla `levels`
--
ALTER TABLE `levels`
  ADD PRIMARY KEY (`id`),
  ADD KEY `currency_pair_id` (`currency_pair_id`);

--
-- Indices de la tabla `supports_resistors`
--
ALTER TABLE `supports_resistors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `currency_pair_id` (`currency_pair_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alerts`
--
ALTER TABLE `alerts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3816;

--
-- AUTO_INCREMENT de la tabla `currency_pairs`
--
ALTER TABLE `currency_pairs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `iq_values`
--
ALTER TABLE `iq_values`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104782;

--
-- AUTO_INCREMENT de la tabla `levels`
--
ALTER TABLE `levels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3919;

--
-- AUTO_INCREMENT de la tabla `supports_resistors`
--
ALTER TABLE `supports_resistors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1148;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `iq_values`
--
ALTER TABLE `iq_values`
  ADD CONSTRAINT `iq_values_ibfk_1` FOREIGN KEY (`currency_pair_id`) REFERENCES `currency_pairs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `supports_resistors`
--
ALTER TABLE `supports_resistors`
  ADD CONSTRAINT `supports_resistors_ibfk_1` FOREIGN KEY (`currency_pair_id`) REFERENCES `currency_pairs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
