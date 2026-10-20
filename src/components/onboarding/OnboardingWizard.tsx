import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function OnboardingWizard() {
  const navigate = useNavigate()
  useEffect(() => { navigate('/app/overview', { replace: true }) }, [navigate])
  return null
}
