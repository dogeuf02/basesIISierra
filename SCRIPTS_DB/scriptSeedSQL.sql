-- ==========================================
-- SEED DATA FOR DIGITAL LIBRARY METADATA DB
-- ==========================================

-- ============================
-- 1. Programs
-- ============================
INSERT INTO program (program_id, name, faculty) VALUES
  (1, 'Systems Engineering', 'Engineering Faculty'),
  (2, 'Electronic Engineering', 'Engineering Faculty'),
  (3, 'Education', 'Human Sciences Faculty');

-- ============================
-- 2. Users
-- ============================
INSERT INTO app_user (user_id, name, email, role, program_id, created_at) VALUES
  (1, 'Alice Student',    'alice@student.edu',    'student',   1, NOW()),
  (2, 'Bob Student',      'bob@student.edu',      'student',   1, NOW()),
  (3, 'Prof. Carol',      'carol@prof.edu',       'professor', 2, NOW()),
  (4, 'Admin Daniel',     'daniel@admin.edu',     'admin',     1, NOW());

-- ============================
-- 3. Licenses
-- ============================
INSERT INTO license (license_id, name, description, valid_from, valid_until) VALUES
  (1, 'Open Access', 
   'Freely accessible to all users inside and outside the university.', 
   '2020-01-01', NULL),
  (2, 'Institutional Only', 
   'Access restricted to university network or VPN.', 
   '2021-01-01', NULL),
  (3, 'Course Material', 
   'Restricted to students enrolled in specific courses.', 
   '2022-01-01', NULL);

-- ============================
-- 4. Resources
-- ============================
INSERT INTO resource (
    resource_id, title, description, publication_year, 
    resource_type, language, license_id, created_at
) VALUES
  (1, 'Introduction to Databases',
   'Basic concepts of relational and non-relational databases.',
   2018, 'book', 'English', 1, NOW()),

  (2, 'Advanced Database Systems',
   'Architectures, distributed databases and big data.',
   2021, 'book', 'English', 2, NOW()),

  (3, 'Machine Learning for Engineers',
   'Practical introduction to ML techniques and tools.',
   2020, 'book', 'English', 1, NOW()),

  (4, 'Digital Libraries and Information Retrieval',
   'Concepts, architectures and search models for digital libraries.',
   2019, 'article', 'English', 2, NOW()),

  (5, 'Thesis: Usage Patterns in Academic Repositories',
   'Case study of user behavior in an institutional repository.',
   2022, 'thesis', 'Spanish', 3, NOW());

-- ============================
-- 5. Authors
-- ============================
INSERT INTO author (author_id, name, affiliation) VALUES
  (1, 'Hector Garcia',      'University A'),
  (2, 'Maria Rodriguez',    'University B'),
  (3, 'John Smith',         'Tech Institute'),
  (4, 'Laura Martinez',     'University A'),
  (5, 'Ana Gomez',          'University C');

-- ============================
-- 6. Categories
-- ============================
INSERT INTO category (category_id, name) VALUES
  (1, 'Databases'),
  (2, 'Distributed Systems'),
  (3, 'Machine Learning'),
  (4, 'Digital Libraries'),
  (5, 'User Behavior');

-- ============================
-- 7. Keywords
-- ============================
INSERT INTO keyword (keyword_id, keyword) VALUES
  (1, 'SQL'),
  (2, 'NoSQL'),
  (3, 'Search'),
  (4, 'Recommender Systems'),
  (5, 'User Analytics'),
  (6, 'Information Retrieval');

-- ============================
-- 8. ResourceAuthor (N:M)
-- ============================
INSERT INTO resource_author (resource_id, author_id) VALUES
  (1, 1),  -- Intro to Databases - Hector
  (1, 2),  -- Intro to Databases - Maria
  (2, 2),  -- Advanced DB - Maria
  (2, 3),  -- Advanced DB - John
  (3, 3),  -- ML for Engineers - John
  (3, 4),  -- ML for Engineers - Laura
  (4, 4),  -- Digital Libraries - Laura
  (5, 5);  -- Thesis - Ana

-- ============================
-- 9. ResourceCategory (N:M)
-- ============================
INSERT INTO resource_category (resource_id, category_id) VALUES
  (1, 1),  -- Intro DB -> Databases
  (2, 1),  -- Advanced DB -> Databases
  (2, 2),  -- Advanced DB -> Distributed Systems
  (3, 3),  -- ML for Engineers -> Machine Learning
  (4, 4),  -- Digital Libraries -> Digital Libraries
  (5, 4),  -- Thesis -> Digital Libraries
  (5, 5);  -- Thesis -> User Behavior

-- ============================
-- 10. ResourceKeyword (N:M)
-- ============================
INSERT INTO resource_keyword (resource_id, keyword_id) VALUES
  (1, 1),  -- Intro DB -> SQL
  (1, 2),  -- Intro DB -> NoSQL
  (2, 1),  -- Advanced DB -> SQL
  (2, 2),  -- Advanced DB -> NoSQL
  (2, 5),  -- Advanced DB -> User Analytics
  (3, 3),  -- ML -> Search
  (3, 4),  -- ML -> Recommender Systems
  (4, 3),  -- Digital Libraries -> Search
  (4, 6),  -- Digital Libraries -> Information Retrieval
  (5, 5);  -- Thesis -> User Analytics

-- ============================
-- 11. Reviews
-- ============================
INSERT INTO review (
    review_id, resource_id, user_id, rating, comment, created_at
) VALUES
  (1, 1, 1, 5, 'Very clear introduction to database concepts.', NOW()),
  (2, 2, 1, 4, 'Useful for understanding distributed databases.', NOW()),
  (3, 3, 2, 5, 'Great examples for machine learning beginners.', NOW()),
  (4, 4, 3, 4, 'Good overview of digital library architectures.', NOW()),
  (5, 5, 2, 3, 'Interesting case study, but lacks more datasets.', NOW());

-- 1. Verificar conteo básico de registros
-- ============================
SELECT 'program'          AS table_name, COUNT(*) AS total FROM program
UNION ALL
SELECT 'app_user',              COUNT(*) FROM app_user
UNION ALL
SELECT 'license',               COUNT(*) FROM license
UNION ALL
SELECT 'resource',              COUNT(*) FROM resource
UNION ALL
SELECT 'author',                COUNT(*) FROM author
UNION ALL
SELECT 'category',              COUNT(*) FROM category
UNION ALL
SELECT 'keyword',               COUNT(*) FROM keyword
UNION ALL
SELECT 'review',                COUNT(*) FROM review
UNION ALL
SELECT 'resource_author',       COUNT(*) FROM resource_author
UNION ALL
SELECT 'resource_category',     COUNT(*) FROM resource_category
UNION ALL
SELECT 'resource_keyword',      COUNT(*) FROM resource_keyword;

-- Deberías ver números > 0 en todas (según el seed que cargaste).

-- ============================
-- 2. Ver recursos con su licencia
-- ============================
SELECT 
    r.resource_id,
    r.title,
    l.name AS license_name,
	l.description,
	l.valid_from,
	l.valid_until
FROM resource r
LEFT JOIN license l ON r.license_id = l.license_id
ORDER BY r.resource_id;

-- ============================
-- 3. Ver users con su programa
-- ============================
SELECT 
    u.user_id,
    u.name AS user_name,
    u.email,
    u.role,
    p.name AS program_name
FROM app_user u
LEFT JOIN program p ON u.program_id = p.program_id
ORDER BY u.user_id;

-- ============================
-- 4. Ver autores de cada recurso
-- ============================
SELECT 
    r.resource_id,
    r.title,
    a.author_id,
    a.name AS author_name
FROM resource r
JOIN resource_author ra ON r.resource_id = ra.resource_id
JOIN author a          ON ra.author_id   = a.author_id
ORDER BY r.resource_id, a.author_id;


-- ============================
-- 5. Ver categorías de cada recurso
-- ============================
SELECT 
    r.resource_id,
    r.title,
    c.category_id,
    c.name AS category_name
FROM resource r
JOIN resource_category rc ON r.resource_id   = rc.resource_id
JOIN category c           ON rc.category_id  = c.category_id
ORDER BY r.resource_id, c.category_id;


-- ============================
-- 6. Ver keywords de cada recurso
-- ============================
SELECT 
    r.resource_id,
    r.title,
    k.keyword_id,
    k.keyword
FROM resource r
JOIN resource_keyword rk ON r.resource_id  = rk.resource_id
JOIN keyword k           ON rk.keyword_id = k.keyword_id
ORDER BY r.resource_id, k.keyword_id;



-- ============================
-- 7. Ver reseñas de cada recurso
-- ============================
SELECT 
    r.resource_id,
    r.title,
    u.name   AS user_name,
    rv.rating,
    rv.comment,
    rv.created_at
FROM review rv
JOIN resource r  ON rv.resource_id = r.resource_id
JOIN app_user u  ON rv.user_id     = u.user_id
ORDER BY r.resource_id, rv.created_at;

-- ============================
-- 8. Query tipo "búsqueda simple" por título
-- (simula GET /search?query=Databases)
-- ============================
SELECT 
    r.resource_id,
    r.title,
    r.publication_year
FROM resource r
WHERE r.title ILIKE '%Database%';

-- ============================
-- 9. Recursos por categoría específica
-- (simula getResourcesByCategory('Digital Libraries'))
-- ============================
SELECT 
    r.resource_id,
    r.title,
    c.name AS category_name
FROM resource r
JOIN resource_category rc ON r.resource_id  = rc.resource_id
JOIN category c           ON rc.category_id = c.category_id
WHERE c.name = 'Digital Libraries';


-- ============================
-- 10. Recursos por keyword específica
-- (simula getResourcesByKeyword('NoSQL'))
-- ============================
SELECT 
    r.resource_id,
    r.title,
    k.keyword
FROM resource r
JOIN resource_keyword rk ON r.resource_id  = rk.resource_id
JOIN keyword k           ON rk.keyword_id = k.keyword_id
WHERE k.keyword = 'NoSQL';

-- ============================
-- 11. Reseñas de un recurso específico
-- (simula GET /resources/1/reviews)
-- ============================
SELECT 
    r.title,
    u.name  AS user_name,
    rv.rating,
    rv.comment
FROM review rv
JOIN resource r ON rv.resource_id = r.resource_id
JOIN app_user u ON rv.user_id     = u.user_id
WHERE r.resource_id = 1;


