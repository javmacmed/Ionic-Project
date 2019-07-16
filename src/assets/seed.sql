CREATE TABLE IF NOT EXISTS animals (id INTEGER PRIMARY KEY AUTOINCREMENT, spanishName TEXT NOT NULL, englishName TEXT NOT NULL);
INSERT or IGNORE INTO animals(spanishName, englishName) VALUES ('León', 'Lion');
INSERT or IGNORE INTO animals(spanishName, englishName) VALUES ('Tigre', 'Tiger');
INSERT or IGNORE INTO animals(spanishName, englishName) VALUES ('Perro', 'Dog');
INSERT or IGNORE INTO animals(spanishName, englishName) VALUES ('Gato', 'Cat');
INSERT or IGNORE INTO animals(spanishName, englishName) VALUES ('Loro', 'Parrot');
INSERT or IGNORE INTO animals(spanishName, englishName) VALUES ('Pájaro', 'Bird');
INSERT or IGNORE INTO animals(spanishName, englishName) VALUES ('Delfín', 'Dolphin');

CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT NOT NULL, pass PASSWORD NOT NULL);
INSERT or IGNORE INTO users(userName, pass) VALUES ('Anisuri', '20J2018');
INSERT or IGNORE INTO users(userName, pass) VALUES ('JmacArrow', 'MEQTE');