import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

describe('App landing page', () => {
  it('renders the main product headline and primary CTA', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: /powerful sms/i }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /get started/i }).length).toBeGreaterThan(0)
  })

  it('renders the sign in page with email and password fields', () => {
    render(
      <MemoryRouter initialEntries={['/signin']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  it('renders the register page with required fields', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/business name/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('renders the feature cards section', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByText(/bulk email campaigns/i)).toBeInTheDocument()
    expect(screen.getByText(/bulk sms campaigns/i)).toBeInTheDocument()
    expect(screen.getByText(/easy integration/i)).toBeInTheDocument()
  })

  it('shows dashboard data in demo mode without a live backend', async () => {
    render(
      <MemoryRouter initialEntries={['/signin']}>
        <App />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText(/^Email$/i), { target: { value: 'demo@example.com' } })
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'DemoPass123' } })
    fireEvent.click(screen.getByRole('button', { name: /^sign in$/i }))

    fireEvent.click(await screen.findByRole('button', { name: /continue/i }))
    fireEvent.click(await screen.findByRole('button', { name: /continue/i }))
    fireEvent.click(await screen.findByRole('button', { name: /finish setup/i }))

    expect(await screen.findByRole('heading', { name: /good morning|good afternoon|good evening/i })).toBeInTheDocument()
    expect(screen.queryByText(/unable to load your dashboard data/i)).not.toBeInTheDocument()
  })
})
