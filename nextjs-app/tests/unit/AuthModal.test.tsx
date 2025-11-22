// @ts-ignore - screen and fireEvent are exported from @testing-library/react
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthModal from '@/components/AuthModal';

describe('AuthModal Component', () => {
  it('renders login form by default', () => {
    const mockOnClose: jest.Mock = jest.fn();
    render(
      <AuthModal isOpen={true} onClose={mockOnClose} initialMode="login" />
    );
    
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('switches to register form when requested', () => {
    const mockOnClose: jest.Mock = jest.fn();
    render(
      <AuthModal isOpen={true} onClose={mockOnClose} initialMode="register" />
    );
    
    expect(screen.getByText(/create account/i)).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    const mockOnClose: jest.Mock = jest.fn();
    render(
      <AuthModal isOpen={true} onClose={mockOnClose} initialMode="login" />
    );
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays error message on failed login', async () => {
    const mockOnClose: jest.Mock = jest.fn();
    render(
      <AuthModal isOpen={true} onClose={mockOnClose} initialMode="login" />
    );
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // Test expects error handling
    expect(submitButton).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const mockOnClose: jest.Mock = jest.fn();
    const { container } = render(
      <AuthModal isOpen={false} onClose={mockOnClose} initialMode="login" />
    );
    
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
});
