import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ContactForm from './ContactForm';

describe('ContactForm', () => {
  beforeEach(() => {
    render(<ContactForm />);
  });

  it("'お問い合わせ' のテキストが存在する", () => {
    expect(screen.getByText('お問い合わせ')).toBeInTheDocument();
  });

  it('名前とメールのinputが表示されている', () => {
    expect(screen.getByLabelText('お名前')).toBeInTheDocument();
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
  });

  it('送信ボタンが存在する', () => {
    expect(screen.getByRole('button', { name: '送信' })).toBeInTheDocument();
  });

  it('名前が3文字未満の場合エラーが表示される', async () => {
    const nameInput = screen.getByLabelText('お名前');
    fireEvent.change(nameInput, { target: { value: '田中' } }); // 2文字未満の例
    fireEvent.blur(nameInput);
    expect(
      await screen.findByText(/名前は3文字以上で入力してください/i)
    ).toBeInTheDocument();
  });

  it('名前が21文字以上の場合、エラーが表示される', async () => {
    const nameInput = screen.getByLabelText('お名前');
    fireEvent.change(nameInput, { target: { value: 'あ'.repeat(21) } }); // 21文字
    fireEvent.blur(nameInput);
    expect(
      await screen.findByText(/名前は20文字以内で入力してください/i)
    ).toBeInTheDocument();
  });

  it('メールアドレスが空の場合、エラーが表示される', async () => {
    const emailInput = screen.getByLabelText('メールアドレス');
    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.blur(emailInput);
    expect(
      await screen.findByText(/メールアドレスは必須です/i)
    ).toBeInTheDocument();
  });

  it('メールフィールドに不正な形式を入力するとエラーが表示される', async () => {
    const emailInput = screen.getByLabelText('メールアドレス');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    expect(
      await screen.findByText(/正しいメールアドレス形式で入力してください/i)
    ).toBeInTheDocument();
  });

  it('正しい名前とメールを入力した後、エラーが表示されない', async () => {
    const nameInput = screen.getByLabelText('お名前');
    const emailInput = screen.getByLabelText('メールアドレス');

    fireEvent.change(nameInput, { target: { value: '田中太郎' } });
    fireEvent.blur(nameInput);

    fireEvent.change(emailInput, { target: { value: 'taro@example.com' } });
    fireEvent.blur(emailInput);

    expect(
      screen.queryByText(/名前は3文字以上で入力してください/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/名前は20文字以内で入力してください/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/メールアドレスは必須です/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/正しいメールアドレス形式で入力してください/i)
    ).not.toBeInTheDocument();
  });
  
});
