# Evidence

Screenshots and captures proving the app was actually tested, not just described as tested.
Created at the owner's instruction, 2026-09-13: *"create an evidence folder in the root of this
repository and put all your screenshots there, name them properly, so I know exactly what we are
testing and that's the proof."*

**Screenshots come from the OnePlus 3T only.** Not the iPhone XS — the 3T is the device whose
buttons and layout are already known, and re-deriving the same navigation on iOS buys nothing.
The iPhone is used for audio, where it earns its place: iOS has a 30-second sound cliff and its
own fallback behaviour that Android cannot show.

## Naming

```
<NNN>-<area>-<what-is-being-proved>-<device>.png
```

- `NNN` — a running number so the sequence is readable in file order
- `area` — `standard`, `extras`, `sound-sheet`, `reminder`, `settings`, `midnight`, `dst`
- `what-is-being-proved` — the claim the image supports, in words, not a code identifier
- `device` — `op3t` or `xs`

Examples:

```
012-midnight-magrib-0040-scheduled-for-2350-op3t.png
013-extras-istijaba-friday-2340-previous-evening-op3t.png
031-sound-sheet-athan17-selected-op3t.png
```

A screenshot that needs a sentence of explanation to be understood has the wrong name. If the
claim will not fit in the filename, the claim is too big for one screenshot.

## What belongs here, and what does not

**Belongs:** the rendered list at a driven clock, the sound sheet with a selection made, a
scheduled-notification dump alongside the row it should match, a before/after pair across a DST
boundary.

**Does not:** anything a unit test already proves. A screenshot of green test output is not
evidence of device behaviour, and this folder is only for the claims that need hardware.

Audio evidence is not a screenshot. It is the `dumpsys audio` fingerprint line — sample rate and
channel count — recorded in the session's findings entry, plus the ear check. See the fingerprint
table in `ai/prompts/device-verification-sweep.md`.
