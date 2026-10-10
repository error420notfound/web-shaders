import { useState } from "react";
import { registry, categories, humanize } from "../../data/registry";
import { Icon } from "../controls/Primitives";
export function Library({ onAdd }: { onAdd: (type: string) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All effects");
  const filtered = registry.filter(
    (e) =>
      (category === "All effects" || e.category === category) &&
      `${e.name} ${humanize(e.name)} ${e.description}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <section className="library">
      <header className="panel-heading">
        <h2>Effect library</h2>
        <span>200</span>
      </header>
      <label className="search">
        <Icon name="search" />
        <input
          aria-label="Search effects"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find an effect…"
        />
        <kbd>/</kbd>
      </label>
      <select
        className="category-select"
        aria-label="Effect category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {["All effects", ...categories].map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <div className="effect-list">
        {filtered.map((e) => (
          <button
            key={e.name}
            className="effect-row"
            onClick={() => onAdd(e.name)}
            title={`${e.description}${e.requiresChild ? " • Wraps the selected layer; empty until child content is added." : ""}`}
          >
            <span
              className={`effect-symbol cat-${e.category.replace(/ /g, "")}`}
            >
              <Icon
                name={
                  e.requiresChild
                    ? "intersect"
                    : e.category === "Shapes"
                      ? "circle"
                      : e.category === "Interactive"
                        ? "cursor"
                        : "stars"
                }
              />
            </span>
            <span>
              <strong>{humanize(e.name)}</strong>
              <small>
                {e.category}
                {e.requiresChild ? " · child effect" : ""}
              </small>
            </span>
            <Icon name="plus" />
          </button>
        ))}
        {!filtered.length && (
          <div className="empty-state">
            No matching effects.
            <br />
            Try another search.
          </div>
        )}
      </div>
      <div className="library-caption">Verified from Shaders 4.0.4</div>
    </section>
  );
}
