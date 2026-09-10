# Rural, Tier-3, and Village Deployment

## Operating assumption

The public user is not the dashboard user. Residents may have a basic phone, shared phone, intermittent electricity, limited data, no map literacy, and limited ability to read the state language. The system must remain useful when the resident never opens a website.

## Community operating model

Each pilot settlement should nominate a small response group approved by the gram panchayat or district authority. The group can include a panchayat representative, school or anganwadi worker, ASHA worker, local volunteer, road or forest worker, and a technical maintenance contact. Their responsibilities are to receive alerts, perform simple verification, assist vulnerable residents, maintain route boards, and report drills and incidents.

The platform should maintain a **zone roster** rather than only individual app accounts. A zone roster can contain village, hamlet, language, alert channels, shelter, route, local authority, volunteer, and accessibility information. Personal information must be restricted by role.

## User experience for low literacy

Use four design layers:

| Layer | Design |
|---|---|
| Message | One action per message, common words, local language, no unexplained score. |
| Voice | IVR with keypad choices and recorded native-speaker prompts; repeat option. |
| Visual | Color plus shape and icon; never rely on color alone. Use a red triangle for danger, amber circle for watch, green square for normal. |
| Human | Siren patterns, public address, volunteer relay, and household support for people with hearing, vision, mobility, or language barriers. |

An alert example should be operational: “**WATCH. East village hillside. Heavy rain. Stay away from the slope and prepare to move to the school shelter. Next update at 8 PM.**” The connected dashboard may show technical evidence separately.

## Connectivity and power architecture

Place sensors at instrumented slopes and connect them to a solar-powered edge gateway with a battery. Buffer readings locally when the network is unavailable. Use LoRa or another low-power local link between sensors and the gateway where practical, then use 2G/4G, Wi-Fi backhaul, or a store-and-forward mobile device to reach the server. A local siren controller should be able to activate a pre-approved emergency pattern even when the cloud connection is down.

The gateway should send compressed measurements and health summaries rather than raw high-frequency data at all times. The server should record the last successful transmission and expose stale-data state to operators.

## Offline-first field workflow

A volunteer application should support local-language labels, cached village maps, queued reports, photo compression, and later synchronization. A report must receive a local reference number immediately. The application should work without GPS by allowing the user to select a village, road segment, or map point manually. GPS should be optional and treated as uncertain.

## Training and trust

Run a pre-monsoon orientation and at least one drill. Demonstrate the siren, show the shelter route, explain the three most important alert phrases, and explain that an advisory is not an evacuation order. Collect feedback after every drill. Never introduce a warning system without explaining who has authority to issue an evacuation instruction.

Trust depends on accuracy and transparency. After an alert, publish a simple outcome summary to local partners: what evidence triggered it, whether it was confirmed, and what was learned. Avoid public blame when an alert is wrong; improve the threshold and explain the uncertainty.

## Inclusion checklist

- Record preferred language and channel.
- Identify households requiring assisted evacuation without publishing exact personal details.
- Provide voice and audio alternatives to text.
- Test alerts with women, elderly residents, people with disabilities, migrant workers, and residents outside smartphone ownership.
- Include local knowledge about springs, cracks, drainage blockage, road cuts, and historical failures.
- Schedule maintenance before monsoon peaks and plan spare batteries, enclosures, and replacement sensors.

## Pilot acceptance tests

A village pilot is not complete when the website works. It is complete when a resident without a smartphone receives an understandable warning, a volunteer can verify a report offline, a siren or voice channel works during a network interruption, authorities can see an audit trail, and the community can reach a safe location during a drill.

## Sources

[1]: https://www.undrr.org/terminology/early-warning-system "UNDRR definition of an early warning system"
[2]: https://www.un.org/en/climatechange/early-warnings-for-all "United Nations Early Warnings for All"
[3]: https://sachet.ndma.gov.in/ "NDMA SACHET national disaster alert portal"
[4]: https://nerdrr.gov.in/landslide.php "North Eastern Regional Node for Disaster Risk Reduction: Landslide hazard, inventory, mapping and experimental early warning"
