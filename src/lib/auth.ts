export interface DummyUser {
  id: string
  name: string
  email: string
  role: 'student' | 'admin'
  avatar?: string
}

const STORAGE_KEY = 'codequest_dummy_user'

export function getUser(): DummyUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as DummyUser) : null
  } catch {
    return null
  }
}

export function setUser(user: DummyUser): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function clearUser(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function login(email: string, _password: string): DummyUser {
  const name = email.split('@')[0] || 'Quest Learner'
  const user: DummyUser = {
    id: 'user-001',
    name: name.charAt(0).toUpperCase() + name.slice(1),
    email,
    role: 'student',
  }
  setUser(user)
  return user
}

export function register(name: string, email: string, _password: string): DummyUser {
  const user: DummyUser = {
    id: 'user-001',
    name: name || 'Quest Learner',
    email,
    role: 'student',
  }
  setUser(user)
  return user
}

export function logout(): void {
  clearUser()
}

export function isAuthenticated(): boolean {
  return getUser() !== null
}
