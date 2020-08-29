-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2020. Aug 29. 20:40
-- Kiszolgáló verziója: 10.4.11-MariaDB
-- PHP verzió: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Adatbázis: `srl`
--
CREATE DATABASE IF NOT EXISTS `srl` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
USE `srl`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `point`
--

CREATE TABLE `point` (
  `place` int(11) NOT NULL,
  `point` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `racer`
--

CREATE TABLE `racer` (
  `id` varchar(200) COLLATE utf8_bin NOT NULL,
  `username` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `season`
--

CREATE TABLE `season` (
  `id` varchar(200) COLLATE utf8_bin NOT NULL,
  `name` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `season_track`
--

CREATE TABLE `season_track` (
  `id` varchar(200) COLLATE utf8_bin NOT NULL,
  `season_id` varchar(200) COLLATE utf8_bin NOT NULL,
  `track_id` varchar(200) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `season_track_racer`
--

CREATE TABLE `season_track_racer` (
  `id` varchar(200) COLLATE utf8_bin NOT NULL,
  `season_track_id` varchar(200) COLLATE utf8_bin NOT NULL,
  `racer_id` varchar(200) COLLATE utf8_bin NOT NULL,
  `position` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `track`
--

CREATE TABLE `track` (
  `id` varchar(200) COLLATE utf8_bin NOT NULL,
  `name` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `racer`
--
ALTER TABLE `racer`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `season`
--
ALTER TABLE `season`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `season_track`
--
ALTER TABLE `season_track`
  ADD PRIMARY KEY (`id`),
  ADD KEY `season_id` (`season_id`),
  ADD KEY `track_id` (`track_id`);

--
-- A tábla indexei `season_track_racer`
--
ALTER TABLE `season_track_racer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `season_track_id` (`season_track_id`),
  ADD KEY `racer_id` (`racer_id`);

--
-- A tábla indexei `track`
--
ALTER TABLE `track`
  ADD PRIMARY KEY (`id`);

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `season_track`
--
ALTER TABLE `season_track`
  ADD CONSTRAINT `season_track_ibfk_1` FOREIGN KEY (`track_id`) REFERENCES `track` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `season_track_ibfk_2` FOREIGN KEY (`season_id`) REFERENCES `season` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `season_track_racer`
--
ALTER TABLE `season_track_racer`
  ADD CONSTRAINT `season_track_racer_ibfk_1` FOREIGN KEY (`season_track_id`) REFERENCES `season_track` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `season_track_racer_ibfk_2` FOREIGN KEY (`racer_id`) REFERENCES `racer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;
