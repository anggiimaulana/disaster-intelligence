--
-- PostgreSQL database dump
--

\restrict PDf5E3QMImTArKGB4cRGsoOE3nMMsvjvdA9hiCDA0NbNrnG9ZQrcNDTizq8SxoP

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: level_warning; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.level_warning AS ENUM (
    'Siaga',
    'Waspada',
    'Awas'
);


--
-- Name: sumber_data; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.sumber_data AS ENUM (
    'whatsapp',
    'mobile_app',
    'website',
    'api',
    'sensor'
);


--
-- Name: tingkat_keparahan; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.tingkat_keparahan AS ENUM (
    'Rendah',
    'Sedang',
    'Tinggi',
    'Darurat'
);


--
-- Name: tipe_pesan; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.tipe_pesan AS ENUM (
    'text',
    'image',
    'video',
    'audio',
    'document',
    'location'
);


--
-- Name: warning_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.warning_status AS ENUM (
    'aktif',
    'selesai'
);


--
-- Name: whatsapp_source; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.whatsapp_source AS ENUM (
    'whatsapp_cloud_api',
    'wablas',
    'fonnte',
    'twilio'
);


--
-- Name: whatsapp_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.whatsapp_status AS ENUM (
    'pending',
    'processed',
    'failed'
);


--
-- Name: workflow_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.workflow_status AS ENUM (
    'running',
    'success',
    'failed'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: analytics_daily; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analytics_daily (
    id bigint NOT NULL,
    tanggal date,
    total_laporan integer DEFAULT 0 NOT NULL,
    total_warning integer DEFAULT 0 NOT NULL,
    total_darurat integer DEFAULT 0 NOT NULL,
    total_banjir integer DEFAULT 0 NOT NULL,
    total_abrasi integer DEFAULT 0 NOT NULL,
    total_rob integer DEFAULT 0 NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: analytics_daily_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.analytics_daily_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: analytics_daily_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.analytics_daily_id_seq OWNED BY public.analytics_daily.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id bigint NOT NULL,
    user_id bigint,
    action character varying(255),
    table_name character varying(100),
    record_id bigint,
    old_data json,
    new_data json,
    ip_address character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.audit_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: berita; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.berita (
    id bigint NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    content text NOT NULL,
    thumbnail character varying(255),
    status character varying(255) DEFAULT 'draft'::character varying NOT NULL,
    seo_title character varying(255),
    seo_description text,
    seo_keywords character varying(255),
    published_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: berita_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.berita_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: berita_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.berita_id_seq OWNED BY public.berita.id;


--
-- Name: cache; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration bigint NOT NULL
);


--
-- Name: cache_locks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration bigint NOT NULL
);


--
-- Name: cv_analysis; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cv_analysis (
    id bigint NOT NULL,
    laporan_media_id bigint,
    detected_object character varying(255),
    severity_level character varying(50),
    confidence_score numeric(5,2),
    raw_result json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: cv_analysis_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cv_analysis_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cv_analysis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cv_analysis_id_seq OWNED BY public.cv_analysis.id;


--
-- Name: early_warning; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.early_warning (
    id bigint NOT NULL,
    laporan_id bigint,
    jenis_bencana_id bigint,
    level_warning character varying(20),
    status character varying(20) DEFAULT 'aktif'::character varying NOT NULL,
    wilayah character varying(255),
    pesan text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT chk_level_warning CHECK ((((level_warning)::text = ANY ((ARRAY['Siaga'::character varying, 'Waspada'::character varying, 'Awas'::character varying])::text[])) OR (level_warning IS NULL))),
    CONSTRAINT chk_warning_status CHECK (((status)::text = ANY ((ARRAY['aktif'::character varying, 'selesai'::character varying])::text[])))
);


--
-- Name: early_warning_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.early_warning_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: early_warning_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.early_warning_id_seq OWNED BY public.early_warning.id;


--
-- Name: failed_jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection character varying(255) NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;


--
-- Name: faqs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faqs (
    id bigint NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    seo_title character varying(255),
    seo_description text,
    seo_keywords character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: faqs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faqs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faqs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faqs_id_seq OWNED BY public.faqs.id;


--
-- Name: incident_clusters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.incident_clusters (
    id bigint NOT NULL,
    cluster_code character varying(100),
    jenis_bencana_id bigint,
    total_laporan integer,
    radius_km double precision,
    center_latitude numeric(10,8),
    center_longitude numeric(11,8),
    severity character varying(20),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT chk_cluster_severity CHECK ((((severity)::text = ANY ((ARRAY['Rendah'::character varying, 'Sedang'::character varying, 'Tinggi'::character varying, 'Darurat'::character varying])::text[])) OR (severity IS NULL)))
);


--
-- Name: incident_clusters_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.incident_clusters_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: incident_clusters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.incident_clusters_id_seq OWNED BY public.incident_clusters.id;


--
-- Name: jenis_bencana; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jenis_bencana (
    id bigint NOT NULL,
    kode character varying(20),
    nama_bencana character varying(100),
    icon character varying(255),
    warna character varying(20),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: jenis_bencana_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jenis_bencana_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jenis_bencana_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jenis_bencana_id_seq OWNED BY public.jenis_bencana.id;


--
-- Name: job_batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);


--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: kesiapsiagaans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kesiapsiagaans (
    id bigint NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    content text NOT NULL,
    thumbnail character varying(255),
    status character varying(255) DEFAULT 'draft'::character varying NOT NULL,
    seo_title character varying(255),
    seo_description text,
    seo_keywords character varying(255),
    published_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: kesiapsiagaans_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.kesiapsiagaans_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: kesiapsiagaans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.kesiapsiagaans_id_seq OWNED BY public.kesiapsiagaans.id;


--
-- Name: laporan_bencana; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.laporan_bencana (
    id bigint NOT NULL,
    kode_laporan character varying(50),
    whatsapp_message_id bigint,
    user_id bigint,
    jenis_bencana_id bigint,
    status_id bigint DEFAULT '1'::bigint NOT NULL,
    wilayah_id bigint,
    judul character varying(255),
    deskripsi text,
    alamat text,
    latitude numeric(10,8),
    longitude numeric(11,8),
    tingkat_keparahan character varying(20) DEFAULT 'Rendah'::character varying NOT NULL,
    sumber_data character varying(20) DEFAULT 'website'::character varying NOT NULL,
    confidence_score numeric(5,2),
    validasi_ai boolean DEFAULT false NOT NULL,
    validasi_admin boolean DEFAULT false NOT NULL,
    is_duplicate boolean DEFAULT false NOT NULL,
    duplicate_reference bigint,
    waktu_kejadian timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    kecamatan character varying(100),
    desa character varying(100),
    nama_pelapor character varying(150),
    no_hp_pelapor character varying(25),
    CONSTRAINT chk_sumber_data CHECK (((sumber_data)::text = ANY ((ARRAY['whatsapp'::character varying, 'mobile_app'::character varying, 'website'::character varying, 'api'::character varying, 'sensor'::character varying])::text[]))),
    CONSTRAINT chk_tingkat_keparahan CHECK (((tingkat_keparahan)::text = ANY ((ARRAY['Rendah'::character varying, 'Sedang'::character varying, 'Tinggi'::character varying, 'Darurat'::character varying])::text[])))
);


--
-- Name: laporan_bencana_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.laporan_bencana_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: laporan_bencana_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.laporan_bencana_id_seq OWNED BY public.laporan_bencana.id;


--
-- Name: laporan_media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.laporan_media (
    id bigint NOT NULL,
    laporan_id bigint NOT NULL,
    media_type character varying(255),
    file_path text,
    file_url text,
    ai_result text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT laporan_media_media_type_check CHECK (((media_type)::text = ANY ((ARRAY['image'::character varying, 'video'::character varying, 'audio'::character varying, 'document'::character varying])::text[])))
);


--
-- Name: laporan_media_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.laporan_media_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: laporan_media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.laporan_media_id_seq OWNED BY public.laporan_media.id;


--
-- Name: media_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media_files (
    id bigint NOT NULL,
    whatsapp_message_id bigint,
    file_name character varying(255),
    original_name character varying(255),
    file_path text,
    file_url text,
    file_type character varying(50),
    mime_type character varying(100),
    file_size bigint,
    ai_analysis text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: media_files_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_files_id_seq OWNED BY public.media_files.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: ml_predictions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ml_predictions (
    id bigint NOT NULL,
    laporan_id bigint,
    model_name character varying(100),
    model_version character varying(50),
    prediksi_bencana character varying(100),
    prediksi_keparahan character varying(50),
    confidence_score numeric(5,2),
    raw_result json,
    processing_time double precision,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: ml_predictions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ml_predictions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ml_predictions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ml_predictions_id_seq OWNED BY public.ml_predictions.id;


--
-- Name: nlp_analysis; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nlp_analysis (
    id bigint NOT NULL,
    laporan_id bigint,
    extracted_keywords text,
    sentiment character varying(50),
    detected_entities text,
    cleaned_text text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: nlp_analysis_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nlp_analysis_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nlp_analysis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nlp_analysis_id_seq OWNED BY public.nlp_analysis.id;


--
-- Name: passkeys; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.passkeys (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    credential_id character varying(255) NOT NULL,
    credential json NOT NULL,
    last_used_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: passkeys_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.passkeys_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: passkeys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.passkeys_id_seq OWNED BY public.passkeys.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id bigint,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);


--
-- Name: status_laporan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.status_laporan (
    id bigint NOT NULL,
    nama_status character varying(100),
    warna character varying(20),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: status_laporan_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.status_laporan_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: status_laporan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.status_laporan_id_seq OWNED BY public.status_laporan.id;


--
-- Name: supported_regencies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.supported_regencies (
    id bigint NOT NULL,
    code character varying(10) NOT NULL,
    name character varying(100) NOT NULL,
    province_code character varying(10) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: supported_regencies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.supported_regencies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: supported_regencies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.supported_regencies_id_seq OWNED BY public.supported_regencies.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    two_factor_secret text,
    two_factor_recovery_codes text,
    two_factor_confirmed_at timestamp(0) without time zone,
    is_admin boolean DEFAULT false NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: validasi_laporan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.validasi_laporan (
    id bigint NOT NULL,
    laporan_id bigint NOT NULL,
    admin_id bigint,
    hasil_validasi character varying(20),
    catatan text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT chk_hasil_validasi CHECK ((((hasil_validasi)::text = ANY ((ARRAY['valid'::character varying, 'invalid'::character varying, 'spam'::character varying, 'duplikat'::character varying])::text[])) OR (hasil_validasi IS NULL)))
);


--
-- Name: validasi_laporan_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.validasi_laporan_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: validasi_laporan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.validasi_laporan_id_seq OWNED BY public.validasi_laporan.id;


--
-- Name: whatsapp_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.whatsapp_messages (
    id bigint NOT NULL,
    message_id character varying(255),
    nomor_pengirim character varying(30),
    nama_pengirim character varying(150),
    tipe_pesan character varying(20),
    source character varying(30) DEFAULT 'whatsapp_cloud_api'::character varying NOT NULL,
    status_proses character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    isi_pesan text,
    media_url text,
    latitude numeric(10,8),
    longitude numeric(11,8),
    raw_payload jsonb,
    received_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT chk_source CHECK (((source)::text = ANY ((ARRAY['whatsapp_cloud_api'::character varying, 'wablas'::character varying, 'fonnte'::character varying, 'twilio'::character varying])::text[]))),
    CONSTRAINT chk_status_proses CHECK (((status_proses)::text = ANY ((ARRAY['pending'::character varying, 'processed'::character varying, 'failed'::character varying])::text[]))),
    CONSTRAINT chk_tipe_pesan CHECK ((((tipe_pesan)::text = ANY ((ARRAY['text'::character varying, 'image'::character varying, 'video'::character varying, 'audio'::character varying, 'document'::character varying, 'location'::character varying])::text[])) OR (tipe_pesan IS NULL)))
);


--
-- Name: whatsapp_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.whatsapp_messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: whatsapp_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.whatsapp_messages_id_seq OWNED BY public.whatsapp_messages.id;


--
-- Name: wilayah; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wilayah (
    id bigint NOT NULL,
    provinsi character varying(100),
    kabupaten character varying(100),
    kecamatan character varying(100),
    desa character varying(100),
    kodepos character varying(10),
    latitude numeric(10,8),
    longitude numeric(11,8),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: wilayah_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.wilayah_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: wilayah_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.wilayah_id_seq OWNED BY public.wilayah.id;


--
-- Name: workflow_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.workflow_logs (
    id bigint NOT NULL,
    workflow_name character varying(255),
    execution_id character varying(255),
    whatsapp_message_id bigint,
    laporan_id bigint,
    step_name character varying(255),
    status character varying(20),
    response text,
    execution_time double precision,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT chk_workflow_status CHECK ((((status)::text = ANY ((ARRAY['running'::character varying, 'success'::character varying, 'failed'::character varying])::text[])) OR (status IS NULL)))
);


--
-- Name: workflow_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.workflow_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: workflow_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.workflow_logs_id_seq OWNED BY public.workflow_logs.id;


--
-- Name: analytics_daily id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_daily ALTER COLUMN id SET DEFAULT nextval('public.analytics_daily_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: berita id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.berita ALTER COLUMN id SET DEFAULT nextval('public.berita_id_seq'::regclass);


--
-- Name: cv_analysis id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cv_analysis ALTER COLUMN id SET DEFAULT nextval('public.cv_analysis_id_seq'::regclass);


--
-- Name: early_warning id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.early_warning ALTER COLUMN id SET DEFAULT nextval('public.early_warning_id_seq'::regclass);


--
-- Name: failed_jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);


--
-- Name: faqs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faqs ALTER COLUMN id SET DEFAULT nextval('public.faqs_id_seq'::regclass);


--
-- Name: incident_clusters id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incident_clusters ALTER COLUMN id SET DEFAULT nextval('public.incident_clusters_id_seq'::regclass);


--
-- Name: jenis_bencana id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jenis_bencana ALTER COLUMN id SET DEFAULT nextval('public.jenis_bencana_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: kesiapsiagaans id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kesiapsiagaans ALTER COLUMN id SET DEFAULT nextval('public.kesiapsiagaans_id_seq'::regclass);


--
-- Name: laporan_bencana id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.laporan_bencana ALTER COLUMN id SET DEFAULT nextval('public.laporan_bencana_id_seq'::regclass);


--
-- Name: laporan_media id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.laporan_media ALTER COLUMN id SET DEFAULT nextval('public.laporan_media_id_seq'::regclass);


--
-- Name: media_files id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_files ALTER COLUMN id SET DEFAULT nextval('public.media_files_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: ml_predictions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ml_predictions ALTER COLUMN id SET DEFAULT nextval('public.ml_predictions_id_seq'::regclass);


--
-- Name: nlp_analysis id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nlp_analysis ALTER COLUMN id SET DEFAULT nextval('public.nlp_analysis_id_seq'::regclass);


--
-- Name: passkeys id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.passkeys ALTER COLUMN id SET DEFAULT nextval('public.passkeys_id_seq'::regclass);


--
-- Name: status_laporan id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.status_laporan ALTER COLUMN id SET DEFAULT nextval('public.status_laporan_id_seq'::regclass);


--
-- Name: supported_regencies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supported_regencies ALTER COLUMN id SET DEFAULT nextval('public.supported_regencies_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: validasi_laporan id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.validasi_laporan ALTER COLUMN id SET DEFAULT nextval('public.validasi_laporan_id_seq'::regclass);


--
-- Name: whatsapp_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.whatsapp_messages ALTER COLUMN id SET DEFAULT nextval('public.whatsapp_messages_id_seq'::regclass);


--
-- Name: wilayah id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wilayah ALTER COLUMN id SET DEFAULT nextval('public.wilayah_id_seq'::regclass);


--
-- Name: workflow_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workflow_logs ALTER COLUMN id SET DEFAULT nextval('public.workflow_logs_id_seq'::regclass);


--
-- Name: analytics_daily analytics_daily_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_daily
    ADD CONSTRAINT analytics_daily_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: berita berita_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.berita
    ADD CONSTRAINT berita_pkey PRIMARY KEY (id);


--
-- Name: berita berita_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.berita
    ADD CONSTRAINT berita_slug_unique UNIQUE (slug);


--
-- Name: cache_locks cache_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);


--
-- Name: cache cache_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);


--
-- Name: cv_analysis cv_analysis_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cv_analysis
    ADD CONSTRAINT cv_analysis_pkey PRIMARY KEY (id);


--
-- Name: early_warning early_warning_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.early_warning
    ADD CONSTRAINT early_warning_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);


--
-- Name: faqs faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (id);


--
-- Name: incident_clusters incident_clusters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incident_clusters
    ADD CONSTRAINT incident_clusters_pkey PRIMARY KEY (id);


--
-- Name: jenis_bencana jenis_bencana_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jenis_bencana
    ADD CONSTRAINT jenis_bencana_pkey PRIMARY KEY (id);


--
-- Name: job_batches job_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: kesiapsiagaans kesiapsiagaans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kesiapsiagaans
    ADD CONSTRAINT kesiapsiagaans_pkey PRIMARY KEY (id);


--
-- Name: kesiapsiagaans kesiapsiagaans_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kesiapsiagaans
    ADD CONSTRAINT kesiapsiagaans_slug_unique UNIQUE (slug);


--
-- Name: laporan_bencana laporan_bencana_kode_laporan_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.laporan_bencana
    ADD CONSTRAINT laporan_bencana_kode_laporan_unique UNIQUE (kode_laporan);


--
-- Name: laporan_bencana laporan_bencana_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.laporan_bencana
    ADD CONSTRAINT laporan_bencana_pkey PRIMARY KEY (id);


--
-- Name: laporan_media laporan_media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.laporan_media
    ADD CONSTRAINT laporan_media_pkey PRIMARY KEY (id);


--
-- Name: media_files media_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_files
    ADD CONSTRAINT media_files_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: ml_predictions ml_predictions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ml_predictions
    ADD CONSTRAINT ml_predictions_pkey PRIMARY KEY (id);


--
-- Name: nlp_analysis nlp_analysis_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nlp_analysis
    ADD CONSTRAINT nlp_analysis_pkey PRIMARY KEY (id);


--
-- Name: passkeys passkeys_credential_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.passkeys
    ADD CONSTRAINT passkeys_credential_id_unique UNIQUE (credential_id);


--
-- Name: passkeys passkeys_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.passkeys
    ADD CONSTRAINT passkeys_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: status_laporan status_laporan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.status_laporan
    ADD CONSTRAINT status_laporan_pkey PRIMARY KEY (id);


--
-- Name: supported_regencies supported_regencies_code_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supported_regencies
    ADD CONSTRAINT supported_regencies_code_unique UNIQUE (code);


--
-- Name: supported_regencies supported_regencies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supported_regencies
    ADD CONSTRAINT supported_regencies_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: validasi_laporan validasi_laporan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.validasi_laporan
    ADD CONSTRAINT validasi_laporan_pkey PRIMARY KEY (id);


--
-- Name: whatsapp_messages whatsapp_messages_message_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.whatsapp_messages
    ADD CONSTRAINT whatsapp_messages_message_id_unique UNIQUE (message_id);


--
-- Name: whatsapp_messages whatsapp_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.whatsapp_messages
    ADD CONSTRAINT whatsapp_messages_pkey PRIMARY KEY (id);


--
-- Name: wilayah wilayah_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wilayah
    ADD CONSTRAINT wilayah_pkey PRIMARY KEY (id);


--
-- Name: workflow_logs workflow_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workflow_logs
    ADD CONSTRAINT workflow_logs_pkey PRIMARY KEY (id);


--
-- Name: cache_expiration_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cache_expiration_index ON public.cache USING btree (expiration);


--
-- Name: cache_locks_expiration_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cache_locks_expiration_index ON public.cache_locks USING btree (expiration);


--
-- Name: failed_jobs_connection_queue_failed_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX failed_jobs_connection_queue_failed_at_index ON public.failed_jobs USING btree (connection, queue, failed_at);


--
-- Name: idx_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_created_at ON public.laporan_bencana USING btree (created_at);


--
-- Name: idx_execution_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_execution_id ON public.workflow_logs USING btree (execution_id);


--
-- Name: idx_hasil_validasi; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hasil_validasi ON public.validasi_laporan USING btree (hasil_validasi);


--
-- Name: idx_kode_laporan; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_kode_laporan ON public.laporan_bencana USING btree (kode_laporan);


--
-- Name: idx_kode_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_kode_status ON public.laporan_bencana USING btree (kode_laporan, status_id);


--
-- Name: idx_laporan_latlng; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_laporan_latlng ON public.laporan_bencana USING btree (latitude, longitude);


--
-- Name: idx_level_warning; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_level_warning ON public.early_warning USING btree (level_warning);


--
-- Name: idx_media_laporan_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_media_laporan_type ON public.laporan_media USING btree (laporan_id, media_type);


--
-- Name: idx_severity_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_severity_status ON public.laporan_bencana USING btree (tingkat_keparahan, status_id);


--
-- Name: idx_source_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_source_time ON public.laporan_bencana USING btree (sumber_data, created_at);


--
-- Name: idx_status_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_status_id ON public.laporan_bencana USING btree (status_id);


--
-- Name: idx_status_proses; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_status_proses ON public.whatsapp_messages USING btree (status_proses);


--
-- Name: idx_validasi_admin_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_validasi_admin_time ON public.validasi_laporan USING btree (admin_id, created_at);


--
-- Name: idx_validasi_hasil; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_validasi_hasil ON public.validasi_laporan USING btree (laporan_id, hasil_validasi);


--
-- Name: idx_validation_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_validation_status ON public.laporan_bencana USING btree (validasi_admin, validasi_ai, status_id);


--
-- Name: idx_waktu_jenis; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_waktu_jenis ON public.laporan_bencana USING btree (waktu_kejadian, jenis_bencana_id);


--
-- Name: idx_warning_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_warning_status ON public.early_warning USING btree (status);


--
-- Name: idx_warning_status_jenis; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_warning_status_jenis ON public.early_warning USING btree (status, jenis_bencana_id, created_at);


--
-- Name: idx_whatsapp_message; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_whatsapp_message ON public.whatsapp_messages USING btree (message_id);


--
-- Name: idx_wilayah_status_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_wilayah_status_time ON public.laporan_bencana USING btree (wilayah_id, status_id, created_at);


--
-- Name: idx_workflow_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_workflow_status ON public.workflow_logs USING btree (status);


--
-- Name: jobs_queue_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);


--
-- Name: passkeys_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX passkeys_user_id_index ON public.passkeys USING btree (user_id);


--
-- Name: sessions_last_activity_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);


--
-- Name: sessions_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);


--
-- Name: audit_logs audit_logs_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: cv_analysis cv_analysis_laporan_media_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cv_analysis
    ADD CONSTRAINT cv_analysis_laporan_media_id_foreign FOREIGN KEY (laporan_media_id) REFERENCES public.laporan_media(id) ON DELETE CASCADE;


--
-- Name: early_warning early_warning_jenis_bencana_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.early_warning
    ADD CONSTRAINT early_warning_jenis_bencana_id_foreign FOREIGN KEY (jenis_bencana_id) REFERENCES public.jenis_bencana(id) ON DELETE SET NULL;


--
-- Name: early_warning early_warning_laporan_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.early_warning
    ADD CONSTRAINT early_warning_laporan_id_foreign FOREIGN KEY (laporan_id) REFERENCES public.laporan_bencana(id) ON DELETE CASCADE;


--
-- Name: incident_clusters incident_clusters_jenis_bencana_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incident_clusters
    ADD CONSTRAINT incident_clusters_jenis_bencana_id_foreign FOREIGN KEY (jenis_bencana_id) REFERENCES public.jenis_bencana(id) ON DELETE CASCADE;


--
-- Name: laporan_bencana laporan_bencana_duplicate_reference_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.laporan_bencana
    ADD CONSTRAINT laporan_bencana_duplicate_reference_foreign FOREIGN KEY (duplicate_reference) REFERENCES public.laporan_bencana(id) ON DELETE SET NULL;


--
-- Name: laporan_bencana laporan_bencana_jenis_bencana_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.laporan_bencana
    ADD CONSTRAINT laporan_bencana_jenis_bencana_id_foreign FOREIGN KEY (jenis_bencana_id) REFERENCES public.jenis_bencana(id) ON DELETE SET NULL;


--
-- Name: laporan_bencana laporan_bencana_status_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.laporan_bencana
    ADD CONSTRAINT laporan_bencana_status_id_foreign FOREIGN KEY (status_id) REFERENCES public.status_laporan(id);


--
-- Name: laporan_bencana laporan_bencana_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.laporan_bencana
    ADD CONSTRAINT laporan_bencana_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: laporan_bencana laporan_bencana_whatsapp_message_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.laporan_bencana
    ADD CONSTRAINT laporan_bencana_whatsapp_message_id_foreign FOREIGN KEY (whatsapp_message_id) REFERENCES public.whatsapp_messages(id) ON DELETE SET NULL;


--
-- Name: laporan_bencana laporan_bencana_wilayah_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.laporan_bencana
    ADD CONSTRAINT laporan_bencana_wilayah_id_foreign FOREIGN KEY (wilayah_id) REFERENCES public.wilayah(id) ON DELETE SET NULL;


--
-- Name: laporan_media laporan_media_laporan_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.laporan_media
    ADD CONSTRAINT laporan_media_laporan_id_foreign FOREIGN KEY (laporan_id) REFERENCES public.laporan_bencana(id) ON DELETE CASCADE;


--
-- Name: media_files media_files_whatsapp_message_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_files
    ADD CONSTRAINT media_files_whatsapp_message_id_foreign FOREIGN KEY (whatsapp_message_id) REFERENCES public.whatsapp_messages(id) ON DELETE CASCADE;


--
-- Name: ml_predictions ml_predictions_laporan_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ml_predictions
    ADD CONSTRAINT ml_predictions_laporan_id_foreign FOREIGN KEY (laporan_id) REFERENCES public.laporan_bencana(id) ON DELETE CASCADE;


--
-- Name: nlp_analysis nlp_analysis_laporan_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nlp_analysis
    ADD CONSTRAINT nlp_analysis_laporan_id_foreign FOREIGN KEY (laporan_id) REFERENCES public.laporan_bencana(id) ON DELETE CASCADE;


--
-- Name: passkeys passkeys_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.passkeys
    ADD CONSTRAINT passkeys_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: validasi_laporan validasi_laporan_admin_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.validasi_laporan
    ADD CONSTRAINT validasi_laporan_admin_id_foreign FOREIGN KEY (admin_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: validasi_laporan validasi_laporan_laporan_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.validasi_laporan
    ADD CONSTRAINT validasi_laporan_laporan_id_foreign FOREIGN KEY (laporan_id) REFERENCES public.laporan_bencana(id) ON DELETE CASCADE;


--
-- Name: workflow_logs workflow_logs_laporan_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workflow_logs
    ADD CONSTRAINT workflow_logs_laporan_id_foreign FOREIGN KEY (laporan_id) REFERENCES public.laporan_bencana(id) ON DELETE CASCADE;


--
-- Name: workflow_logs workflow_logs_whatsapp_message_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workflow_logs
    ADD CONSTRAINT workflow_logs_whatsapp_message_id_foreign FOREIGN KEY (whatsapp_message_id) REFERENCES public.whatsapp_messages(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict PDf5E3QMImTArKGB4cRGsoOE3nMMsvjvdA9hiCDA0NbNrnG9ZQrcNDTizq8SxoP

--
-- PostgreSQL database dump
--

\restrict UzdYyoCe1O6mBSe0sghppBSWPskQ8aIYddgcuBjSx5fN1nAujc98j5fHCI1Guxt

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	0001_01_01_000000_create_users_table	1
2	0001_01_01_000001_create_cache_table	1
3	0001_01_01_000002_create_jobs_table	1
4	2024_01_01_000000_create_passkeys_table	1
5	2025_08_14_170933_add_two_factor_columns_to_users_table	1
6	2026_07_11_000001_create_jenis_bencana_table	1
7	2026_07_11_000002_create_status_laporan_table	1
8	2026_07_11_000003_create_wilayah_table	1
9	2026_07_11_000004_create_whatsapp_messages_table	1
10	2026_07_11_000005_create_laporan_bencana_table	1
11	2026_07_11_000006_create_laporan_media_table	1
12	2026_07_11_000007_create_media_files_table	1
13	2026_07_11_000008_create_validasi_laporan_table	1
14	2026_07_11_000009_create_early_warning_table	1
15	2026_07_11_000010_create_ml_predictions_table	1
16	2026_07_11_000011_create_nlp_analysis_table	1
17	2026_07_11_000012_create_cv_analysis_table	1
18	2026_07_11_000013_create_incident_clusters_table	1
19	2026_07_11_000014_create_analytics_daily_table	1
20	2026_07_11_000015_create_audit_logs_table	1
21	2026_07_11_000016_create_workflow_logs_table	1
22	2026_07_12_000001_add_performance_indexes	1
23	2026_07_12_044902_add_kecamatan_desa_to_laporan_bencana_table	1
24	2026_07_13_030741_create_beritas_table	2
25	2026_07_13_030742_add_supported_regencies_and_laporan_columns	2
26	2026_07_13_040421_add_is_admin_to_users_table	3
27	2026_07_13_055741_create_kesiapsiagaans_table	4
28	2026_07_13_055742_create_faqs_table	4
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.migrations_id_seq', 28, true);


--
-- PostgreSQL database dump complete
--

\unrestrict UzdYyoCe1O6mBSe0sghppBSWPskQ8aIYddgcuBjSx5fN1nAujc98j5fHCI1Guxt

