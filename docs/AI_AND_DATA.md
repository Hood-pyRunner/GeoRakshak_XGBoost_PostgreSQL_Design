# AI, Data, and Model Design

## Recommended strategy

Build GeoRakshak as a **hybrid risk engine**. Begin with an interpretable rules-and-threshold baseline, then add supervised machine learning when the project has a reliable local inventory. Do not begin with a large neural network. A complex model cannot compensate for missing event timestamps, inaccurate coordinates, or inconsistent sensor calibration.

The final score should be decomposed into evidence components:

```text
risk = f(susceptibility, rainfall_trigger, soil_wetness, movement, exposure, data_quality)
```

The system should store the components and the model version so an analyst can answer: “Why did this zone move to watch or warning?”

## Data layers

| Layer | Minimum fields | Typical role |
|---|---|---|
| Static terrain | latitude, longitude, elevation, slope, aspect, curvature, drainage distance, relief | Susceptibility and spatial aggregation |
| Geology and soil | lithology, faults/lineaments, soil class, depth where available | Conditioning factors |
| Land cover | vegetation, built-up area, road cuts, deforestation or disturbance indicators | Exposure and conditioning |
| Historical inventory | event ID, geometry, date/time range, type, source, confidence, casualties/damage if verified | Labels and validation |
| Weather | station ID, rainfall interval, cumulative rainfall windows, forecast precipitation, source timestamp | Trigger features |
| Sensors | sensor ID, location, value, battery, quality flag, calibration, timestamp | Movement and wetness evidence |
| Reports | report ID, approximate location, media, reporter role, time, verification status | Human evidence and labels |
| Exposure | buildings, roads, schools, health centres, shelters, population estimate | Consequence and prioritization |

## Feature engineering

Use multiple rainfall windows rather than one daily total. Candidate features include rolling rainfall over 1, 3, 6, 12, 24, 48, and 72 hours; intensity maxima; deviation from seasonal baseline; antecedent rainfall index; forecast rainfall; soil moisture anomaly; and time since the last significant event.

Use spatial features from a digital elevation model, including slope angle, aspect, curvature, topographic wetness proxy, drainage proximity, relative relief, road-cut proximity, and settlement exposure. Use geology, soil, land cover, and historical event density as conditioning features. All derived features must record source resolution and transformation method.

Use movement features such as tilt rate, displacement velocity, acceleration, pore-water pressure change, soil-moisture rate of change, vibration anomaly, sensor agreement, and missing-data duration. A rate-of-change feature is often more informative than a raw sensor value.

## Labels and target definitions

Do not train on a vague label such as “landslide happened sometime during monsoon.” Define a prediction horizon and target explicitly. For example:

- `event_in_6h`: a verified event intersects the zone in the next six hours.
- `event_in_24h`: a verified event intersects the zone in the next 24 hours.
- `movement_anomaly`: a verified sensor anomaly exceeds a quality-controlled threshold.
- `no_event_observed`: sufficient observation coverage exists and no event was recorded.

Unknown periods must not be treated as safe negatives. A negative label is valid only when reporting and monitoring coverage were adequate. The dataset should store label confidence, event source, spatial uncertainty, temporal uncertainty, and whether the label was independently verified.

## Model progression

### Phase 1: transparent baseline

Implement a susceptibility raster or zone score, rainfall intensity-duration thresholds calibrated from local events, and sensor rules for missing data and rapid movement. Combine them with a documented weighted score. This baseline is the benchmark against which every ML model must improve.

### Phase 2: tabular machine learning

Train gradient-boosted trees or a calibrated random forest on time-windowed tabular features. These models are appropriate for mixed data, work with moderate sample sizes, and can expose feature importance. Use spatial and temporal holdouts rather than random row splits, because random splits can leak nearby events into both training and test data.

### Phase 3: temporal and spatial models

Only after sufficient local data exists, evaluate temporal models or spatiotemporal approaches. Compare their performance against the baseline and retain the simpler model if gains do not justify operational complexity.

## Evaluation

Evaluate at the decision level, not only at the row level. Required metrics include precision, recall, false-alarm rate, missed-event rate, lead time, calibration error, alert fatigue per community, and percentage of alerts with complete evidence. Report metrics by monsoon season, geology, sensor coverage, district, and warning level.

Use time-based backtesting and leave-one-slope-or-region-out validation. The test set must represent future deployment conditions. Calibrate probabilities using a held-out set. A model that produces 0.9 risk should be correct approximately 90 percent of the time within the same operating population; otherwise label it as a score, not a probability.

## Explainability and uncertainty

Every score should return:

- the risk state and score;
- model version and feature timestamp;
- top positive evidence, such as extreme 24-hour rainfall or accelerating tilt;
- missing or stale evidence;
- confidence or calibration band;
- recommended human verification step;
- data quality status.

Use monotonic or constrained logic where domain knowledge requires it, such as risk not decreasing simply because rainfall increases while all else is equal. Do not hide uncertainty behind a visually precise percentage.

## AI-assisted community reports

Computer vision may assist in triaging uploaded photos for visible cracks, debris, blocked drains, or fresh scarps. It must not autonomously declare a landslide from an image. Image results should be marked “screening only,” linked to the original evidence, and reviewed by a trained operator. Remove faces, vehicle plates, and unnecessary personal details before public display.

## Data quality gates

The ingestion pipeline should reject or quarantine impossible coordinates, impossible rainfall values, duplicate events, clock drift, sensor jumps, and records with missing provenance. It should distinguish sensor failure from a safe reading. A stale sensor should reduce confidence, not silently contribute a zero value.

## Sources

[1]: https://nerdrr.gov.in/landslide.php "North Eastern Regional Node for Disaster Risk Reduction: Landslide hazard, inventory, mapping and experimental early warning"
[2]: https://api.imd.gov.in/public/api_reference.html "India Meteorological Department API Reference"
[3]: https://www.usgs.gov/programs/landslide-hazards/science/early-warning-system "USGS Early Warning System"
[4]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10755328/ "A systematic review on rainfall thresholds for landslides occurrence"
