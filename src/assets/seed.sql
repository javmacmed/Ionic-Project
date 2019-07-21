CREATE TABLE IF NOT EXISTS animals (id INTEGER PRIMARY KEY AUTOINCREMENT, spanishName TEXT NOT NULL, englishName TEXT NOT NULL);
INSERT or IGNORE INTO animals(id, spanishName, englishName) VALUES ('1', 'León', 'Lion');
INSERT or IGNORE INTO animals(id, spanishName, englishName) VALUES ('2', 'Tigre', 'Tiger');
INSERT or IGNORE INTO animals(id, spanishName, englishName) VALUES ('3', 'Perro', 'Dog');
INSERT or IGNORE INTO animals(id, spanishName, englishName) VALUES ('4', 'Gato', 'Cat');
INSERT or IGNORE INTO animals(id, spanishName, englishName) VALUES ('5', 'Loro', 'Parrot');
INSERT or IGNORE INTO animals(id, spanishName, englishName) VALUES ('6', 'Pájaro', 'Bird');
INSERT or IGNORE INTO animals(id, spanishName, englishName) VALUES ('7', 'Delfín', 'Dolphin');

CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT NOT NULL, pass PASSWORD NOT NULL);
INSERT or IGNORE INTO users(id, userName, pass) VALUES ('1', 'Anisuri', '20J2018');
INSERT or IGNORE INTO users(id, userName, pass) VALUES ('2', 'JmacArrow', 'MEQTE');