# New Workflow — Scaffold Generator

Generate a complete, correctly-wired workflow overlay for `App.jsx` in one pass. This exists because every hand-built workflow repeats the same six wiring steps and re-introduces the same defects the muster then catches (`num-tab`, ghost state, `Input` `e.target.value`). The scaffold makes those **impossible by construction** — build from it and the muster is free to find real logic bugs instead.

## Usage

`/new-workflow <id> "<Title>"` — e.g. `/new-workflow overdraft "Overdraft limit change"`. If the user gave a feature brief (often from `/shipwright`), use it to fill the steps; otherwise scaffold a 3-step skeleton they can flesh out.

## The six wiring points — ALL required, in this order

A workflow that misses any of these is broken. Grep the anchors from `CLAUDE.md` → "Key data locations"; line numbers drift.

1. **State** — add `useState`s in the top block (grep the last `use...State` before `const closeWorkflow`, insert above it). Never inside the closure.
2. **`closeWorkflow()` reset** — add a reset line for **every** var from step 1 (grep `const closeWorkflow`). Persistent-by-design settings are the only exception and must be commented as such.
3. **`renderXxx` closure** — insert before `const HomeScreen`. No hooks inside — it's a closure, not a component.
4. **Home tile** — add to the right action group in `HomeScreen` (`payments` / `business` / `tax` / `accounts`): `{ icon: Icon, title: '…', desc: '…', onClick: () => { setWorkflow('<id>'); setStep(0); } }`.
5. **Mobile routing** — add `{workflow === '<id>' && renderXxx()}` to the mobile shell block (grep the other `workflow === '…' && render`).
6. **Desktop routing** — add the **same** line to the desktop shell block. There are TWO routing blocks at different indentation; a `replace_all` will collide — edit each explicitly. Confirm `grep -c "workflow === '<id>'"` returns **2**.

## Baked-in correctness — copy these, don't re-derive

- **`Input` calls `onChange(value)`, not `onChange(event)`** → always `onChange={setX}`. Never `e.target.value`. (Native `<input type="checkbox">` DOES use `e.target.checked` — different thing.)
- **Every monetary amount gets `num-tab`** (and usually `font-mono`). Includes review-summary rows — the easy miss.
- **Fixed-width identifiers** (IBAN, SWIFT, account/sort) also get `font-mono num-tab`.
- **Edits invalidate downstream verification.** If the flow has a "screen / verify / check" step whose result depends on earlier fields, wrap those field setters so editing re-arms it (see `withRescreen` in `renderBeneficiary`). Otherwise the review can claim a pass against changed data.
- **Muted status palette only**: emerald-600 / amber-600 / red-600. Never `text-stone-400/500` on a coloured or dark surface.
- **One primary CTA per step** — StepFrame's Next is it. An in-body action button (e.g. "Run checks") is fine only if Next stays `nextDisabled` until it's done (sequential, not competing).
- **Every `.map` gets a stable `key`** (an id/code/unique string, never the array index if the list can reorder).

## The skeleton

```jsx
// 1 — STATE (top block, above closeWorkflow)
const [xxStep, setXxStep] = useState(null);   // rename per field; add one per input
const [xxConfirm, setXxConfirm] = useState(false);

// 2 — in closeWorkflow():  setXxStep(null); setXxConfirm(false);

// 3 — renderXxx (before HomeScreen)
const renderXxx = () => {
  const stepDefs = [
    { id: 'a', t: 'First step',  s: 'subtitle' },
    { id: 'b', t: 'Details',     s: 'subtitle' },
    { id: 'review', t: 'Review & confirm', s: 'subtitle' },
  ];
  const total = stepDefs.length;
  const sd = stepDefs[step];

  const next = () => {
    if (step === total - 1) { fireToast('Done — logged to audit trail'); closeWorkflow(); }
    else setStep(step + 1);
  };
  const back = () => step === 0 ? closeWorkflow() : setStep(step - 1);
  const canProceed = () => {
    if (sd.id === 'review') return xxConfirm;
    return true;
  };

  return (
    <StepFrame onClose={closeWorkflow} title={sd.t} sub={sd.s} total={total} current={step}
      onBack={back} onNext={next}
      nextLabel={sd.id === 'review' ? 'Confirm' : 'Continue'}
      replaces={{ form: 'Paper process replaced', savings: 'Self-serve · instant · logged' }}
      nextDisabled={!canProceed()}
    >
      {sd.id === 'a' && (<div className="space-y-4">{/* fields — Input onChange={setX} */}</div>)}
      {sd.id === 'review' && (
        <div className="space-y-4">
          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-stone-200 cursor-pointer">
            <input type="checkbox" checked={xxConfirm} onChange={e => setXxConfirm(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#DA291C]" />
            <span className="text-sm text-stone-700">I confirm the details are correct.</span>
          </label>
        </div>
      )}
    </StepFrame>
  );
};

// 4 — Home tile:   { icon: Icon, title: '…', desc: '…', onClick: () => { setWorkflow('xxx'); setStep(0); } }
// 5 — mobile:      {workflow === 'xxx' && renderXxx()}
// 6 — desktop:     {workflow === 'xxx' && renderXxx()}   (same line, other block)
```

## After scaffolding

1. `npm run build` — must be clean.
2. Inline gates: `grep -c "workflow === '<id>'"` → 2; bare-outline count → 0; gray/zinc → 0.
3. `/muster` (full panel for a new workflow) → fix any RED, log AMBER.
4. **Runtime drive-through** — `node scripts/verify-flows.mjs`. Static review confirms the code exists; this confirms the button actually *fires*. Add a check that drives the new workflow to its terminal step and asserts the final state renders (this is how the Sign-&-send dead-button bug would have been caught). Look at the screenshot.
5. `/ship-ready` → commit → push. Then move the item to Launched in `SHIPWRIGHT-BACKLOG.md` and bump the workflow count in `CLAUDE.md`.
