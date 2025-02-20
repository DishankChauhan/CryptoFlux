/*
  # Create merchant tables

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `key` (text, unique)
      - `name` (text)
      - `active` (boolean)
      - `created_at` (timestamp)
      - `last_used` (timestamp)

    - `payment_requests`
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, references users)
      - `amount` (numeric)
      - `currency` (text)
      - `status` (text)
      - `callback_url` (text)
      - `success_url` (text)
      - `cancel_url` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamp)
      - `expires_at` (timestamp)

    - `webhooks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `url` (text)
      - `events` (text[])
      - `active` (boolean)
      - `secret` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    key text UNIQUE NOT NULL,
    name text NOT NULL,
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    last_used timestamptz
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own API keys"
    ON api_keys
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own API keys"
    ON api_keys
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Payment Requests table
CREATE TABLE IF NOT EXISTS payment_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id uuid REFERENCES auth.users NOT NULL,
    amount numeric NOT NULL,
    currency text NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    callback_url text,
    success_url text,
    cancel_url text,
    metadata jsonb,
    created_at timestamptz DEFAULT now(),
    expires_at timestamptz NOT NULL
);

ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment requests"
    ON payment_requests
    FOR SELECT
    TO authenticated
    USING (auth.uid() = merchant_id);

CREATE POLICY "Users can create their own payment requests"
    ON payment_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = merchant_id);

-- Webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    url text NOT NULL,
    events text[] NOT NULL,
    active boolean DEFAULT true,
    secret text NOT NULL,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own webhooks"
    ON webhooks
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own webhooks"
    ON webhooks
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);