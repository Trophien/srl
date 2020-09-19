-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2020. Sze 19. 20:32
-- Kiszolgáló verziója: 10.4.14-MariaDB
-- PHP verzió: 7.4.9

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
-- Tábla szerkezet ehhez a táblához `racer`
--

CREATE TABLE `racer` (
  `id` varchar(200) COLLATE utf8_bin NOT NULL,
  `team_id` varchar(200) COLLATE utf8_bin NOT NULL,
  `name` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- A tábla adatainak kiíratása `racer`
--

INSERT INTO `racer` (`id`, `team_id`, `name`) VALUES
('1', '1', 'leventenyiro'),
('2', '1', 'TUSZMUSZ'),
('3', '2', 'MorzsamanKing');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `season`
--

CREATE TABLE `season` (
  `id` varchar(200) COLLATE utf8_bin NOT NULL,
  `name` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- A tábla adatainak kiíratása `season`
--

INSERT INTO `season` (`id`, `name`) VALUES
('1', 'Formula 1 - Season 1');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `season_track`
--

CREATE TABLE `season_track` (
  `id` varchar(200) COLLATE utf8_bin NOT NULL,
  `season_id` varchar(200) COLLATE utf8_bin NOT NULL,
  `track_id` varchar(200) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- A tábla adatainak kiíratása `season_track`
--

INSERT INTO `season_track` (`id`, `season_id`, `track_id`) VALUES
('1', '1', '1'),
('2', '1', '2');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `season_track_racer`
--

CREATE TABLE `season_track_racer` (
  `id` varchar(200) COLLATE utf8_bin NOT NULL,
  `season_track_id` varchar(200) COLLATE utf8_bin NOT NULL,
  `racer_id` varchar(200) COLLATE utf8_bin NOT NULL,
  `position` varchar(255) COLLATE utf8_bin NOT NULL,
  `point` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- A tábla adatainak kiíratása `season_track_racer`
--

INSERT INTO `season_track_racer` (`id`, `season_track_id`, `racer_id`, `position`, `point`) VALUES
('1', '1', '1', '1', 25),
('2', '1', '2', '2', 18),
('3', '1', '3', '3', 15),
('4', '2', '1', '2', 18),
('5', '2', '2', '3', 15);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `team`
--

CREATE TABLE `team` (
  `id` varchar(200) COLLATE utf8_bin NOT NULL,
  `name` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- A tábla adatainak kiíratása `team`
--

INSERT INTO `team` (`id`, `name`) VALUES
('2', 'Ferrari'),
('1', 'Mercedes-AMG');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `track`
--

CREATE TABLE `track` (
  `id` varchar(200) COLLATE utf8_bin NOT NULL,
  `name` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- A tábla adatainak kiíratása `track`
--

INSERT INTO `track` (`id`, `name`) VALUES
('1', 'Australia'),
('2', 'Bahrein');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user`
--

CREATE TABLE `user` (
  `id` varchar(200) COLLATE utf8_bin NOT NULL,
  `username` varchar(255) COLLATE utf8_bin NOT NULL,
  `password` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- A tábla adatainak kiíratása `user`
--

INSERT INTO `user` (`id`, `username`, `password`) VALUES
('18b040e387', 'admin', '$2b$10$xgbmCgkaNqe7S4BgakDW5.oK5Jk4Zt20a7LudRTQHEMxU5lIDBL6i');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `racer`
--
ALTER TABLE `racer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `team_id` (`team_id`);

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
-- A tábla indexei `team`
--
ALTER TABLE `team`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uc_name` (`name`);

--
-- A tábla indexei `track`
--
ALTER TABLE `track`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uc_username` (`username`);

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `racer`
--
ALTER TABLE `racer`
  ADD CONSTRAINT `racer_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `team` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
