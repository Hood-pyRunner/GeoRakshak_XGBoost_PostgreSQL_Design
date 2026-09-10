# Research, Problem Definition, and Design Principles

## Executive conclusion

The major problem is not simply that landslides are difficult to predict. The operational problem is that **risk evidence is fragmented, warning latency is high, data quality is uneven, and many exposed residents cannot use a smartphone dashboard or interpret a technical risk score**. GeoRakshak should therefore be built as a people-centered warning chain rather than as an AI screen.

The system must connect four functions: risk knowledge, monitoring and forecasting, warning communication, and preparedness and response. This structure follows the four-part early-warning definition used by the United Nations Office for Disaster Risk Reduction (UNDRR) [5].

## Problem decomposition

| Problem | Why it matters | GeoRakshak solution |
|---|---|---|
| No single reliable prediction signal | Rainfall can trigger different slopes at different thresholds; a susceptibility map has no timing. | Fuse susceptibility, rainfall, antecedent wetness, forecasts, movement sensors, and verified reports. |
| Sparse and noisy historical labels | Many events have uncertain time, location, type, or severity. | Create a versioned inventory with provenance, confidence, and separate positive, negative, and unknown periods. |
| False alarms reduce trust | Repeated inaccurate warnings can cause people to ignore future alerts. | Calibrate locally, display confidence and evidence, use staged advisory/watch/warning states, and evaluate false-alarm rate. |
| Rural last-mile exclusion | Residents may lack smartphones, data, literacy, electricity, or stable network access. | Use local-language SMS, voice calls/IVR, sirens, village volunteers, public address, offline apps, and printed route boards. |
| Fragmented authority | Public warnings require accountable human decisions. | Use role-based verification, escalation, approval, audit trails, and integration with district authorities. |
| Power and connectivity failures | The most dangerous conditions can coincide with outages. | Buffer sensor data at the edge, use solar/backup batteries, LoRa/2G/4G where available, and local siren fallback. |
| Unclear action | “High risk” is not an instruction. | Every alert states location, urgency, action, safe route or shelter, source, timestamp, and next update. |
| Model overclaiming | Exact time, place, and runout are not reliably predicted from a generic model. | Label outputs as risk estimates and alerts, not certainty; require field validation for high-consequence actions. |

## What the system should detect

GeoRakshak should distinguish three related but different outputs:

1. **Susceptibility:** a relatively stable spatial estimate of how prone a slope is to failure.
2. **Trigger risk:** a near-real-time estimate that current or forecast conditions are moving a susceptible slope toward failure.
3. **Observed movement:** evidence that deformation or a physical event is already occurring.

The warning service should promote risk only when evidence is strong enough for the relevant action. A high susceptibility score alone should not trigger evacuation. A high-risk alert should normally require a combination of spatial susceptibility and trigger evidence, or a credible observed movement signal.

## Research findings that constrain the design

The North Eastern Regional Node for Disaster Risk Reduction identifies landslide inventories as integral to hazard zonation and early-warning work. It also describes susceptibility mapping using geological, geomorphological, land-use, drainage, soil, and topographic parameters, and notes experimental rainfall-triggered early warning in collaboration with NRSC/ISRO [1].

The IMD API catalogue provides official interfaces for current weather, district nowcasts, AWS/ARG observations, district warnings, district rainfall, forecasts, and other weather products [2]. GeoRakshak should treat these as upstream data sources and retain source timestamps rather than silently mixing forecast and observation values.

USGS describes a warning approach that compares precipitation estimates with established intensity-duration thresholds and disseminates outlooks, watches, and warnings to emergency-management personnel [3]. The lesson for GeoRakshak is that threshold logic is useful, transparent, and operationally understandable, but it must be localized.

A systematic review of rainfall thresholds reports major limitations involving geology, geotechnical conditions, time scales, rain-gauge density, event timing, data reliability, and validation. It warns that inaccurate systems can cause exposed populations to lose trust [4]. GeoRakshak must therefore report data quality and model uncertainty instead of presenting a single unexplained percentage.

## Scope boundaries

The first release should support rainfall-triggered landslide risk for selected communities or corridors. It should not claim complete coverage of rockfalls, earthquake-triggered failures, glacial-lake outburst floods, mining subsidence, or every type of debris flow unless separate models and response procedures are validated.

The system should use government data and local observations responsibly. It should not scrape or redistribute restricted datasets without permission. It should not expose personal phone numbers, household locations, or vulnerable-person records in public map layers.

## Design principles

- **Safety over novelty:** a transparent baseline that authorities understand is preferable to an unvalidated deep-learning model.
- **Human-in-the-loop:** AI prioritizes and explains; authorized people confirm public warnings.
- **Graceful degradation:** the system must continue to provide local warnings when cloud services, internet, or power fail.
- **Local calibration:** thresholds and model performance must be evaluated by slope, geology, season, and sensor coverage.
- **Actionable communication:** warnings describe what to do, not only what the model thinks.
- **Auditability:** every input, score, decision, message, acknowledgement, and correction is time-stamped.
- **Privacy by design:** collect the minimum data needed for safety and protect it by default.
