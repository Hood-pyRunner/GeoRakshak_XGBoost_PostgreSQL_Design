# Implementation Roadmap and Pilot Plan

## Phase 0 — governance and site selection

Select one district, village cluster, or highway corridor with a responsible authority, known landslide history, reachable communities, and a feasible sensor-maintenance plan. Obtain permission for data use, alert issuance, installation, and drills. Define who can approve a public warning before writing production code.

**Exit criteria:** signed site scope, hazard-zone boundary, stakeholder roster, escalation tree, data inventory, language plan, and safety review.

## Phase 1 — data and baseline

Implement the hazard-zone database, historical inventory schema, IMD ingestion adapter, GIS preprocessing, rainfall feature windows, and transparent risk rules. Add a dashboard showing evidence freshness and uncertainty. Import only datasets whose provenance and usage rights are recorded.

**Exit criteria:** reproducible data pipeline, baseline backtest, data-quality report, and no untraceable hard-coded production scores.

## Phase 2 — field instrumentation and community workflow

Install a small number of rain, soil-moisture, and tilt sensors at carefully selected slopes. Build an edge gateway with local buffering and health telemetry. Add offline community reporting, local-language message templates, operator review, and a drill-only alert mode.

**Exit criteria:** sensor uptime target agreed, reports sync after outage, every signal is audited, and a community drill is completed.

## Phase 3 — supervised ML and alert integration

Train and calibrate an ML model only after enough verified local labels exist. Compare it with the baseline using time and spatial holdouts. Integrate SMS, IVR, siren, public-address, and dashboard channels. Keep human approval for operational warning and evacuation states.

**Exit criteria:** model card, validation report, rollback artifact, delivery tests, accessibility tests, and authority sign-off.

## Phase 4 — controlled expansion

Expand by zone only when the original site meets performance, maintenance, trust, and response targets. Recalibrate thresholds by geology and sensor configuration. Add satellite change detection or image triage only as an additional evidence source.

## Pilot KPIs

| Dimension | KPI |
|---|---|
| Detection | Verified-event recall at the selected horizon; median lead time; sensor anomaly confirmation rate |
| Trust | False-alarm rate; alert acknowledgement; drill comprehension; resident feedback |
| Delivery | SMS/IVR/siren delivery success; alert latency; fallback-channel success |
| Inclusion | Share of households reachable without a smartphone; local-language coverage; accessibility drill success |
| Reliability | Sensor uptime; gateway data completeness; source freshness; backup-restore success |
| Operations | Verification time; percentage of alerts with complete evidence; maintenance response time |
| Safety | No unapproved public alerts; no exposed personal data; documented authority response |

Do not set a universal accuracy target before establishing the event definition, prediction horizon, monitoring coverage, and cost of false negatives. In a safety system, a high accuracy number can be misleading when events are rare.

## Testing plan

Use unit tests for feature calculations, threshold rules, message templates, authorization, and deduplication. Use replay tests that feed historical weather and sensor data into the risk engine. Use failure-injection tests for stale sensors, bad coordinates, clock drift, duplicate events, queue failure, SMS failure, and network outage. Use tabletop exercises with authorities and field drills with residents.

## Definition of done for a release

A release is complete only when the code, database migrations, model artifact, configuration example, runbook, tests, data provenance, security review, and rollback procedure are committed together. A dashboard screenshot is not evidence that an early-warning system works.
