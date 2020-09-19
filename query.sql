-- egyéni
-- név, csapat, pont
SELECT r.username, te.name AS team, sum(point) AS point
FROM season_track_racer str
LEFT JOIN season_track st ON season_track_id = st.id
LEFT JOIN track tr ON st.track_id = tr.id
LEFT JOIN season s ON st.season_id = s.id

LEFT JOIN racer r ON str.racer_id = r.id
LEFT JOIN team te ON r.team_id = te.id
WHERE s.id = "1"

GROUP BY str.racer_id
ORDER BY sum(point) DESC

-- csapatok
SELECT t.name AS team, sum(point) AS point
FROM season_track_racer str
LEFT JOIN racer r ON str.racer_id = r.id
LEFT JOIN team t ON r.team_id = t.id

LEFT JOIN season_track st ON str.season_track_id = st.id
LEFT JOIN season s ON st.season_id = s.id

WHERE s.id = "2"
GROUP BY t.id
ORDER BY sum(point) DESC

-- helyezések
-- pálya, név, csapat, helyezések
SELECT tr.name, r.username, te.name, position
FROM season_track_racer str
LEFT JOIN season_track st ON season_track_id = st.id
LEFT JOIN track tr ON st.track_id = tr.id
LEFT JOIN season s ON st.season_id = s.id

LEFT JOIN racer r ON str.racer_id = r.id
LEFT JOIN team te ON r.team_id = te.id

WHERE str.racer_id = "1" AND s.id = "1"



-- szezonok lekérdezése
SELECT * FROM season