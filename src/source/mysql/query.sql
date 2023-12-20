SELECT * FROM meeting;

ALTER TABLE meeting
ADD color varchar(8);

ALTER TABLE meeting
DROP COLUMN color;