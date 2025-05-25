import { submitContactForm } from './contact';

// redirectのモック
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('submitContactForm', () => {
  const prevState = {
    success: false,
    errors: {},
  };

  beforeEach(() => {
    // 各テストの前にモックをリセット
    (require('next/navigation').redirect as jest.Mock).mockClear();
  });

  it('バリデーションエラー: 名前が空の場合', async () => {
    const formData = new FormData();
    formData.append('name', '');
    formData.append('email', 'test@example.com');

    const result = await submitContactForm(prevState, formData);

    expect(result.success).toBe(false);
    expect(result.errors.name).toEqual(['名前は3文字以上で入力してください']);
    expect(result.errors.email).toEqual([]); // emailエラーは空配列であることを期待
    expect(require('next/navigation').redirect).not.toHaveBeenCalled();
  });

  it('バリデーションエラー: メールアドレスが不正な場合', async () => {
    const formData = new FormData();
    formData.append('name', 'Test User');
    formData.append('email', 'invalid-email');

    const result = await submitContactForm(prevState, formData);

    expect(result.success).toBe(false);
    expect(result.errors.name).toEqual([]); // nameエラーは空配列であることを期待
    expect(result.errors.email).toEqual([
      '正しいメールアドレス形式で入力してください',
    ]);
    expect(require('next/navigation').redirect).not.toHaveBeenCalled();
  });

  it('バリデーションエラー: 名前とメールアドレスが不正な場合', async () => {
    const formData = new FormData();
    formData.append('name', '');
    formData.append('email', 'invalid-email');

    const result = await submitContactForm(prevState, formData);

    expect(result.success).toBe(false);
    expect(result.errors.name).toEqual(['名前は3文字以上で入力してください']);
    expect(result.errors.email).toEqual([
      '正しいメールアドレス形式で入力してください',
    ]);
    expect(require('next/navigation').redirect).not.toHaveBeenCalled();
  });

  it('成功ケース: バリデーション成功時にリダイレクトする', async () => {
    const formData = new FormData();
    formData.append('name', 'Test User');
    formData.append('email', 'test@example.com');

    // submitContactForm は redirect を呼び出すと例外を発生させるので、try-catch で囲む
    try {
      await submitContactForm(prevState, formData);
    } catch (error: any) {
      expect(error.message).toContain('NEXT_REDIRECT');
    }

    expect(require('next/navigation').redirect).toHaveBeenCalledWith(
      '/contacts/complete'
    );
  });
});
