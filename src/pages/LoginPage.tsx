import { useNavigate } from 'react-router-dom'
import { LoginPage as CodeQuestLoginPage } from '@/components/pages/LoginPage'

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <CodeQuestLoginPage
      onAuthenticated={() => {
        navigate('/')
      }}
    />
  )
}
