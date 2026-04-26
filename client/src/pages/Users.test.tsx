import { fireEvent, screen, waitFor, within } from '@testing-library/react';
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

  it('validates and creates a new user', async () => {
    const createdAt = '2026-04-13T07:31:02.000Z';

    mockedAxios.get
      .mockResolvedValueOnce({
        data: {
          users: [],
        },
      })
      .mockResolvedValueOnce({
        data: {
          users: [
            {
              id: 'user-3',
              name: 'Agent Smith',
              email: 'agent.smith@example.com',
              role: 'agent',
              createdAt,
            },
          ],
        },
      });

    mockedAxios.post.mockResolvedValueOnce({
      data: {
        user: {
          id: 'user-3',
          name: 'Agent Smith',
          email: 'agent.smith@example.com',
          role: 'agent',
          createdAt,
        },
      },
    });

    renderUsersPage();

    await screen.findByRole('heading', { name: 'Users' });
    fireEvent.click(screen.getByRole('button', { name: 'New User' }));

    const dialog = screen.getByRole('dialog', { name: 'Create user' });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Create user' }));

    expect(await within(dialog).findByText('Name must be at least 3 characters.')).toBeInTheDocument();
    expect(within(dialog).getByText('Password must be at least 8 characters.')).toBeInTheDocument();
    expect(mockedAxios.post).not.toHaveBeenCalled();

    fireEvent.change(within(dialog).getByLabelText('Name'), {
      target: { value: 'Agent Smith' },
    });
    fireEvent.change(within(dialog).getByLabelText('Email'), {
      target: { value: 'agent.smith@example.com' },
    });
    fireEvent.change(within(dialog).getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Create user' }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:3001/api/users',
        {
          name: 'Agent Smith',
          email: 'agent.smith@example.com',
          password: 'password123',
        },
        { withCredentials: true },
      );
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Create user' })).not.toBeInTheDocument();
    });

    expect(await screen.findByText('Agent Smith')).toBeInTheDocument();
    expect(screen.getByText('agent.smith@example.com')).toBeInTheDocument();
  });
});
