import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import RegisterForm from '@/components/auth/RegisterForm'

export const metadata = {
  title: 'Sign Up - ValorantGuides',
  description: 'Join the ValorantGuides community. Create an account to share lineups, crosshairs, and connect with other Valorant players.',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Join ValorantGuides</h1>
              <p className="text-gray-400">
                Create an account to access exclusive features and join our community
              </p>
            </div>
            <RegisterForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
