import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

// Mock the data layer so the test does not depend on the real API.
vi.mock('../services/api.js', () => ({
  addReview: vi.fn().mockResolvedValue({
    id: 'r-test01',
    name: 'Jane Doe',
    rating: 5,
    comment: 'Great platform, very fast booking.',
    date: '2026-11-17',
  }),
}));

import GiveReviews from '../components/GiveReviews.jsx';
import { addReview } from '../services/api.js';

beforeEach(() => {
  addReview.mockClear();
});

describe('GiveReviews (disabled after submission)', () => {
  it('publishes a review then disables the whole form', async () => {
    render(<GiveReviews />);

    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/your review/i), {
      target: { value: 'Great platform, very fast booking.' },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /publish review/i }));
    });

    expect(addReview).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: /review published/i })).toBeDisabled();
    expect(screen.getByText(/form is now disabled/i)).toBeInTheDocument();
  });
});
