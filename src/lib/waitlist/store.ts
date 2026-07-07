import { randomUUID } from "crypto";
import { Pool } from "pg";

const INIT_SQL = `
CREATE TABLE IF NOT EXISTS waitlist_submissions (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  consent BOOLEAN NOT NULL DEFAULT FALSE,
  source TEXT NOT NULL DEFAULT 'access',
  user_agent TEXT,
  referer TEXT
);

CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist_submissions (email);
`;

export type WaitlistSubmissionInput = {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  consent?: boolean;
  source?: string;
  userAgent?: string;
  referer?: string;
};

export type WaitlistSubmission = Required<
  Pick<WaitlistSubmissionInput, "name" | "email" | "consent" | "source">
> & {
  id: string;
  createdAt: string;
  phone: string;
  message: string;
  userAgent: string;
  referer: string;
};

type WaitlistStore = {
  addSubmission(input: WaitlistSubmissionInput): Promise<WaitlistSubmission>;
  getSubmissions(limit: number): Promise<WaitlistSubmission[]>;
};

const toSubmission = (row: Record<string, unknown>): WaitlistSubmission => {
  const createdAt = row.created_at instanceof Date
    ? row.created_at.toISOString()
    : String(row.created_at);

  return {
    id: row.id as string,
    createdAt,
    name: row.name as string,
    email: row.email as string,
    phone: (row.phone as string | null) ?? "",
    message: (row.message as string | null) ?? "",
    consent: Boolean(row.consent),
    source: (row.source as string | null) ?? "access",
    userAgent: (row.user_agent as string | null) ?? "",
    referer: (row.referer as string | null) ?? "",
  };
};

class PostgresWaitlistStore implements WaitlistStore {
  private initialized = false;
  private pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30_000,
    });
  }

  private async ensureTables() {
    if (this.initialized) return;
    await this.pool.query(INIT_SQL);
    this.initialized = true;
  }

  async addSubmission(input: WaitlistSubmissionInput) {
    await this.ensureTables();

    const res = await this.pool.query(
      `INSERT INTO waitlist_submissions
        (id, name, email, phone, message, consent, source, user_agent, referer)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        randomUUID(),
        input.name,
        input.email,
        input.phone ?? null,
        input.message ?? null,
        input.consent ?? false,
        input.source ?? "access",
        input.userAgent ?? null,
        input.referer ?? null,
      ],
    );

    return toSubmission(res.rows[0]);
  }

  async getSubmissions(limit: number) {
    await this.ensureTables();

    const res = await this.pool.query(
      `SELECT * FROM waitlist_submissions ORDER BY created_at DESC LIMIT $1`,
      [limit],
    );

    return res.rows.map(toSubmission);
  }
}

class InMemoryWaitlistStore implements WaitlistStore {
  private submissions: WaitlistSubmission[] = [];

  async addSubmission(input: WaitlistSubmissionInput) {
    const submission: WaitlistSubmission = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      name: input.name,
      email: input.email,
      phone: input.phone ?? "",
      message: input.message ?? "",
      consent: input.consent ?? false,
      source: input.source ?? "access",
      userAgent: input.userAgent ?? "",
      referer: input.referer ?? "",
    };

    this.submissions.unshift(submission);
    return submission;
  }

  async getSubmissions(limit: number) {
    return this.submissions.slice(0, limit);
  }
}

const createWaitlistStore = (): WaitlistStore => {
  if (process.env.DATABASE_URL) {
    return new PostgresWaitlistStore(process.env.DATABASE_URL);
  }

  return new InMemoryWaitlistStore();
};

export const waitlistStore = createWaitlistStore();
