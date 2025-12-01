// backend/scripts/seed_ipos.js
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import pool, { query } from '../db.js';

dotenv.config();

async function tryRead(paths) {
  for (const p of paths) {
    try {
      const raw = await fs.readFile(p, 'utf8');
      return { path: p, raw };
    } catch (e) {
      // ignore
    }
  }
  return null;
}

async function main() {
  try {
    const cwd = process.cwd(); // backend/
    const candidates = [
      path.join(cwd, 'data', 'ipos.json'),                        // backend/data/ipos.json
      path.join(cwd, '..', 'frontend', 'data', 'ipos.json'),      // frontend/data/ipos.json
      path.join(cwd, '..', 'data', 'ipos.json'),                  // repo-root/data/ipos.json
      path.join(cwd, '..', '..', 'frontend', 'data', 'ipos.json')
    ];

    const found = await tryRead(candidates);
    if (!found) {
      console.error('Could not locate ipos.json. Tried:', candidates);
      process.exit(1);
    }
    console.log('Seeding from', found.path);

    let items;
    try {
      items = JSON.parse(found.raw);
    } catch (e) {
      console.error('Invalid JSON in ipos.json', e);
      process.exit(1);
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const raw of items) {
        const id = String(raw.id);
        const name = raw.name || raw.companyName || null;
        const company_name = raw.companyName || raw.name || null;
        const issue_type = raw.issueType || null;
        const open_date = raw.openDate ? new Date(raw.openDate) : null;
        const close_date = raw.closeDate ? new Date(raw.closeDate) : null;
        const listing_date = raw.listingDate ? new Date(raw.listingDate) : null;
        const price_band = raw.priceBand || null;
        const issue_price = raw.issuePrice ?? null;
        const lot_size = raw.lotSize ?? null;
        const issue_size = raw.issueSize ?? null;
        const face_value = raw.faceValue ?? null;
        const subscription_retail = raw.subscriptionRetail ?? null;
        const subscription_qib = raw.subscriptionQib ?? null;
        const subscription_nii = raw.subscriptionNii ?? null;
        const subscription_total = raw.subscriptionTotal ?? null;
        const status = raw.status || null;
        const registrar_name = raw.registrarName || null;
        const lead_managers = raw.leadManagers ? JSON.stringify(raw.leadManagers) : null;
        const description = raw.description || null;
        const listing_gains = raw.listingGains ?? null;
        const raw_json = JSON.stringify(raw);

        const upsertQuery = `
          INSERT INTO ipos (
            id, name, company_name, issue_type, open_date, close_date, listing_date,
            price_band, issue_price, lot_size, issue_size, face_value,
            subscription_retail, subscription_qib, subscription_nii, subscription_total,
            status, registrar_name, lead_managers, description, listing_gains, raw, created_at, updated_at
          )
          VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22, now(), now()
          )
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            company_name = EXCLUDED.company_name,
            issue_type = EXCLUDED.issue_type,
            open_date = EXCLUDED.open_date,
            close_date = EXCLUDED.close_date,
            listing_date = EXCLUDED.listing_date,
            price_band = EXCLUDED.price_band,
            issue_price = EXCLUDED.issue_price,
            lot_size = EXCLUDED.lot_size,
            issue_size = EXCLUDED.issue_size,
            face_value = EXCLUDED.face_value,
            subscription_retail = EXCLUDED.subscription_retail,
            subscription_qib = EXCLUDED.subscription_qib,
            subscription_nii = EXCLUDED.subscription_nii,
            subscription_total = EXCLUDED.subscription_total,
            status = EXCLUDED.status,
            registrar_name = EXCLUDED.registrar_name,
            lead_managers = EXCLUDED.lead_managers,
            description = EXCLUDED.description,
            listing_gains = EXCLUDED.listing_gains,
            raw = EXCLUDED.raw,
            updated_at = now()
        `;
        const params = [
          id, name, company_name, issue_type, open_date, close_date, listing_date,
          price_band, issue_price, lot_size, issue_size, face_value,
          subscription_retail, subscription_qib, subscription_nii, subscription_total,
          status, registrar_name, lead_managers, description, listing_gains, raw_json
        ];
        await client.query(upsertQuery, params);
      }

      await client.query('COMMIT');
      console.log('Seed complete — inserted/updated', items.length, 'items');
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Seed failed', err);
      process.exit(1);
    } finally {
      client.release();
      process.exit(0);
    }
  } catch (err) {
    console.error('Unexpected seed error', err);
    process.exit(1);
  }
}

main();