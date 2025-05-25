'use client';
import { z } from 'zod';
import { submitContactForm } from '@/lib/actions/contact';
import { useActionState, useState, useEffect } from 'react';
import { ContactSchema } from '@/validations/contact';

export default function ContactForm() {
  const [nameValue, setNameValue] = useState('');
  const [emailValue, setEmailValue] = useState('');

  const [clientErrors, setClientErrors] = useState({
    name: '',
    email: '',
  });
  const [serverErrorDisplay, setServerErrorDisplay] = useState({
    name: true,
    email: true,
  });
  const [state, formAction] = useActionState(submitContactForm, {
    success: false,
    errors: {},
    serverError: undefined,
  });

  useEffect(() => {
    setServerErrorDisplay({
      name: true,
      email: true,
    });
  }, [state.errors]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target as {
      name: 'name' | 'email';
      value: string;
    };

    try {
      if (name === 'name') {
        ContactSchema.pick({ name: true }).parse({ name: value });
      } else if (name === 'email') {
        ContactSchema.pick({ email: true }).parse({ email: value });
      }
      setClientErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        let errorMessage = '';
        const firstError = error.errors[0];

        if (firstError && firstError.message) {
          errorMessage = firstError.message;
        }

        setClientErrors((prevErrors) => ({
          ...prevErrors,
          [name]: errorMessage,
        }));
      }
    }
    setServerErrorDisplay((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  const handleSubmitClick = () => {
    setClientErrors({
      name: '',
      email: '',
    });
  };

  return (
    <form action={formAction}>
      <div className="py-24 text-gray-600">
        <div className="mx-auto flex flex-col bg-white shadow-md p-8 md:w-1/2">
          <h2 className="text-lg mb-2">お問い合わせ</h2>
          <div className="mb-4">
            <label htmlFor="name" className="text-sm">
              お名前
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              className={`w-full rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none py-1 px-3 leading-8 ${
                (state.errors.name && serverErrorDisplay.name) ||
                clientErrors.name
                  ? '!bg-red-50 !autofill:bg-red-50 [&:-webkit-autofill]:!shadow-[inset_0_0_0px_1000px_#fef2f2]'
                  : '!bg-white !autofill:bg-white [&:-webkit-autofill]:!shadow-[inset_0_0_0px_1000px_#ffffff]'
              }`}
              onBlur={handleBlur}
            />
            {state.errors.name && serverErrorDisplay.name && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.name.join(', ')}
              </p>
            )}
            {clientErrors.name && (
              <p className="text-red-500 text-sm mt-1">{clientErrors.name}</p>
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
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              className={`w-full rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none py-1 px-3 leading-8 ${
                (state.errors.email && serverErrorDisplay.email) ||
                clientErrors.email
                  ? '!bg-red-50 !autofill:bg-red-50 [&:-webkit-autofill]:!shadow-[inset_0_0_0px_1000px_#fef2f2]'
                  : '!bg-white !autofill:bg-white [&:-webkit-autofill]:!shadow-[inset_0_0_0px_1000px_#ffffff]'
              }`}
              onBlur={handleBlur}
            />
            {state.errors.email && serverErrorDisplay.email && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.email.join(', ')}
              </p>
            )}
            {clientErrors.email && (
              <p className="text-red-500 text-sm mt-1">{clientErrors.email}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-indigo-500 text-white text-lg px-6 py-2 rounded hover:bg-indigo-600"
            onClick={handleSubmitClick}
          >
            送信
          </button>
        </div>
      </div>
    </form>
  );
}
