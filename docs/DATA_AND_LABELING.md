# Data Inventory, Labeling, and Governance

## Data-source register

Create a machine-readable register for every source with owner, access method, license or permission, spatial resolution, temporal resolution, update schedule, expected latency, quality limits, and fallback. The initial register should include IMD weather and rainfall products, GSI and government landslide inventories, ISRO/Bhuvan products, digital elevation models, local sensor data, and verified field reports. The IMD API reference lists current weather, nowcast, AWS/ARG, district warnings, rainfall, and forecast interfaces [1]. NESAC describes inventory, susceptibility mapping, remote sensing, and experimental early warning work relevant to the Northeast [2].

## Event schema

Every event record should include:

```text
id
geometry or approximate_geometry
event_time_start
event_time_end
reported_at
movement_type
trigger_class
source
source_url_or_reference
spatial_uncertainty_m
temporal_uncertainty_h
verification_status
verification_actor
confidence
media_refs
impact_summary
created_at
updated_at
```

A record should never imply greater precision than the source supports. For example, a social-media report may have an approximate time and location until a field worker verifies it.

## Labeling workflow

1. Ingest the original report without changing it.
2. Normalize coordinates and timestamps while preserving the original values.
3. Deduplicate likely copies and link related reports.
4. Assign preliminary type and confidence.
5. Request field or imagery verification where consequences are material.
6. Mark verified, rejected, unresolved, or superseded.
7. Create training labels only from records meeting the label-quality policy.
8. Version the dataset and record the query or extraction used to build it.

## Avoiding leakage and bias

Do not randomly split adjacent observations from the same event across training and test sets. Keep all records from an event, slope, and time window in the same fold where practical. Evaluate under-reported villages separately because reporting density can look like hazard density. Treat missing data as a property of the observation process, not as evidence of safety.

## Data retention and access

Keep raw source data immutable where permissions allow. Store derived features separately so the transformation can be reproduced. Restrict personal data, exact household coordinates, and original media. Publish aggregated or anonymized data for research only after review. Define retention periods for contact lists, delivery receipts, and evidence media.

## References

[1]: https://api.imd.gov.in/public/api_reference.html "India Meteorological Department API Reference"
[2]: https://nerdrr.gov.in/landslide.php "North Eastern Regional Node for Disaster Risk Reduction: Landslide hazard, inventory, mapping and experimental early warning"
[3]: https://bhusanket.gsi.gov.in/ "Geological Survey of India Bhusanket landslide portal"
