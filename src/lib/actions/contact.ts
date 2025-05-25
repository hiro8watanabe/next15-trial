'use server';
import { redirect } from 'next/navigation';
import { ContactSchema } from '@/validations/contact';
import { prisma } from '@/lib/prisma';

// ActionStateの型定義
interface ActionState {
  success: boolean;
  errors: {
    name?: string[];
    email?: string[];
  };
  serverError?: string;
}

export async function submitContactForm(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  // バリデーション
  const validatedResult = ContactSchema.safeParse({
    name,
    email,
  });

  if (!validatedResult.success) {
    const errors = validatedResult.error.flatten().fieldErrors;
    return {
      success: false,
      errors: {
        name: errors.name || [],
        email: errors.email || [],
      },
    };
  }

  // prismaを使用してDBに保存
  // メールアドレスが存在するかチェック
  const existingRecord = await prisma.contact.findUnique({
    where: { email: email },
  });
  // メールアドレスが存在する場合はエラー
  if (existingRecord) {
    return {
      success: false,
      errors: {
        name: [],
        email: ['このメールアドレスは既に登録されています'],
      },
    };
  }

  // エラーがなければデータベースに保存
  await prisma.contact.create({
    data: { name, email },
  });

  redirect('/contacts/complete');
}
