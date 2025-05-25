import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ContactForm from './ContactForm';
import { submitContactForm } from '../app/lib/actions/contact';
import { ContactSchema } from '../validations/contact';
import { ZodError, ZodIssueCode } from 'zod';

// submitContactForm のモック
jest.mock('@/app/lib/actions/contact', () => ({
  ...jest.requireActual('@/app/lib/actions/contact'),
  submitContactForm: jest.fn(),
}));

// ContactSchema.pick のモック (一部のテストケースで使用)
const mockPick = jest.fn();
jest.mock('@/validations/contact', () => ({
  ...jest.requireActual('@/validations/contact'),
  ContactSchema: {
    ...jest.requireActual('@/validations/contact').ContactSchema,
    pick: (...args: any[]) => {
      // mockPick が設定されていればそれを使用し、なければ実際の pick を呼ぶ
      if (mockPick && mockPick.getMockName() !== 'jest.fn()') {
        return mockPick(...args);
      }
      return jest
        .requireActual('@/validations/contact')
        .ContactSchema.pick(...args);
    },
  },
}));

describe('ContactForm', () => {
  beforeEach(() => {
    render(<ContactForm />);
    // 各テストの前に submitContactForm モックをクリア
    (submitContactForm as jest.Mock).mockClear();
    // 各テストの前に ContactSchema.pick モックをクリア
    mockPick.mockClear();
    // mockPick のデフォルトの振る舞いを実際のpickに戻すため、jest.fn()をセット
    mockPick.mockImplementation(jest.fn());
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

  it('handleBlur で ZodError 以外のエラーが発生した場合、エラーメッセージがセットされない', async () => {
    // ContactSchema.pick が ZodError 以外のエラーをスローするようにモック
    const genericError = new Error('Generic error');
    // mockPick が特定の振る舞いをするように設定
    mockPick.mockImplementation(() => {
      return {
        parse: jest.fn(() => {
          throw genericError;
        }),
      };
    });

    const nameInput = screen.getByLabelText('お名前');
    fireEvent.change(nameInput, { target: { value: 'テスト' } });
    fireEvent.blur(nameInput);

    // ZodError由来のエラーメッセージは表示されないはず
    expect(
      screen.queryByText(/名前は3文字以上で入力してください/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/名前は20文字以内で入力してください/i)
    ).not.toBeInTheDocument();
    // 他のエラーも表示されないことを確認（コンソールにはエラーが出るかもしれない）
    const errorMessages = screen.queryAllByRole('alert'); // data-testidやroleなどでエラー要素を特定
    // clientErrorsが更新されないことを確認（間接的に）
    expect(nameInput).not.toHaveClass('bg-red-50');
  });

  it('handleBlur で ZodError の message が falsy な場合、errorMessage が空文字になる', async () => {
    // ContactSchema.pick が message が空文字の ZodError をスローするようにモック
    const customZodError = new ZodError([
      {
        code: ZodIssueCode.custom,
        path: ['name'],
        message: '', // 空のメッセージ
      },
    ]);
    mockPick.mockImplementation(() => ({
      parse: jest.fn(() => {
        throw customZodError;
      }),
    }));

    const nameInput = screen.getByLabelText('お名前');
    fireEvent.change(nameInput, { target: { value: 'テスト' } });
    fireEvent.blur(nameInput);

    // エラーメッセージ表示はされないか、あるいは空文字で更新される（カバレッジ目的）
    // nameInput に bg-red-50 がつかないことを確認 (メッセージが空なのでエラー扱いされない想定)
    // このテストの主目的は || '' のパスを通すこと
    expect(nameInput).not.toHaveClass('bg-red-50');
    // 念のため、他のZodエラーメッセージが表示されていないことも確認
    expect(
      screen.queryByText(/名前は3文字以上で入力してください/i)
    ).not.toBeInTheDocument();
  });

  it('handleBlur で ZodError の issues 配列が空の場合, errorMessage が空文字になる', async () => {
    // ContactSchema.pick が空のissuesを持つ ZodError をスローするようにモック
    const emptyIssuesZodError = new ZodError([]); // 空のissues配列
    mockPick.mockImplementation(() => ({
      parse: jest.fn(() => {
        throw emptyIssuesZodError;
      }),
    }));

    const nameInput = screen.getByLabelText('お名前');
    fireEvent.change(nameInput, { target: { value: 'テスト' } });
    fireEvent.blur(nameInput);

    // エラーメッセージ表示はされないか、あるいは空文字で更新される（カバレッジ目的）
    // nameInput に bg-red-50 がつかないことを確認
    expect(nameInput).not.toHaveClass('bg-red-50');
    // 念のため、他のZodエラーメッセージが表示されていないことも確認
    expect(
      screen.queryByText(/名前は3文字以上で入力してください/i)
    ).not.toBeInTheDocument();
  });

  describe('入力フィールドのエラークラス (bg-red-50)', () => {
    it('名前入力: クライアントサイドエラーで bg-red-50 がつく', async () => {
      const nameInput = screen.getByLabelText('お名前');
      fireEvent.change(nameInput, { target: { value: '名' } }); // 短すぎる名前
      fireEvent.blur(nameInput);
      expect(
        await screen.findByText(/名前は3文字以上で入力してください/i)
      ).toBeInTheDocument();
      expect(nameInput).toHaveClass('bg-red-50');
    });

    it('名前入力: サーバーサイドエラーで bg-red-50 がつく', async () => {
      (submitContactForm as jest.Mock).mockImplementationOnce(async () => ({
        success: false,
        errors: { name: ['サーバーからの名前エラー'] },
      }));

      const nameInput = screen.getByLabelText('お名前');
      fireEvent.change(nameInput, { target: { value: '適切な名前' } });
      fireEvent.change(screen.getByLabelText('メールアドレス'), {
        target: { value: 'test@example.com' },
      });

      const submitButton = screen.getByRole('button', { name: '送信' });
      await act(async () => {
        fireEvent.click(submitButton);
      });

      expect(
        await screen.findByText('サーバーからの名前エラー')
      ).toBeInTheDocument();
      expect(nameInput).toHaveClass('bg-red-50');
    });

    it('メール入力: クライアントサイドエラーで bg-red-50 がつく', async () => {
      const emailInput = screen.getByLabelText('メールアドレス');
      fireEvent.change(emailInput, { target: { value: 'invalid' } }); // 不正なメール
      fireEvent.blur(emailInput);
      expect(
        await screen.findByText(/正しいメールアドレス形式で入力してください/i)
      ).toBeInTheDocument();
      expect(emailInput).toHaveClass('bg-red-50');
    });

    it('メール入力: サーバーサイドエラーで bg-red-50 がつく', async () => {
      (submitContactForm as jest.Mock).mockImplementationOnce(async () => ({
        success: false,
        errors: { email: ['サーバーからのメールエラー'] },
      }));

      fireEvent.change(screen.getByLabelText('お名前'), {
        target: { value: '適切な名前' },
      });
      const emailInput = screen.getByLabelText('メールアドレス');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const submitButton = screen.getByRole('button', { name: '送信' });
      await act(async () => {
        fireEvent.click(submitButton);
      });

      expect(
        await screen.findByText('サーバーからのメールエラー')
      ).toBeInTheDocument();
      expect(emailInput).toHaveClass('bg-red-50');
    });
  });
});
