# Operations Runbook

## Daily monitoring

The duty operator checks source freshness, sensor health, gateway connectivity, queued reports, unresolved incidents, and current risk states. A dashboard must show “unknown” when a critical source is stale; it must not show normal risk by default.

## When the system raises an advisory

The analyst reviews the zone, evidence timestamps, forecast horizon, sensor quality, and nearby reports. The analyst checks whether the signal is within the authority’s operating procedure and records the review. An advisory can be sent automatically only when the authority has approved that policy.

## When the system raises a watch

The operator contacts the designated field or village responder. The responder checks local rain, drainage, cracks, falling debris, unusual sounds, and access routes without entering an unsafe slope. The operator records the result and escalates to the district authority if evidence supports a warning.

## When a warning is needed

Only an authorized role approves the operational warning. The message identifies the specific zone, action, shelter or route, issue time, expiry or next update, and authority. The operator confirms that at least two delivery channels are available or activates the local fallback. Delivery and acknowledgement status are monitored.

## After an incident or false alarm

Freeze the relevant raw inputs and model version. Record the event timeline, signal arrival times, decisions, messages, delivery outcomes, field observations, and damages or near misses. Mark whether the alert was timely and actionable. Do not edit past audit records; append corrections. Feed verified outcomes into the next data-quality and calibration review.

## Maintenance

Inspect sensor enclosures, solar panels, batteries, mounting, cable strain, and calibration according to the site schedule and before monsoon periods. Keep spare parts and a manual reporting path. A failed instrument should create a maintenance task and lower confidence; it should not silently disappear from the dashboard.

## Drill procedure

Use a clearly marked drill message that cannot be mistaken for a real warning. Test one connected channel and one disconnected fallback. Measure time from risk decision to delivery, comprehension of the message, route familiarity, shelter access, and assistance for vulnerable residents. Hold a debrief with residents and authorities and track corrective actions.
