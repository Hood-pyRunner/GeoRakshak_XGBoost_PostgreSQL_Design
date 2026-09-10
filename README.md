# GeoRakshak

## AI-Based Landslide Early Detection and Management System

GeoRakshak is a **hybrid, AI-assisted landslide early-warning platform** designed for hilly regions, rural communities, tier-3 cities, villages, highways, and other locations exposed to rainfall-triggered landslides.

The system combines **PostgreSQL/PostGIS, rainfall and weather data, terrain and geological information, field sensors, community reports, machine learning, human verification, and multi-channel alerts** to help authorities identify increasing landslide risk and communicate clear actions to affected communities.

> **Safety statement:** GeoRakshak provides risk estimates and decision support. It does not guarantee that a landslide will or will not occur. Public warnings and evacuation instructions must be issued or approved through the responsible disaster-management authority and qualified domain experts.

---

## Problem

Landslide risk is difficult to manage because no single data source is sufficient:

- Rainfall thresholds differ between locations and geological conditions.
- Susceptibility maps show where landslides are more likely but not exactly when they will occur.
- Sensor networks may be sparse, damaged, offline, or poorly calibrated.
- Historical landslide records may have uncertain dates, locations, and verification status.
- Residents in villages may not own smartphones or understand technical risk scores.
- Warnings must remain available during power, network, and cloud-service failures.

GeoRakshak addresses this problem through a layered warning architecture rather than relying on one AI prediction.

---

## Core concept

GeoRakshak evaluates risk using five evidence layers:

| Layer | Purpose | Example inputs |
|---|---|---|
| **Susceptibility** | Identifies areas naturally prone to landslides. | Slope, elevation, soil, geology, drainage, land cover, historical events |
| **Trigger conditions** | Detects weather and wetness conditions that increase risk. | Rainfall intensity, cumulative rainfall, forecast rainfall, soil moisture |
| **Ground movement** | Detects abnormal physical movement or pressure. | Tilt, displacement, pore-water pressure, vibration |
| **Exposure** | Estimates consequences if a failure occurs. | Buildings, roads, schools, hospitals, population, shelters |
| **Human verification** | Confirms local evidence before high-consequence actions. | Field reports, photographs, cracks, debris, blocked drains |

The system produces operational states such as:

- **Normal** — no active risk signal above the operating threshold.
- **Advisory** — unfavorable conditions are developing.
- **Watch** — elevated risk; residents should prepare and avoid hazardous areas.
- **Warning** — strong evidence of imminent or ongoing danger; follow official instructions.
- **Emergency** — an event or immediate danger has been reported and response is active.

---

## AI and machine-learning approach

GeoRakshak uses a **hybrid model strategy**:

1. Start with an interpretable baseline using susceptibility scores, rainfall thresholds, and sensor rules.
2. Build a reliable local landslide inventory with verified, time-stamped, and geolocated events.
3. Convert PostgreSQL/PostGIS records into structured feature vectors.
4. Train and validate an XGBoost model for tabular risk estimation.
5. Compare the model against the transparent baseline.
6. Use the model only when it provides demonstrable improvement under spatial and time-based validation.

### Why XGBoost?

XGBoost is appropriate for GeoRakshak because the primary data is structured and tabular. It can learn from mixed physical, weather, sensor, and exposure features without requiring all information to be converted into generic embeddings.

Example features include:

```text
slope_degrees
 elevation_m
rainfall_1h_mm
rainfall_6h_mm
rainfall_24h_mm
rainfall_72h_mm
rainfall_forecast_6h_mm
soil_moisture
tilt_change_1h
pore_pressure_change
distance_to_road_m
historical_event_count
exposed_population
sensor_health_score
```

The model output must be stored together with:

- model version;
- feature version;
- feature timestamp;
- risk score;
- warning state;
- top supporting evidence;
- missing or stale inputs;
- confidence or calibration status;
- expiry time.

### Feature vectors versus embeddings

The core XGBoost model uses a **structured feature vector**, not a text or image embedding. Optional PostgreSQL `pgvector` support may later be added for:

- similar historical reports;
- photograph and satellite-image similarity;
- multilingual field notes;
- image-based evidence triage.

Embeddings should support investigation and triage. They should not replace rainfall, terrain, soil, and movement features in the main risk model.

---

## System architecture

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

### Main components

- **PostgreSQL/PostGIS:** system of record for zones, observations, events, reports, risk assessments, and spatial data.
- **Data ingestion:** adapters for weather, rainfall, forecasts, sensors, satellite products, and community reports.
- **Quality-control layer:** validates coordinates, timestamps, ranges, duplicates, sensor health, and source freshness.
- **Feature builder:** generates versioned zone-time feature snapshots.
- **Risk engine:** runs the baseline rules and the XGBoost model.
- **Verification workflow:** routes elevated signals to analysts, field workers, or authorized officials.
- **Alert service:** delivers SMS, IVR calls, sirens, public-address announcements, push notifications, and dashboard updates.
- **Audit and monitoring:** records model decisions, approvals, delivery status, acknowledgements, and system health.

---

## Rural and low-literacy deployment

GeoRakshak is designed so that residents do not need to use a smartphone application to receive a warning.

Supported communication channels include:

- local-language SMS;
- IVR and automated voice calls;
- village sirens;
- public-address systems;
- panchayat offices;
- schools and health workers;
- trained community volunteers;
- radio and vehicle-mounted loudspeakers;
- web and mobile dashboards for connected users.

The system should support solar-powered sensor gateways, local buffering, low-power communication, offline reporting, cached maps, and fallback alert channels. Warnings should use short, action-oriented language rather than technical scores.

Example public message:

> **WATCH: East Village hillside. Heavy rainfall may increase landslide risk. Stay away from the slope and prepare to move to the school shelter. Next update at 8 PM.**

---

## Suggested technology stack

| Layer | Recommended technology |
|---|---|
| Frontend | HTML/CSS/JavaScript prototype; React or similar framework for production |
| Backend API | Spring Boot or Node.js |
| Main database | PostgreSQL with PostGIS |
| Time-series data | PostgreSQL time-series tables or TimescaleDB |
| Machine learning | Python, pandas, scikit-learn, XGBoost |
| Optional vector search | PostgreSQL `pgvector` |
| Object storage | Evidence photos, videos, and reports |
| Queue and jobs | Celery, a message queue, or scheduled workers |
| Alerts | SMS, IVR, push, siren, public-address, and email integrations |
| Deployment | Docker-based staging and production environments |
| Monitoring | Logs, metrics, data-freshness checks, model-drift checks |

The first pilot can use a modular monolith. Services should be split only when scale, reliability, or team ownership requires it.

---

## Current prototype status

The current frontend prototype demonstrates:

- Northeast India regional map;
- susceptibility and rainfall views;
- regional advisory cards;
- alert registration interface;
- evidence upload interface;
- basic responsive design.

The prototype currently uses demonstration data. The following production capabilities still need to be implemented:

- PostgreSQL/PostGIS backend;
- real weather and rainfall ingestion;
- sensor ingestion and health monitoring;
- feature-engineering pipeline;
- XGBoost training and inference;
- user authentication and roles;
- human verification workflow;
- alert-provider integrations;
- audit logs and delivery tracking;
- deployment, monitoring, and backup procedures.

---

## Implementation roadmap

### Phase 1 — Data and baseline

Implement hazard zones, historical event storage, weather ingestion, rainfall windows, transparent thresholds, and operator evidence display.

### Phase 2 — Field monitoring

Install a limited number of rain, soil-moisture, and tilt sensors. Add gateway buffering, sensor health, offline community reports, local-language messages, and drill-only alerts.

### Phase 3 — XGBoost model

Train and calibrate XGBoost after sufficient verified local labels exist. Compare it with the baseline using time-based and spatial validation. Keep human approval for operational warnings.

### Phase 4 — Multi-channel warning

Integrate SMS, IVR, sirens, public-address systems, volunteers, panchayats, and district dashboards. Test fallback behavior during power and network failures.

### Phase 5 — Optional intelligent evidence tools

Add `pgvector`, image similarity, satellite-image comparison, and computer-vision triage only as assistive tools with human review.

---

## Validation requirements

Do not rely on accuracy alone. Landslides are rare events, so a system can appear accurate while missing nearly every real event.

Required evaluation metrics include:

- precision;
- recall;
- false-alarm rate;
- missed-event rate;
- lead time;
- calibration error;
- warning fatigue per community;
- alert delivery success;
- sensor uptime;
- percentage of alerts with complete evidence.

Validation must include time-based splits, monsoon-season holdouts, leave-one-slope-out validation, and leave-one-region-out validation where feasible.

---

## Safety, security, and privacy

GeoRakshak must:

- require authorized human approval for high-consequence warnings;
- record every model version and alert decision;
- protect operator accounts with role-based access;
- encrypt communications and backups;
- validate and rate-limit public APIs;
- sign or authenticate sensor payloads;
- separate public maps from private contact and household data;
- display approximate report locations publicly;
- maintain rollback and incident-review procedures;
- avoid exposing personal phone numbers or vulnerable-person records.

A stale sensor must reduce confidence. It must never silently become a safe reading.

---

## Repository structure

```text
GeoRakshak/
├── README.md
├── docs/
│   ├── AI_AND_DATA.md
│   ├── ARCHITECTURE.md
│   ├── DATA_AND_LABELING.md
│   ├── DETECTION_AND_ALERTS.md
│   ├── IMPLEMENTATION_ROADMAP.md
│   ├── OPERATIONS_RUNBOOK.md
│   ├── RESEARCH_AND_PROBLEM.md
│   └── RURAL_DEPLOYMENT.md
├── frontend/
├── services/
│   ├── ingestion/
│   ├── risk-engine/
│   ├── alert-service/
│   └── admin-api/
├── ml/
│   ├── notebooks/
│   ├── pipelines/
│   ├── training/
│   └── evaluation/
├── infra/
└── tests/
```

---

## Getting started

The current uploaded prototype is a static frontend. Open `index.html` in a browser or serve the directory with a local static server:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

For production development, begin by implementing the PostgreSQL/PostGIS schema and ingestion layer described in the formal design document before connecting live alerts.

---

## Documentation

- [Formal XGBoost and PostgreSQL technical design](GeoRakshak_XGBoost_PostgreSQL_Design.md)
- [Research and problem definition](docs/RESEARCH_AND_PROBLEM.md)
- [AI and data design](docs/AI_AND_DATA.md)
- [Detection and alerting](docs/DETECTION_AND_ALERTS.md)
- [Rural deployment](docs/RURAL_DEPLOYMENT.md)
- [Production architecture](docs/ARCHITECTURE.md)
- [Implementation roadmap](docs/IMPLEMENTATION_ROADMAP.md)
- [Data and labeling governance](docs/DATA_AND_LABELING.md)
- [Operations runbook](docs/OPERATIONS_RUNBOOK.md)
- [Prototype status](docs/PROTOTYPE_STATUS.md)
- [Contribution and safety guidelines](CONTRIBUTING.md)

---

## Research references

[1]: https://api.imd.gov.in/public/api_reference.html "India Meteorological Department API Reference"

[2]: https://nerdrr.gov.in/landslide.php "North Eastern Regional Node for Disaster Risk Reduction: Landslide hazard, inventory, mapping and experimental early warning"

[3]: https://www.usgs.gov/programs/landslide-hazards/science/early-warning-system "USGS Early Warning System"

[4]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10755328/ "A systematic review on rainfall thresholds for landslides occurrence"

[5]: https://xgboost.readthedocs.io/en/stable/ "XGBoost Documentation"

[6]: https://postgis.net/documentation/ "PostGIS Documentation"

[7]: https://github.com/pgvector/pgvector "pgvector: Open-source vector similarity search for PostgreSQL"

[8]: https://www.undrr.org/terminology/early-warning-system "UNDRR definition of an early warning system"

---

## License

Add an open-source license after confirming ownership and redistribution permissions for the source code, generated data, map layers, sensor firmware, and third-party services used by the project.

## Disclaimer

GeoRakshak is an academic and engineering project intended to support research, prototyping, and controlled pilot deployments. It must not be treated as a substitute for official government warnings, professional geotechnical assessment, or emergency-management instructions.
