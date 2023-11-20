'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { FormEvent, useState } from 'react';

export default function Login() {
  const { data } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await signIn('credentials', { username, password });
  };

  if (data) {
    return <button onClick={() => signOut()}>Logout</button>;
  }

  return (
    <form onSubmit={login}>
      <input
        type="username"
        name="username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button>login</button>
    </form>
  );
}
