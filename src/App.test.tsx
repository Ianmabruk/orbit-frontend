import { fireEvent, render, screen } from '@testing-library/react'
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
      screen.getByRole('heading', { name: /every customer conversation/i }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /get started/i }).length).toBeGreaterThan(0)
  })

  it('allows a demo user to sign in and continue to onboarding', async () => {
    render(
      <MemoryRouter initialEntries={['/signin']}>
        <App />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText(/^Email$/i), { target: { value: 'demo@example.com' } })
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'DemoPass123' } })
    fireEvent.click(screen.getByRole('button', { name: /^sign in$/i }))

    expect(
      await screen.findByRole('heading', { name: /tell us about your business/i }),
    ).toBeInTheDocument()
  })

  it('shows the WordPress sync action in the dashboard workspace', async () => {
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

    expect(await screen.findByRole('button', { name: /sync wordpress/i })).toBeInTheDocument()
  })

  it('shows the CSV import controls in the contacts workspace', async () => {
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

    fireEvent.click(await screen.findByRole('link', { name: /contacts/i }))

    expect(await screen.findByLabelText(/paste csv rows/i)).toBeInTheDocument()
  })
})
