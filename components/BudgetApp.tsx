"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type AppKey =
  | "finance"
  | "freelance"
  | "student"
  | "cv"
  | "github"
  | "stock"
  | "event";

type Transaction = {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
};

type Budget = { category: string; limit: number };

type Client = { id: number; name: string; email: string };
type Project = { id: number; name: string; clientId: number; status: "todo" | "doing" | "done" };
type Task = { id: number; title: string; done: boolean; projectId: number };

type Topic = { id: number; name: string; correct: number; total: number };
type Question = { id: number; topicId: number; text: string; options: string[]; answer: number };

type Product = { id: number; name: string; stock: number; min: number; price: number };
type EventItem = { id: number; title: string; date: string; capacity: number; attendees: { id: number; name: string; checkedIn: boolean }[] };

const apps: { key: AppKey; label: string; emoji: string }[] = [
  { key: "finance", label: "Kişisel Finans", emoji: "💸" },
  { key: "freelance", label: "Freelance CRM", emoji: "🧾" },
  { key: "student", label: "Öğrenci Platformu", emoji: "📚" },
  { key: "cv", label: "CV & Portföy", emoji: "🪪" },
  { key: "github", label: "GitHub Analiz", emoji: "🐙" },
  { key: "stock", label: "Stok & Satış", emoji: "📦" },
  { key: "event", label: "Etkinlik", emoji: "🎟️" },
];

const money = (n: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);

const uid = () => Date.now() + Math.floor(Math.random() * 1000);

export default function BudgetApp() {
  const [active, setActive] = useState<AppKey>("finance");

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, title: "Maaş", amount: 42000, type: "income", category: "Maaş" },
    { id: 2, title: "Kira", amount: 12000, type: "expense", category: "Ev" },
    { id: 3, title: "Market", amount: 2800, type: "expense", category: "Gıda" },
  ]);
  const [budgets] = useState<Budget[]>([
    { category: "Gıda", limit: 6000 },
    { category: "Ev", limit: 14000 },
    { category: "Ulaşım", limit: 2500 },
  ]);
  const [txForm, setTxForm] = useState({ title: "", amount: "", type: "expense", category: "Gıda" });

  const [clients, setClients] = useState<Client[]>([{ id: 1, name: "Ayşe Yazılım", email: "ayse@ornek.com" }]);
  const [projects, setProjects] = useState<Project[]>([{ id: 1, name: "Landing sayfası", clientId: 1, status: "doing" }]);
  const [tasks, setTasks] = useState<Task[]>([{ id: 1, title: "Hero section", done: false, projectId: 1 }]);
  const [clientForm, setClientForm] = useState({ name: "", email: "" });
  const [projectForm, setProjectForm] = useState({ name: "", clientId: "1" });
  const [taskForm, setTaskForm] = useState({ title: "", projectId: "1" });

  const [topics, setTopics] = useState<Topic[]>([
    { id: 1, name: "Matematik", correct: 0, total: 0 },
    { id: 2, name: "Türkçe", correct: 0, total: 0 },
    { id: 3, name: "Fen", correct: 0, total: 0 },
  ]);
  const questions: Question[] = [
    { id: 1, topicId: 1, text: "12 x 6 kaçtır?", options: ["62", "72", "66"], answer: 1 },
    { id: 2, topicId: 2, text: "'de/da' ayrı yazımı doğru olan?", options: ["evdede", "evde de", "evdede"], answer: 1 },
    { id: 3, topicId: 3, text: "Su kaç derecede kaynar?", options: ["90", "100", "120"], answer: 1 },
  ];
  const [quizIndex, setQuizIndex] = useState(0);
  const [timer, setTimer] = useState(60);
  const [quizRunning, setQuizRunning] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "Muhammed Said",
    title: "Frontend Developer",
    summary: "React ve Next.js ile ürün geliştiren geliştirici.",
    skills: "React,Next.js,TypeScript",
    projects: "Finans Dashboard;Freelance Panel",
    template: "minimal",
  });

  const [repoInput, setRepoInput] = useState("vercel/next.js");
  const [repoStats, setRepoStats] = useState<{ stars: number; forks: number; openIssues: number; watchers: number } | null>(null);
  const [repoState, setRepoState] = useState<{ loading: boolean; error: string }>({ loading: false, error: "" });

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Notebook", stock: 15, min: 5, price: 45 },
    { id: 2, name: "Kulaklık", stock: 4, min: 5, price: 500 },
  ]);
  const [sales, setSales] = useState<{ id: number; productId: number; quantity: number; total: number }[]>([]);
  const [productForm, setProductForm] = useState({ name: "", stock: "", min: "", price: "" });
  const [saleForm, setSaleForm] = useState({ productId: "1", quantity: "1" });

  const [events, setEvents] = useState<EventItem[]>([
    { id: 1, title: "Frontend Meetup", date: "2026-10-10", capacity: 30, attendees: [{ id: 1, name: "Elif", checkedIn: false }] },
  ]);
  const [eventForm, setEventForm] = useState({ title: "", date: "", capacity: "" });
  const [registerForm, setRegisterForm] = useState({ eventId: "1", name: "" });

  useEffect(() => {
    if (!quizRunning) return;
    if (timer <= 0) {
      setQuizRunning(false);
      return;
    }
    const t = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [quizRunning, timer]);

  const income = useMemo(() => transactions.filter((x) => x.type === "income").reduce((a, x) => a + x.amount, 0), [transactions]);
  const expense = useMemo(() => transactions.filter((x) => x.type === "expense").reduce((a, x) => a + x.amount, 0), [transactions]);

  const weakTopics = useMemo(() => {
    return topics
      .map((t) => ({ ...t, rate: t.total ? t.correct / t.total : 0 }))
      .sort((a, b) => a.rate - b.rate)
      .slice(0, 2);
  }, [topics]);

  function addTransaction(e: FormEvent) {
    e.preventDefault();
    const amount = Number(txForm.amount);
    if (!txForm.title || amount <= 0) return;
    setTransactions((prev) => [{ id: uid(), title: txForm.title, amount, type: txForm.type as "income" | "expense", category: txForm.category }, ...prev]);
    setTxForm({ ...txForm, title: "", amount: "" });
  }

  function addClient(e: FormEvent) {
    e.preventDefault();
    if (!clientForm.name || !clientForm.email) return;
    const nextClientId = uid();
    setClients((prev) => [...prev, { id: nextClientId, ...clientForm }]);
    if (!projectForm.clientId) setProjectForm((prev) => ({ ...prev, clientId: String(nextClientId) }));
    setClientForm({ name: "", email: "" });
  }

  function addProject(e: FormEvent) {
    e.preventDefault();
    if (!projectForm.name || !projectForm.clientId) return;
    setProjects((prev) => [...prev, { id: uid(), name: projectForm.name, clientId: Number(projectForm.clientId), status: "todo" }]);
    setProjectForm({ ...projectForm, name: "" });
  }

  function addTask(e: FormEvent) {
    e.preventDefault();
    if (!taskForm.title || !taskForm.projectId) return;
    setTasks((prev) => [...prev, { id: uid(), title: taskForm.title, done: false, projectId: Number(taskForm.projectId) }]);
    setTaskForm({ ...taskForm, title: "" });
  }

  function answerQuestion(choice: number) {
    if (!quizRunning) return;
    const q = questions[quizIndex];
    setTopics((prev) =>
      prev.map((t) =>
        t.id === q.topicId
          ? { ...t, total: t.total + 1, correct: t.correct + (choice === q.answer ? 1 : 0) }
          : t
      )
    );
    if (quizIndex + 1 >= questions.length) {
      setQuizRunning(false);
      setQuizIndex(0);
      return;
    }
    setQuizIndex((prev) => prev + 1);
  }

  function resetQuiz() {
    setTopics((prev) => prev.map((t) => ({ ...t, correct: 0, total: 0 })));
    setQuizIndex(0);
    setTimer(60);
    setQuizRunning(false);
  }

  async function fetchRepo() {
    const [owner, repo] = repoInput.split("/");
    if (!owner || !repo) {
      setRepoState({ loading: false, error: "owner/repo formatı kullanın." });
      return;
    }
    setRepoState({ loading: true, error: "" });
    setRepoStats(null);
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!res.ok) throw new Error("Repo bulunamadı veya API limiti doldu.");
      const data = await res.json();
      setRepoStats({
        stars: data.stargazers_count ?? 0,
        forks: data.forks_count ?? 0,
        openIssues: data.open_issues_count ?? 0,
        watchers: data.subscribers_count ?? 0,
      });
      setRepoState({ loading: false, error: "" });
    } catch (error) {
      setRepoState({ loading: false, error: error instanceof Error ? error.message : "Bilinmeyen hata" });
    }
  }

  function addProduct(e: FormEvent) {
    e.preventDefault();
    const stock = Number(productForm.stock);
    const min = Number(productForm.min);
    const price = Number(productForm.price);
    if (!productForm.name || stock < 0 || min < 0 || price <= 0) return;
    const product = { id: uid(), name: productForm.name, stock, min, price };
    setProducts((prev) => [...prev, product]);
    if (!saleForm.productId) setSaleForm((prev) => ({ ...prev, productId: String(product.id) }));
    setProductForm({ name: "", stock: "", min: "", price: "" });
  }

  function sellProduct(e: FormEvent) {
    e.preventDefault();
    const quantity = Number(saleForm.quantity);
    const productId = Number(saleForm.productId);
    const product = products.find((p) => p.id === productId);
    if (!product || quantity <= 0 || quantity > product.stock) return;
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock: p.stock - quantity } : p)));
    setSales((prev) => [...prev, { id: uid(), productId, quantity, total: quantity * product.price }]);
  }

  function addEvent(e: FormEvent) {
    e.preventDefault();
    const capacity = Number(eventForm.capacity);
    if (!eventForm.title || !eventForm.date || capacity <= 0) return;
    const item = { id: uid(), title: eventForm.title, date: eventForm.date, capacity, attendees: [] as EventItem["attendees"] };
    setEvents((prev) => [...prev, item]);
    if (!registerForm.eventId) setRegisterForm((prev) => ({ ...prev, eventId: String(item.id) }));
    setEventForm({ title: "", date: "", capacity: "" });
  }

  function registerAttendee(e: FormEvent) {
    e.preventDefault();
    const eventId = Number(registerForm.eventId);
    if (!registerForm.name || !eventId) return;
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId || ev.attendees.length >= ev.capacity) return ev;
        return { ...ev, attendees: [...ev.attendees, { id: uid(), name: registerForm.name, checkedIn: false }] };
      })
    );
    setRegisterForm((prev) => ({ ...prev, name: "" }));
  }

  function toggleCheckIn(eventId: number, attendeeId: number) {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id !== eventId
          ? ev
          : {
              ...ev,
              attendees: ev.attendees.map((a) => (a.id === attendeeId ? { ...a, checkedIn: !a.checkedIn } : a)),
            }
      )
    );
  }

  return (
    <div className="workspace">
      <aside className="sidebar">
        <div className="brand">mvp<span>.lab</span></div>
        <div className="nav">
          {apps.map((app) => (
            <button key={app.key} className={active === app.key ? "active" : ""} onClick={() => setActive(app.key)}>
              {app.emoji} {app.label}
            </button>
          ))}
        </div>
      </aside>

      <main className="main">
        {active === "finance" && (
          <section className="panel">
            <h1>Yapay zekâ destekli kişisel finans uygulaması</h1>
            <div className="cards">
              <div className="card"><b>Bakiye</b><p>{money(income - expense)}</p></div>
              <div className="card"><b>Gelir</b><p className="positive">{money(income)}</p></div>
              <div className="card"><b>Gider</b><p className="negative">{money(expense)}</p></div>
            </div>
            <form className="inline-form" onSubmit={addTransaction}>
              <input placeholder="İşlem adı" value={txForm.title} onChange={(e) => setTxForm({ ...txForm, title: e.target.value })} />
              <input type="number" min="1" placeholder="Tutar" value={txForm.amount} onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })} />
              <select value={txForm.type} onChange={(e) => setTxForm({ ...txForm, type: e.target.value })}><option value="expense">Gider</option><option value="income">Gelir</option></select>
              <input placeholder="Kategori" value={txForm.category} onChange={(e) => setTxForm({ ...txForm, category: e.target.value })} />
              <button className="btn">Ekle</button>
            </form>
            <div className="split">
              <div className="card">
                <h3>Bütçe limitleri</h3>
                {budgets.map((b) => {
                  const used = transactions.filter((x) => x.type === "expense" && x.category === b.category).reduce((a, x) => a + x.amount, 0);
                  const pct = Math.min(100, Math.round((used / b.limit) * 100));
                  return <p key={b.category}>{b.category}: {money(used)} / {money(b.limit)} ({pct}%)</p>;
                })}
              </div>
              <div className="card">
                <h3>AI öneri motoru</h3>
                <ul>
                  <li>En yüksek gider kategorin: {transactions.filter((x) => x.type === "expense").sort((a, b) => b.amount - a.amount)[0]?.category ?? "-"}</li>
                  <li>Tasarruf oranı: {income ? Math.max(0, Math.round(((income - expense) / income) * 100)) : 0}%</li>
                  <li>Öneri: Gıda harcamanı haftalık limite böl ve bildirimle takip et.</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {active === "freelance" && (
          <section className="panel">
            <h1>Freelance müşteri ve proje yönetim paneli</h1>
            <div className="split">
              <form className="card" onSubmit={addClient}>
                <h3>Müşteri ekle</h3>
                <input placeholder="Ad" value={clientForm.name} onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })} />
                <input placeholder="E-posta" value={clientForm.email} onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })} />
                <button className="btn">Kaydet</button>
              </form>
              <form className="card" onSubmit={addProject}>
                <h3>Proje ekle</h3>
                <input placeholder="Proje adı" value={projectForm.name} onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} />
                <select value={projectForm.clientId} onChange={(e) => setProjectForm({ ...projectForm, clientId: e.target.value })}>{clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <button className="btn">Kaydet</button>
              </form>
            </div>
            <form className="inline-form" onSubmit={addTask}>
              <input placeholder="Görev" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
              <select value={taskForm.projectId} onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })}>{projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
              <button className="btn">Görev ekle</button>
            </form>
            <div className="card">
              <h3>Durum özeti</h3>
              <p>Müşteri: {clients.length} · Proje: {projects.length} · Görev: {tasks.length}</p>
              {projects.map((p) => {
                const client = clients.find((c) => c.id === p.clientId);
                const projectTasks = tasks.filter((t) => t.projectId === p.id);
                return <div key={p.id} className="row"><b>{p.name}</b><span>{client?.name}</span><span>{projectTasks.filter((t) => t.done).length}/{projectTasks.length} tamamlandı</span></div>;
              })}
            </div>
          </section>
        )}

        {active === "student" && (
          <section className="panel">
            <h1>Türkçe öğrenci çalışma platformu</h1>
            <div className="cards">
              {topics.map((t) => <div key={t.id} className="card"><b>{t.name}</b><p>{t.correct}/{t.total} doğru</p></div>)}
            </div>
            <div className="split">
              <div className="card">
                <h3>Deneme sınavı</h3>
                <p>Süre: {timer}s</p>
                {!quizRunning ? (
                  <button className="btn" onClick={() => { setQuizIndex(0); setTimer(60); setQuizRunning(true); }}>Sınavı başlat</button>
                ) : (
                  <div>
                    <p>{questions[quizIndex].text}</p>
                    <div className="option-grid">
                      {questions[quizIndex].options.map((option, i) => <button key={option} className="btn btn-light" onClick={() => answerQuestion(i)}>{option}</button>)}
                    </div>
                  </div>
                )}
                <button className="btn btn-light" onClick={resetQuiz}>Sıfırla</button>
              </div>
              <div className="card">
                <h3>AI çalışma planı</h3>
                <p>Zayıf konular: {weakTopics.map((x) => x.name).join(", ") || "-"}</p>
                <ul>
                  <li>Her gün 20 soru tekrar</li>
                  <li>Önce en zayıf konuya 30 dakika</li>
                  <li>Hafta sonu karma deneme</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {active === "cv" && (
          <section className="panel">
            <h1>CV ve portföy oluşturucu</h1>
            <div className="split">
              <form className="card">
                <h3>Profil formu</h3>
                <input value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} placeholder="Ad Soyad" />
                <input value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} placeholder="Ünvan" />
                <textarea value={profile.summary} onChange={(e) => setProfile({ ...profile, summary: e.target.value })} placeholder="Özet" rows={3} />
                <input value={profile.skills} onChange={(e) => setProfile({ ...profile, skills: e.target.value })} placeholder="Yetenekler virgül ile" />
                <input value={profile.projects} onChange={(e) => setProfile({ ...profile, projects: e.target.value })} placeholder="Projeler noktalı virgül" />
                <select value={profile.template} onChange={(e) => setProfile({ ...profile, template: e.target.value })}><option value="minimal">Minimal</option><option value="bold">Bold</option></select>
                <button type="button" className="btn btn-light" onClick={() => window.print()}>PDF dışa aktar (Yazdır)</button>
              </form>
              <div className={`card cv-preview ${profile.template}`}>
                <h2>{profile.fullName}</h2>
                <p>{profile.title}</p>
                <p>{profile.summary}</p>
                <h4>Yetenekler</h4>
                <p>{profile.skills.split(",").map((s) => s.trim()).filter(Boolean).join(" · ")}</p>
                <h4>Projeler</h4>
                <ul>{profile.projects.split(";").map((p) => p.trim()).filter(Boolean).map((p) => <li key={p}>{p}</li>)}</ul>
                <p className="muted">Portföy linki: https://portfolio.local/{encodeURIComponent(profile.fullName.toLowerCase().replaceAll(" ", "-"))}</p>
              </div>
            </div>
          </section>
        )}

        {active === "github" && (
          <section className="panel">
            <h1>GitHub analiz paneli</h1>
            <form className="inline-form" onSubmit={(e) => { e.preventDefault(); fetchRepo(); }}>
              <input value={repoInput} onChange={(e) => setRepoInput(e.target.value)} placeholder="owner/repo" />
              <button className="btn">Metrikleri getir</button>
            </form>
            {repoState.loading && <p>Yükleniyor...</p>}
            {repoState.error && <p className="negative">{repoState.error}</p>}
            {repoStats && (
              <div className="cards">
                <div className="card"><b>Stars</b><p>{repoStats.stars}</p></div>
                <div className="card"><b>Forks</b><p>{repoStats.forks}</p></div>
                <div className="card"><b>Open Issues</b><p>{repoStats.openIssues}</p></div>
                <div className="card"><b>Watchers</b><p>{repoStats.watchers}</p></div>
              </div>
            )}
            <div className="card"><h3>Haftalık öneri</h3><p>PR inceleme süresini düşürmek için açık issue/PR oranını %20 altına çekmeyi hedefleyin.</p></div>
          </section>
        )}

        {active === "stock" && (
          <section className="panel">
            <h1>Stok ve satış takip sistemi</h1>
            <div className="split">
              <form className="card" onSubmit={addProduct}>
                <h3>Ürün ekle</h3>
                <input placeholder="Ürün" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
                <input type="number" min="0" placeholder="Stok" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />
                <input type="number" min="0" placeholder="Kritik seviye" value={productForm.min} onChange={(e) => setProductForm({ ...productForm, min: e.target.value })} />
                <input type="number" min="1" placeholder="Fiyat" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
                <button className="btn">Kaydet</button>
              </form>
              <form className="card" onSubmit={sellProduct}>
                <h3>Satış işlemi</h3>
                <select value={saleForm.productId} onChange={(e) => setSaleForm({ ...saleForm, productId: e.target.value })}>{products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                <input type="number" min="1" value={saleForm.quantity} onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })} />
                <button className="btn">Sat</button>
              </form>
            </div>
            <div className="card">
              <h3>Stok durumu</h3>
              {products.map((p) => <div key={p.id} className="row"><b>{p.name}</b><span>Stok: {p.stock}</span><span className={p.stock <= p.min ? "negative" : "positive"}>{p.stock <= p.min ? "Kritik" : "Normal"}</span></div>)}
              <p>Günlük satış toplamı: {money(sales.reduce((a, s) => a + s.total, 0))}</p>
            </div>
          </section>
        )}

        {active === "event" && (
          <section className="panel">
            <h1>Etkinlik platformu</h1>
            <div className="split">
              <form className="card" onSubmit={addEvent}>
                <h3>Etkinlik oluştur</h3>
                <input placeholder="Başlık" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} />
                <input type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} />
                <input type="number" min="1" placeholder="Kapasite" value={eventForm.capacity} onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })} />
                <button className="btn">Kaydet</button>
              </form>
              <form className="card" onSubmit={registerAttendee}>
                <h3>Katılımcı kaydı</h3>
                <select value={registerForm.eventId} onChange={(e) => setRegisterForm({ ...registerForm, eventId: e.target.value })}>{events.map((ev) => <option key={ev.id} value={ev.id}>{ev.title}</option>)}</select>
                <input placeholder="Katılımcı adı" value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} />
                <button className="btn">Kaydet</button>
              </form>
            </div>
            <div className="card">
              <h3>Organizatör paneli</h3>
              {events.map((ev) => (
                <div key={ev.id} className="event-box">
                  <p><b>{ev.title}</b> · {ev.date} · {ev.attendees.length}/{ev.capacity}</p>
                  {ev.attendees.map((a) => (
                    <div className="row" key={a.id}>
                      <span>{a.name}</span>
                      <span>Kod: EVT-{ev.id}-{a.id}</span>
                      <button className="btn btn-light" onClick={() => toggleCheckIn(ev.id, a.id)}>{a.checkedIn ? "Check-out" : "QR check-in"}</button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
