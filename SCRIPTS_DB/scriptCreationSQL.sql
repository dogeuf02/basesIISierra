-- ============================
-- 1. Academic Programs
-- ============================
CREATE TABLE program (
    program_id      SERIAL PRIMARY KEY,
    name            VARCHAR(120) NOT NULL,
    faculty         VARCHAR(120) NULL
);

-- ============================
-- 2. Users
-- ============================
CREATE TABLE app_user (
    user_id         SERIAL PRIMARY KEY,
    name            VARCHAR(120) NOT NULL,
    email           VARCHAR(180) NOT NULL UNIQUE,
    role            VARCHAR(40)  NOT NULL DEFAULT 'student',  -- 'student', 'professor', 'admin'
    program_id      INTEGER      NULL,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_app_user_program
        FOREIGN KEY (program_id) REFERENCES program(program_id)
);

-- ============================
-- 3. Licenses
-- ============================
CREATE TABLE license (
    license_id      SERIAL PRIMARY KEY,
    name            VARCHAR(120) NOT NULL,        -- e.g. "Open Access", "Institutional Only"
    description     TEXT         NULL,
    valid_from      DATE         NULL,
    valid_until     DATE         NULL
);

-- ============================
-- 4. Resources (digital items)
-- ============================
CREATE TABLE resource (
    resource_id     SERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    description     TEXT         NULL,
    publication_year SMALLINT    NULL,
    resource_type   VARCHAR(40)  NOT NULL DEFAULT 'book', -- 'book', 'article', 'thesis', etc.
    language        VARCHAR(40)  NULL,
    license_id      INTEGER      NULL,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_resource_license
        FOREIGN KEY (license_id) REFERENCES license(license_id)
);

-- ============================
-- 5. Authors
-- ============================
CREATE TABLE author (
    author_id       SERIAL PRIMARY KEY,
    name            VARCHAR(180) NOT NULL,
    affiliation     VARCHAR(180) NULL
);

-- ============================
-- 6. Categories
-- ============================
CREATE TABLE category (
    category_id     SERIAL PRIMARY KEY,
    name            VARCHAR(120) NOT NULL UNIQUE
);

-- ============================
-- 7. Keywords
-- ============================
CREATE TABLE keyword (
    keyword_id      SERIAL PRIMARY KEY,
    keyword         VARCHAR(120) NOT NULL UNIQUE
);

-- ============================
-- 8. Reviews
-- ============================
CREATE TABLE review (
    review_id       SERIAL PRIMARY KEY,
    resource_id     INTEGER      NOT NULL,
    user_id         INTEGER      NOT NULL,
    rating          SMALLINT     NOT NULL,           -- 1–5
    comment         TEXT         NULL,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_review_rating
        CHECK (rating BETWEEN 1 AND 5),

    CONSTRAINT fk_review_resource
        FOREIGN KEY (resource_id) REFERENCES resource(resource_id),

    CONSTRAINT fk_review_user
        FOREIGN KEY (user_id) REFERENCES app_user(user_id)
);

-- ============================
-- 9. DW Daily Stats
-- ============================
CREATE TABLE IF NOT EXISTS daily_stats (
    date DATE PRIMARY KEY,
    total_events INTEGER NOT NULL,
    top_search_terms JSONB NOT NULL,
    top_downloads JSONB NOT NULL
);



-- =======================================
-- ResourceKeyword (N:M Resource ↔ Keyword)
-- =======================================
CREATE TABLE resource_keyword (
    resource_id     INTEGER NOT NULL,
    keyword_id      INTEGER NOT NULL,

    PRIMARY KEY (resource_id, keyword_id),

    CONSTRAINT fk_rk_resource
        FOREIGN KEY (resource_id) REFERENCES resource(resource_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rk_keyword
        FOREIGN KEY (keyword_id) REFERENCES keyword(keyword_id)
        ON DELETE CASCADE
);


-- ========================================
-- ResourceCategory (N:M Resource ↔ Category)
-- ========================================
CREATE TABLE resource_category (
    resource_id     INTEGER NOT NULL,
    category_id     INTEGER NOT NULL,

    PRIMARY KEY (resource_id, category_id),

    CONSTRAINT fk_rc_resource
        FOREIGN KEY (resource_id) REFERENCES resource(resource_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rc_category
        FOREIGN KEY (category_id) REFERENCES category(category_id)
        ON DELETE CASCADE
);


-- =====================================
-- ResourceAuthor (N:M Resource ↔ Author)
-- =====================================
CREATE TABLE resource_author (
    resource_id     INTEGER NOT NULL,
    author_id       INTEGER NOT NULL,

    PRIMARY KEY (resource_id, author_id),

    CONSTRAINT fk_ra_resource
        FOREIGN KEY (resource_id) REFERENCES resource(resource_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_ra_author
        FOREIGN KEY (author_id) REFERENCES author(author_id)
        ON DELETE CASCADE
);
