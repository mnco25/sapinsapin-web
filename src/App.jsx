import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Problem from './components/Problem.jsx'
import Stats from './components/Stats.jsx'
import Datasets from './components/Datasets.jsx'
import Models from './components/Models.jsx'
import Contribute from './components/Contribute.jsx'
import Cta from './components/Cta.jsx'
import Footer from './components/Footer.jsx'
import { LayerDivider } from './components/Primitives.jsx'

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ube focus:px-5 focus:py-2.5 focus:text-cream"
      >
        Skip to content
      </a>

      <Header />

      <main id="main">
        <Hero />
        <Problem />
        <Stats />
        <Datasets />
        <LayerDivider />
        <Models />
        <LayerDivider />
        <Contribute />
        <Cta />
      </main>

      <Footer />
    </>
  )
}
