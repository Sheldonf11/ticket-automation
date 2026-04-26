import { screen, waitFor, within } from '@testing-library/react';
import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { Users } from './Users';

vi.mock('axios');

vi.mock('@/lib/auth-client', () => ({
  signOut: vi.fn(),
  useSession: () => ({
    data: {
      user: {
        name: 'Admin User',
        role: 'admin',
      },
    },
  }),
}));

const mockedAxios = vi.mocked(axios, true);

function renderUsersPage() {
  return renderWithProviders(<Users />, { route: '/users' });
}

describe('Users page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and renders the user list', async () => {
    const createdAt = '2026-04-13T07:31:02.000Z';

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        users: [
          {
            id: 'user-1',
            name: 'Sheldon Dsouza',
            email: 'sheldon@example.com',
            role: 'admin',
            createdAt,
          },
          {
            id: 'user-2',
            name: null,
            email: 'agent@example.com',
            role: 'agent',
            createdAt,
          },
        ],
      },
    });

    renderUsersPage();

    expect(await screen.findByRole('heading', { name: 'Users' })).toBeInTheDocument();
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3001/api/users', {
      withCredentials: true,
    });

    let rows = await screen.findAllByRole('row');
    await waitFor(() => {
      rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(3);
    });

    expect(within(rows[1]).getByText('Sheldon Dsouza')).toBeInTheDocument();
    expect(within(rows[1]).getByText('sheldon@example.com')).toBeInTheDocument();
    expect(within(rows[1]).getByText('admin')).toBeInTheDocument();
    expect(within(rows[1]).getByText(new Date(createdAt).toLocaleDateString())).toBeInTheDocument();

    expect(within(rows[2]).getByText('Unknown')).toBeInTheDocument();
    expect(within(rows[2]).getByText('agent@example.com')).toBeInTheDocument();
    expect(within(rows[2]).getByText('agent')).toBeInTheDocument();
  });

  it('shows an error message when users cannot be loaded', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Unable to load users.'));

    renderUsersPage();

    expect(await screen.findByText('Unable to load users.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
