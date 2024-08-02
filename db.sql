DROP TABLE IF EXISTS account;

-- Account table
CREATE TABLE account (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    password TEXT NOT NULL,
    level SMALLINT NOT NULL,
    avatar TEXT,
    banned BOOLEAN NOT NULL,
    app VARCHAR(255) NOT NULL,
    confirmationId TEXT
);

-- Insert master account
INSERT INTO account(email, firstname, lastname, password, level, banned, app) VALUES ('manjaka.rajaonson@gmail.com', 'Harijaona', 'Rajaonson', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 0, false, 'hauth');