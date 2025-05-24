'use server';
import { redirect } from 'next/navigation';
import { ContactSchema } from '@/validations/contact';

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
  const name = formData.get('name');
  const email = formData.get('email');

  // バリデーション
  const validatedResult = ContactSchema.safeParse({
    name,
    email,
  });

  if (!validatedResult.success) {
    const errors = validatedResult.error.flatten().fieldErrors;
    console.log('サーバー側でエラーが発生しました', errors);
    return {
      success: false,
      errors: {
        name: errors.name || [],
        email: errors.email || [],
      },
    };
  }

  console.log('送信されたデータ', name, email);

  redirect('/contacts/complete');
}
