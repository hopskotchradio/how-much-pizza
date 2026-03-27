import { useState, useMemo, useEffect, useCallback } from 'react';
import { type FoodType, FOOD_CONFIGS, HUNGER_LABELS } from './types';
import { calculate } from './calculator';
import { DominosPanel } from './DominosPanel';
import { LIGHT_THEMES, DARK_THEMES, applyTheme } from './themes';
import './App.css';

function App() {
  const [foodType, setFoodType] = useState<FoodType>('pizza');
  const [adults, setAdults] = useState(4);
  const [kids, setKids] = useState(0);
  const [hungerLevel, setHungerLevel] = useState(2);
  const [hasSides, setHasSides] = useState(false);
  const [wantLeftovers, setWantLeftovers] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hmp-dark-mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const themes = darkMode ? DARK_THEMES : LIGHT_THEMES;

  // Apply theme when food type or dark mode changes
  useEffect(() => {
    applyTheme(themes[foodType]);
  }, [foodType, darkMode, themes]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('hmp-dark-mode', String(next));
      return next;
    });
  }, []);

  const result = useMemo(
    () => calculate({ foodType, adults, kids, hungerLevel, hasSides, wantLeftovers }),
    [foodType, adults, kids, hungerLevel, hasSides, wantLeftovers]
  );

  const hungerInfo = HUNGER_LABELS[hungerLevel];
  const config = FOOD_CONFIGS[foodType];
  // Food type theme names for the label
  const THEME_NAMES: Record<FoodType, string> = {
    pizza: '🍕 Margherita',
    tacos: '🌮 Fiesta',
    subs: '🥖 Deli Fresh',
    wings: '🍗 Buffalo',
    chinese: '🥡 Lucky Red',
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <h1>{config.emoji} How Much {config.label}?</h1>
          <button
            className="mode-toggle"
            onClick={toggleDarkMode}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <p className="subtitle">Stop guessing. Start eating.</p>
        <div className="theme-badge">
          {THEME_NAMES[foodType]} {darkMode ? '(dark)' : ''}
        </div>
      </header>

      <main className="calculator">
        {/* Food Type — "Choose Your Topping" */}
        <section className="section">
          <label className="section-label">🎨 Choose your topping</label>
          <div className="food-grid">
            {(Object.keys(FOOD_CONFIGS) as FoodType[]).map((type) => (
              <button
                key={type}
                className={`food-btn ${foodType === type ? 'active' : ''}`}
                onClick={() => setFoodType(type)}
              >
                <span className="food-emoji">{FOOD_CONFIGS[type].emoji}</span>
                <span className="food-label">{FOOD_CONFIGS[type].label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* People */}
        <section className="section">
          <label className="section-label">How many people?</label>
          <div className="people-row">
            <div className="counter">
              <span className="counter-label">Adults</span>
              <div className="counter-controls">
                <button
                  className="counter-btn"
                  onClick={() => setAdults(Math.max(0, adults - 1))}
                >
                  −
                </button>
                <span className="counter-value">{adults}</span>
                <button
                  className="counter-btn"
                  onClick={() => setAdults(adults + 1)}
                >
                  +
                </button>
              </div>
            </div>
            <div className="counter">
              <span className="counter-label">Kids</span>
              <div className="counter-controls">
                <button
                  className="counter-btn"
                  onClick={() => setKids(Math.max(0, kids - 1))}
                >
                  −
                </button>
                <span className="counter-value">{kids}</span>
                <button
                  className="counter-btn"
                  onClick={() => setKids(kids + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Hunger Scale */}
        <section className="section">
          <label className="section-label">
            How hungry is everyone? {hungerInfo.emoji}
          </label>
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={hungerLevel}
            onChange={(e) => setHungerLevel(Number(e.target.value))}
            className="hunger-slider"
          />
          <div className="hunger-label">{hungerInfo.label}</div>
          <div className="hunger-ticks">
            {HUNGER_LABELS.map((h) => (
              <span
                key={h.value}
                className={`hunger-tick ${hungerLevel === h.value ? 'active' : ''}`}
              >
                {h.emoji}
              </span>
            ))}
          </div>
        </section>

        {/* Toggles */}
        <section className="section">
          <div className="toggle-row">
            <label className="toggle">
              <input
                type="checkbox"
                checked={hasSides}
                onChange={(e) => setHasSides(e.target.checked)}
              />
              <span className="toggle-label">🥗 Getting sides too</span>
            </label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={wantLeftovers}
                onChange={(e) => setWantLeftovers(e.target.checked)}
              />
              <span className="toggle-label">📦 I want leftovers</span>
            </label>
          </div>
        </section>

        {/* Result */}
        <section className="result">
          <div className="result-emoji">{config.emoji}</div>
          <div className="result-main">
            {result.units > 0 ? (
              <>
                <div className="result-number">{result.units}</div>
                <div className="result-unit">
                  {result.units === 1 ? config.unit : config.unitPlural}
                </div>
                <div className="result-detail">
                  {result.totalServings} {config.description} total ·{' '}
                  {result.servingsPerPerson} per person
                  {result.leftoverServings > 0 && (
                    <> · ~{result.leftoverServings} leftover</>
                  )}
                </div>
              </>
            ) : (
              <div className="result-unit">{result.summary}</div>
            )}
          </div>
          {result.tip && <div className="result-tip">{result.tip}</div>}
        </section>

        {/* Domino's Integration */}
        {foodType === 'pizza' && (
          <DominosPanel
            adults={adults}
            kids={kids}
            hungerLevel={hungerLevel}
            hasSides={hasSides}
            wantLeftovers={wantLeftovers}
          />
        )}
      </main>

      <footer className="footer">
        <p>
          Made with {config.emoji} by{' '}
          <a href="https://github.com/hopskotchradio" target="_blank" rel="noopener">
            gh0stam
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
