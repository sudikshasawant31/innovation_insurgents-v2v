'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { BookOpen, ExternalLink, Film, Sparkles } from 'lucide-react'

const videos = [
  'mQDe9UOoLFY',
  'pZX8ikmWvEU',
  'yWoCgYevgVI',
  'F6JBFWrEvFc',
  '8vtsuqRhxjQ',
  'wY44LKLysHg',
  'WNkxc6M6Rxk',
  'LIsYbDCMfDc',
  'FnvoU0-wcy0',
  'Mc5iK0AtGNc',
  'q3I0erDeh5Y',
  '37BO0eQhFA8',
  'h1tvgmgM-ew',
]

const articles = [
  ['WHO', 'Polycystic ovary syndrome fact sheet', 'https://www.who.int/news-room/fact-sheets/detail/polycystic-ovary-syndrome'],
  ['Mayo Clinic', 'PCOS diagnosis and treatment', 'https://www.mayoclinic.org/diseases-conditions/pcos/diagnosis-treatment/drc-20353443'],
  ['Cleveland Clinic', 'PCOS overview', 'https://my.clevelandclinic.org/health/diseases/8316-polycystic-ovary-syndrome-pcos'],
  ['Johns Hopkins', 'Polycystic ovary syndrome', 'https://www.hopkinsmedicine.org/health/conditions-and-diseases/polycystic-ovary-syndrome-pcos'],
  ['WHO', 'Menopause fact sheet', 'https://www.who.int/news-room/fact-sheets/detail/menopause'],
  ['NCBI', 'Menopause clinical overview', 'https://www.ncbi.nlm.nih.gov/books/NBK507826/'],
  ['MedlinePlus', 'Menopause information', 'https://medlineplus.gov/menopause.html'],
  ['WomensHealth.gov', 'Menstrual cycle', 'https://womenshealth.gov/menstrual-cycle'],
  ['NHS', 'Periods', 'https://www.nhs.uk/conditions/periods/'],
  ['Mayo Clinic', 'Menstrual cramps', 'https://www.mayoclinic.org/diseases-conditions/menstrual-cramps/symptoms-causes/syc-20374938'],
  ['NHS', 'Period pain', 'https://www.nhs.uk/symptoms/period-pain/'],
  ['WHO', 'Mental health', 'https://www.who.int/health-topics/mental-health'],
  ['SAMHSA', 'Mental health and support', 'https://www.samhsa.gov/'],
  ['NIMH', 'Women and mental health', 'https://www.nimh.nih.gov/health/topics/women-and-mental-health'],
  ['WomensHealth.gov', 'Reproductive health', 'https://www.womenshealth.gov/a-z-topics/reproductive-health'],
  ['Cleveland Clinic', 'Female reproductive system', 'https://my.clevelandclinic.org/health/body/9118-female-reproductive-system'],
  ['PMC', 'Women health research article', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9851410/'],
  ['Health.com', 'Postpartum depression treatment', 'https://www.health.com/postpartum-depression-treatment-8740347'],
  ['AP News', 'Women health news update', 'https://apnews.com/article/79044a524a59810b23422c5b24b3b596'],
]

const facts = [
  ['Preventive Healthcare', 'Women make up nearly 49.7% of the world population.', 'Global health programs need women-centered design.'],
  ['Preventive Healthcare', 'Women generally have a higher average life expectancy than men globally.', 'Longer life also means preventive screening and bone health matter.'],
  ['Menstrual Health', 'Hormonal changes during the menstrual cycle can influence mood, energy, sleep, and appetite.', 'Tracking symptoms can help users understand patterns.'],
  ['Menstrual Health', 'An average woman experiences around 450 to 500 menstrual cycles in her lifetime.', 'Cycle awareness supports earlier detection of irregularity.'],
  ['Menopause', 'Women are at a higher risk of osteoporosis, especially after menopause.', 'Calcium, vitamin D, and strength training are important.'],
  ['Nutrition', 'Iron deficiency anemia is one of the most common nutritional deficiencies among women worldwide.', 'Fatigue and weakness can be signs to discuss with a clinician.'],
  ['Menstrual Health', 'Regular physical activity can reduce menstrual cramps and improve mood.', 'Even walking and stretching can help many users.'],
  ['Mental Health', 'Poor sleep can affect hormone balance, stress levels, and menstrual health.', 'Sleep logs can be useful alongside mood tracking.'],
  ['Pregnancy & Postpartum', 'Postpartum depression is a medical condition that can be treated with support and care.', 'Early support can protect both mother and baby.'],
  ['Nutrition', 'Staying hydrated can help reduce headaches, fatigue, and menstrual discomfort.', 'Hydration reminders fit naturally into weekly checkups.'],
  ['Mental Health', 'Stress management techniques such as meditation and exercise can improve reproductive and mental health.', 'Small daily habits are easier to sustain.'],
  ['Nutrition', 'Foods rich in iron, calcium, folate, and vitamin D are especially important for women health.', 'Personalized nutrition tips can make care practical.'],
  ['Preventive Healthcare', 'Regular preventive checkups help detect health conditions earlier and improve outcomes.', 'This is why health calendars and reminders matter.'],
  ['Menopause', 'Menopause is natural and usually occurs between ages 45 and 55.', 'Education can reduce fear and stigma.'],
  ['Mental Health', 'Women are more likely than men to experience anxiety and depression.', 'Mental health support should be easy to reach.'],
  ['Preventive Healthcare', 'Just 30 minutes of moderate exercise daily can improve heart health, bone strength, and mood.', 'Activity tracking can turn advice into action.'],
  ['Pregnancy & Postpartum', 'Folic acid before and during pregnancy helps support healthy fetal development.', 'Preconception care is part of preventive health.'],
  ['Preventive Healthcare', 'Early detection improves management of PCOS, thyroid disorders, and anemia.', 'Screening plus follow-up is more useful than prediction alone.'],
]

const categories = ['All', 'Mental Health', 'Menstrual Health', 'Nutrition', 'Pregnancy & Postpartum', 'Menopause', 'Preventive Healthcare']

export default function FemaleHealthFactsPage() {
  const [category, setCategory] = useState('All')
  const visibleFacts = category === 'All' ? facts : facts.filter(([factCategory]) => factCategory === category)

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-28">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Facts about female health</p>
          <h1 className="mt-2 text-4xl font-bold">Learn with videos, articles, and flip cards</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Educational resources for PCOS, periods, menopause, mental health, reproductive health, and preventive care.
          </p>
        </div>

        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-secondary" />
            <h2 className="text-2xl font-bold">Did You Know?</h2>
          </div>
          <div className="mb-5 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button key={item} onClick={() => setCategory(item)} className={`rounded-full px-4 py-2 text-sm font-semibold ${category === item ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                {item}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleFacts.map(([factCategory, front, back]) => (
              <div key={front} className="flip-card min-h-48">
                <div className="flip-card-inner">
                  <div className="flip-card-face rounded-xl border border-border bg-card p-5">
                    <p className="mb-3 text-sm font-semibold text-primary">{factCategory}</p>
                    <h3 className="text-xl font-bold">{front}</h3>
                    <p className="mt-4 text-sm text-muted-foreground">Hover to learn why it matters.</p>
                  </div>
                  <div className="flip-card-face flip-card-back rounded-xl border border-primary/30 bg-primary p-5 text-primary-foreground">
                    <p className="mb-3 text-sm font-semibold opacity-80">{factCategory}</p>
                    <p className="text-lg font-semibold">{back}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <Film className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-bold">Video library</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((id, index) => (
              <a key={id} href={`https://youtu.be/${id}`} target="_blank" rel="noreferrer" className="overflow-hidden rounded-xl border border-border bg-card transition-transform hover:-translate-y-1">
                <img src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`} alt={`Female health video ${index + 1}`} className="h-48 w-full object-cover" />
                <div className="p-4">
                  <p className="text-sm font-semibold text-primary">YouTube video {index + 1}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Tap to watch the educational video.</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Trusted articles</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map(([source, title, url]) => {
              const host = new URL(url).hostname
              return (
                <a key={url} href={url} target="_blank" rel="noreferrer" className="rounded-xl border border-border bg-card p-5 transition-transform hover:-translate-y-1">
                  <div className="mb-4 flex h-28 items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15">
                    <img src={`https://www.google.com/s2/favicons?domain=${host}&sz=128`} alt={`${source} icon`} className="h-16 w-16 rounded-lg" />
                  </div>
                  <p className="text-sm font-semibold text-primary">{source}</p>
                  <h3 className="mt-1 font-bold">{title}</h3>
                  <p className="mt-3 inline-flex items-center gap-1 text-sm text-muted-foreground">
                    Open article <ExternalLink className="h-3 w-3" />
                  </p>
                </a>
              )
            })}
          </div>
        </section>
      </section>
    </main>
  )
}
