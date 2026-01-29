import { render, screen } from '@testing-library/react';
import Landing from '../../components/Landing';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

// Mock Lucide icons to avoid rendering issues in tests
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual as object,
    Zap: () => <div data-testid="zap-icon" />,
    Brain: () => <div data-testid="brain-icon" />,
    User: () => <div data-testid="user-icon" />,
    ArrowRight: () => <div data-testid="arrow-right-icon" />
  };
});

describe('Landing Component', () => {
  it('renders the welcome message', () => {
    render(<Landing onEnterLogin={() => {}} />);
    expect(screen.getAllByText(/NEURONADS/i).length).toBeGreaterThan(0);
    // Use regex to match text that might be split or contain specific phrases
    expect(screen.getAllByText(/Next-Gen/i).length).toBeGreaterThan(0);
  });

  it('renders login buttons', () => {
    render(<Landing onEnterLogin={() => {}} />);
    expect(screen.getByText('SATELLITE ACCESS')).toBeInTheDocument();
    // Use getAllByText for multiple occurrences and check the first one or simply length
    expect(screen.getAllByText(/NEURONADS/i).length).toBeGreaterThan(0);
  });
});
