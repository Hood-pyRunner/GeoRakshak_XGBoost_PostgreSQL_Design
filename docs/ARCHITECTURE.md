# Production Architecture

## Logical architecture

```text
                 +-------------------------------+
                 | IMD / GSI / ISRO / DEM / GIS  |
                 +---------------+---------------+
                                 |
+-------------+       +---------v---------+       +----------------+
| Field       |------>| Ingestion adapters |<------| Community      |
| sensors     |       +---------+---------+       | reports/media  |
+------+------+                 |                 +-------+--------+
       |                         v                         |
       |               +---------+---------+               |
       +-------------->| Quality/time store |<--------------+
                       +---------+---------+
                                 |
                       +---------v---------+
                       | Risk engine       |
                       | rules + ML + GIS  |
                       +----+---------+----+
                            |         |
                +-----------v-+   +---v-----------+
                | Analyst/admin|   | Alert service  |
                | dashboard    |   | SMS/IVR/siren  |
                +--------------+   +---+------------+
                                       |
                              +--------v---------+
                              | Residents and    |
                              | local responders |
                              +------------------+
```

## Recommended components

The uploaded static frontend can evolve into a web client. A practical production stack is a Spring Boot or Node.js API, PostgreSQL with PostGIS for zones and geometry, object storage for evidence, a time-series table or extension for sensor data, a queue for ingestion and alert jobs, and a Python model service for training/inference. The exact stack can remain flexible; the interfaces and audit semantics are more important than a particular framework.

Use separate services or modules for ingestion, quality control, risk calculation, alert orchestration, administration, and analytics. Start as a modular monolith for the pilot if the team is small. Split services only when load, deployment ownership, or reliability requirements justify it.

## Core entities

| Entity | Important fields |
|---|---|
| `hazard_zone` | id, geometry, susceptibility_score, source, version, valid_from, valid_to |
| `sensor` | id, type, location, zone_id, calibration, owner, status, last_seen |
| `observation` | sensor_id, observed_at, value, unit, quality_flag, received_at |
| `weather_observation` | source, station, geometry, observed_at, rainfall, forecast_window, raw_reference |
| `landslide_event` | id, geometry, event_time_start/end, type, source, confidence, verification |
| `community_report` | id, approximate_geometry, created_at, category, media_ref, reporter_role, status |
| `risk_assessment` | zone_id, computed_at, state, score, evidence_json, model_version, expiry |
| `alert` | id, state, zone_id, message_by_language, issued_at, expires_at, authority_id |
| `delivery` | alert_id, channel, recipient_group, status, provider_reference, delivered_at, acknowledged_at |
| `audit_log` | actor, action, entity, before/after hash, timestamp, reason |

## API outline

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/zones/{id}/risk` | Current risk, evidence, confidence, expiry |
| `GET` | `/api/v1/zones/{id}/history` | Risk and observations over time |
| `POST` | `/api/v1/reports` | Submit a resident or field-worker report |
| `POST` | `/api/v1/observations/batch` | Ingest signed sensor observations |
| `POST` | `/api/v1/assessments/{id}/verify` | Human verification and reason |
| `POST` | `/api/v1/alerts/prepare` | Generate a draft alert for approval |
| `POST` | `/api/v1/alerts/{id}/approve` | Issue an authorized alert |
| `GET` | `/api/v1/alerts/{id}/deliveries` | Delivery and acknowledgement status |
| `GET` | `/api/v1/health/data-freshness` | Data source and sensor health |

All endpoints should validate authorization, input schema, rate limits, and audit requirements. Never accept a client-provided risk score as authoritative.

## Roles

- **Resident:** receives alerts and submits reports.
- **Volunteer/field worker:** verifies local observations and supports evacuation.
- **Analyst:** reviews risk evidence, model health, and reports.
- **District operator:** approves operational alerts within delegated scope.
- **System administrator:** manages users, integrations, zones, and audit access.
- **Model steward:** approves model versions, calibration, and rollback.

## Security and privacy

Use strong authentication for operators, least-privilege role-based access, short-lived tokens, encrypted transport, encrypted backups, secret management, dependency scanning, signed sensor payloads, and immutable or append-only alert logs. Apply rate limits to report and alert endpoints. Separate public map data from restricted household and recipient data.

Store approximate report locations for public display. Keep exact coordinates, contact information, media originals, and vulnerable-person data restricted. Define retention periods, deletion workflows, access logging, and consent language before collecting personal data. Follow applicable Indian privacy and disaster-management requirements with legal review.

## Reliability and observability

Track ingestion latency, source freshness, sensor uptime, battery status, queue depth, risk-engine errors, alert delivery success, acknowledgement rate, false-alarm rate, missed-event investigations, and model drift. Page operators for stale critical sources and failed alert providers. Test backup restoration and network-outage behavior.

## Deployment

Use environment-specific configuration, migrations, reproducible containers, automated tests, staging, and a controlled production deployment. Keep the model artifact and feature schema versioned. Provide a rollback command for both software and model versions. Use a synthetic test zone so alert pathways can be tested without sending real public warnings.
