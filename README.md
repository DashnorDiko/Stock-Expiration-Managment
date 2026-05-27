# Smart Expiry MVP

Mobile-first web application for supermarket staff to register product batches, track expiration dates, and clear shelf-check tasks.

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Prisma ORM with PostgreSQL

## MVP Features

- `Register`: scan/lookup barcode, auto-fill product, and create an incoming expiry batch.
- `Inventory`: category tabs for active batches with archive controls.
- `Alerts`: prioritized soon/critical/expired task list with one-tap clear flow.
- `Soft delete`: batches are archived/cleared (never hard deleted in UI), preserving data for reporting.
- `Waste logging`: optional discarded unit count and note when clearing a batch.

## Data Model

- `Product`: master table keyed by barcode.
- `Batch`: tracked expiry records with lifecycle (`ACTIVE`, `CLEARED`, `ARCHIVED`).
- `WasteLog`: optional discard entries tied to batch clear actions.
- `User`: optional staff identity for created/cleared audit fields.

Schema lives in `prisma/schema.prisma`.

## Project Structure

- `app/(dashboard)/register/page.tsx`
- `app/(dashboard)/inventory/page.tsx`
- `app/(dashboard)/alerts/page.tsx`
- `app/api/products/lookup/route.ts`
- `app/api/batches/route.ts`
- `app/api/batches/[id]/route.ts`
- `app/api/batches/[id]/clear/route.ts`
- `app/api/alerts/route.ts`
- `components/forms/*`
- `components/inventory/*`
- `components/alerts/*`
- `lib/prisma.ts`
- `lib/dates/expiry.ts`
- `lib/validators/batch.ts`
- `lib/services/alerts.ts`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
# .env
DATABASE_URL="postgres://<username>:<password>@<host>:<port>/<database>?sslmode=require"
```

3. Generate Prisma client:

```bash
npx prisma generate
```

4. Apply migrations:

```bash
npx prisma migrate dev
```

5. Seed master products and sample staff:

```bash
npx prisma db seed
```

6. Start app:

```bash
npm run dev
```

## Developer Commands

- `npm run dev` - run local development server.
- `npm run lint` - run ESLint.
- `npm test` - run unit + integration tests.
- `npm run build` - production build validation.
- `npx prisma studio` - inspect records in GUI.

## Pilot Runbook

### Daily floor workflow

1. Staff receives product shipment and opens `Register`.
2. Scan barcode (or type manually), verify product autofill.
3. Enter expiration date and optional location/quantity estimate.
4. During shifts, open `Alerts` and process highest priority tasks.
5. Staff physically checks shelf and taps `Clear Batch`.
6. If waste is discarded, enter optional discarded units and note.
7. Use `Inventory` page to archive non-actionable or relocated batches.

### Data retention policy

- Keep `CLEARED` and `ARCHIVED` rows for at least 2 months.
- Avoid hard deletes in user-facing flows.
- Optional future enhancement: scheduled archival/purge workflow for long-term retention controls.

### QA checklist (mobile/tablet)

- Registration: scan -> lookup -> create batch success.
- Inventory: category tabs switch quickly and list correct records.
- Alerts: yellow for <=21 days, red for <=7 days or expired.
- Clear flow: works with and without discarded units.
- Touch targets: easy to tap with gloves/one hand on tablet.
- Performance: smooth navigation and quick API responses on warehouse Wi-Fi.

## Testing

Automated tests are in `tests/`:

- `tests/unit/expiry.test.ts` - threshold and date logic.
- `tests/unit/validators.test.ts` - request schema validation.
- `tests/integration/alerts-priority.test.ts` - alert prioritization behavior.

