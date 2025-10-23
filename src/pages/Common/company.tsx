import Hero from '@/components/Company/Hero'
import FooterSection from '@/components/Landing/FooterSection'
import Navbar from '@/components/Landing/navbar'


function company() {
  return (
    <div className='h-full w-screen bg-black'>
        <Navbar />
        <Hero />
        <FooterSection />
    </div>
  )
}

export default company