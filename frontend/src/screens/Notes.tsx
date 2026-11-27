// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";
import { api } from "@/api/client";
import { clearSessionToken } from "@/lib/api";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Button, Input, Textarea, Label, Badge, Empty } = UI;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Plus, Search, Check, X, FileText, Clock, Trash, AlertCircle, CheckCircle } = Icons;

const NOW = Date.now();
const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const OWNER_EMAIL = "sai.kiron@quorq.ai";

const SEED_NOTES = [
  {
    id: "note_a81f",
    owner_id: "own_01",
    content:
      "Groceries for the weekend\n\nOat milk x2\nSourdough from Blackbird (before 10am or it's gone)\nChestnut mushrooms\nParmesan — the proper wedge, not the tub\nClementines\nBin bags, 30L\n\nSkip the ready meals this time.",
    created_at: NOW - 3 * DAY - 2 * HOUR,
    updated_at: NOW - 5 * MIN,
  },
  {
    id: "note_5c20",
    owner_id: "own_01",
    content:
      "Call plumber about kitchen tap\n\nDrips from the base, not the spout. Started Sunday night.\nDermot — leaves the answerphone on until noon.\nCallout last February was 85 for the hour.\nMention the washer he replaced in March, it may still be under his guarantee.",
    created_at: NOW - 6 * DAY,
    updated_at: NOW - 2 * HOUR,
  },
  {
    id: "note_9d4b",
    owner_id: "own_01",
    content:
      "Reading list for December\n\nThe Overstory — Richard Powers (half finished since August)\nSmall Things Like These — Claire Keegan\nThe Wager — David Grann\nPiranesi — reread, it's short\n\nLibrary holds: two ready for pickup, expire 2 Dec.",
    created_at: NOW - 9 * DAY,
    updated_at: NOW - 26 * HOUR,
  },
  {
    id: "note_31ae",
    owner_id: "own_01",
    content:
      "Notes from Tuesday standup\n\nMigration ran clean on staging, 41 minutes end to end.\nPriya is off Thu/Fri — hand the import queue to Marcus.\nDecision: hold the pricing page copy until legal reply.\nOpen question: do we keep the old export format for Q1?",
    created_at: NOW - 24 * DAY - 3 * HOUR,
    updated_at: NOW - 24 * DAY,
  },
  {
    id: "note_6ff7",
    owner_id: "own_01",
    content:
      "Flat viewing — questions to ask\n\nWhen was the boiler last serviced?\nService charge for 2027 and what it covers\nAny planned works on the roof?\nHow long has it been on the market?\nIs the parking space deeded or allocated?",
    created_at: NOW - 4 * DAY,
    updated_at: NOW - 4 * HOUR,
  },
  {
    id: "note_c013",
    owner_id: "own_01",
    content:
      "Sourdough starter — feeding schedule\n\nFriday evening: 50g flour, 50g water, discard the rest.\nSaturday 8am: feed again, leave on top of the fridge.\nSaturday 7pm: mix dough, autolyse one hour.\nSunday: bake at 250 with the lid on for 20 min, 220 lid off for 20.",
    created_at: NOW - 15 * DAY,
    updated_at: NOW - 9 * HOUR,
  },
  {
    id: "note_77b2",
    owner_id: "own_01",
    content:
      "Birthday ideas for Mum (6 Dec)\n\nThe ceramics weekend in Hathersage — she mentioned it twice\nNew secateurs, the Japanese ones\nPrint the Whitby photos properly, not the phone screen\nBook the table at Rafters early, it fills up by the first week.",
    created_at: NOW - 11 * DAY,
    updated_at: NOW - 2 * DAY,
  },
  {
    id: "note_e4a9",
    owner_id: "own_01",
    content:
      "Bike service checklist\n\nRear brake pads down to the line\nChain stretch — measure before ordering\nBottom bracket creaks out of the saddle\nNew bar tape, black\nBooked in at Cycle Works, Wed 2 Dec, 08:30.",
    created_at: NOW - 13 * DAY,
    updated_at: NOW - 3 * DAY - 2 * HOUR,
  },
  {
    id: "note_2b6c",
    owner_id: "own_01",
    content:
      "Porto trip — rough plan\n\nFly Thu evening, back Monday lunchtime.\nStay in Cedofeita, not Ribeira — quieter and cheaper.\nDay 1: Livraria Lello early, then the port lodges across the bridge.\nDay 2: train to Aveiro.\nEat: Cantina 32, Flor dos Congregados.",
    created_at: NOW - 21 * DAY,
    updated_at: NOW - 5 * DAY,
  },
  {
    id: "note_8ad5",
    owner_id: "own_01",
    content:
      'Quotes I keep coming back to\n\n"The best time to plant a tree was twenty years ago. The second best time is now."\n\n"A person is a fool to become a writer. His only compensation is absolute freedom." — Roald Dahl\n\n"Attention is the rarest and purest form of generosity." — Simone Weil',
    created_at: NOW - 40 * DAY,
    updated_at: NOW - 8 * DAY,
  },
  {
    id: "note_45e1",
    owner_id: "own_01",
    content:
      "Train times to Sheffield\n\nWeekday mornings: 07:12 (direct, 2h04), 08:40 (change at Derby).\nAdvance singles released 12 weeks out — set a reminder.\nRailcard renews 19 Jan 2027.\nAvoid the 17:35 back, it's rammed.",
    created_at: NOW - 30 * DAY,
    updated_at: NOW - 12 * DAY,
  },
  {
    id: "note_0f73",
    owner_id: "own_01",
    content:
      "Things to fix before the viewing\n\nTouch up the skirting in the hall\nSilicone around the bath has gone grey\nSpare key cut for the agent\nThe door to the second bedroom still sticks in damp weather\nClear the cupboard under the stairs.",
    created_at: NOW - 35 * DAY,
    updated_at: NOW - 19 * DAY,
  },
];

function titleOf(content) {
  const first = (content || "").split("\n").find(function (l) {
    return l.trim().length > 0;
  });
  return first ? first.trim() : "Untitled note";
}

function snippetOf(content) {
  const lines = (content || "").split("\n");
  const title = titleOf(content);
  const rest = lines
    .map(function (l) {
      return l.trim();
    })
    .filter(function (l) {
      return l.length > 0 && l !== title;
    })
    .join("  ");
  return rest.length ? rest : "Empty note — nothing written yet";
}

function relTime(ts) {
  const diff = Date.now() - ts;
  if (diff < 45 * 1000) return "just now";
  if (diff < HOUR) {
    const m = Math.max(1, Math.round(diff / MIN));
    return m === 1 ? "1 minute ago" : m + " minutes ago";
  }
  if (diff < 24 * HOUR) {
    const h = Math.max(1, Math.floor(diff / HOUR));
    return h === 1 ? "1 hour ago" : h + " hours ago";
  }
  if (diff < 48 * HOUR) return "yesterday";
  const d = new Date(ts);
  return d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();
}

function absTime(ts) {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear() + " " + hh + ":" + mm;
}

function clockTime(ts) {
  const d = new Date(ts);
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}

export default function Screen() {
  const navigate = useNavigate();
  const ink = "#eaf3ff";
  const dim = brand.neutralColor;
  const glassBg = "rgba(255,255,255,0.055)";
  const glassBg2 = "rgba(255,255,255,0.09)";
  const hair = "1px solid rgba(255,255,255,0.13)";
  const gradient =
    "linear-gradient(104deg, " + brand.primaryColor + " 0%, " + brand.accentColor + " 100%)";

  const [notes, setNotes] = React.useState(SEED_NOTES);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState(SEED_NOTES[0].id);
  const [draft, setDraft] = React.useState(SEED_NOTES[0].content);
  const [saveState, setSaveState] = React.useState("saved"); // saved | pending | saving | error
  const [lastSynced, setLastSynced] = React.useState(NOW - 5 * MIN);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [flash, setFlash] = React.useState(null);
  const [signingOut, setSigningOut] = React.useState(false);
  const [creatingNote, setCreatingNote] = React.useState(false);
  const [newNoteText, setNewNoteText] = React.useState("");
  const [createLoading, setCreateLoading] = React.useState(false);
  const [createError, setCreateError] = React.useState(null);

  const timersRef = React.useRef([]);
  const attemptsRef = React.useRef(0);
  const textareaRef = React.useRef(null);
  const newNoteRef = React.useRef(null);
  const deleteBtnRef = React.useRef(null);
  const confirmDeleteRef = React.useRef(null);
  const cancelRef = React.useRef(null);
  const focusEditorRef = React.useRef(false);

  const pushTimer = function (t) {
    timersRef.current.push(t);
  };
  const clearTimers = function () {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  React.useEffect(function () {
    const t = setTimeout(function () {
      setLoading(false);
    }, 760);
    return function () {
      clearTimeout(t);
    };
  }, []);

  React.useEffect(function () {
    return function () {
      clearTimers();
    };
  }, []);

  React.useEffect(
    function () {
      if (focusEditorRef.current && textareaRef.current) {
        focusEditorRef.current = false;
        textareaRef.current.focus();
      }
    },
    [selectedId, creatingNote],
  );

  React.useEffect(
    function () {
      if (confirmOpen && cancelRef.current) cancelRef.current.focus();
    },
    [confirmOpen],
  );

  const sorted = React.useMemo(
    function () {
      return notes.slice().sort(function (a, b) {
        return b.updated_at - a.updated_at;
      });
    },
    [notes],
  );

  const q = query.trim().toLowerCase();
  const visible = q
    ? sorted.filter(function (n) {
        return n.content.toLowerCase().indexOf(q) !== -1;
      })
    : sorted;

  const selected =
    notes.find(function (n) {
      return n.id === selectedId;
    }) || null;

  function commit(id, text, unsynced) {
    setNotes(function (prev) {
      return prev.map(function (n) {
        return n.id === id
          ? { ...n, content: text, updated_at: Date.now(), unsynced: !!unsynced }
          : n;
      });
    });
  }

  function runSave(id, text) {
    clearTimers();
    setSaveState("saving");
    attemptsRef.current += 1;
    const willFail = attemptsRef.current % 4 === 0;
    pushTimer(
      setTimeout(function () {
        if (willFail) {
          setSaveState("error");
        } else {
          commit(id, text, false);
          setLastSynced(Date.now());
          setSaveState("saved");
        }
      }, 680),
    );
  }

  function onDraftChange(e) {
    const value = e.target.value;
    setDraft(value);
    if (!selected) return;
    clearTimers();
    setSaveState("pending");
    const id = selected.id;
    pushTimer(
      setTimeout(function () {
        runSave(id, value);
      }, 950),
    );
  }

  function flushBeforeLeaving() {
    if (!selected) return;
    if (saveState === "pending" || saveState === "saving") {
      clearTimers();
      commit(selected.id, draft, false);
      setLastSynced(Date.now());
    } else if (saveState === "error") {
      clearTimers();
      commit(selected.id, draft, true);
    }
  }

  function selectNote(id) {
    if (id === selectedId) return;
    flushBeforeLeaving();
    const next = notes.find(function (n) {
      return n.id === id;
    });
    setSelectedId(id);
    setDraft(next ? next.content : "");
    setSaveState(next && next.unsynced ? "error" : "saved");
  }

  function createNote() {
    flushBeforeLeaving();
    setCreatingNote(true);
    setNewNoteText("");
    setCreateError(null);
    setCreateLoading(false);
    setSelectedId(null);
    setQuery("");
    focusEditorRef.current = true;
  }

  // AC-010 / AC-011: the only way a note is created — plain text, entered here, sent
  // to the server the moment the owner leaves the field. There is no formatting,
  // checklist, image or attachment control anywhere on this screen.
  function submitNewNote() {
    const text = newNoteText;
    if (!text.trim() || createLoading) return;
    setCreateLoading(true);
    setCreateError(null);
    api
      .POST("/notes", { body: { text: text } })
      .then(function (res) {
        if (res.error || !res.data) {
          setCreateError("Changes not saved — check your connection");
          return;
        }
        const data = res.data;
        const createdMs = new Date(data.createdAt).getTime();
        const fresh = {
          id: data.id,
          owner_id: "own_01",
          content: data.text,
          created_at: createdMs,
          updated_at: createdMs,
        };
        setNotes(function (prev) {
          return [fresh].concat(prev);
        });
        setSelectedId(data.id);
        setDraft(data.text);
        setSaveState("saved");
        setLastSynced(createdMs);
        setCreatingNote(false);
        setNewNoteText("");
      })
      .catch(function () {
        setCreateError("Changes not saved — check your connection");
      })
      .finally(function () {
        setCreateLoading(false);
      });
  }

  function showFlash(message) {
    setFlash(message);
    pushTimer(
      setTimeout(function () {
        setFlash(null);
      }, 4200),
    );
  }

  function confirmDelete() {
    if (!selected) return;
    setDeleting(true);
    const victim = selected;
    pushTimer(
      setTimeout(function () {
        const remaining = notes.filter(function (n) {
          return n.id !== victim.id;
        });
        setNotes(remaining);
        const nextSorted = remaining.slice().sort(function (a, b) {
          return b.updated_at - a.updated_at;
        });
        const next = nextSorted[0] || null;
        setSelectedId(next ? next.id : null);
        setDraft(next ? next.content : "");
        setSaveState("saved");
        setDeleting(false);
        setConfirmOpen(false);
        showFlash("Note deleted");
        if (newNoteRef.current) newNoteRef.current.focus();
      }, 520),
    );
  }

  function closeConfirm() {
    if (deleting) return;
    setConfirmOpen(false);
    if (deleteBtnRef.current) deleteBtnRef.current.focus();
  }

  function onDialogKeyDown(e) {
    if (e.key === "Escape") {
      e.stopPropagation();
      closeConfirm();
      return;
    }
    if (e.key === "Tab") {
      const first = cancelRef.current;
      const last = confirmDeleteRef.current;
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function signOut() {
    setSigningOut(true);
    // Sign-out always ends the local session and returns to Sign in, even if the
    // request to revoke the server-side token never completes (AC-008).
    api
      .POST("/auth/logout")
      .catch(function () {})
      .then(function () {
        clearSessionToken();
        navigate("sign-in");
      });
  }

  const css =
    "@keyframes np-rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}" +
    "@keyframes np-pop{from{opacity:0;transform:translateY(10px) scale(.985)}to{opacity:1;transform:none}}" +
    "@keyframes np-pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.25)}}" +
    "@keyframes np-shimmer{0%,100%{opacity:.35}50%{opacity:.7}}" +
    ".np-rise{animation:np-rise .3s cubic-bezier(.2,.7,.3,1) both}" +
    ".np-pop{animation:np-pop .22s cubic-bezier(.2,.7,.3,1) both}" +
    ".np-pulse{animation:np-pulse 1.15s ease-in-out infinite}" +
    ".np-shimmer{animation:np-shimmer 1.4s ease-in-out infinite}" +
    ".np-row{transition:background-color .18s ease,border-color .18s ease,transform .18s ease}" +
    ".np-row:hover{background-color:rgba(255,255,255,.075)}" +
    ".np-btn{transition:transform .15s ease,filter .15s ease,background-color .18s ease,border-color .18s ease}" +
    ".np-btn:hover{filter:brightness(1.08)}" +
    ".np-btn:active{transform:translateY(1px)}" +
    ".np-ring:focus-visible{outline:2px solid " +
    brand.primaryColor +
    ";outline-offset:3px}" +
    ".np-ta{transition:border-color .2s ease,background-color .2s ease}" +
    ".np-ta:focus{border-color:" +
    brand.accentColor +
    "66 !important;background-color:rgba(255,255,255,.075) !important}" +
    "@media (prefers-reduced-motion: reduce){.np-rise,.np-pop,.np-pulse,.np-shimmer{animation:none !important}.np-row,.np-btn,.np-ta{transition:none !important}}";

  const panelStyle = {
    backgroundColor: glassBg,
    border: hair,
    borderRadius: brand.radius,
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
  };

  const saveMeta = {
    saved: { label: "Saved", tone: brand.primaryColor },
    pending: { label: "Edited — saving in a moment", tone: brand.accentColor },
    saving: { label: "Saving to the server…", tone: brand.accentColor },
    error: { label: "Not saved", tone: "#fb7185" },
  }[saveState];

  return (
    <div
      className="relative min-h-full w-full overflow-hidden"
      style={{ backgroundColor: brand.backgroundColor, color: ink, fontFamily: brand.fontBody }}
    >
      <style>{css}</style>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full"
        style={{ background: brand.primaryColor, opacity: 0.16, filter: "blur(110px)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-40 h-96 w-96 rounded-full"
        style={{ background: brand.accentColor, opacity: 0.14, filter: "blur(130px)" }}
      />

      <div className="relative mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Row 1 */}
        <div className="grid grid-cols-12 items-start gap-4">
          <div data-wf="b-0-0" className="col-span-12 lg:col-span-8">
            <h1
              data-testid="my-notes-12-title"
              className="text-[32px] font-extrabold leading-tight tracking-tight lg:text-[40px]"
              style={{ fontFamily: brand.fontHeading }}
            >
              My notes{" "}
              <span style={{ color: brand.accentColor, fontVariantNumeric: "tabular-nums" }}>
                ({notes.length})
              </span>
            </h1>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: dim }}>
              Signed in as {OWNER_EMAIL} · kept on the server, so they open on any browser ·{" "}
              <button
                type="button"
                onClick={signOut}
                disabled={signingOut}
                className="np-ring np-btn rounded-full px-2 py-1 font-semibold underline underline-offset-4 disabled:opacity-70"
                style={{ color: brand.primaryColor }}
              >
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </p>
          </div>

          <div data-wf="b-0-1" className="col-span-12 flex lg:col-span-4 lg:justify-end">
            <Button
              ref={newNoteRef}
              type="button"
              onClick={createNote}
              data-wf="b-0-1-btn"
              data-testid="new-note-btn"
              className="np-ring np-btn inline-flex h-12 w-full items-center justify-center gap-2 px-6 text-[15px] font-bold lg:w-auto"
              style={{
                background: gradient,
                color: "#06142b",
                border: "none",
                borderRadius: brand.radius,
                boxShadow: "0 18px 50px -12px " + brand.accentColor + "80",
              }}
            >
              <Plus className="h-5 w-5" aria-hidden="true" />
              New note
            </Button>
          </div>
        </div>

        {/* Row 2 */}
        <div data-wf="b-1-0" className="mt-7">
          <Label htmlFor="notes-search" className="sr-only">
            Search notes by text
          </Label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2"
              aria-hidden="true"
              style={{ color: brand.primaryColor }}
            />
            <Input
              id="notes-search"
              data-testid="search-notes-by-text-input"
              type="search"
              value={query}
              onChange={function (e) {
                setQuery(e.target.value);
              }}
              placeholder="Search notes by text"
              className="np-ring np-ta h-14 w-full pl-14 pr-28 text-base"
              style={{
                backgroundColor: glassBg,
                border: hair,
                borderRadius: brand.radius,
                color: ink,
                backdropFilter: "blur(16px)",
              }}
            />
            {query ? (
              <button
                type="button"
                onClick={function () {
                  setQuery("");
                }}
                aria-label="Clear search"
                className="np-ring np-btn absolute right-4 top-1/2 flex h-9 items-center gap-1.5 -translate-y-1/2 rounded-full px-3 text-xs font-semibold"
                style={{ backgroundColor: glassBg2, border: hair, color: ink }}
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Clear
              </button>
            ) : null}
          </div>
          <p
            className="mt-2 pl-1 text-xs"
            style={{ color: dim, fontVariantNumeric: "tabular-nums" }}
          >
            {q
              ? visible.length + " of " + notes.length + " notes match “" + query.trim() + "”"
              : "Searches the full text of every note. No folders, notebooks or tags — one list."}
          </p>
        </div>

        {/* Rows 3–5 */}
        <div className="mt-6 grid grid-cols-12 gap-5 lg:gap-6">
          {/* Left column: list / empty */}
          <div className="col-span-12 lg:col-span-4">
            {notes.length === 0 ? (
              <div
                data-wf="b-3-0"
                data-testid="no-notes-yet-create-your-first-not-empty"
                className="np-rise p-2"
                style={panelStyle}
              >
                <Empty
                  title="No notes yet — create your first note"
                  description="Your list is clear. Create your first note and it will appear here, newest activity at the top."
                  action={
                    <Button
                      type="button"
                      onClick={createNote}
                      className="np-ring np-btn inline-flex h-11 items-center gap-2 px-5 text-sm font-bold"
                      style={{
                        background: gradient,
                        color: "#06142b",
                        border: "none",
                        borderRadius: brand.radius,
                      }}
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      Write your first note
                    </Button>
                  }
                  className="py-10"
                />
              </div>
            ) : (
              <section data-wf="b-2-0" style={panelStyle} className="overflow-hidden">
                <div className="flex items-baseline justify-between px-5 pb-3 pt-5">
                  <h2
                    className="text-[11px] font-bold uppercase tracking-[0.16em]"
                    style={{ color: dim, fontFamily: brand.fontHeading }}
                  >
                    Sorted by most recent activity
                  </h2>
                  <span
                    className="text-[11px] font-semibold"
                    style={{ color: brand.primaryColor, fontVariantNumeric: "tabular-nums" }}
                  >
                    {visible.length}
                  </span>
                </div>
                <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.1)" }} />

                {flash ? (
                  <p
                    className="np-rise flex items-start gap-2 px-5 py-3 text-xs"
                    style={{ color: ink, backgroundColor: brand.primaryColor + "14" }}
                    role="status"
                  >
                    <CheckCircle
                      className="mt-px h-4 w-4 shrink-0"
                      aria-hidden="true"
                      style={{ color: brand.primaryColor }}
                    />
                    {flash}
                  </p>
                ) : null}

                {loading ? (
                  <ul className="p-3">
                    {[0, 1, 2, 3, 4].map(function (i) {
                      return (
                        <li
                          key={i}
                          className="np-shimmer px-2 py-3.5"
                          style={{ animationDelay: i * 0.1 + "s" }}
                        >
                          <div
                            className="h-3.5 w-2/3 rounded-full"
                            style={{ backgroundColor: "rgba(255,255,255,0.14)" }}
                          />
                          <div
                            className="mt-2.5 h-3 w-5/6 rounded-full"
                            style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
                          />
                        </li>
                      );
                    })}
                    <li className="px-2 pb-2 pt-3 text-xs" style={{ color: dim }}>
                      Fetching your notes from the server…
                    </li>
                  </ul>
                ) : visible.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div
                      className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: glassBg2, border: hair }}
                    >
                      <Search
                        className="h-5 w-5"
                        aria-hidden="true"
                        style={{ color: brand.accentColor }}
                      />
                    </div>
                    <p className="mt-4 text-sm font-semibold" style={{ color: ink }}>
                      No notes found
                    </p>
                    <p
                      className="mx-auto mt-1.5 max-w-[34ch] text-xs leading-relaxed"
                      style={{ color: dim }}
                    >
                      Nothing in your {notes.length} notes contains “{query.trim()}”. Try a shorter
                      word, or clear the search to see everything again.
                    </p>
                    <Button
                      type="button"
                      onClick={function () {
                        setQuery("");
                      }}
                      className="np-ring np-btn mt-5 inline-flex h-10 items-center px-4 text-xs font-bold"
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid " + brand.primaryColor + "66",
                        color: brand.primaryColor,
                        borderRadius: brand.radius,
                      }}
                    >
                      Clear search
                    </Button>
                  </div>
                ) : (
                  <ul
                    data-testid="sorted-by-most-recent-activity-list"
                    className="max-h-[560px] overflow-y-auto p-2"
                  >
                    {visible.map(function (n, i) {
                      const isSel = n.id === selectedId;
                      return (
                        <li
                          key={n.id}
                          className="np-rise"
                          style={{ animationDelay: Math.min(i, 8) * 0.025 + "s" }}
                        >
                          <button
                            type="button"
                            data-wf={"i-2-0-" + i}
                            onClick={function () {
                              selectNote(n.id);
                            }}
                            aria-current={isSel ? "true" : undefined}
                            className="np-row np-ring relative w-full px-4 py-3.5 pl-5 text-left"
                            style={{
                              borderRadius: 12,
                              backgroundColor: isSel ? "rgba(255,255,255,0.095)" : "transparent",
                            }}
                          >
                            <span
                              aria-hidden="true"
                              className="absolute bottom-3 left-1.5 top-3 w-[3px] rounded-full"
                              style={{
                                background: isSel ? gradient : "transparent",
                                boxShadow: isSel ? "0 0 18px " + brand.accentColor + "99" : "none",
                              }}
                            />
                            <span className="flex items-center gap-2">
                              <span
                                className="truncate text-[15px] font-semibold"
                                style={{ color: isSel ? ink : "#d7e5f7" }}
                              >
                                {titleOf(n.content)}
                              </span>
                              {n.unsynced ? (
                                <Badge
                                  className="shrink-0 px-2 py-0.5 text-[10px] font-bold"
                                  style={{
                                    backgroundColor: "#fb718524",
                                    color: "#fda4af",
                                    border: "1px solid #fb718555",
                                    borderRadius: 999,
                                  }}
                                >
                                  Unsaved
                                </Badge>
                              ) : null}
                            </span>
                            <span
                              className="mt-1 block truncate text-[13px]"
                              style={{ color: dim }}
                            >
                              {snippetOf(n.content)}
                            </span>
                            <span
                              className="mt-1.5 flex items-center gap-1.5 text-[11px]"
                              style={{
                                color: isSel ? brand.primaryColor : "#7e94b2",
                                fontVariantNumeric: "tabular-nums",
                              }}
                            >
                              <Clock className="h-3 w-3" aria-hidden="true" />
                              updated {relTime(n.updated_at)}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            )}
          </div>

          {/* Right column: editor + meta + delete */}
          <div className="col-span-12 lg:col-span-8">
            <div className="p-5 sm:p-6" style={panelStyle}>
              {loading ? (
                <div className="np-shimmer space-y-3 py-6">
                  <div
                    className="h-4 w-48 rounded-full"
                    style={{ backgroundColor: "rgba(255,255,255,0.14)" }}
                  />
                  <div
                    className="h-[320px] w-full rounded-2xl"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                  />
                  <p className="text-xs" style={{ color: dim }}>
                    Opening your most recent note…
                  </p>
                </div>
              ) : creatingNote ? (
                <React.Fragment>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <Label
                      htmlFor="note-body"
                      className="text-[13px] font-bold"
                      style={{ color: ink }}
                    >
                      Note text (plain text only)
                    </Label>
                    <span
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold"
                      style={{
                        backgroundColor:
                          (createLoading
                            ? brand.accentColor
                            : createError
                              ? "#fb7185"
                              : brand.primaryColor) + "1f",
                        border:
                          "1px solid " +
                          (createLoading
                            ? brand.accentColor
                            : createError
                              ? "#fb7185"
                              : brand.primaryColor) +
                          "55",
                        color: createLoading
                          ? brand.accentColor
                          : createError
                            ? "#fda4af"
                            : brand.primaryColor,
                      }}
                      role="status"
                      aria-live="polite"
                    >
                      {createLoading ? (
                        <span
                          className="np-pulse inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: brand.accentColor }}
                          aria-hidden="true"
                        />
                      ) : createError ? (
                        <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {createLoading
                        ? "Saving to the server…"
                        : createError
                          ? "Not saved"
                          : "Saved"}
                    </span>
                  </div>

                  {createError ? (
                    <div
                      className="np-rise mb-3 flex flex-wrap items-start gap-3 p-4"
                      style={{
                        backgroundColor: "#fb718514",
                        border: "1px solid #fb718555",
                        borderRadius: brand.radius,
                      }}
                      role="alert"
                    >
                      <AlertCircle
                        className="mt-0.5 h-5 w-5 shrink-0"
                        aria-hidden="true"
                        style={{ color: "#fda4af" }}
                      />
                      <div className="min-w-[200px] flex-1">
                        <p className="text-sm font-semibold" style={{ color: "#ffe4e6" }}>
                          Changes not saved — check your connection
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <Textarea
                    id="note-body"
                    data-testid="note-text-plain-text-only-input"
                    ref={textareaRef}
                    value={newNoteText}
                    onChange={function (e) {
                      setNewNoteText(e.target.value);
                    }}
                    onBlur={submitNewNote}
                    spellCheck="true"
                    disabled={createLoading}
                    placeholder="Start typing. Plain text, saved as you go."
                    aria-describedby="note-help"
                    className="np-ring np-ta min-h-[360px] w-full resize-y p-5 text-[15px] leading-[1.65]"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border: hair,
                      borderRadius: brand.radius,
                      color: ink,
                      whiteSpace: "pre-wrap",
                    }}
                  />
                  <p id="note-help" className="mt-2 text-xs" style={{ color: dim }}>
                    Plain text only — no formatting, checklists, images or attachments.
                  </p>
                </React.Fragment>
              ) : !selected ? (
                <div className="flex min-h-[340px] flex-col items-center justify-center px-6 text-center">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full"
                    style={{ backgroundColor: glassBg2, border: hair }}
                  >
                    <FileText
                      className="h-6 w-6"
                      aria-hidden="true"
                      style={{ color: brand.primaryColor }}
                    />
                  </div>
                  <h2 className="mt-5 text-xl font-bold" style={{ fontFamily: brand.fontHeading }}>
                    Nothing open
                  </h2>
                  <p className="mt-2 max-w-[44ch] text-sm leading-relaxed" style={{ color: dim }}>
                    Pick a note from the list to read it, or start a new one — it saves itself as
                    you type.
                  </p>
                </div>
              ) : (
                <React.Fragment>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <Label
                      htmlFor="note-body"
                      className="text-[13px] font-bold"
                      style={{ color: ink }}
                    >
                      Note text (plain text only)
                    </Label>
                    <span
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold"
                      style={{
                        backgroundColor: saveMeta.tone + "1f",
                        border: "1px solid " + saveMeta.tone + "55",
                        color: saveMeta.tone,
                      }}
                      role="status"
                      aria-live="polite"
                    >
                      {saveState === "saved" ? (
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : saveState === "error" ? (
                        <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <span
                          className="np-pulse inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: saveMeta.tone }}
                          aria-hidden="true"
                        />
                      )}
                      {saveMeta.label}
                    </span>
                  </div>

                  {saveState === "error" ? (
                    <div
                      className="np-rise mb-3 flex flex-wrap items-start gap-3 p-4"
                      style={{
                        backgroundColor: "#fb718514",
                        border: "1px solid #fb718555",
                        borderRadius: brand.radius,
                      }}
                      role="alert"
                    >
                      <AlertCircle
                        className="mt-0.5 h-5 w-5 shrink-0"
                        aria-hidden="true"
                        style={{ color: "#fda4af" }}
                      />
                      <div className="min-w-[200px] flex-1">
                        <p className="text-sm font-semibold" style={{ color: "#ffe4e6" }}>
                          This change hasn’t reached the server
                        </p>
                        <p className="mt-1 text-[13px] leading-relaxed" style={{ color: dim }}>
                          The connection dropped while saving. Your text is still here on screen and
                          nothing has been lost — keep typing and it will try the server again, or
                          leave this tab open until it goes through.
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <Textarea
                    id="note-body"
                    data-wf="b-2-1"
                    data-testid="note-text-plain-text-only-input"
                    ref={textareaRef}
                    value={draft}
                    onChange={onDraftChange}
                    onBlur={flushBeforeLeaving}
                    spellCheck="true"
                    placeholder="Start typing. Plain text, saved as you go."
                    aria-describedby="note-help note-meta"
                    className="np-ring np-ta min-h-[360px] w-full resize-y p-5 text-[15px] leading-[1.65]"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border: hair,
                      borderRadius: brand.radius,
                      color: ink,
                      whiteSpace: "pre-wrap",
                    }}
                  />
                  <p id="note-help" className="mt-2 text-xs" style={{ color: dim }}>
                    Plain text only — no formatting, checklists, images or attachments.
                  </p>

                  {/* Row 4 */}
                  <div
                    data-wf="b-3-1"
                    id="note-meta"
                    className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 border-t pt-4 text-[13px]"
                    style={{
                      borderColor: "rgba(255,255,255,0.1)",
                      color: dim,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    <span>Created {absTime(selected.created_at)}</span>
                    <span aria-hidden="true">·</span>
                    <span>Last updated {absTime(selected.updated_at)}</span>
                    <span aria-hidden="true">·</span>
                    <span style={{ color: saveState === "error" ? "#fda4af" : brand.primaryColor }}>
                      {saveState === "error"
                        ? "Not saved — last synced " + clockTime(lastSynced)
                        : "Saved automatically"}
                    </span>
                  </div>

                  {/* Row 5 */}
                  <div className="mt-5">
                    <Button
                      type="button"
                      data-wf="b-4-0"
                      data-testid="delete-note-btn"
                      ref={deleteBtnRef}
                      onClick={function () {
                        setConfirmOpen(true);
                      }}
                      className="np-ring np-btn inline-flex h-11 w-full items-center justify-center gap-2 px-5 text-sm font-bold sm:w-auto"
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid rgba(251,113,133,0.5)",
                        color: "#fda4af",
                        borderRadius: brand.radius,
                      }}
                    >
                      <Trash className="h-4 w-4" aria-hidden="true" />
                      Delete note
                    </Button>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs" style={{ color: "#6e84a2" }}>
          Private to one owner · free, with no billing · sessions end after 30 minutes idle or when
          you sign out
        </p>
      </div>

      {/* Row 6 — confirmation */}
      {confirmOpen && selected ? (
        <div
          data-wf="b-5-0"
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
        >
          <div
            aria-hidden="true"
            onClick={closeConfirm}
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(3,10,22,0.74)", backdropFilter: "blur(6px)" }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-desc"
            data-testid="delete-this-note-it-will-be-remove-modal"
            onKeyDown={onDialogKeyDown}
            className="np-pop relative w-full max-w-md p-6"
            style={{
              backgroundColor: "rgba(16,30,54,0.92)",
              border: hair,
              borderRadius: brand.radius,
              boxShadow: "0 40px 90px -20px " + brand.accentColor + "66",
              backdropFilter: "blur(20px)",
            }}
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full"
              style={{ backgroundColor: "#fb718524", border: "1px solid rgba(251,113,133,0.45)" }}
            >
              <Trash className="h-5 w-5" aria-hidden="true" style={{ color: "#fda4af" }} />
            </div>
            <h2
              id="delete-title"
              className="mt-4 text-[22px] font-bold leading-snug"
              style={{ fontFamily: brand.fontHeading }}
            >
              Delete this note?
            </h2>
            <p id="delete-desc" className="mt-2 text-sm leading-relaxed" style={{ color: dim }}>
              It will be removed permanently — “{titleOf(selected.content)}” won’t come back when
              you reload or sign in from another browser.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                data-wf="i-5-0-1"
                ref={cancelRef}
                onClick={closeConfirm}
                disabled={deleting}
                className="np-ring np-btn h-11 px-5 text-sm font-bold"
                style={{
                  backgroundColor: "transparent",
                  border: hair,
                  color: ink,
                  borderRadius: brand.radius,
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                data-wf="i-5-0-0"
                ref={confirmDeleteRef}
                onClick={confirmDelete}
                disabled={deleting}
                className="np-ring np-btn inline-flex h-11 items-center justify-center gap-2 px-5 text-sm font-bold"
                style={{
                  backgroundColor: "#fda4af",
                  color: "#3f0a14",
                  border: "none",
                  borderRadius: brand.radius,
                  opacity: deleting ? 0.85 : 1,
                }}
              >
                {deleting ? (
                  <span
                    className="np-pulse inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: "#3f0a14" }}
                    aria-hidden="true"
                  />
                ) : (
                  <Trash className="h-4 w-4" aria-hidden="true" />
                )}
                {deleting ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
