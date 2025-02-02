import Hero from '../components/hero'
import LatestCollection from '../components/latestCollection'
import BestSeller from '../components/bestSeller'
import OurPolicy from '../components/ourPolicy'
import NewsletterBox from '../components/newsletterBox'

const Home = () => {
  return (
    <div>
      <section>
        <Hero />
      </section>
      <section>
        <LatestCollection />
      </section>
      <section>
        <BestSeller />  
      </section>
      <section>
        <OurPolicy />
      </section>
      <section>
        <NewsletterBox />
      </section>
    </div>
  )
}

export default Home