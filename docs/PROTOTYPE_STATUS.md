# Prototype Status

The current uploaded prototype is a static dashboard for Northeast India. It demonstrates a Leaflet map, susceptibility and rainfall views, regional advisory cards, alert registration, and evidence upload UI.

The following parts are demonstration-only and must be replaced before a field pilot:

- region data and advisory records are hard-coded in `script.js`;
- map boundaries and basemap are fetched directly from third-party URLs;
- alert registration does not call a backend or send a message;
- evidence upload remains in a local browser queue;
- no user authentication, role-based authorization, database, audit trail, model, sensor ingestion, or alert approval workflow exists;
- displayed “risk” and “rainfall signal” values are not operational measurements.

This status is intentionally explicit so a GitHub visitor does not mistake the interface prototype for a validated warning system.
