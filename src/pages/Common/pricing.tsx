import Pricing from '@/components/Company/Pricing'
import FooterSection from '@/components/Landing/FooterSection'
import Navbar from '@/components/Landing/navbar'

function pricing() {
  return (
    <div className='h-full w-screen bg-black'>
        <Navbar />
        <Pricing />
        <FooterSection />
    </div>
  )
}

export default pricing;