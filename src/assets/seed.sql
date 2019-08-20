CREATE TABLE IF NOT EXISTS Animales (id INTEGER PRIMARY KEY AUTOINCREMENT, spanishName TEXT NOT NULL, englishName TEXT NOT NULL);
INSERT or IGNORE INTO Animales(id, spanishName, englishName) VALUES ('1', 'León', 'Lion');
INSERT or IGNORE INTO Animales(id, spanishName, englishName) VALUES ('2', 'Tigre', 'Tiger');
INSERT or IGNORE INTO Animales(id, spanishName, englishName) VALUES ('3', 'Perro', 'Dog');
INSERT or IGNORE INTO Animales(id, spanishName, englishName) VALUES ('4', 'Gato', 'Cat');
INSERT or IGNORE INTO Animales(id, spanishName, englishName) VALUES ('5', 'Ornitorrinco', 'Platypus');
INSERT or IGNORE INTO Animales(id, spanishName, englishName) VALUES ('6', 'Pájaro', 'Bird');
INSERT or IGNORE INTO Animales(id, spanishName, englishName) VALUES ('7', 'Delfín', 'Dolphin');

CREATE TABLE IF NOT EXISTS Colores (id INTEGER PRIMARY KEY AUTOINCREMENT, spanishName TEXT NOT NULL, englishName TEXT NOT NULL);
INSERT or IGNORE INTO Colores(id, spanishName, englishName) VALUES ('1', 'Rojo', 'Red');
INSERT or IGNORE INTO Colores(id, spanishName, englishName) VALUES ('2', 'Azul', 'Blue');
INSERT or IGNORE INTO Colores(id, spanishName, englishName) VALUES ('3', 'Amarillo', 'Yellow');
INSERT or IGNORE INTO Colores(id, spanishName, englishName) VALUES ('4', 'Verde', 'Green');
INSERT or IGNORE INTO Colores(id, spanishName, englishName) VALUES ('5', 'Rosa', 'Pink');
INSERT or IGNORE INTO Colores(id, spanishName, englishName) VALUES ('6', 'Blanco', 'White');
INSERT or IGNORE INTO Colores(id, spanishName, englishName) VALUES ('7', 'Negro', 'Black');