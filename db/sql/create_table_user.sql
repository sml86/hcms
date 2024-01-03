CREATE TABLE IF NOT EXISTS public.user (
    id VARCHAR(256) NOT NULL,
    created_by VARCHAR(256) NOT NULL,
    created_on TIMESTAMP NOT NULL,
    updated_by VARCHAR(256) NOT NULL,
    updated_on TIMESTAMP NOT NULL,
    first_name VARCHAR(256) NOT NULL,
    last_name VARCHAR(256) NOT NULL,
    email VARCHAR(256) NOT NULL,
    password VARCHAR(256) NOT NULL,
    active BOOLEAN NOT NULL,
    scopes VARCHAR(256) NOT NULL,
    PRIMARY KEY (id)
);