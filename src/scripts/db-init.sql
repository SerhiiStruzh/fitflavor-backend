BEGIN;

CREATE TABLE IF NOT EXISTS public."Comments"
(
    id serial NOT NULL,
    "userId" integer NOT NULL,
    "postId" integer NOT NULL,
    "commentText" character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Comments_pkey" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."Likes"
(
    id serial NOT NULL,
    "userId" integer NOT NULL,
    "postId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Likes_pkey" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."Posts"
(
    id serial NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    body text COLLATE pg_catalog."default" NOT NULL,
    "userId" integer NOT NULL,
    search_vector tsvector,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Posts_pkey" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."RefreshTokens"
(
    id serial NOT NULL,
    "userId" integer NOT NULL,
    "refreshTokenHash" character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "RefreshTokens_pkey" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."Users"
(
    id serial NOT NULL,
    name character varying(255) COLLATE pg_catalog."default",
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    picture character varying(255) COLLATE pg_catalog."default",
    linktree character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Users_pkey" PRIMARY KEY (id),
    CONSTRAINT "Users_email_key" UNIQUE (email)
);

ALTER TABLE IF EXISTS public."Comments"
    ADD CONSTRAINT "Comments_postId_fkey" FOREIGN KEY ("postId")
    REFERENCES public."Posts" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE IF EXISTS public."Comments"
    ADD CONSTRAINT "Comments_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES public."Users" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE IF EXISTS public."Likes"
    ADD CONSTRAINT "Likes_postId_fkey" FOREIGN KEY ("postId")
    REFERENCES public."Posts" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE IF EXISTS public."Likes"
    ADD CONSTRAINT "Likes_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES public."Users" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE IF EXISTS public."Posts"
    ADD CONSTRAINT "Posts_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES public."Users" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE IF EXISTS public."RefreshTokens"
    ADD CONSTRAINT "RefreshTokens_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES public."Users" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

-- Тригери для автоматичного оновлення search_vector
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS trigger AS $$
BEGIN
    NEW.search_vector := to_tsvector('simple', 
        COALESCE(NEW.title, '') || ' ' || 
        regexp_replace(COALESCE(NEW.body, ''), '!\[(.*?)\]\((.*?)\)', ' ', 'g')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_search_vector
BEFORE INSERT OR UPDATE ON public."Posts"
FOR EACH ROW
EXECUTE FUNCTION update_search_vector();

COMMIT;
