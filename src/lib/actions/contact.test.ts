import { submitContactForm } from './contact';
// prisma のモック (prisma をインポートしている実際のパスに合わせてください)
// `src/lib/prisma.ts` で `export const prisma = new PrismaClient()` とされていると仮定
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  prisma: {
    contact: {
      create: jest.fn(),
      findUnique: jest.fn(), // findUnique をモックに追加
    },
  },
}));

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
    // prisma のモックをクリア
    const mockedPrisma = require('@/lib/prisma').prisma;
    if (jest.isMockFunction(mockedPrisma.contact.create)) {
      mockedPrisma.contact.create.mockClear();
    }
    if (jest.isMockFunction(mockedPrisma.contact.findUnique)) {
      mockedPrisma.contact.findUnique.mockClear(); // findUnique のモックもクリア
    }
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

    // prisma のモックを設定
    const { prisma: mockedPrisma } = require('@/lib/prisma');
    mockedPrisma.contact.findUnique.mockResolvedValue(null); // 既存ユーザーなしと仮定
    mockedPrisma.contact.create.mockResolvedValue({
      id: 'mocked-id',
      name: 'Test User',
      email: 'test@example.com',
    });

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
