# Session Prompt: alarmClock Backport (#49687) — throwaway branch, daily-use verification, dies at SDK 58

Owner-sequenced: runs on a fresh branch cut from uat; the branch is NEVER merged to uat or
main. Read `ai/AGENTS.md` first, act as Orchestrator.

## Owner's plan (2026-09-09, authoritative)

Patch the merged upstream fix into `node_modules/expo-notifications` via patch-package,
then submit TWO EAS cloud builds at the same version: the real Android APK
(`com.mugtaba.athan`, Release compilation, exactly what would ship to production) and an
iOS IPA purely for version parity (#49687 is Android-only — iOS gets no functional
change). The owner installs the Android APK on all phones DIRECTLY from the EAS build
page (no Mac/adb connection needed — the phones are already clean of every previous
install) and uses it as the one true app in daily life. The codebase is then untouched
until SDK 58 ships, at which point the patch and the branch are deleted and the real
release carries the fix. Nothing on the branch may leak into uat/main; the branch is
frozen at cut time and never rebased.

## Facts

- #49687 merged to expo/expo `main` 2026-09-08 by vonovak, merge commit `257006e`
  (maintainer pre-merge adjustments included — use THIS state, never an older draft).
  Rides the SDK-58 line; no 57.x backport release exists. First action of the session:
  re-check the npm 57.x line — if a 57.x patch already carries it, the whole session
  collapses to deletion day (below).
- Shipped API: `delivery: 'bestEffort' | 'alarmClock'` on `DateTriggerInput` and the
  repeating wall-clock triggers. Android-only, default `'bestEffort'`, degrades to
  best-effort without the exact-alarm permission.
- Files to backport from the diff: `NotificationScheduler.kt`, `NotificationTriggers.kt`,
  `ExpoSchedulingDelegate.kt` (android), `NotificationScheduler.types.ts`,
  `Notifications.types.ts`, `scheduleNotificationAsync.ts`, `parseTrigger-test.ts`.
  Ignore docs/CHANGELOG/bare-expo/native-component-list.
- Precedent: patch-package backports of MERGED code are sanctioned (G.1 fallback plan),
  deleted when the real release ships.

## Procedure

1. `git checkout uat && git pull && git checkout -b experiment/alarmclock-backport`
   (branch name fixed; never merge, never rebase).
2. Extract the merged diff: `curl -s https://github.com/expo/expo/commit/257006e.diff`,
   keep only the files above. Apply onto `node_modules/expo-notifications@<installed>`
   (re-check installed version at session start). Expect drift between `main` and 57.x in
   surrounding code — reconcile manually against the 57.x sources; the alarmClock hunks
   are additive (new enum, new trigger field, `setAlarmClock()` branch).
3. `yarn add -D patch-package`, add `"postinstall": "patch-package"` to package.json
   scripts (branch-only; the sanctioned exception to no-new-deps). `npx patch-package
   expo-notifications` and verify `patches/expo-notifications+<version>.patch` contains
   exactly the backport.
4. Usage diff (the ONLY functional app-code change, written to port verbatim to SDK 58):
   `delivery: 'alarmClock'` on the `DateTriggerInput`s for Athan and reminder
   notifications in `stores/notifications.ts`.
5. What's New re-stamp (branch-only, rides the 1.24.0 bump): in `shared/whatsNew.ts` set
   `WHATS_NEW.version` AND the three shipped items (Tablet support, Athan sounds,
   Reminder sounds) from `'1.23.1'` to `'1.24.0'` — identical content, so the 1.24.0
   popup presents the same three items. The parked widgets item stays `version: null`.
5. Build config (branch-only, never merges): the APK must carry the real package id and
   REAL data. First verify the EAS `preview` environment:
   `eas env:vars --environment preview` — it must contain `EXPO_PUBLIC_API_KEY` and a
   non-local `EXPO_PUBLIC_ENV` (unset `EXPO_PUBLIC_ENV` means mock data — a daily-use
   build must not ship mock). If `EXPO_PUBLIC_ENV` is missing there, pin
   `"EXPO_PUBLIC_ENV": "preview"` in the profile env. Then add
   `"environment": "preview"` to the eas.json `preview` profile (Release compilation,
   internal distribution = directly installable APK; no app-id suffix, no name suffix).
   NEVER put the API key itself in eas.json.
6. `yarn validate` green; MINOR version bump (1.24.0 — feature grade, distinguishes the
   daily-use build from the 1.23.x line); commit; push branch.
7. Build on EAS CLOUD ONLY — no local compilation ever on this branch (no
   `expo run:android`, no gradle, no local EAS builds). Submit BOTH platforms at 1.24.0:
   `eas build --platform android --profile preview --non-interactive --no-wait` and
   `eas build --platform ios --profile preview --non-interactive --no-wait`
   (GLOBAL eas CLI only — `npx eas-cli` inside the repo crashes on minimatch). Expo's
   build server runs yarn install → the postinstall hook applies the patch → the patched
   Kotlin compiles into the Release APK. Native Kotlin means a real build, never OTA.
8. Owner installs EVERYTHING personally from the EAS build page in each device's browser
   (both platforms, no exceptions — no adb, no devicectl, every device is already clean):
   the APK on 3T, 5T, 8T, Find X8 and the IPA on the XS (registered for internal
   provisioning — campaign precedent 1.18.1 ship360 IPA).

   iOS INSTALL PATH (owner question 2026-09-09 — discuss and verify in this session, no
   TestFlight/ASC detour): the internal-distribution IPA installs straight from the EAS
   build page in Safari, like Android — ad-hoc/development signed (paid account = 1-year
   profile). BEFORE building, verify the XS is registered: `eas device:list` must show
   UDID 00008020-0015585C22D2002E; if absent, `eas device:create` walks the owner through
   registration on the phone, then build. After install, one-time trust step on the
   phone: Settings → General → VPN & Device Management → trust the developer cert.
   FALLBACK (owner-sanctioned exception if the link route fails): the agent installs the
   IPA over USB: `xcrun devicectl device install app --device 00008020-0015585C22D2002E
   <path.ipa>`. Same result; the owner just does not tap the button personally.
   Objective confirmation ONLY on the connected 3T after its first schedule:
   `adb -s 8f7ada76 shell dumpsys alarm | grep -A2 mugtaba` — athan entries must show
   `window=0` (alarm-clock class; was `window=+1h0m0s0ms` windowed). All other devices:
   verification is daily use — prayers land at the minute, no 60s-to-minutes drift.
9. **Deletion day (SDK 58 or a 57.x patch carrying #49687)**: delete the branch and the
   patch, remove the postinstall script and devDep, upgrade, port the step-4 usage diff
   verbatim. Watch: expo-notifications CHANGELOG on the sdk-57 branch + npm. When the
   next store release goes out, verify the Play install replaces the side-loaded APK
   (if the EAS keystore differs from the Play upload key, uninstall-first once more).

## Constraints

- Branch never merges to uat/main; frozen at cut; never rebased onto later uat.
- ALL compilation on EAS cloud. No local builds of any kind on this branch.
- `releases.json` untouched. Version: minor bump 1.24.0 on the branch.
- Phone quirks stand: doubled `am start` on the 3T; 8T Auto-launch re-enable after
  reinstall (#19 mitigated); 8T USB re-enumeration after reboots; Play Protect blocks
  sideloads on ColorOS 16 (`settings put global package_verifier_enable 0` +
  `verifier_verify_adb_installs 0`, restore after).

## Session record (2026-09-09)

Branch cut and built at 1.24.0. Everything below rides the branch commit and is
the authoritative description of what the patch contains and why.

**Patch inventory** (`patches/expo-notifications+57.0.17.patch`, 10 files):
the 7 upstream files from merge commit `257006e` (NotificationScheduler.kt,
NotificationTriggers.kt, ExpoSchedulingDelegate.kt, NotificationScheduler.types.ts,
Notifications.types.ts, scheduleNotificationAsync.ts, parseTrigger-test.ts) PLUS 3
compiled-output mirrors (`build/Notifications.types.d.ts`,
`build/NotificationScheduler.types.d.ts`, `build/scheduleNotificationAsync.js`).
All hunks applied cleanly onto 57.0.17; no drift reconciliation was needed.

**The build-mirror requirement (durable lesson for any expo-package backport):**
published expo packages resolve `main`/`types` through `build/`, not `src/`. A
patch that touches only `src/` compiles, ships, and silently does nothing at
runtime; the only tripwire is `tsc` rejecting the new field in app code (which is
exactly how it surfaced here — failing closed). Any future patch-package backport
of a JS/TS file must mirror the same change into the compiled `build/` outputs
and regenerate the patch. Kotlin is unaffected (compiled from source by gradle).

**The prebuilt-AAR requirement (durable lesson, 2026-09-09, the 1.24.0 miss):**
SDK 57 ships expo modules' Android native code as PRECOMPILED AARs inside each
npm package (`local-maven-repo/.../<pkg>.aar`); the gradle autolinking plugin
links the AAR and never compiles `android/src`. The 1.24.0 builds applied the
patch faithfully but compiled the UNPATCHED binary — verified by pulling the EAS
artifact and grepping the dex (control string present, patch markers absent) and
by dumpsys on the 8T/Find X8 (`window=+1h0m0s0ms`, the old windowed class; a
neighboring app's alarms showed `window=0` proving exact delivery possible).
THE FIX: `package.json` → `expo.autolinking.android.buildFromSource:
["expo-notifications"]` makes the settings plugin link the patched source
instead of the publication (`SettingsManager.configurePublication`:
`shouldUsePublication = !forceBuildFromSource && ...`). The 1.24.1 rebuild adds
this. Any future expo-module backport must set it for every patched package.
Verification ritual before install: pull the artifact, `grep -a "Unsupported
trigger delivery" classes*.dex` — marker present means the patch truly compiled
in. (Upstream precedent: the expo/expo#49244 verification harness used exactly
patch + build-from-source together.)

**Verification ladder (all green before submission):**
install (`npx patch-package` recreates cleanly), typecheck (`yarn validate`:
tsc + biome + 968 tests), JS runtime (node executed the patched
`build/scheduleNotificationAsync.js` `parseTrigger` directly: `delivery:
'alarmClock'` forwards to the native trigger object on date triggers, is omitted
when unset, and is correctly excluded from timeInterval triggers), compilation
and device stages pending the EAS builds.

**Runtime patch flow on the EAS build server:** `yarn install` runs the
`postinstall: patch-package` hook, the patch applies onto the fresh
node_modules, and the patched Kotlin compiles into the Release APK. Native code
means a real build, never OTA.

**Editor note:** after the patch applies, IDE TypeScript servers hold a stale
pre-patch snapshot (node_modules is excluded from file watching). "Restart TS
Server" clears the phantom `delivery` error; `tsc --noEmit` from the CLI is the
truth.

## TRACKER — update at every session end

| Step | Status |
| --- | --- |
| B1 Branch created from uat | DONE 2026-09-09 (experiment/alarmclock-backport, frozen at 1.23.12 cut) |
| B2 Diff extracted + drift reconciled onto installed 57.x | DONE 2026-09-09 (clean apply; +3 build/ mirrors, see session record) |
| B3 patch-package patch generated + postinstall wired | DONE 2026-09-09 (10-file patch, devDep + hook in package.json) |
| B4 `delivery: 'alarmClock'` adopted in `device/notifications.ts` (both DATE triggers) | DONE 2026-09-09 |
| B4b What's New re-stamped to 1.24.0 (same three items, parked widgets item untouched) | DONE 2026-09-09 |
| B5 eas.json preview profile wired to the `preview` EAS environment (real key, non-local env; branch-only) | DONE 2026-09-09 (`EXPO_PUBLIC_ENV=preview` already set server-side, no profile pin needed) |
| B6 validate green, committed, pushed | DONE 2026-09-09 (968 tests green; 1.24.0) |
| B7 EAS APK + parity IPA built; owner installs BOTH personally via the EAS link; dumpsys `window=0` confirmed on the connected 3T | 1.24.0 built FINISHED but carried the UNPATCHED AAR (prebuilt-AAR miss, see session record). 1.24.1 rebuilt with `buildFromSource`, artifact dex-markers verified BEFORE install, then agent-installed via adb (owner-sanctioned). **PROVEN 2026-09-09 on the FULL FLEET: `window=0` alarm-clock class on 3T, 8T, Find X8, 5T, S23 (every alarm exact to the second; was `window=+1h` on 1.24.0); XS parity at 1.24.1 with owner-configured alerts**. iOS 1.24.1 parity build FINISHED |
| B8 Daily-use verdict (delivery punctuality on OEM phones) | owner daily-use testing underway since 2026-09-09 evening (first fleet-wide delivery: Asr 16:32, then Fajr 04:47/04:52) |
| B9 Real release carries #49687; branch + patch deleted; usage diff ported | waiting on SDK 58 (as of 2026-09-09 the 57.x line tops out at 57.0.17 with no alarmClock entry) |
| B10 ISSUES #22 addendum | SKIPPED per owner 2026-09-09 (fixed 1.22.19; rides daily use if ever revisited) |

## Deletion-day checklist (SDK 58, or any 57.x release carrying #49687)

1. Confirm the release notes/CHANGELOG actually carry #49687.
2. Delete `patches/expo-notifications+57.0.17.patch`.
3. Remove `"postinstall": "patch-package"` from package.json scripts; `yarn remove patch-package`.
4. Delete the `experiment/alarmclock-backport` branch (never merged, never rebased).
5. Port the usage diff verbatim: `delivery: 'alarmClock'` on the two DATE triggers in `device/notifications.ts`.
6. Re-stamp What's New for the real store release.
7. Verify once on the 3T with `adb shell dumpsys alarm | grep -A2 mugtaba` (`window=0`).
8. Verify the Play install replaces the side-loaded APK once (uninstall-first if keystrokes differ).
