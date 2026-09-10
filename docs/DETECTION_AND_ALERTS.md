# Detection, Risk States, and Alerts

## End-to-end detection flow

```text
Weather / forecast / satellite / sensors / community reports
                         |
                    Ingestion
                         |
              Quality checks and time alignment
                         |
        Susceptibility + trigger + movement fusion
                         |
           Risk score, evidence, confidence, expiry
                         |
      Human verification for high-consequence actions
                         |
     Local-language alert orchestration and audit log
                         |
      Delivery acknowledgement, response, evaluation
```

## How it detects landslide risk

The system does not wait for a single sensor to “see” a landslide. It estimates escalating risk from a sequence of conditions:

1. The zone is mapped as susceptible because of terrain, geology, soil, drainage, land cover, or prior events.
2. Rainfall or forecast rainfall crosses a locally calibrated trigger threshold, or antecedent wetness makes the slope unusually sensitive.
3. Optional field sensors show saturation, pore-pressure increase, tilt, displacement, vibration, or another movement anomaly.
4. A field worker or resident report supplies corroborating evidence such as cracks, falling material, blocked drainage, or a fresh scar.
5. The engine checks sensor health, coverage, recency, and agreement before assigning the warning state.

A rainfall trigger should raise an advisory or watch in a susceptible zone. A warning or evacuation recommendation should normally require stronger evidence, such as accelerating movement, a verified field report, or a very high-confidence trigger in an exposed corridor. The exact thresholds must be calibrated during a pilot.

## Warning states

| State | Meaning | Public message | Human action |
|---|---|---|---|
| Normal | No current evidence above the operating threshold. | “No active warning. Keep drainage clear and report cracks.” | Monitor data quality. |
| Advisory | Conditions are becoming unfavorable. | “Heavy rain may increase landslide risk. Avoid unstable cut slopes and stay informed.” | Increase observation frequency. |
| Watch | Trigger conditions and susceptibility are elevated. | “Landslide watch for [place] until [time]. Keep away from marked slopes and prepare to move.” | Verify locally; prepare shelters and routes. |
| Warning | Strong evidence of imminent or ongoing hazard. | “Move away from [specific area] now using [route]. Follow local authority instructions.” | Authorized authority confirms or issues public warning. |
| Emergency | Movement/event reported or immediate danger. | “Do not enter [area]. Emergency response is active. Call [local number].” | Evacuate, close route, dispatch responders. |

Every message must include the area, state, issue time, expiry or next-update time, source or authority, action, and a way to obtain help. Avoid technical terms such as “probability of failure” in the public message.

## Multi-channel delivery for villages

Use a delivery policy that is independent of a smartphone app:

- SMS in the recipient’s preferred language for subscribers and officials.
- IVR or automated voice calls for low-literacy recipients.
- Village siren or public-address speaker connected to a local gateway.
- Panchayat office, school, health worker, self-help group, and trained volunteer relay.
- Push notification and web dashboard for connected users.
- Printed hazard boards and route signs for permanent preparedness.
- Radio or vehicle-mounted loudspeaker for network outages or wider evacuation.

Messages should be short, consistent, and translated by native speakers. Use a recognizable sender and conduct drills so residents know that an alert is genuine. Avoid sending public alerts from a model without an accountable authority and a documented escalation policy.

## Alert deduplication and escalation

The alert service should group repeated signals into one incident. It should suppress duplicate messages while sending a new message when the state changes, the affected polygon changes materially, or the expiry time is extended. Escalation should be based on evidence and time, not on an arbitrary number of notifications.

A warning should have an expiry time. If no one acknowledges it, the system should notify the next role in the escalation tree. Delivery logs must distinguish queued, sent, delivered, failed, and acknowledged. If SMS fails, use the configured fallback channel.

## Sensor fusion and fault handling

A single sensor can fail or be vandalized. The risk engine should require sensor health checks, compare neighboring sensors where possible, and label readings with quality flags. A disagreement between rainfall, soil moisture, and movement should trigger review rather than automatic cancellation. A missing sensor should reduce confidence and create a maintenance task.

## Sources

[1]: https://www.undrr.org/terminology/early-warning-system "UNDRR definition of an early warning system"
[2]: https://www.usgs.gov/programs/landslide-hazards/science/early-warning-system "USGS Early Warning System"
[3]: https://nerdrr.gov.in/landslide.php "North Eastern Regional Node for Disaster Risk Reduction: Landslide hazard, inventory, mapping and experimental early warning"
[4]: https://sachet.ndma.gov.in/ "NDMA SACHET national disaster alert portal"
