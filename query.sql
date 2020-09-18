SELECT *
FROM season_track_racer str
LEFT JOIN season_track st ON season_track_id = st.id
LEFT JOIN track t ON st.track_id = t.id

LEFT JOIN racer r ON str.racer_id = r.id

WHERE 



-- pontok
SELECT r.username, str.position
FROM season_track_racer str
LEFT JOIN season_track st ON season_track_id = st.id
LEFT JOIN track t ON st.track_id = t.id
LEFT JOIN season s ON st.season_id = s.id

LEFT JOIN racer r ON str.racer_id = r.id

LEFT JOIN point p ON p.season_id = s.id

GROUP BY str.racer_id