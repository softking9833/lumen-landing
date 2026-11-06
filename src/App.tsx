import { useEffect, useRef, useState, type CSSProperties } from 'react'
import heroBudget from './assets/hero-morning-kitchen.jpg'
import goalsDesk from './assets/goals-desk.jpg'
import voiceMaya from './assets/voice-sarah.jpg'
import './App.css'

type DayBeat = {
  time: string
  title: string
  detail: string
  spend: number
  save: number
  tone: string
}

const dayBeats: DayBeat[] = [
  {
    time: '6:12',
    title: 'Bills held',
    detail:
      'Rent, phone, and transit come out first from the $4,280 deposit—before anything discretionary.',
    spend: 0,
    save: 120,
    tone: 'var(--moss)',
  },
  {
    time: '7:40',
    title: 'Budgeted coffee',
    detail:
      '$4.50 latte. Logged under Lifestyle. Savings goal stays untouched.',
    spend: 4.5,
    save: 0,
    tone: 'var(--sage)',
  },
  {
    time: '12:20',
    title: 'Grocery run',
    detail:
      '$36.20 groceries against this week’s food budget. Lumen shows what remains until next payday.',
    spend: 36.2,
    save: 0,
    tone: 'var(--mist)',
  },
  {
    time: '18:05',
    title: 'Transit home',
    detail:
      '$2.75 commute. Bills already covered; emergency fund still climbing.',
    spend: 2.75,
    save: 0,
    tone: 'var(--leaf)',
  },
]

const AFTER_BILLS = 2249.4
const SAVE_START = 696
const SAVE_GOAL = 1200

function money(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3c3.6 2.7 5.8 5.9 5.8 9.5A5.8 5.8 0 0 1 12 18.3 5.8 5.8 0 0 1 6.2 12.5C6.2 8.9 8.4 5.7 12 3z" />
    </svg>
  )
}

function useReveal() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const nodes = root.querySelectorAll<HTMLElement>('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return rootRef
}

function BudgetDay() {
  const [active, setActive] = useState(0)
  const spent = dayBeats
    .slice(0, active + 1)
    .reduce((sum, b) => sum + b.spend, 0)
  const saved =
    SAVE_START +
    dayBeats.slice(0, active + 1).reduce((sum, b) => sum + b.save, 0)
  const left = AFTER_BILLS - spent
  const pct = Math.min(100, Math.round((saved / SAVE_GOAL) * 100))

  return (
    <section className="planner" id="payday">
      <div className="shell planner__grid">
        <div className="planner__copy reveal">
          <p className="eyebrow">Will rent bounce again?</p>
          <h2 className="display">
            Cover bills on payday—then spend what’s <em>actually</em> left.
          </h2>
          <p>
            Tap through a sample Tuesday. Fixed bills clear first. Daily spend
            draws from what’s left. A set amount moves into savings
            automatically.
          </p>
          <dl className="planner__legend">
            <div>
              <dt>Budget left</dt>
              <dd>{money(left)}</dd>
            </div>
            <div>
              <dt>Savings goal</dt>
              <dd>
                {money(saved)}
                <span> / {money(SAVE_GOAL)}</span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="planner__board reveal">
          <div className="planner__hours" aria-hidden="true">
            <span>6am</span>
            <span>9am</span>
            <span>12pm</span>
            <span>3pm</span>
            <span>6pm</span>
          </div>
          <div
            className="planner__lanes"
            role="tablist"
            aria-label="Budget day timeline"
          >
            {dayBeats.map((beat, index) => (
              <button
                key={beat.time}
                type="button"
                role="tab"
                aria-selected={index === active}
                className={
                  index === active ? 'planner__bar is-active' : 'planner__bar'
                }
                style={
                  {
                    '--bar': beat.tone,
                    gridColumn: `${index + 1} / span 1`,
                  } as CSSProperties
                }
                onClick={() => setActive(index)}
              >
                <span className="planner__bar-time">{beat.time}</span>
                <span className="planner__bar-title">{beat.title}</span>
              </button>
            ))}
          </div>
          <div className="planner__detail" role="tabpanel">
            <p>{dayBeats[active].detail}</p>
            <div
              className="planner__track"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Savings goal progress"
            >
              <span style={{ width: `${pct}%` }} />
            </div>
            <p className="planner__track-label">
              Emergency / trip savings · {pct}% funded
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const pageRef = useReveal()

  return (
    <div className="page" ref={pageRef}>
      <header className="site-header">
        <div className="shell site-header__inner">
          <a className="logo" href="#top">
            <LogoMark />
            Lumen
          </a>
          <nav className="nav" aria-label="Primary">
            <a href="#payday">How it works</a>
            <a href="#pricing">Cost</a>
            <a href="#features">What you get</a>
            <a href="#scenarios">Scenarios</a>
          </nav>
          <div className="header-actions">
            <a className="header-login" href="#pricing">
              Log in
            </a>
            <a className="btn btn--cream header-cta" href="#pricing">
              Start budgeting
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        {/* 1. What is this / who is it for */}
        <section className="hero">
          <div className="hero__stage">
            <div className="hero__media" aria-hidden="true">
              <img
                src={heroBudget}
                alt=""
                width={1920}
                height={1080}
                fetchPriority="high"
              />
              <div className="hero__veil" />
            </div>
            <div className="shell hero__content">
              <p className="brand-mark">Lumen</p>
              <h1 className="hero__headline">
                Budget, pay bills, and save—without losing the plot mid-month.
              </h1>
              <p className="hero__lede">
                For young professionals on a salary: track spending, cover rent
                and utilities when payday hits, and grow savings before lifestyle
                spend kicks in.
              </p>
              <div className="hero__actions">
                <a className="btn btn--cream" href="#pricing">
                  See pricing
                </a>
                <a className="btn btn--ghost-light" href="#payday">
                  Will my bills get covered?
                </a>
              </div>
            </div>
          </div>

          <div className="shell hero__ledger reveal">
            <div className="ledger-panel" aria-label="Sample payday budget">
              <div className="ledger-panel__head">
                <p className="ledger-panel__title">Payday budget · biweekly</p>
                <p className="ledger-panel__pay">Deposit {money(4280)}</p>
              </div>
              <div className="ledger-panel__cols">
                <div>
                  <p className="ledger-panel__label">Bills &amp; essentials</p>
                  <ul>
                    <li>
                      <span>Rent reserve</span>
                      <strong>−$1,650</strong>
                    </li>
                    <li>
                      <span>Utilities + phone</span>
                      <strong>−$186</strong>
                    </li>
                    <li>
                      <span>Transit</span>
                      <strong>−$75</strong>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="ledger-panel__label">Plan &amp; leftover</p>
                  <ul>
                    <li>
                      <span>Savings auto-transfer</span>
                      <strong>−$120</strong>
                    </li>
                    <li>
                      <span>Food budget</span>
                      <strong>−$280</strong>
                    </li>
                    <li className="is-remain">
                      <span>Safe to spend</span>
                      <strong>{money(AFTER_BILLS)}</strong>
                    </li>
                  </ul>
                </div>
              </div>
              <p className="ledger-panel__note">
                Sample ledger for this demo · not a live account
              </p>
            </div>
          </div>
        </section>

        {/* 2. Customer question: will bills / rent get covered? */}
        <BudgetDay />

        {/* 3. Customer question: what does it cost? (moved earlier on purpose) */}
        <section className="pricing" id="pricing">
          <div className="shell pricing__wrap">
            <header className="pricing__head reveal">
              <p className="eyebrow eyebrow--light">What does it cost?</p>
              <h2 className="display display--light">
                Free to budget and cover bills. Pro when you need more goals.
              </h2>
              <p>
                Most people start on Free. Upgrade only if you want unlimited
                savings goals or a shared household budget.
              </p>
            </header>

            <div className="pricing__compare reveal" role="table">
              <div className="pricing__compare-row pricing__compare-row--head">
                <div role="columnheader">Included</div>
                <div role="columnheader">
                  Free
                  <span>{money(0)}/mo</span>
                </div>
                <div role="columnheader">
                  Pro
                  <span>{money(9.99)}/mo</span>
                </div>
              </div>
              <div className="pricing__compare-row">
                <div role="rowheader">Category budgets &amp; spend tracking</div>
                <div role="cell">Yes</div>
                <div role="cell">Yes</div>
              </div>
              <div className="pricing__compare-row">
                <div role="rowheader">Payday bill holds (rent, utilities…)</div>
                <div role="cell">Yes</div>
                <div role="cell">Yes</div>
              </div>
              <div className="pricing__compare-row">
                <div role="rowheader">Named savings goals + auto-transfer</div>
                <div role="cell">1 goal</div>
                <div role="cell">Unlimited</div>
              </div>
              <div className="pricing__compare-row">
                <div role="rowheader">Shared household budget</div>
                <div role="cell">—</div>
                <div role="cell">Up to 2 people</div>
              </div>
              <div className="pricing__compare-row">
                <div role="rowheader">Bill due reminders &amp; weekly review</div>
                <div role="cell">Basic</div>
                <div role="cell">Full</div>
              </div>
              <div className="pricing__compare-row pricing__compare-row--cta">
                <div role="rowheader" />
                <div role="cell">
                  <a className="btn btn--cream" href="#top">
                    Use Free
                  </a>
                </div>
                <div role="cell">
                  <a className="btn btn--leaf" href="#top">
                    Try Pro free 14 days
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Customer question: what exactly do I get? */}
        <section className="pillars" id="features">
          <div className="shell">
            <header className="pillars__head reveal">
              <p className="eyebrow">What do I get?</p>
              <h2 className="display">
                Four jobs Lumen is built to do.
              </h2>
            </header>
            <ol className="pillars__list">
              <li className="reveal">
                <h3>Budget categories that match your paycheck</h3>
                <p>
                  Split income into bills, groceries, transport, and fun money.
                  Adjust once; Lumen recalculates what you can still spend.
                </p>
              </li>
              <li className="reveal">
                <h3>Bill coverage on payday—not the due-date panic</h3>
                <p>
                  Hold rent, utilities, and subscriptions the morning direct
                  deposit lands so mid-month surprises don’t bounce.
                </p>
              </li>
              <li className="reveal">
                <h3>Savings goals with automatic transfers</h3>
                <p>
                  Name the goal, set a dollar amount per payday, and keep daily
                  spending from quietly draining it.
                </p>
              </li>
              <li className="reveal">
                <h3>Clear spending history you can act on</h3>
                <p>
                  See where the week went—coffee, rides, groceries—against the
                  budget you set, in plain language.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* 5. Illustrative scenarios — clearly labeled, not fake social proof */}
        <section className="voices" id="scenarios">
          <div className="shell">
            <header className="voices__head reveal">
              <p className="eyebrow">Example scenarios</p>
              <h2 className="display">
                How budgeting shows up in a normal month.
              </h2>
              <p className="voices__disclaimer">
                Illustrative scenarios for this demo — not verified customer
                quotes or real accounts. Replace with real member stories when
                available.
              </p>
            </header>
            <div className="voices__grid">
              <article className="voice reveal">
                <p className="voice__tag">Illustrative · Scenario A</p>
                <img src={voiceMaya} alt="" width={72} height={72} />
                <blockquote>
                  “Rent used to clear after a loud weekend. With payday holds,
                  rent and utilities are set aside first. Over four months, $810
                  builds toward a flight home—without cutting coffee entirely.”
                </blockquote>
                <footer>
                  <strong>Composite: first-job renter</strong>
                  <span>Focus: rent timing + trip savings</span>
                </footer>
              </article>
              <article className="voice reveal">
                <p className="voice__tag">Illustrative · Scenario B</p>
                <img src={goalsDesk} alt="" width={72} height={72} />
                <blockquote>
                  “Shared grocery and internet categories with a partner,
                  separate fun money. Fewer ‘who spent what’ arguments because
                  the budget already answered.”
                </blockquote>
                <footer>
                  <strong>Composite: shared household</strong>
                  <span>Focus: joint bills + separate lifestyle budgets</span>
                </footer>
              </article>
            </div>
          </div>
        </section>

        <section className="close">
          <div className="shell close__inner reveal">
            <h2 className="display">Ready to put payday in order?</h2>
            <p>
              Start on Free: set bill holds, one savings goal, and category
              budgets. Upgrade later only if you need more.
            </p>
            <a className="btn btn--forest" href="#pricing">
              Back to pricing
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell site-footer__inner">
          <a className="logo logo--footer" href="#top">
            <LogoMark />
            Lumen
          </a>
          <nav aria-label="Footer">
            <a href="#payday">How it works</a>
            <a href="#pricing">Cost</a>
            <a href="#features">What you get</a>
            <a href="#scenarios">Scenarios</a>
          </nav>
          <p>
            © {new Date().getFullYear()} Lumen · Demo landing page with
            illustrative content
          </p>
        </div>
      </footer>
    </div>
  )
}
