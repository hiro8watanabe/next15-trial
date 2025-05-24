'use client';
import { submitContactForm } from '@/app/lib/actions/contact';
import { useActionState } from 'react';

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, {
    success: false,
    errors: {},
    serverError: undefined,
  });

  console.log(state);

  return (
    <form action={formAction}>
      <div className="py-24 text-gray-600">
        <div className="mx-auto flex flex-col bg-w shadow-md p-8 md:w-1/2">
          <h2 className="text-lg mb-2">お問い合わせ</h2>
          <div className="mb-4">
            <label htmlFor="name" className="text-sm">
              お名前
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none py-1 px-3 leading-8 ${
                state.errors.name && 'bg-red-50'
              }`}
            />
            {state.errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.name.join(', ')}
              </p>
            )}
          </div>
          <div className="mb-8">
            <label htmlFor="email" className="text-sm">
              メールアドレス
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className={`w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none py-1 px-3 leading-8 ${
                state.errors.email && 'bg-red-50'
              }`}
            />
            {state.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.email.join(', ')}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="bg-indigo-500 text-white text-lg px-6 py-2 rounded hover:bg-indigo-600"
          >
            送信
          </button>
        </div>
      </div>
    </form>
  );
}
